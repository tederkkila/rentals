import {IconType} from "react-icons";

interface IconElementProps {
    icon: IconType;
    size?: number;
}

export const IconElement = ({icon: Icon, size}: IconElementProps) =>
            <Icon size={size} />


