"use client"

import React, {useState} from "react"
import { addDays, eachWeekOfInterval, format, isAfter, isBefore, isSameDay } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange, rangeIncludesDate, rangeOverlaps, TZDate, Matcher } from "react-day-picker"
import { differenceInDays, startOfDay } from 'date-fns';

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ToolTipDayButton } from "@/modules/units/ui/components/ToolTipDayButton";

// const getCheckOutOnlyRanges = (bookedRanges: DateRange[]) => {
//     //because a renter can check in on the day another is checking out, the checkout date is the start of the next booking
//
//     //this creates a range with from and to on the same day
//     const checkOutOnlyRanges: DateRange[] = bookedRanges.map((bookedRange: DateRange) => ({
//         from: bookedRange.from ? bookedRange.from : undefined,
//         to: bookedRange.from ? bookedRange.from : undefined
//     }));
//
//     return checkOutOnlyRanges
// }

// const getMinimumStayRanges = (
//     checkOutOnlyRanges: DateRange[],
//     minimumStay: number,
//     minimumStayPeak: number,
//     peakSeasonRanges: DateRange[],
//     ) => {
//
//     let minimumStayRanges: DateRange[] = []
//
//     const shortestMin = -1;
//     let longestMin = 0;
//
//     //checks checkOutOnly date to see if it is peak or not
//     //then corrects the minimum stay based on the season
//
//     checkOutOnlyRanges.forEach(checkOutOnlyRange => {
//
//         //check is from date is in peak season
//         peakSeasonRanges.forEach(peakSeasonRange => {
//             if (rangeIncludesDate(peakSeasonRange, checkOutOnlyRange.from as TZDate)) {
//                 //this is peak season
//                 longestMin = 0 - (minimumStayPeak - 1)
//             } else {
//                 longestMin = 0 - (minimumStay - 1)
//             }
//         })
//
//         minimumStayRanges.push({
//             from: checkOutOnlyRange.from ? addDays(checkOutOnlyRange.from, - 1) : undefined,
//             to: checkOutOnlyRange.from ? addDays(checkOutOnlyRange.from, - longestMin) : undefined
//         })
//
//     })
//
//     return minimumStayRanges
// }

const rangeContainsBookingRange = (range: DateRange, bookingRanges: DateRange[]) => {

    let bookingsOverlap = false;

    bookingRanges.forEach(bookingRange => {
        if (range?.from && range?.to) {
            //compares two objects with from and to properties
            if (rangeOverlaps(range as { from: Date; to: Date }, bookingRange as { from: Date; to: Date })) bookingsOverlap = true;
        } else if (range?.from) {
            //compares DateRange with Date
            if (rangeIncludesDate(bookingRange, range.from)) bookingsOverlap = true;
        }
    })

    return bookingsOverlap
}

const processBookedRanges = (bookedRanges: DateRange[], peakSeasonRanges: DateRange[], minimumNights): [DateRange[], DateRange[], DateRange[], DateRange[]] => {
    let effectiveBookedRanges: DateRange[] = []
    let checkOutOnlyRanges: DateRange[] = []
    let initialMinimumStayRanges: DateRange[] = []
    let notPeakSundays: DateRange[] = []

    bookedRanges.forEach((bookedRange: DateRange) => {

        if (bookedRange.from && bookedRange.to) {

            effectiveBookedRanges.push({
                from: addDays(bookedRange.from as TZDate, 1),
                to: bookedRange.to as TZDate
            });

            checkOutOnlyRanges.push({
                from: bookedRange.from as TZDate,
                to: bookedRange.from as TZDate
            });
        }

        peakSeasonRanges.forEach(peakSeasonRange => {
            bookedRanges.forEach(bookedRange => {

                const nights = calculateNights(bookedRange, peakSeasonRange, minimumNights)

                const minimumStayRange = {
                    from: addDays(bookedRange.from as TZDate, -1 * (nights - 1)) as TZDate,
                    to: addDays(bookedRange.from as TZDate, -1),
                }

                const exists = initialMinimumStayRanges.some(
                    (r) =>
                        r.from &&
                        r.to &&
                        minimumStayRange.from &&
                        minimumStayRange.to &&
                        isSameDay(r.from, minimumStayRange.from) &&
                        isSameDay(r.to, minimumStayRange.to)
                );

                if (!exists) {
                    initialMinimumStayRanges.push(minimumStayRange);
                }

            })

            // Get every Sunday within the peak range
            const WEEK_STARTS_ON_SUNDAY = 0 as 0 //date-fns expects weekStartsOn to be a specific union type (0 | 1 | 2 | 3 | 4 | 5 | 6) rather than a general number
            const sundays = eachWeekOfInterval(
                { start: peakSeasonRange.from as TZDate, end: peakSeasonRange.to as TZDate },
                { weekStartsOn: WEEK_STARTS_ON_SUNDAY }
            );

            sundays.forEach((sunday) => {
                const friday = addDays(sunday, 5);

                if (isAfter(sunday, peakSeasonRange.from as TZDate) && isBefore(friday, peakSeasonRange.to as TZDate)) {
                    notPeakSundays.push({
                        from: sunday,
                        to: friday,
                    });
                }

            });

        })
    })

    return [effectiveBookedRanges, checkOutOnlyRanges, initialMinimumStayRanges, notPeakSundays]
}

const calculateNights = (bookedRange: DateRange, peakSeasonRange: DateRange, minimumNights) => {
    let nights = minimumNights.offPeak

    let fromIsPeakSeason = undefined;
    let toIsPeakSeason = undefined;

    if (rangeIncludesDate(peakSeasonRange, bookedRange.from as TZDate)) {
        fromIsPeakSeason = true;
    }
    if (rangeIncludesDate(peakSeasonRange, bookedRange.to as TZDate)) {
        toIsPeakSeason = true;
    }

    if (fromIsPeakSeason && (toIsPeakSeason || !toIsPeakSeason)) {
        //this is a peak season booking
        //use peak minimum night value
        nights = minimumNights.peak;
    }

    return nights
}

interface DatePickerWithRangeProps {
    title: string,
}

export const DatePickerWithRange = ( { title }: DatePickerWithRangeProps ) => {

    const timeZone = 'America/New_York';
    const minimumNights = {offPeak: 2, peak: 7};
    // const minimumStayPeak = 7;
    let saturdayCheckOutOnly = [];

    //production will have no range selected to start
    const bookedRanges: DateRange[] = [
        { from: new TZDate(2026, 4, 11, timeZone), to: new TZDate(2026, 4, 12, timeZone) },
        { from: new TZDate(2026, 4, 15, timeZone), to: new TZDate(2026, 4, 17, timeZone) },
        { from: new TZDate(2026, 5, 12, timeZone), to: new TZDate(2026, 5, 19, timeZone) },
        { from: new TZDate(2026, 6, 11, timeZone), to: new TZDate(2026, 6, 18, timeZone) },
        { from: new TZDate(2026, 6, 18, timeZone), to: new TZDate(2026, 6, 22, timeZone) },
    ]

    //will be retrieved from the database for each unit for all years moving forward
    const peakSeasonRanges: DateRange[]   = [
        { from: new TZDate(2026, 5, 20, timeZone), to: new TZDate(2026, 8, 7, timeZone) }
    ];

    const [effectiveBookedRanges, checkOutOnlyRanges, initialMinimumStayRanges, notPeakSundays] =
        processBookedRanges(bookedRanges, peakSeasonRanges, minimumNights)

    const [minimumStayRanges, setMinimumStayRanges] = useState<DateRange[]>(
        initialMinimumStayRanges
    );

    const [disabledMatcher, setDisabledMatcher] = useState<Matcher[]>(
        [{ before: TZDate.tz(timeZone)}, ...effectiveBookedRanges, ...checkOutOnlyRanges, ...notPeakSundays, ...minimumStayRanges]
    )


    //for testing
    //TODO create function to calculate first available check-in date (weekend preferred)
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    //     {
    //     from: new TZDate(2026, 4, 6, timeZone),
    //     to: addDays(new TZDate(2026, 4, 6, timeZone), 3),
    // }
    );


    const handleSelect = (newRange: DateRange | undefined) => {
        console.log("newRange: ", newRange);

        saturdayCheckOutOnly = []

        const bookedDatesFound = (newRange) ? rangeContainsBookingRange(newRange, effectiveBookedRanges) : false;

        if (!bookedDatesFound) {
            if (newRange?.from && newRange?.to) {
                //full range selected
                if (!isSameDay(newRange.from, newRange.to)) {
                    setDisabledMatcher([ {before: TZDate.tz(timeZone)}, ...effectiveBookedRanges, ...notPeakSundays ]);
                    setMinimumStayRanges([]);
                    setSelectedRange(newRange);
                }
            } else {
                //partial range selected

                //TODO extract current year peakSeasonRange from database
                const nights = calculateNights(newRange, peakSeasonRanges[0], minimumNights)
                console.log("nights: ", nights);
                const newMinimumStayRange: DateRange = {
                    from: addDays(newRange.from as TZDate, 1),
                    to: addDays(newRange.from as TZDate, (nights - 1)) as TZDate,
                }


                //set the current minimum stay range for formatting
                setMinimumStayRanges([newMinimumStayRange]);
                setDisabledMatcher([{ before: newRange?.from}, ...effectiveBookedRanges, ...notPeakSundays, newMinimumStayRange]);
                setSelectedRange(newRange);
            }
        }
    };

    const clearSelection = () => {
        setSelectedRange(undefined);
        setMinimumStayRanges(initialMinimumStayRanges)
        setDisabledMatcher([{ before: TZDate.tz(timeZone)}, ...effectiveBookedRanges, ...checkOutOnlyRanges, ...notPeakSundays, ...minimumStayRanges]);
        setMinimumStayRanges(initialMinimumStayRanges)
    }

    //create modifiers for react-day-picker
    //const checkOutOnlyRanges: DateRange[] = getCheckOutOnlyRanges(bookedRanges);
    // console.log("checkOutOnlyRanges: ", checkOutOnlyRanges);



    /*const isDisabled = (date: Date): boolean => {

        // const tzDate = new TZDate (date, timeZone);
        // // console.log("tzDate: ", tzDate);
        //
        // const selectedFrom = (selectedRange?.from) ? selectedRange.from : undefined;
        // let days = null;
        //
        // if (selectedFrom) {
        //     days = Math.abs(differenceInDays(startOfDay(tzDate), startOfDay(selectedFrom)))
        // }
        //
        // let checkOutOnly = false;
        // let inPeakSeason = false;
        // let isLessThanMinimumStay = false;
        // let isBeforeFromDate = false;
        // let isBooked = false;

        // peakSeasonRanges.forEach(peakSeasonRange => {
        //     if (rangeIncludesDate(peakSeasonRange, tzDate)) {
        //         if (tzDate.getDay() !== 6) {
        //             console.log("date is NOT Saturday in peakSeasonRange")
        //             inPeakSeason = true; // Disable Saturday only
        //             if (days && days > minimumStayPeak) {
        //                 console.log("date is in peakSeasonRange and greater than minimum peak stay")
        //                 saturdayCheckOutOnly.push(tzDate)
        //             }
        //         }
        //
        //         if (days && days < minimumStayPeak) {
        //             console.log("date is in peakSeasonRange and less than minimum peak stay")
        //             if (!minimumStayExclusion.includes(tzDate)) minimumStayExclusion.push(tzDate)
        //             isLessThanMinimumStay = true;
        //         }
        //     }
        // })

        // if (selectedFrom && !selectedRange?.to && days < minimumStay) {
        //     console.log(`date is less than minimum stay days: ${days}`)
        //     if (!minimumStayExclusion.includes(tzDate)) minimumStayExclusion.push(tzDate)
        //     isLessThanMinimumStay = true;
        // }

        // if (!selectedRange?.to && date < selectedRange?.from) {
        //     console.log("date is before from date")
        //     isBeforeFromDate  = true;
        // }

        // bookedRanges.forEach(bookedRange => {
        //     if (rangeIncludesDate(bookedRange, tzDate)) {
        //         console.log(`booked : ${tzDate}`)
        //
        //         if (bookedRange.from && isSameDay(tzDate, bookedRange.from)) {
        //             console.log("dates is first day of booking range, do not show as booked")
        //         } else {
        //             isBooked = true;
        //         }
        //     }
        // })


        //We use the disable function of the calendar only for booked dates (or before from date
        // return checkOutOnly || inPeakSeason || isLessThanMinimumStay || isBeforeFromDate || isBooked;
         return isBeforeFromDate || isBooked;


    }*/

    return (
        <Field className="/*w-60*/ mb-2">
            <FieldLabel htmlFor="date-picker-range">{title}</FieldLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date-picker-range"
                        className="justify-start px-2.5 font-normal"
                    >
                        <CalendarIcon />
                        {selectedRange?.from ? (
                            selectedRange.to ? (
                                <>
                                    {format(selectedRange.from, "LLL dd, y")} -{" "}
                                    {format(selectedRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(selectedRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                        mode="range"
                        fixedWeeks
                        resetOnSelect
                        timeZone={timeZone}
                        startMonth={new Date()}
                        defaultMonth={selectedRange?.from}
                        selected={selectedRange}
                        disabled={disabledMatcher}
                        modifiers={{
                            booked: effectiveBookedRanges,
                            peak: peakSeasonRanges,
                            checkOutOnly: checkOutOnlyRanges,
                            minimumStay: minimumStayRanges,
                            saturdayCheckOutOnly: notPeakSundays
                        }}
                        modifiersClassNames={{
                            booked: "[&_button]:line-through opacity-50 text-gray-500 booked",
                            peak: "text-medium bg-red-100 text-red-600 peak",
                            checkOutOnly: "checkOutOnly ",
                            minimumStay: "text-green-700 text-small minimumStay",
                            saturdayCheckOutOnly: "saturdayCheckOutOnly"
                        }}
                        numberOfMonths={2}
                        onSelect={handleSelect}
                        showOutsideDays={false}
                        components={{ DayButton: ToolTipDayButton }}
                    />
                    <div className="flex justify-center gap-2 m-2">
                        <Button variant="outline" size="sm" onClick={clearSelection}>
                            Clear Selection
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </Field>
    )
}
