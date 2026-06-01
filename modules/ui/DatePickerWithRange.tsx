"use client"

import React, { useState, useMemo } from "react"
import { addDays, subDays, eachWeekOfInterval, format, isAfter, isBefore, isSameDay } from "date-fns"
import { startOfDay, differenceInDays } from 'date-fns';
import { CalendarIcon } from "lucide-react"
import { DayPicker, DateRange, rangeIncludesDate, TZDate  } from "@daypicker/react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ToolTipDayButton, CalendarPriceContext } from "@/modules/ui/ToolTipDayButton";
import { CalendarColorContext, DynamicDay } from "@/modules/ui/DynamicDay"
import { Discount, Peakseason, Rate, Reservation, Tenant, Unit } from "@/payload-types";
import { type DayDataConfig } from "@/modules/ui/calendarTypes";


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

const processBookedRanges = (
    bookedRanges: DateRange[],
    peakSeasonRanges: DateRange[],
    minimumNights: Record<string, number>
): [DateRange[], DateRange[], DateRange[], DateRange[], DateRange[] ] => {

    let effectiveBookedRanges: DateRange[] = []
    let checkOutOnlyRanges: DateRange[] = []
    let fullBookedRanges: DateRange[] = []
    let initialMinimumStayRanges: DateRange[] = []
    let notPeakSundays: DateRange[] = []
    const checkedOutDays = new Set<string>()

    bookedRanges.forEach((bookedRange: DateRange) => {

        if (bookedRange.from && bookedRange.to) {

            const fromTZDate = bookedRange.from as TZDate
            const toTZDate = bookedRange.to as TZDate

            effectiveBookedRanges.push({
                from: addDays(fromTZDate, 1) as TZDate,
                to:   subDays(toTZDate, 1) as TZDate,
            });

            const fromTZString = fromTZDate.toISOString().split('T')[0]

            if (!checkedOutDays.has(fromTZString)) {
                checkOutOnlyRanges.push({
                    from: fromTZDate,
                    to: fromTZDate,
                });
            } else {
                fullBookedRanges.push({
                    from: fromTZDate,
                    to: fromTZDate,
                })
            }

            checkedOutDays.add(toTZDate.toISOString().split('T')[0])

        }

        peakSeasonRanges.forEach(peakSeasonRange => {
            bookedRanges.forEach(bookedRange => {

                const nights = calculateMinimumNights(bookedRange, peakSeasonRange, minimumNights)

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

    return [effectiveBookedRanges, checkOutOnlyRanges, initialMinimumStayRanges, notPeakSundays, fullBookedRanges]
}

const createCalendarInformationMap = (
    rates: Rate[] | null,
    peakseasons: Peakseason[] | null,
    discounts: Discount[] | null,
    reservations: Reservation[] | null,
    timeZone: string
): [Record<string, any>, number] => {

    const calendarInformationMap: Record<string, any> = {};
    let maxMiniumNights = 0;

    const addDateToCalendarInformationMap = (data: Rate | Peakseason | Discount ) => {

        const startDate = new TZDate(data.startDate, data.startDate_tz);
        const endDate = new TZDate(data.endDate, data.endDate_tz);
        const priceType = data.priceType;

        let price: number = 0;
        if (priceType === 'night') price = data.price;
        if (priceType === 'week') price = Math.ceil(data.price / 7);
        if (priceType === 'month') price = Math.ceil(data.price / 28);
        const minimumNights = data.minimumNights;
        if (minimumNights > maxMiniumNights) maxMiniumNights = minimumNights;

        while (startDate <= endDate) {
            const dateKey = startDate.toISOString().slice(0, 10);
            calendarInformationMap[dateKey] = {
                price: price,
                minimumNights: minimumNights,
            }
            if ("color" in data && data.color) {
                calendarInformationMap[dateKey].color = data.color;
            }
            if ("colorstep" in data && data.colorstep) {
                calendarInformationMap[dateKey].colorstep = data.colorstep;
            }
            startDate.setDate(startDate.getDate() + 1);
        }

    }

    //add rate data to calendarInformationMap
    if (!rates) return [calendarInformationMap, maxMiniumNights]; //return empty map if no rates
    rates.forEach((rate: Rate) => {
        addDateToCalendarInformationMap (rate)
    })

    if (peakseasons) {
        peakseasons.forEach((peakseason: Peakseason) => {
            addDateToCalendarInformationMap (peakseason)
        })
    }

    if (discounts) {
        discounts.forEach((discount: Discount) => {
            addDateToCalendarInformationMap (discount)
        })
    }


    //TODO Sort entries
    // const sortedEntries = Object.entries(calendarInformationMap).sort(([dateA], [dateB]) => {
    //     return new Date(dateA).getTime() - new Date(dateB).getTime();
    // });

    return [calendarInformationMap, maxMiniumNights];
}

const calculateMinimumNights = (bookedRange: DateRange, peakSeasonRange: DateRange, minimumNights: Record<string, number>) => {
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

const createDateMatrix = (newRange: DateRange, calendarInformationMap: Record<string, any>, maxMiniumNights: number): Record<string, any> => {
    //if from is missing, return an empty object
    if (!newRange?.from) return {};

    const dateMatrix: Record<string, any> = {};

    const fromTZDate = new TZDate(newRange.from)

    let toTZDate = addDays(fromTZDate, maxMiniumNights) as TZDate; //set missing toTZDate to fromTZDate to start
    if (newRange?.to) {
        toTZDate = new TZDate(newRange.to)
    }

    let currentDate = new TZDate(fromTZDate);
    // console.log("currentDate: ", currentDate);

    while (currentDate < toTZDate) {
        const dateKey = currentDate.toISOString().slice(0, 10);
        const price = calendarInformationMap[dateKey]?.price ?? 0;
        const minimumNights = calendarInformationMap[dateKey]?.minimumNights ?? 0;
        dateMatrix[dateKey] = {
            price: price,
            minimumNights: minimumNights,
        }
        currentDate = (addDays(currentDate, 1) as TZDate)
    }

    return dateMatrix;
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
    setDateMatrix: (matrix: Record<string, any>) => void,
}

export const DatePickerWithRange = ( {
    title,
    unit,
    selected,
    setSelectedDateRange,
    open,
    setOpen,
    setDateMatrix,
}: DatePickerWithRangeProps ) => {
    // console.log("DatePickerWithRange Re-Rendered");
    // console.log("unit imported: ", unit);

    const timeZone = useMemo (() => {
        return unit.tenant?.timezone ?? 'America/New_York';
    }, [])
    //console.log("timeZone: ", timeZone);

    //TODO Remove this next line
    const minimumNights: Record<string, number> = {offPeak: 3, peak: 7};

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

    const [calendarInformationMap, maxMinimumNights] = useMemo(() => {
        return createCalendarInformationMap(unit.rates, unit.peakseasons, unit.discounts, unit.reservations, timeZone)
    }, [unit.rates, unit.peakseasons, unit.discounts, unit.reservations, timeZone])
    //console.log("calendarInformationMap: ", JSON.stringify(calendarInformationMap));

    //Determine the last date to display in the calendar
    let lastDate: Date | string | undefined = Object.keys(calendarInformationMap).at(-1);
    if (lastDate === undefined) {
        //there is an issue with the calendarInformationMap, so use today's date as the last date'
        const today = TZDate.tz(timeZone);
        lastDate = today.toISOString().split('T')[0];
    }
    lastDate = TZDate.tz(timeZone, lastDate as string);

    const [effectiveBookedRanges, checkOutOnlyRanges, initialMinimumStayRanges, notPeakSundays, fullBookedRanges] = useMemo(() => {
        return processBookedRanges(bookedRanges, peakSeasonRanges, minimumNights)
    }, [bookedRanges]); // Only compute once

    //console.log("initialMinimumStayRanges: ", initialMinimumStayRanges);



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

        if (!newRange) return;

        const nights = getNightsCount(newRange)

        if (newRange?.from && newRange?.to) {
            //both dates selected

            //check if multiple days are not selected
            if (!isSameDay(newRange.from, newRange.to)) {

                //create dataMatrix and send to the parent component
                const dateMatrix = createDateMatrix({...newRange}, calendarInformationMap, maxMinimumNights);
                setDateMatrix(dateMatrix);

                setSelectedDateRange({...newRange});
                setCurrentCalendarValues( prevState => ({
                    ...prevState,
                    selectedRange: newRange,
                    firstAvailableBookingDate: startOfDay(TZDate.tz(timeZone)), //reset date to today
                    lastAvailableBookingDate: startOfDay(addDays(TZDate.tz(timeZone),365)), //reset to one year from today
                    minimumStayRanges: initialMinimumStayRanges, //reset to initial values
                    disableCheckOutOnly: true,
                }));


                setTimeout(() => setOpen(false), 1200)

            } else {
                //if the same day is selected, clear the selection
                clearSelection();
            }

        } else {
            //partial range selected

            const nextEffectiveBookedDate = getNextChronological(
                effectiveBookedDaysMapSorted,
                (newRange.from as TZDate).toISOString().split('T')[0]
            )
            console.log("nextEffectiveBookedDate: ", nextEffectiveBookedDate);

            //get the dateMatrix for the next maxMinimumNights days
            let dateMatrix = createDateMatrix({...newRange}, calendarInformationMap, maxMinimumNights);
            console.log("dateMatrix: ", JSON.stringify(dateMatrix));

            if (nextEffectiveBookedDate !== undefined) {
                //if date is defined, remove it and any days after from dateMatrix
                dateMatrix = Object.keys(dateMatrix).reduce<Record<string, any>>((acc, key) => {
                    if (key < nextEffectiveBookedDate) {
                        acc[key] = dateMatrix[key];
                    }
                    return acc;
                }, {});

             }

            console.log("dateMatrix: ", JSON.stringify(dateMatrix));

            //get the value of the first night
            const firstNightMinimumNights = Object.values(dateMatrix)[0].minimumNights;
            // console.log("firstNightMinimumNights: ", firstNightMinimumNights);

            let effectiveMinimumNights = firstNightMinimumNights;
            const mapSize: number = Object.keys(dateMatrix).length;
            const previewDays = Math.min(mapSize, effectiveMinimumNights) - 1;
            // console.log("previewDays: ", previewDays);

            //check first night plus this number of nights dates for higher min
            for (let i = 1; i <= previewDays; i++) {
                // console.log(Object.values(dateMatrix)[i])
                if (Object.values(dateMatrix)[i].minimumNights > effectiveMinimumNights) {
                    effectiveMinimumNights = Object.values(dateMatrix)[i].minimumNights;
                }
            }
            // console.log("effectiveMinimumNights: ", effectiveMinimumNights);

            //const nights = calculateMinimumNights(newRange, peakSeasonRanges[0], minimumNights)
            //find the next effective booking date from a set of dates

            const newMinimumStayRange: DateRange = {
                from: addDays(newRange.from as TZDate, 1),
                to: addDays(newRange.from as TZDate, (effectiveMinimumNights - 1)) as TZDate,
            }



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
        setDateMatrix({});
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
    const fullBookedMap = useDateRangeMap(fullBookedRanges);
    // console.log("fullBookedMap:", fullBookedMap);

    const isDayDisabled = useMemo(() => (day: Date) => {

        if (isBefore(day, startOfDay(currentCalendarValues.firstAvailableBookingDate))) return true
        if (isAfter(day, startOfDay(currentCalendarValues.lastAvailableBookingDate))) return true

        const dateString = format(day, 'yyyy-MM-dd');

        if (effectiveBookedDaysMapSorted.has(dateString)) return true;
        if (fullBookedMap.has(dateString)) return true;
        if (currentCalendarValues.disableCheckOutOnly && checkOutOnlyDayMap.has(dateString)) return true;
        if (notPeakSundaysMap.has(dateString)) return true;
        if (minimumStayMap.has(dateString)) return true;

        return false;

    }, [effectiveBookedDaysMapSorted, fullBookedMap, checkOutOnlyDayMap, notPeakSundaysMap, minimumStayMap, currentCalendarValues.disableCheckOutOnly]);

    const modifiers = useMemo(() => ({
        booked: (day: Date) => effectiveBookedDaysMapSorted.has(format(day, 'yyyy-MM-dd')) || fullBookedMap.has(format(day, 'yyyy-MM-dd')),
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
                <PopoverContent className="w-auto p-4" align="center">
                    <CalendarColorContext value={calendarInformationMap}>
                    <CalendarPriceContext value={calendarInformationMap}>
                    <DayPicker
                        mode="range"
                        fixedWeeks
                        resetOnSelect={true}
                        timeZone={timeZone}
                        startMonth={new Date()}
                        endMonth={lastDate}
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
                            minimumStay: "minimumStay",
                            saturdayCheckOutOnly: "saturdayCheckOutOnly",
                        }}
                        numberOfMonths={1}
                        onSelect={handleSelect}
                        showOutsideDays={false}
                        components={{
                            Day: DynamicDay,
                            DayButton: (props) => (
                                <ToolTipDayButton {...props} />
                            )
                        }}
                    />
                    </CalendarPriceContext>
                    </CalendarColorContext>
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
