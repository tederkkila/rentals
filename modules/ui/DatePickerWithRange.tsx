"use client"

import React, { useState, useMemo } from "react"
import { addDays, subDays, eachWeekOfInterval, format, isAfter, isBefore, isSameDay } from "date-fns"
import { startOfDay } from 'date-fns';
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
import { ToolTipDayButton } from "@/modules/units/ui/components/ToolTipDayButton";
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
}

export const DatePickerWithRange = ( { title, unit, selected, setSelectedDateRange, open, setOpen }: DatePickerWithRangeProps ) => {
    // console.log("DatePickerWithRange Re-Rendered");
    // console.log("unit imported: ", unit);

    const timeZone = useMemo (() => {
        return unit.tenant?.timezone ?? 'America/New_York';
    }, [])
    //console.log("timeZone: ", timeZone);
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
    // console.log("bookedRanges: ", bookedRanges);

    //will be retrieved from the database for each unit for all years moving forward
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

    //console.log("currentCalendarValues: ", currentCalendarValues);

    const handleSelect = (newRange: DateRange | undefined) => {
        console.log("newRange: ", newRange);
        //TODO extract current year peakSeasonRange from database
        if (!newRange) return;

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
                setOpen(false)
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
                effectiveBookedDaysSetSorted,
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
        setCurrentCalendarValues( prevState => ({
            ...prevState,
            selectedRange: undefined,
            minimumStayRanges: initialMinimumStayRanges,
            firstAvailableBookingDate: startOfDay(TZDate.tz(timeZone)),
            lastAvailableBookingDate: startOfDay(addDays(TZDate.tz(timeZone),365)),
            disableCheckOutOnly: true,
        }));

    }

    const effectiveBookedDaysSet: Map<string, any> = useDateRangeMap(effectiveBookedRanges);

    const effectiveBookedDaysSetSorted = useMemo(() => {
        const keysSorted = Array.from(effectiveBookedDaysSet.keys()).sort();

        const sortedMap  = new Map();
        keysSorted.forEach(key => {
            sortedMap .set(key, effectiveBookedDaysSet.get(key));
        });

        return sortedMap ;
    }, [effectiveBookedDaysSet])

    // console.log("effectiveBookedDaysSet:", effectiveBookedDaysSet);
    // console.log("effectiveBookedDaysSetSorted: ", effectiveBookedDaysSetSorted);
    const checkOutOnlyDaySet = useDateRangeMap(checkOutOnlyRanges);
    // console.log("checkOutOnlyDaySet: ", checkOutOnlyDaySet);
    const notPeakSundaysSet = useDateRangeMap(notPeakSundays);
    // console.log("notPeakSundaysSet: ", notPeakSundaysSet);
    const minimumStaySet = useDateRangeMap(currentCalendarValues.minimumStayRanges);
    //console.log("minimumStaySet: ", minimumStaySet);
    const peakSeasonSet = useDateRangeMap(peakSeasonRanges);
    // console.log("peakSeasonSet:", peakSeasonSet);

    const isDayDisabled = useMemo(() => (day: Date) => {

        if (isBefore(day, startOfDay(currentCalendarValues.firstAvailableBookingDate))) return true
        if (isAfter(day, startOfDay(currentCalendarValues.lastAvailableBookingDate))) return true

        const dateString = format(day, 'yyyy-MM-dd');

        if (effectiveBookedDaysSetSorted.has(dateString)) return true;
        if (currentCalendarValues.disableCheckOutOnly && checkOutOnlyDaySet.has(dateString)) return true;
        if (notPeakSundaysSet.has(dateString)) return true;
        if (minimumStaySet.has(dateString)) return true;

        return false;

    }, [effectiveBookedDaysSetSorted, checkOutOnlyDaySet, notPeakSundaysSet, minimumStaySet, currentCalendarValues]);

    const modifiers = useMemo(() => ({
        booked: (day: Date) => effectiveBookedDaysSetSorted.has(format(day, 'yyyy-MM-dd')),
        checkOutOnly: (day: Date) => checkOutOnlyDaySet.has(format(day, 'yyyy-MM-dd')),
        saturdayCheckOutOnly: (day: Date) => notPeakSundaysSet.has(format(day, 'yyyy-MM-dd')),
        minimumStay: (day: Date) => minimumStaySet.has(format(day, 'yyyy-MM-dd')),
        peak: (day: Date) => peakSeasonSet.has(format(day, 'yyyy-MM-dd')),
    }), [effectiveBookedDaysSetSorted, checkOutOnlyDaySet, notPeakSundaysSet, minimumStaySet, peakSeasonSet]);

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
                            booked: "[&_button]:line-through opacity-50 text-gray-500 booked",
                            peak: "text-medium bg-red-100 text-red-600 peak",
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
                    <div className="flex justify-center gap-2 m-2">
                        <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
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
