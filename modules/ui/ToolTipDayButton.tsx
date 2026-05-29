import React, { createContext, useContext } from "react"
import { CalendarDayButton } from "@/components/ui/calendar"
import {DayButton} from "@daypicker/react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/modules/units/ui/components/tooltip"

export const CalendarPriceContext = createContext<Record<string, string>>({});

type ToolTipDayButtonProps = React.ComponentProps<typeof DayButton>

export const ToolTipDayButton = ({
    modifiers,
    day,
    ...buttonProps
}: ToolTipDayButtonProps) => {
    const { booked, checkOutOnly, minimumStay, peak, saturdayCheckOutOnly } = modifiers;

    let tooltipText = "";
    if (booked) {
        tooltipText = "Booked";
    } else {
        if (checkOutOnly) {
            tooltipText = "Checkout Only";
        } else {
            if (saturdayCheckOutOnly) {
                tooltipText = "Sat. Check in/out";
            } else  if (minimumStay) {
                if (peak) {
                    tooltipText = "< peak night min";
                } else {
                    tooltipText = "< night min";
                }
            }
        }
    }

    const rateData = useContext(CalendarPriceContext);
    const dateString = day.date.toISOString().split("T")[0];
    //console.log("dateString", dateString);
    const data = rateData[dateString];

    const price = ("price" in data && data.price) ? data.price : ""
    const color = ("color" in data && data.color) ? data.color : "gray"
    const colorstep = ("colorstep" in data && data.colorstep) ? data.colorstep : ""

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <span className="inline-block w-fit test">
                    <DayButton {...buttonProps} day={day} modifiers={modifiers}>
                        <div className="block">
                        <div className="day-number">{day.date.getDate()}</div>
                        <div className="day-price" style={{ fontSize: '10px', fontWeight: '300', color: 'black', marginTop: '-2px' }}>
                          {price}
                        </div>
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