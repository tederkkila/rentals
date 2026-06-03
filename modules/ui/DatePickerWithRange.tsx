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

// const processBookedRanges = (
//     bookedRanges: DateRange[],
//     peakSeasonRanges: DateRange[],
//     calendarInformationMap: Record<string, any>,
//     maxMinimumNights: number,
//     minimumNights: Record<string, number>
// ): [DateRange[], DateRange[], DateRange[], DateRange[], DateRange[] ] => {
//
//     let effectiveBookedRanges: DateRange[] = [] //effective booked ranges are the dates that are disabled on the calendar
//     let checkOutOnlyRanges: DateRange[] = [] //dates that only have a check-out
//     let fullBookedRanges: DateRange[] = [] //dates that have both a check-in and check-out
//     let initialMinimumStayRanges: DateRange[] = [] // dates that are disabled for being within a minimum stay range
//     let notPeakSundays: DateRange[] = []
//
//     const checkedOutDays = new Set<string>()
//
//     bookedRanges.forEach((bookedRange: DateRange) => {
//
//         if (bookedRange.from && bookedRange.to) {
//
//             const fromTZDate = bookedRange.from as TZDate
//             const toTZDate = bookedRange.to as TZDate
//
//             effectiveBookedRanges.push({
//                 from: addDays(fromTZDate, 1) as TZDate,
//                 to:   subDays(toTZDate, 1) as TZDate,
//             });
//
//             const fromTZString = fromTZDate.toISOString().split('T')[0]
//
//             if (!checkedOutDays.has(fromTZString)) {
//                 checkOutOnlyRanges.push({
//                     from: fromTZDate,
//                     to: fromTZDate,
//                 });
//             } else {
//                 fullBookedRanges.push({
//                     from: fromTZDate,
//                     to: fromTZDate,
//                 })
//             }
//
//             checkedOutDays.add(toTZDate.toISOString().split('T')[0])
//
//         }
//
//         peakSeasonRanges.forEach(peakSeasonRange => {
//
//             bookedRanges.forEach(bookedRange => {
//
//                 const nights = calculateMinimumNights(bookedRange, peakSeasonRange, minimumNights)
//
//                 const minimumStayRange = {
//                     from: addDays(bookedRange.from as TZDate, -1 * (nights - 1)) as TZDate,
//                     to: addDays(bookedRange.from as TZDate, -1),
//                 }
//
//                 const exists = initialMinimumStayRanges.some(
//                     (r) =>
//                         r.from &&
//                         r.to &&
//                         minimumStayRange.from &&
//                         minimumStayRange.to &&
//                         isSameDay(r.from, minimumStayRange.from) &&
//                         isSameDay(r.to, minimumStayRange.to)
//                 );
//
//                 if (!exists) {
//                     initialMinimumStayRanges.push(minimumStayRange);
//                 }
//
//             })
//
//         });
//
//
//     })
//
//     peakSeasonRanges.forEach(peakSeasonRange => {
//         // Get every Sunday within the peak range
//         const WEEK_STARTS_ON_SUNDAY = 0 as 0 //date-fns expects weekStartsOn to be a specific union type (0 | 1 | 2 | 3 | 4 | 5 | 6) rather than a general number
//         const sundays = eachWeekOfInterval(
//             { start: peakSeasonRange.from as TZDate, end: peakSeasonRange.to as TZDate },
//             { weekStartsOn: WEEK_STARTS_ON_SUNDAY }
//         );
//
//         sundays.forEach((sunday) => {
//             const friday = addDays(sunday, 5);
//
//             if (isAfter(sunday, peakSeasonRange.from as TZDate) && isBefore(friday, peakSeasonRange.to as TZDate)) {
//                 notPeakSundays.push({
//                     from: sunday,
//                     to: friday,
//                 });
//             }
//
//         });
//
//     });
//
//     console.log("initialMinimumStayRanges: ", initialMinimumStayRanges);
//     return [effectiveBookedRanges, checkOutOnlyRanges, initialMinimumStayRanges, notPeakSundays, fullBookedRanges]
// }

const createCalendarInformationMap = (
    rates: Rate[] | null,
    peakseasons: Peakseason[] | null,
    discounts: Discount[] | null,
    reservations: Reservation[] | null,
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

        let formattedChosenDay: string[] = [];
        let isPeakSeason = false;

        if ("requireCheckin" in data) {
            console.log("requireCheckin: ", data.requireCheckin);
            isPeakSeason = true;
            if (minimumNights == 7 && data.requireCheckin) {
                //only added if requireCheckin is present and minNights is 7
                const requireCheckin = data.requireCheckin;
                //console.log("requireCheckin: ", requireCheckin);

                if (Number(requireCheckin) !== -1) {

                    const requiredCheckInOutDay = Number(requireCheckin) as 0 | 1 | 2 | 3 | 4 | 5 | 6 //date-fns expects weekStartsOn to be a specific union type (0 | 1 | 2 | 3 | 4 | 5 | 6) rather than a general number

                    const chosenDay = eachWeekOfInterval(
                        {start: startDate as TZDate, end: endDate as TZDate},
                        {weekStartsOn: requiredCheckInOutDay}
                    );

                    formattedChosenDay = chosenDay.map((date: Date) => {
                        return date.toISOString().split('T')[0];
                    });

                }

            }
        }

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

            if (formattedChosenDay.length > 0) {
                if (formattedChosenDay.includes(dateKey)) {
                    calendarInformationMap[dateKey].chosenDay = true;
                } else {
                    calendarInformationMap[dateKey].notChosenDay = true;
                }
            }

            if (isPeakSeason) {
                calendarInformationMap[dateKey].peak = true;
            }

            startDate.setDate(startDate.getDate() + 1);
        }

    }

    //add rate data to calendarInformationMap
    if ( !rates || rates.length == 0 ) return [calendarInformationMap, maxMiniumNights]; //return empty map if no rates
    rates.forEach((rate: Rate) => {
        addDateToCalendarInformationMap (rate)
    })

    if ( peakseasons && peakseasons.length > 0 ) {
        peakseasons.forEach((peakseason: Peakseason) => {
            addDateToCalendarInformationMap (peakseason)
        })
    }

    if ( discounts && discounts.length > 0 ) {
        discounts.forEach((discount: Discount) => {
            addDateToCalendarInformationMap (discount)
        })
    }

    if ( reservations && reservations.length > 0 ) {
        reservations.forEach((reservation: Reservation) => {
            const startDate = new TZDate(reservation.startDate, reservation.startDate_tz);
            const endDate = new TZDate(reservation.endDate, reservation.endDate_tz);

            calendarInformationMap[startDate.toISOString().slice(0, 10)].checkin = true;
            calendarInformationMap[endDate.toISOString().slice(0, 10)].checkout = true;

            if (calendarInformationMap[startDate.toISOString().slice(0, 10)].checkout) {
                calendarInformationMap[startDate.toISOString().slice(0, 10)].full = true;
            }

            while (startDate <= endDate) {
                const dateKey = startDate.toISOString().slice(0, 10);

                calendarInformationMap[dateKey].booked = true;

                startDate.setDate(startDate.getDate() + 1);
            }
        })
    }


    //TODO Sort entries
    // const sortedEntries = Object.entries(calendarInformationMap).sort(([dateA], [dateB]) => {
    //     return new Date(dateA).getTime() - new Date(dateB).getTime();
    // });

    return [calendarInformationMap, maxMiniumNights];
}

// const useDateRangeMap = (sourceRanges: DateRange[]) => {
//
//     const dateMap = new Map();
//     if (!sourceRanges) return dateMap;
//
//     sourceRanges.forEach((sourceRange: DateRange) => {
//             if (sourceRange.from && sourceRange.to) {
//                 const currentDate = new TZDate(sourceRange.from);
//                 const endDate = new TZDate(sourceRange.to);
//
//                 while (currentDate <= endDate) {
//                     // Use ISO string or similar formatted string as the map key
//                     dateMap.set(currentDate.toISOString().split('T')[0], true);
//                     currentDate.setDate(currentDate.getDate() + 1);
//                 }
//             }
//         });
//         // console.log("dateMap: ", dateMap);
//
//     return dateMap;
// }

// const getNextChronological = (map: Map<string, any>, targetDate: string): string | undefined => {
//     let nextDate: string | undefined = undefined;
//
//     for (const date of map.keys()) {
//         if (date > targetDate) {
//             if (nextDate === undefined || date < nextDate) {
//                 nextDate = date;
//             }
//         }
//     }
//     return nextDate;
// }

const getNextChronologicalFromSet = (dateSet: Set<string>, targetDate: string): string | undefined => {
    for (const date of dateSet) {
        if (date > targetDate) {
            return date;
        }
    }
    return undefined;
}

// const getNightsCount = (newRange: DateRange): number => {
//     if (!newRange?.from || !newRange?.to) return 0;
//     return differenceInDays(newRange.to, newRange.from);
// };

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

const createCalendarInformationSet = (calendarInformationMap: Record<string, any>, rules: Array<object>): Set<string> => {
    const calendarInformationSet = new Set<string>();

    // 1. Iterate through each date entry in the map
    for (const [dateStr, dayDetails] of Object.entries(calendarInformationMap)) {
        // 2. Check if the day matches AT LEAST ONE rule object (OR logic between rules)
        const matchesAnyRule = rules.some( rule => {
            // 3. Check if the day matches ALL conditions inside this specific rule (AND logic)
            return Object.entries(rule).every(([key, ruleValue]) => {
                const mapValue = dayDetails[key] !== undefined ? dayDetails[key] : false;
                return mapValue === ruleValue;
            });
        });

        // 4. If a match is found, add the date string to the Set
        if (matchesAnyRule) {
            calendarInformationSet.add(dateStr);
        }
    }
    return calendarInformationSet;
}

const calculateInitialMinimumNightSet = (calendarInformationMap: Record<string, any>, maxMinimumNights: number): Set<string> => {
    const minimumNightSet = new Set<string>();

    for (const [dateStr, dayDetails] of Object.entries(calendarInformationMap)) {

        const checkin = dayDetails['checkin'] !== undefined ? dayDetails['checkin'] : false;

        if (checkin) {
            //console.log("checkin: ", dateStr);
            for (let nights = maxMinimumNights; nights >= 1; nights--) {
                const minimumNightDate = subDays(new TZDate(dateStr, 'UTC'), nights) as TZDate;
                const minimumNightDateStr = minimumNightDate.toISOString().split('T')[0];
                const booked = calendarInformationMap[minimumNightDateStr]?.booked ?? false;
                const minimumNight = calendarInformationMap[minimumNightDateStr]?.minimumNights ?? 0;

                //console.log(`   ${nights} | ${minimumNightDateStr}, ${minimumNight}, booked:${booked}`)

                if (minimumNight > nights) {

                    minimumNightSet.add(minimumNightDateStr);
                } else {
                    //check minNights of days in the future from this date
                    for( let i = 1; i < minimumNight; i++ ) {
                        const futureMinimumNightDate = addDays(minimumNightDate, i) as TZDate;
                        const futureMinimumNightDateStr = futureMinimumNightDate.toISOString().split('T')[0];
                        const futureMinimumNight = calendarInformationMap[futureMinimumNightDateStr]?.minimumNights ?? 0;
                        //console.log(`       ${i} | ${futureMinimumNightDateStr}, ${futureMinimumNight}`);
                        if (futureMinimumNight > nights) {
                            minimumNightSet.add(minimumNightDateStr);
                        }
                    }
                }
            }
        }

    }

    return minimumNightSet;
}

const convertRangeToSet = (range:DateRange): Set<string> => {
    // Return empty Set if the range is incomplete
    if (!range || !range.from || !range.to) return new Set();

    const dateSet = new Set<string>();
    let current = new Date(range.from);
    const end = new Date(range.to);

    // Loop through each day and add to the Set
    while (current <= end) {
        // Format to 'YYYY-MM-DD'
        const dateString = format(current, 'yyyy-MM-dd');
        dateSet.add(dateString);

        // Move to the next day
        current.setDate(current.getDate() + 1);
    }

    return dateSet;
}

interface handleStateProperties {
    selectedRange: DateRange | undefined,
    minimumStaySet: Set<string>,
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

    const timeZone = useMemo (() => {
        return unit.tenant?.timezone ?? 'America/New_York';
    }, [])

    // const minimumNights: Record<string, number> = {offPeak: 3, peak: 7};

    //production will have no range selected to start
    // const bookedRanges: DateRange[] = useMemo(() => {
    //     let data: DateRange[] = [];
    //
    //     if (unit.reservations && unit.reservations.length > 0) {
    //         unit.reservations.map ((reservation: Reservation) => {
    //             data.push({
    //                 from: new TZDate(reservation.startDate, reservation.startDate_tz),
    //                 to: new TZDate(reservation.endDate, reservation.endDate_tz),
    //             })
    //         })
    //     }
    //
    //     return data
    // }, [unit.reservations])

    // const peakSeasonRanges: DateRange[] = useMemo(() => {
    //     let data: DateRange[] = [];
    //
    //     if (unit.peakseasons && unit.peakseasons.length > 0) {
    //         unit.peakseasons.map((peakseason: Peakseason) => {
    //             data.push({
    //                 from: new TZDate(peakseason.startDate, peakseason.startDate_tz),
    //                 to: new TZDate(peakseason.endDate, peakseason.endDate_tz),
    //             })
    //         })
    //     }
    //     /*[{ from: new TZDate(2026, 5, 20, timeZone), to: new TZDate(2026, 8, 7, timeZone) }];*/
    //     return data
    // }, [unit.peakseasons])

    const [calendarInformationMap, maxMinimumNights] = useMemo(() => {
        return createCalendarInformationMap(unit.rates, unit.peakseasons, unit.discounts, unit.reservations)
    }, [unit.rates, unit.peakseasons, unit.discounts, unit.reservations])
    // console.log("calendarInformationMap: ", JSON.stringify(calendarInformationMap));
    //console.log("calendarInformationMap: ", calendarInformationMap);

    //Determine the last date to display in the calendar
    let lastDate: Date | string | undefined = Object.keys(calendarInformationMap).at(-1);
    if (lastDate === undefined) {
        //there is an issue with the calendarInformationMap, so use today's date as the last date'
        const today = TZDate.tz(timeZone);
        lastDate = today.toISOString().split('T')[0];
    }
    lastDate = TZDate.tz(timeZone, lastDate as string);

    // const [effectiveBookedRanges, checkOutOnlyRanges, initialMinimumStayRanges, notPeakSundays, fullBookedRanges] = useMemo(() => {
    //     return processBookedRanges(bookedRanges, peakSeasonRanges, calendarInformationMap, maxMinimumNights, minimumNights)
    // }, [bookedRanges]); // Only compute once
    // //console.log("initialMinimumStayRanges: ", initialMinimumStayRanges);

    const initialMinimumNightSet = calculateInitialMinimumNightSet(calendarInformationMap, maxMinimumNights);
    console.log("initialMinimumNightSet: ", initialMinimumNightSet);

    //TODO create function to calculate first available check-in date (weekend preferred)
    const [currentCalendarValues, setCurrentCalendarValues ] = useState<handleStateProperties>(
        {
            selectedRange: selected,
            minimumStaySet: initialMinimumNightSet,
            firstAvailableBookingDate: startOfDay(TZDate.tz(timeZone)),
            lastAvailableBookingDate: startOfDay(addDays(TZDate.tz(timeZone),365)),
            disableCheckOutOnly: true,
        },
    )

    const effectiveBookedDaysSet = createCalendarInformationSet(calendarInformationMap,
        [ {'booked': true, 'checkin': false, 'checkout': false} ] //both in one object must match
    );
    //console.log("effectiveBookedDaysSet: ", effectiveBookedDaysSet);

    const checkOutOnlyDaySet = createCalendarInformationSet(calendarInformationMap,
        [ {'checkout': false, 'checkin': true} ] //both in one object must match
    );
    //console.log("checkOutOnlyDaySet: ", checkOutOnlyDaySet);

    //TODO remove peak and just add minnights to tooltip
    const peakSeasonSet = createCalendarInformationSet(calendarInformationMap,
        [ {'peak': true} ]
    );
    //console.log("peakSeasonSet: ", peakSeasonSet);

    const notChosenDaySet = createCalendarInformationSet(calendarInformationMap,
        [ {'notChosenDay': true} ] //both in one object must match
    );
    //console.log("notChosenDaySet: ", notChosenDaySet);

    const fullBookedSet = createCalendarInformationSet(calendarInformationMap,
        [ {'full': true} ]
    );
    //console.log("fullBookedSet: ", fullBookedSet);

    const handleSelect = (newRange: DateRange | undefined) => {
        console.log("newRange: ", newRange);

        if (!newRange) return;

        //const nights = getNightsCount(newRange)

        if (newRange?.from && newRange?.to) {
            //both dates selected

            //confirm that the from and to dates are different
            if (!isSameDay(newRange.from, newRange.to)) {

                //create dataMatrix and send to the parent component
                const dateMatrix = createDateMatrix({...newRange}, calendarInformationMap, maxMinimumNights);

                //update parent component
                setDateMatrix(dateMatrix);
                setSelectedDateRange({...newRange});

                setCurrentCalendarValues( prevState => ({
                    ...prevState,
                    selectedRange: newRange,
                    firstAvailableBookingDate: startOfDay(TZDate.tz(timeZone)), //reset date to today
                    lastAvailableBookingDate: startOfDay(addDays(TZDate.tz(timeZone),365)), //reset to one year from today
                    minimumStaySet: initialMinimumNightSet, //reset to initial values
                    disableCheckOutOnly: true,
                }));

                //close the popover calendar
                setTimeout(() => setOpen(false), 1200)

            } else {
                //from and to are the same day, clear the selection
                //translates to user action of selecting and deselecting the same day
                clearSelection();
            }

        } else {
            //only the 'from' date selected

            //find the next effective booking as the max possible 'to' date
            // const nextEffectiveBookedDate = getNextChronological(
            //     effectiveBookedDaysMapSorted,
            //     (newRange.from as TZDate).toISOString().split('T')[0]
            // )
            // console.log("nextEffectiveBookedDate: ", nextEffectiveBookedDate);

            const nextEffectiveBookedDateFromSet = getNextChronologicalFromSet(
                effectiveBookedDaysSet,
                (newRange.from as TZDate).toISOString().split('T')[0]
            )
            console.log("nextEffectiveBookedDateFromSet: ", nextEffectiveBookedDateFromSet);

            //get the dateMatrix for the next maxMinimumNights days
            let dateMatrix = createDateMatrix({...newRange}, calendarInformationMap, maxMinimumNights);
            console.log("dateMatrix: ", JSON.stringify(dateMatrix));

            if (nextEffectiveBookedDateFromSet !== undefined) {
                //if the nextEffectiveBookedDate is defined, remove it and any days after from dateMatrix
                dateMatrix = Object.keys(dateMatrix).reduce<Record<string, any>>((acc, key) => {
                    if (key < nextEffectiveBookedDateFromSet) {
                        acc[key] = dateMatrix[key];
                    }
                    return acc;
                }, {});

             }

            //confirm dateMatrix is the proper length
            console.log("dateMatrix: ", JSON.stringify(dateMatrix));

            //get the min nights of the first night
            let effectiveMinimumNights = Object.values(dateMatrix)[0].minimumNights;
            const mapSize: number = Object.keys(dateMatrix).length;
            const previewDays = Math.min(mapSize, effectiveMinimumNights) - 1;

            //check first night plus previewDays for higher min value
            for (let i = 1; i <= previewDays; i++) {
                if (Object.values(dateMatrix)[i].minimumNights > effectiveMinimumNights) {
                    effectiveMinimumNights = Object.values(dateMatrix)[i].minimumNights;
                }
            }

            //const nights = calculateMinimumNights(newRange, peakSeasonRanges[0], minimumNights)

            const newMinimumStayRange: DateRange = {
                from: addDays(newRange.from as TZDate, 1),
                to: addDays(newRange.from as TZDate, (effectiveMinimumNights - 1)) as TZDate,
            }

            const newMiniumStaySet = convertRangeToSet(newMinimumStayRange)

            if (nextEffectiveBookedDateFromSet === undefined) {

                //there might be no nextEffectiveBookedDate if there are no bookings in the next year
                //hard code in 90 days max
                setCurrentCalendarValues( prevState => ({
                    ...prevState,
                    selectedRange: newRange,
                    minimumStaySet: newMiniumStaySet,
                    firstAvailableBookingDate: newRange.from as TZDate,
                    lastAvailableBookingDate: addDays(newRange.from as TZDate, 90 - 1) as TZDate,
                    disableCheckOutOnly: false,
                }));

                console.log("final date: ", currentCalendarValues.lastAvailableBookingDate);

            } else {

                const nextEffectiveBookedDateInSelection = rangeIncludesDate(newRange, TZDate.tz(nextEffectiveBookedDateFromSet as unknown as string, timeZone))
                console.log("nextEffectiveBookedDateInSelection: ", nextEffectiveBookedDateInSelection);

                const lastAvailableBookingDate = nextEffectiveBookedDateFromSet as unknown as TZDate;

                setCurrentCalendarValues( prevState => ({
                    ...prevState,
                    selectedRange: newRange,
                    minimumStaySet: newMiniumStaySet,
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
            minimumStaySet: initialMinimumNightSet,
            firstAvailableBookingDate: startOfDay(TZDate.tz(timeZone)),
            lastAvailableBookingDate: startOfDay(addDays(TZDate.tz(timeZone),365)),
            disableCheckOutOnly: true,
        }));

    }

    // const effectiveBookedDaysMap: Map<string, any> = useDateRangeMap(effectiveBookedRanges);

    // const effectiveBookedDaysMapSorted = useMemo(() => {
    //     const keysSorted = Array.from(effectiveBookedDaysMap.keys()).sort();
    //
    //     const sortedMap  = new Map();
    //     keysSorted.forEach(key => {
    //         sortedMap .set(key, effectiveBookedDaysMap.get(key));
    //     });
    //
    //     return sortedMap ;
    // }, [effectiveBookedDaysMap])

    //Create sets for fast lookup of dates by date string
    //const checkOutOnlyDayMap = useDateRangeMap(checkOutOnlyRanges);
    //console.log("checkOutOnlyDayMap: ", checkOutOnlyDayMap);
    //const notPeakSundaysMap = useDateRangeMap(notPeakSundays);
    //console.log("notPeakSundaysMap: ", notPeakSundaysMap);
    //const minimumStayMap = useDateRangeMap(currentCalendarValues.minimumStayRanges);
    //console.log("minimumStayMap: ", minimumStayMap);
    //const peakSeasonMap = useDateRangeMap(peakSeasonRanges);
    //console.log("peakSeasonMap:", peakSeasonMap);
    //const fullBookedMap = useDateRangeMap(fullBookedRanges);
    //console.log("fullBookedMap:", fullBookedMap);



    const isDayDisabled = useMemo(() => (day: Date) => {

        if (isBefore(day, startOfDay(currentCalendarValues.firstAvailableBookingDate))) return true
        if (isAfter(day, startOfDay(currentCalendarValues.lastAvailableBookingDate))) return true

        const dateString = format(day, 'yyyy-MM-dd');

        if (effectiveBookedDaysSet.has(dateString)) return true;
        if (fullBookedSet.has(dateString)) return true;
        if (currentCalendarValues.disableCheckOutOnly && checkOutOnlyDaySet.has(dateString)) return true;
        if (notChosenDaySet.has(dateString)) return true;
        if (currentCalendarValues.minimumStaySet.has(dateString)) return true;

        return false;

    }, [effectiveBookedDaysSet, fullBookedSet, checkOutOnlyDaySet, notChosenDaySet, currentCalendarValues.minimumStaySet, currentCalendarValues.disableCheckOutOnly]);

    const modifiers = useMemo(() => ({
        booked: (day: Date) => effectiveBookedDaysSet.has(format(day, 'yyyy-MM-dd')) || fullBookedSet.has(format(day, 'yyyy-MM-dd')),
        checkOutOnly: (day: Date) => checkOutOnlyDaySet.has(format(day, 'yyyy-MM-dd')),
        chosenDayCheckOutOnly: (day: Date) => notChosenDaySet.has(format(day, 'yyyy-MM-dd')),
        minimumStay: (day: Date) => currentCalendarValues.minimumStaySet.has(format(day, 'yyyy-MM-dd')),
        peak: (day: Date) => peakSeasonSet.has(format(day, 'yyyy-MM-dd')),
    }), [effectiveBookedDaysSet, checkOutOnlyDaySet, notChosenDaySet, currentCalendarValues.minimumStaySet, peakSeasonSet]);

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
                        //     chosenDayCheckOutOnly: notPeakSundays,
                        // }}
                        modifiersClassNames={{
                            booked: "booked",
                            peak: "peak",
                            checkOutOnly: "checkOutOnly ",
                            minimumStay: "minimumStay",
                            chosenDayCheckOutOnly: "chosenDayCheckOutOnly",
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
