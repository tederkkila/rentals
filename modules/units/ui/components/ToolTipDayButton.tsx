import { DayPicker, DayButton, DayButtonProps, } from "react-day-picker"
import { Calendar, CalendarDayButton  } from "@/components/ui/calendar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { children } from "happy-dom/lib/PropertySymbol";

export const ToolTipDayButton = ({ children, modifiers, day, ...buttonProps }) => {
    // const { day, modifiers, ...buttonProps } = props;
    const { disabled, booked, checkOutOnly, minimumStay, peak, saturdayCheckOutOnly } = modifiers;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <span className="inline-block w-fit">
                  <CalendarDayButton day={day} modifiers={modifiers} {...buttonProps}>
                  {children}
                </CalendarDayButton>
                </span>
                </TooltipTrigger>
                    {booked && (
                        <TooltipContent>
                        <p>Booked</p>
                        </TooltipContent>
                    )}
                    {checkOutOnly && !booked && (
                        <TooltipContent>
                        <p>Checkout Only</p>
                        </TooltipContent>
                    )}
                    {minimumStay && (
                        <TooltipContent>
                            <p>2-night min</p>
                        </TooltipContent>
                    )}
                    {minimumStay && peak && (
                        <TooltipContent>
                            <p>7-night min</p>
                        </TooltipContent>
                    )}
                    {saturdayCheckOutOnly && peak && !booked && (
                        <TooltipContent>
                            <p>Saturday Checkin/out</p>
                        </TooltipContent>
                    )}
            </Tooltip>
        </TooltipProvider>
    );
}