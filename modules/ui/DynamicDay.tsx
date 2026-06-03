import { createContext, useContext } from "react";
import { type DayProps } from "@daypicker/react";
import Color from 'colorjs.io'
import { type DayDataConfig } from "@/modules/ui/calendarTypes";

export const CalendarColorContext = createContext<Record<string, DayDataConfig>>({});

export function DynamicDay(props: DayProps) {
    // Extract date and internal children (the DayButton) from props
    const { day, modifiers, children, ...tdProps } = props;
    const {
        booked, chosenDayCheckOutOnly,
        range_start, range_middle, range_end,
    } = modifiers;
    // Consume your dynamic hex color data mapping
    const rateData: Record<string, DayDataConfig> = useContext(CalendarColorContext);

    const dateString = day.date.toISOString().split("T")[0];
    let cellStyle = {
        ...props.style,
    }

    if (dateString in rateData) {

        const data: DayDataConfig = rateData[dateString];
        const color = ("color" in data && data.color) ? data.color : null

        const colorstep = ("colorstep" in data && data.colorstep) ? data.colorstep : ""

        let bgColor = "";
        let borderColor = "var(--color-neutral-200)";

        if (color) {
            //console.log("color", color)

            const colorVarName = `--color-${color}-${colorstep}`;
            //console.log("colorVarName", colorVarName)
            const value = getComputedStyle(document.documentElement)
                .getPropertyValue(colorVarName)
                .trim();
            //console.log("value", value)

            const okLCH = new Color(value).oklch;
            // let {l, c, h} = okLCH;
            // l = l * (colorstep * 0.01);
            //console.log("okLCH", Math.round(l * 1000)/1000, Math.round(c * 1000)/1000, Math.round(h * 1000)/1000)

            bgColor = `var(${colorVarName})`;
            const colorStepNumber: number = colorstep as unknown as number;
            const borderColorStep = (colorStepNumber <= 700) ? Number(colorStepNumber) + 200 : 950;
            borderColor = `var(--color-${color}-${borderColorStep})`;
        }


        //const bgColor = `var(--color-${color}-${colorstep})`
        //const updatedClassName = props.className + ` ${bgColor}`;
        // Intercept the inline styles to apply your dynamic background color
        //console.log("props.style", props.style);
        //console.log("className:", props.className);


        if (!range_middle && !range_start && !range_end) {
            cellStyle = {
                ...cellStyle,
                backgroundColor: bgColor || "",
                borderRadius: "4px",

            }
            if (!booked) {
                cellStyle = {
                    ...cellStyle,
                    outlineColor: borderColor || "transparent",
                    outlineWidth: "thin",
                    outlineStyle: "solid" as const,

                };
            } else {
                cellStyle = {
                    ...cellStyle,
                    opacity: 0.3,
                }
            }


        } else {
            cellStyle = {
                ...cellStyle,
                borderColor: 'blue',
                borderWidth: '1px',
                borderStyle: 'solid' as const,
            }
            if (range_start) {
                cellStyle = {
                    ...cellStyle,
                    borderRadius: "50% 0 0 50%",
                    borderRightColor: "transparent",
                }
            } else if (range_middle) {
                cellStyle = {
                    ...cellStyle,
                    borderRightColor: "transparent",
                    borderLeftColor: "transparent",
                }
            } else if (range_end) {
                cellStyle = {
                    ...cellStyle,
                    borderRadius: "0 50% 50% 0",
                    borderLeftColor: "transparent",
                }
            }
        }
    } else {

    }

    return (
        <td {...tdProps} style={cellStyle}  >
            {children}
        </td>
    );
}
