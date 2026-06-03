export interface DayDataConfig {
    price: number;
    minimumNights: number;
    booked: boolean;
    peak: boolean;
    requiredCheckInOut: string | undefined;
    color: string | undefined;
    colorstep: number | undefined;
}