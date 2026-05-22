import React from "react"
import { CalendarDayButton } from "@/components/ui/calendar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/modules/units/ui/components/tooltip"

type ToolTipDayButtonProps = React.ComponentProps<typeof CalendarDayButton>

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

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <span className="inline-block w-fit">
                    <CalendarDayButton {...buttonProps} day={day} modifiers={modifiers}>
                        <div className="day-number">{day.date.getDate()}</div>
                        {/*<div className="day-price" style={{ fontSize: '0.7em', color: 'green', marginTop: '-8px' }}>*/}
                        {/*  {"$375"}*/}
                        {/*</div>*/}
                    </CalendarDayButton>
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