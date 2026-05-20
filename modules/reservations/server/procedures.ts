import z from "zod";
import { Customer, Reservation, SupportedTimezones, Unit } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import crypto, { BinaryLike } from 'crypto';
import { TRPCError } from "@trpc/server";
import { CipherGCMTypes, CipherCCMTypes } from 'crypto';

const algorithm = 'aes-256-gcm';
const IV_LENGTH = 12;  // 12-byte IV is standard for GCM

const rawEncryptionKey = process.env.ENCRYPTION_KEY;

if (!rawEncryptionKey) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

const ENCRYPTION_KEY = Buffer.from(rawEncryptionKey, 'hex');

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes');
}

// Helper to encrypt the current time
function encryptTimestamp(timestamp: number): string {
    const iv = crypto.randomBytes(IV_LENGTH) as unknown as Buffer;
    const cipher = crypto.createCipheriv(
        algorithm as unknown as CipherCCMTypes,
        ENCRYPTION_KEY,
        iv as unknown as BinaryLike,
        {authTagLength: 16}
    );
    let encrypted = cipher.update(timestamp.toString(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

// Helper to decrypt the timestamp string
function decryptTimestamp(encryptedText: string): number {
    const [ivHex, encryptedHex] = encryptedText.split(':');
    //console.log("ivHex", ivHex)
    //console.log("encryptedHex", encryptedHex)
    if (!ivHex || !encryptedHex) return 0;

    const iv = Buffer.from(ivHex, 'hex');
    //console.log("iv", iv)
    const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
    //console.log("decipher", decipher)
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    //console.log("decrypted", decrypted)
    //decrypted += decipher.final('utf8');
    //console.log("decrypted+", decrypted)
    //console.log("decrypted+ parseInt", parseInt(decrypted, 10))
    return parseInt(decrypted, 10);
}

export const reservationsRouter = createTRPCRouter({

    getMany: baseProcedure
        .input(
            z.object({
                unitId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {

            const reservationsData = await ctx.db.find({
                collection: "reservations",
                depth: 0,
                where: {
                    unit: { equals: input.unitId },
                    status: { equals: 'confirmed' }
                },
            });

            console.log("reservationsData", reservationsData)

            return reservationsData

        }),

    getFormToken: baseProcedure
        .query( () => {
            const token = encryptTimestamp(Date.now());
            return { token }
        }),

    createReservation: baseProcedure
    .input(
        z.object({
            email: z.email(),
            name: z.string().optional(),
            unitId: z.string(),
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
            timeZone: z.string(),
            quote: z.number().nonnegative(),
            token: z.string(),
            honeyPot: z.string().optional(),
        }).refine((data) => data.endDate > data.startDate, {
            message: "End date must be after start date",
            path: ["endDate"],
        }),
    )
    .mutation(async ({ ctx, input }) => {

        if (input.honeyPot && input.honeyPot.trim().length > 0) {
            console.warn("Spam caught silently via honeyPot.");

            // Return a fake success message to fool the bot into stopping
            return { success: true, recordId: "face42cebcd51e17face5bc3", message: 'Message was sent!' };
        }

        let unit: Unit;

        try {
            const unitData = await ctx.db.find({
                collection: "units",
                depth:0,
                limit: 1,
                pagination: false,
                where: {
                    id: {equals: input.unitId}
                }
            });
            unit = unitData.docs[0] as Unit;
        } catch {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Unit not found",
            });
        }

        if (unit.isArchived || unit.isPrivate) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Unit not found",
            });
        }

        if (!unit.tenant) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Unit is missing tenant information",
            });
        }

        //check if email already exists
        const emailData = await ctx.db.find({
            collection: "customers",
            depth: 0,
            limit: 1,
            pagination: false,
            where: {
                email: { equals: input.email },
            },
        });

        let customer: Customer | null = null;
        const emailCustomer = emailData.docs[0];

        if (emailCustomer) {
            //customer exists
            customer = emailCustomer;
        } else {
            //customer does not exist
            //create customer
            customer = await ctx.db.create({
                collection: "customers",
                data: {
                    email: input.email,
                    name: input.name,
                }
            });
        }

        if (!customer) {
            throw new Error("Could not determine customer for reservation");
        }

        //check timestamp
        const MIN_SUBMISSION_DELAY_MS = 3_000;
        const FORM_SESSION_TTL_MS = 60 * 60 * 1_000;

        function isTRPCError(error: unknown): error is TRPCError {
            return error instanceof TRPCError;
        }

        function validateSubmissionToken(token: string): void {
            try {
                const submittedAtMs = Date.now();
                const tokenCreatedAtMs = decryptTimestamp(token);
                const elapsedMs = submittedAtMs - tokenCreatedAtMs;

                if (elapsedMs < MIN_SUBMISSION_DELAY_MS) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Submission too fast. Are you sure you are not a bot?",
                    });
                }

                if (elapsedMs > FORM_SESSION_TTL_MS) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Form session expired. We just refreshed it for you.",
                    });
                }
            } catch (error) {
                if (isTRPCError(error)) {
                    throw error;
                }

                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Form expired. Please refresh the page and try again. If the problem persists, please contact us.",
                });
            }
        }

        validateSubmissionToken(input.token);


        const reservationTimezone: SupportedTimezones = input.timeZone;
        const initialReservationStatus: Reservation["status"] = "pending";

        const newReservation: Reservation = await ctx.db.create({
            collection: "reservations",
            depth: 0,
            data: {
                customer,
                unit,
                tenant: unit.tenant,
                startDate: input.startDate.toISOString(),
                startDate_tz: reservationTimezone,
                endDate: input.endDate.toISOString(),
                endDate_tz: reservationTimezone,
                status: initialReservationStatus,
                quote: 100,
                amountPaid: 0,
                depositPaid: 0,
            }
        });

        return {success: true, recordId: newReservation.id};
    })
})