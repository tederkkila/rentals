import React, { createContext, useContext } from "react"
import {DayButton} from "@daypicker/react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/modules/units/ui/components/tooltip"
import { type DayDataConfig } from "@/modules/ui/DayDataConfig";

export const CalendarPriceContext = createContext<Record<string, DayDataConfig>>({});

type ToolTipDayButtonProps = React.ComponentProps<typeof DayButton>

export const ToolTipDayButton = ({
    modifiers,
    day,
    ...buttonProps
}: ToolTipDayButtonProps) => {
    const { disabled, booked, checkOutOnly, minimumStay, peak, saturdayCheckOutOnly } = modifiers;

    //console.log("disabled", disabled.toString())

    let tooltipText = "";
    let showPrice = true;
    if (disabled) showPrice = false

    if (booked) {
        tooltipText = "Booked";
        showPrice = false;
    } else {
        if (checkOutOnly) {
            tooltipText = "Checkout Only";
            showPrice = true;
        } else {
            if (saturdayCheckOutOnly) {
                tooltipText = "Sat. Check in/out";
                showPrice = true;
            } else  if (minimumStay) {
                if (peak) {
                    tooltipText = "< peak night min";
                    showPrice = true;
                } else {
                    tooltipText = "< night min";
                    showPrice = true;
                }
            }
        }
    }

    const rateData = useContext(CalendarPriceContext);
    const dateString = day.date.toISOString().split("T")[0];
    //console.log("dateString", dateString);
    const data = rateData[dateString];

    const price = ("price" in data && data.price) ? data.price : ""
    //const color = ("color" in data && data.color) ? data.color : "gray"
    //const colorstep = ("colorstep" in data && data.colorstep) ? data.colorstep : ""

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <span className="inline-block w-fit test">
                    <DayButton {...buttonProps} day={day} modifiers={modifiers}>
                        <div className="block">
                        <div className="day-number">{day.date.getDate()}</div>
                            {showPrice &&
                                <div className="day-price" style={{ fontSize: '10px', fontWeight: '300', color: 'gray', marginTop: '-2px' }}>
                                  {price}
                                </div>
                            }
                        </div>
                    </DayButton>
                </span>
                </TooltipTrigger>
                {tooltipText && (
                    <TooltipContent>
                        <p>{tooltipText}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
}