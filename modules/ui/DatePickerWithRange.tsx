"use client"

import React, { useState, useMemo } from "react"
import { addDays, subDays, eachWeekOfInterval, format, isAfter, isBefore, isSameDay } from "date-fns"
import { startOfDay, differenceInDays } from 'date-fns';
import { CalendarIcon } from "lucide-react"
import { DateRange, rangeIncludesDate, TZDate  } from "@daypicker/react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ToolTipDayButton } from "@/modules/ui/ToolTipDayButton";
import { Discount, Peakseason, Rate, Reservation, Tenant, Unit } from "@/payload-types";

/*const rangeContainsBookingRange = (range: DateRange, bookingRanges: DateRange[]) => {

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
}*/

const processBookedRanges = (bookedRanges: DateRange[], peakSeasonRanges: DateRange[], minimumNights: Record<string, number>): [DateRange[], DateRange[], DateRange[], DateRange[]] => {

    let effectiveBookedRanges: DateRange[] = []
    let checkOutOnlyRanges: DateRange[] = []
    let initialMinimumStayRanges: DateRange[] = []
    let notPeakSundays: DateRange[] = []

    bookedRanges.forEach((bookedRange: DateRange) => {

        if (bookedRange.from && bookedRange.to) {

            effectiveBookedRanges.push({
                from: addDays(bookedRange.from as TZDate, 1) as TZDate,
                to:   subDays(bookedRange.to as TZDate, 1) as TZDate
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

        });


    })

    peakSeasonRanges.forEach(peakSeasonRange => {
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

    });

    return [effectiveBookedRanges, checkOutOnlyRanges, initialMinimumStayRanges, notPeakSundays]
}

const calculateNights = (bookedRange: DateRange, peakSeasonRange: DateRange, minimumNights: Record<string, number>) => {
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
        nights = minimumNights.peak;
    }

    return nights
}

const useDateRangeMap = (sourceRanges: DateRange[]) => {

    const dateMap = new Map();
    if (!sourceRanges) return dateMap;

    sourceRanges.forEach((sourceRange: DateRange) => {
            if (sourceRange.from && sourceRange.to) {
                const currentDate = new TZDate(sourceRange.from);
                const endDate = new TZDate(sourceRange.to);

                while (currentDate <= endDate) {
                    // Use ISO string or similar formatted string as the map key
                    dateMap.set(currentDate.toISOString().split('T')[0], true);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        });
        // console.log("dateMap: ", dateMap);

    return dateMap;
}

const getNextChronological = (map: Map<string, any>, targetDate: string): string | undefined => {
    let nextDate: string | undefined = undefined;

    for (const date of map.keys()) {
        if (date > targetDate) {
            if (nextDate === undefined || date < nextDate) {
                nextDate = date;
            }
        }
    }
    return nextDate;
}

const getNightsCount = (newRange: DateRange): number => {
    if (!newRange?.from || !newRange?.to) return 0;
    return differenceInDays(newRange.to, newRange.from);
};

interface handleStateProperties {
    selectedRange: DateRange | undefined,
    minimumStayRanges: DateRange[],
    firstAvailableBookingDate: TZDate,
    lastAvailableBookingDate: TZDate,
    disableCheckOutOnly: boolean,
}

interface DatePickerWithRangeProps {
    title: string,
    unit: Unit & {
        tenant: Tenant | null,
        reservations: Reservation[] | null,
        rates: Rate[] | null,
        peakseasons: Peakseason[] | null,
        discounts: Discount[] | null,
    },
    selected: DateRange | undefined,
    setSelectedDateRange: (range: DateRange | undefined) => void,
    open: boolean
    setOpen: (open: boolean) => void
    totalNights: number,
    setTotalNights: (totalNights: number) => void,
}

export const DatePickerWithRange = ( {
    title,
    unit,
    selected,
    setSelectedDateRange,
    open,
    setOpen,
    totalNights,
    setTotalNights,
}: DatePickerWithRangeProps ) => {
    // console.log("DatePickerWithRange Re-Rendered");
    // console.log("unit imported: ", unit);

    const timeZone = useMemo (() => {
        return unit.tenant?.timezone ?? 'America/New_York';
    }, [])
    //console.log("timeZone: ", timeZone);
    //TODO Make set of rates for each date in year
    //TODO Make set of minimum nights for each date in year
    const minimumNights: Record<string, number> = {offPeak: 2, peak: 7};

    //production will have no range selected to start
    const bookedRanges: DateRange[] = useMemo(() => {
        let data: DateRange[] = [];

        if (unit.reservations && unit.reservations.length > 0) {
            unit.reservations.map ((reservation: Reservation) => {
                data.push({
                    from: new TZDate(reservation.startDate, reservation.startDate_tz),
                    to: new TZDate(reservation.endDate, reservation.endDate_tz),
                })
            })
        }

        return data
    }, [unit.reservations])

    const peakSeasonRanges: DateRange[] = useMemo(() => {
        let data: DateRange[] = [];

        if (unit.peakseasons && unit.peakseasons.length > 0) {
            unit.peakseasons.map((peakseason: Peakseason) => {
                data.push({
                    from: new TZDate(peakseason.startDate, peakseason.startDate_tz),
                    to: new TZDate(peakseason.endDate, peakseason.endDate_tz),
                })
            })
        }
        /*[{ from: new TZDate(2026, 5, 20, timeZone), to: new TZDate(2026, 8, 7, timeZone) }];*/
        return data
    }, [unit.peakseasons])


    const [effectiveBookedRanges, checkOutOnlyRanges, initialMinimumStayRanges, notPeakSundays] = useMemo(() => {
        return processBookedRanges(bookedRanges, peakSeasonRanges, minimumNights)
    }, [bookedRanges]); // Only compute once

    //TODO create function to calculate first available check-in date (weekend preferred)
    const [currentCalendarValues, setCurrentCalendarValues ] = useState<handleStateProperties>(
        {
            selectedRange: selected,
            minimumStayRanges: initialMinimumStayRanges,
            firstAvailableBookingDate: startOfDay(TZDate.tz(timeZone)),
            lastAvailableBookingDate: startOfDay(addDays(TZDate.tz(timeZone),365)),
            disableCheckOutOnly: true,
        },
    )



    const handleSelect = (newRange: DateRange | undefined) => {
        console.log("newRange: ", newRange);



        //TODO If end date is removed remove the .to from range and redisplay the calendar

        if (!newRange) return;

        const nights = getNightsCount(newRange)
        setTotalNights(nights)

        if (newRange?.from && newRange?.to) {
            //both dates selected
            console.log("newRange", newRange);




            //check if multiple days are not selected
            if (!isSameDay(newRange.from, newRange.to)) {
                setSelectedDateRange(newRange);
                setCurrentCalendarValues( prevState => ({
                    ...prevState,
                    selectedRange: newRange,
                    firstAvailableBookingDate: startOfDay(TZDate.tz(timeZone)), //reset date to today
                    lastAvailableBookingDate: startOfDay(addDays(TZDate.tz(timeZone),365)), //reset to one year from today
                    minimumStayRanges: initialMinimumStayRanges, //reset to initial values
                    disableCheckOutOnly: true,
                }));
                setTimeout(() => setOpen(false), 500)

            } else {
                //if the same day is selected, clear the selection
                clearSelection();
            }

        } else {
            //partial range selected

            const nights = calculateNights(newRange, peakSeasonRanges[0], minimumNights)
            //find the next effective booking date from a set of dates

            const newMinimumStayRange: DateRange = {
                from: addDays(newRange.from as TZDate, 1),
                to: addDays(newRange.from as TZDate, (nights - 1)) as TZDate,
            }

            const nextEffectiveBookedDate = getNextChronological(
                effectiveBookedDaysMapSorted,
                (newRange.from as TZDate).toISOString().split('T')[0]
            )
            console.log("nextEffectiveBookedDate: ", nextEffectiveBookedDate);

            if (nextEffectiveBookedDate !== undefined) {

                //there might be no nextEffectiveBookedDate if there are no bookings in the next year
                setCurrentCalendarValues( prevState => ({
                    ...prevState,
                    selectedRange: newRange,
                    minimumStayRanges: [newMinimumStayRange],
                    firstAvailableBookingDate: newRange.from as TZDate,
                    disableCheckOutOnly: false,
                }));

            } else {

                const nextEffectiveBookedDateInSelection = rangeIncludesDate(newRange, TZDate.tz(nextEffectiveBookedDate as unknown as string, timeZone))
                console.log("nextEffectiveBookedDateInSelection: ", nextEffectiveBookedDateInSelection);

                const lastAvailableBookingDate = nextEffectiveBookedDate as unknown as TZDate;

                setCurrentCalendarValues( prevState => ({
                    ...prevState,
                    selectedRange: newRange,
                    minimumStayRanges: [newMinimumStayRange],
                    firstAvailableBookingDate: newRange.from as TZDate,
                    lastAvailableBookingDate: lastAvailableBookingDate,
                    disableCheckOutOnly: false,
                }));

            }

        }

        /*performance.mark('end-handleSelect');
        performance.measure('Total handleSelect', 'start-handleSelect', 'end-handleSelect');

        const measure = performance.getEntriesByName('Total handleSelect')[0];
        console.log("handleSelect: ", measure.duration); // Duration in ms*/
    };

    const clearSelection = () => {
        setSelectedDateRange(undefined);
        setTotalNights(0);
        setCurrentCalendarValues( prevState => ({
            ...prevState,
            selectedRange: undefined,
            minimumStayRanges: initialMinimumStayRanges,
            firstAvailableBookingDate: startOfDay(TZDate.tz(timeZone)),
            lastAvailableBookingDate: startOfDay(addDays(TZDate.tz(timeZone),365)),
            disableCheckOutOnly: true,
        }));

    }

    const effectiveBookedDaysMap: Map<string, any> = useDateRangeMap(effectiveBookedRanges);

    const effectiveBookedDaysMapSorted = useMemo(() => {
        const keysSorted = Array.from(effectiveBookedDaysMap.keys()).sort();

        const sortedMap  = new Map();
        keysSorted.forEach(key => {
            sortedMap .set(key, effectiveBookedDaysMap.get(key));
        });

        return sortedMap ;
    }, [effectiveBookedDaysMap])

    //Create sets for fast lookup of dates by date string
    // console.log("effectiveBookedDaysMap:", effectiveBookedDaysMap);
    // console.log("effectiveBookedDaysMapSorted: ", effectiveBookedDaysMapSorted);
    const checkOutOnlyDayMap = useDateRangeMap(checkOutOnlyRanges);
    // console.log("checkOutOnlyDayMap: ", checkOutOnlyDayMap);
    const notPeakSundaysMap = useDateRangeMap(notPeakSundays);
    // console.log("notPeakSundaysMap: ", notPeakSundaysMap);
    const minimumStayMap = useDateRangeMap(currentCalendarValues.minimumStayRanges);
    //console.log("minimumStayMap: ", minimumStayMap);
    const peakSeasonMap = useDateRangeMap(peakSeasonRanges);
    // console.log("peakSeasonMap:", peakSeasonMap);

    const isDayDisabled = useMemo(() => (day: Date) => {

        if (isBefore(day, startOfDay(currentCalendarValues.firstAvailableBookingDate))) return true
        if (isAfter(day, startOfDay(currentCalendarValues.lastAvailableBookingDate))) return true

        const dateString = format(day, 'yyyy-MM-dd');

        if (effectiveBookedDaysMapSorted.has(dateString)) return true;
        if (currentCalendarValues.disableCheckOutOnly && checkOutOnlyDayMap.has(dateString)) return true;
        if (notPeakSundaysMap.has(dateString)) return true;
        if (minimumStayMap.has(dateString)) return true;

        return false;

    }, [effectiveBookedDaysMapSorted, checkOutOnlyDayMap, notPeakSundaysMap, minimumStayMap, currentCalendarValues.disableCheckOutOnly]);

    const modifiers = useMemo(() => ({
        booked: (day: Date) => effectiveBookedDaysMapSorted.has(format(day, 'yyyy-MM-dd')),
        checkOutOnly: (day: Date) => checkOutOnlyDayMap.has(format(day, 'yyyy-MM-dd')),
        saturdayCheckOutOnly: (day: Date) => notPeakSundaysMap.has(format(day, 'yyyy-MM-dd')),
        minimumStay: (day: Date) => minimumStayMap.has(format(day, 'yyyy-MM-dd')),
        peak: (day: Date) => peakSeasonMap.has(format(day, 'yyyy-MM-dd')),
    }), [effectiveBookedDaysMapSorted, checkOutOnlyDayMap, notPeakSundaysMap, minimumStayMap, peakSeasonMap]);

    return (
        <Field className="/*w-60*/ mb-2">
            <FieldLabel htmlFor="date-picker-range">{title}</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date-picker-range"
                        className="justify-start px-2.5 font-normal"
                    >
                        <CalendarIcon />
                        {currentCalendarValues.selectedRange?.from ? (
                            currentCalendarValues.selectedRange.to ? (
                                <>
                                    {format(currentCalendarValues.selectedRange.from, "LLL dd, y")} -{" "}
                                    {format(currentCalendarValues.selectedRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(currentCalendarValues.selectedRange.from, "LLL dd, y")
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
                        resetOnSelect={true}
                        timeZone={timeZone}
                        startMonth={new Date()}
                        defaultMonth={currentCalendarValues.selectedRange?.from}
                        selected={currentCalendarValues.selectedRange}
                        disabled={isDayDisabled}
                        modifiers={modifiers}
                        // modifiers={{
                        //     booked: effectiveBookedRanges,
                        //     peak: peakSeasonRanges,
                        //     checkOutOnly: checkOutOnlyRanges,
                        //     minimumStay: currentCalendarValues.minimumStayRanges,
                        //     saturdayCheckOutOnly: notPeakSundays,
                        // }}
                        modifiersClassNames={{
                            booked: "booked",
                            peak: "peak",
                            checkOutOnly: "checkOutOnly ",
                            minimumStay: "text-green-700 text-small minimumStay",
                            saturdayCheckOutOnly: "saturdayCheckOutOnly",
                        }}
                        numberOfMonths={1}
                        onSelect={handleSelect}
                        showOutsideDays={false}
                        components={{
                            DayButton: (props) => (
                                <ToolTipDayButton {...props} />
                            )
                        }}
                    />
                    <div className="flex justify-center gap-2 mb-2">
                        <Button variant="outline" size="sm" onClick={() => setTimeout(() => setOpen(false), 100)}>
                            Close
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearSelection}>
                            Clear Selection
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </Field>
    )
}
