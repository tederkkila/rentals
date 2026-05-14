import React, { useActionState, useState } from "react";
import type { Unit } from "@/payload-types";
import { Box, Card, Button, Text} from "@radix-ui/themes";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Grid } from "@radix-ui/themes/dist/esm";
import { DatePickerWithRange } from "@/modules/ui/DatePickerWithRange";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { DateRange } from "react-day-picker"
import { env } from "use-sidecar/dist/es5/env";


interface UnitCardProps {
    unit: Unit,
}

export const ReservationPicker = ({unit}: UnitCardProps) => {

    const rates = 0;
    const peakseasons = 0;
    //TODO Add discounts
    //const discounts = 0;

    const trpc = useTRPC();

    const {data} = useSuspenseQuery(trpc.units.getUnitWithCalendar.queryOptions({ slug: unit.slug }));

    const [selectedDateRange, setSelectedDateRange] = React.useState<DateRange | undefined>();

    const { data: tokenData, refetch: refreshToken } = useQuery(trpc.reservations.getFormToken.queryOptions(
        undefined,
        { refetchOnWindowFocus: false }
    ))

    const [nickName, setNickname] = useState('');

    const mutation = useMutation(trpc.reservations.createReservation.mutationOptions({
        onSuccess: (data) => {
            alert(`Successfully saved record ID: ${data.recordId}`);
        },
        onError: (error) => {
            console.log('Submission failed:', error.message);
            refreshToken();
        }
    }));

    const [ state, submitAction, isPending ] = useActionState(async (prevState: any, formData: FormData) => {
        try {
            // Execute tRPC mutation asynchronously
            const result = await mutation.mutateAsync({
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                unitId: formData.get('unit') as string,
                startDate: formData.get('startDate') as string,
                endDate: formData.get('endDate') as string,
                quote: 100,
                token: tokenData?.token || "",
                honeyPot: formData.get('nickname') as string,
            });

            return {success: true, recordId: result.recordId, error: null};
        } catch (error: any) {
            return {success: false, recordId: null, error: error.message};
        }
    }, {success: false, recordId: null, error: null});



    return (
        <Box >
            <Card size="1">

                <form action={submitAction}>
                    <DatePickerWithRange
                        title={"Select Reservation Dates"}
                        unit={ data }
                        selected={selectedDateRange}
                        setSelectedDateRange={setSelectedDateRange}
                    />

                    {unit.taxInfo && <p className="text-xs text-gray-600 mb-2 ml-2 mt-0">{unit.taxInfo}</p>}

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input type='text' id="name" name="name" placeholder="Your Name" required/>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                            />
                            <FieldDescription className="ml-2">
                                We will contact you about the booking at this email address.
                            </FieldDescription>
                        </Field>
                            <input type="hidden" name="unit" value={unit.id} required />
                            <input type="hidden" name="startDate" value={selectedDateRange?.from?.toISOString() || ""} required />
                            <input type="hidden" name="endDate" value={selectedDateRange?.to?.toISOString() || ""} required />
                        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                            <input
                                type="text"
                                name="nickname"
                                value={nickName}
                                onChange={(e) => setNickname(e.target.value)}
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </div>
                        <Field orientation="horizontal">
                            <Button type="reset" variant="outline">
                                Reset
                            </Button>
                            <Button type="submit" disabled={isPending || !tokenData}>
                                {isPending ? 'Saving via tRPC...' : 'Check Availability'}
                            </Button>
                            <Text size="1" color={"gray"}>(You will not be charged yet)</Text>

                        </Field>


                    </FieldGroup>

                    <Grid gap="2" p={"4"} style={{backgroundColor: "var(--gray-a2)"}}>
                        {state.success && <p style={{ color: 'green' }}>Saved! ID: {state.recordId}</p>}
                        {state.error && <p style={{ color: 'red' }}>Error: {state.error}</p>}
                    </Grid>



                    {/*<Input name="name" type="text" placeholder="Your Name" required />*/}
                    {/* Email Field */}
                    {/*<div className="grid w-full items-center gap-1.5">
                        <Input name="email" id="email" type="email" placeholder="email@example.com" required />
                    </div>*/}

                    {/* Phone Field */}
                    {/*<div className="grid w-full items-center gap-1.5">
                        <Input name="phone" id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>*/}




                </form>

            </Card>
        </Box>

    )
};