import { createContext, useContext } from "react";
import { type DayProps } from "@daypicker/react";
import Color from 'colorjs.io'

// Structure: { "2026-05-28": {color: "#ff5733"} }
export const CalendarColorContext = createContext<Record<string, string>>({});

export function DynamicDay(props: DayProps) {
    // Extract date and internal children (the DayButton) from props
    const { day, modifiers, children, ...tdProps } = props;
    const {disabled} = modifiers;
    // Consume your dynamic hex color data mapping
    const rateData = useContext(CalendarColorContext);

    const dateString = day.date.toISOString().split("T")[0];
    const data = rateData[dateString];
    const color = ("color" in data && data.color) ? data.color : null
    const colorstep = ("colorstep" in data && data.colorstep) ? data.colorstep : ""

    let bgColor = "transparent";
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
        let {l, c, h} = okLCH;
        // l = l * (colorstep * 0.01);
        //console.log("okLCH", Math.round(l * 1000)/1000, Math.round(c * 1000)/1000, Math.round(h * 1000)/1000)

        bgColor = `var(${colorVarName})`;
        borderColor = `var(--color-${color}-300)`;
    }


    //const bgColor = `var(--color-${color}-${colorstep})`
    //const updatedClassName = props.className + ` ${bgColor}`;
    // Intercept the inline styles to apply your dynamic background color
    //console.log("props.style", props.style);
    //console.log("className:", props.className);

    const cellStyle = {
        ...props.style,
        backgroundColor: bgColor || "transparent",
        outlineColor: borderColor || "transparent",
        outlineWidth: "thin",
        outlineStyle: "solid",
        borderRadius: "4px",
    };

    return (
        <td {...tdProps} style={cellStyle} /*className={updatedClassName}*/ >
            {children}
        </td>
    );
}
