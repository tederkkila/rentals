import {IconElement} from "@/modules/ui/icon-element";

import { FaKitchenSet } from "react-icons/fa6"
import { FaUmbrellaBeach } from "react-icons/fa6"
import { PiTowel } from "react-icons/pi";
import { MdFireplace } from "react-icons/md";
import { GiCanoe } from "react-icons/gi";
import { GiBoatFishing } from "react-icons/gi";
import { FaWifi } from "react-icons/fa6";
import { FaSailboat } from "react-icons/fa6";
import { MdDeck } from "react-icons/md";
import { FaSwimmingPool } from "react-icons/fa";
import { LuSunSnow } from "react-icons/lu";
import { RiDiamondLine } from "react-icons/ri";
import { PiSunglassesFill } from "react-icons/pi";
import { ImBooks } from "react-icons/im";
import { MdOutlineWaterDrop } from "react-icons/md";
import { MdCabin } from "react-icons/md";
import { HiHomeModern } from "react-icons/hi2";
import { MdOutdoorGrill } from "react-icons/md";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { BiSolidWasher } from "react-icons/bi";
import { TbScubaMask } from "react-icons/tb";


const icons = {
    FaKitchenSet: {icon: FaKitchenSet},
    FaUmbrellaBeach: {icon: FaUmbrellaBeach},
    PiTowel: {icon: PiTowel},
    MdFireplace: {icon: MdFireplace},
    GiCanoe: {icon: GiCanoe},
    FaWifi: {icon: FaWifi},
    FaSailboat: {icon: FaSailboat},
    MdDeck: {icon: MdDeck},
    FaSwimmingPool: {icon: FaSwimmingPool},
    LuSunSnow: {icon: LuSunSnow},
    GiBoatFishing: {icon: GiBoatFishing},
    RiDiamondLine: {icon: RiDiamondLine},
    PiSunglassesFill: {icon: PiSunglassesFill},
    ImBooks: {icon: ImBooks},
    MdOutlineWaterDrop: {icon: MdOutlineWaterDrop},
    MdCabin: {icon: MdCabin},
    HiHomeModern: {icon: HiHomeModern},
    MdOutdoorGrill: {icon: MdOutdoorGrill},
    MdOutlineLocalLaundryService: {icon: MdOutlineLocalLaundryService},
    BiSolidWasher: {icon: BiSolidWasher},
    TbScubaMask: {icon: TbScubaMask},
}

interface IconSpanProps {
    name: string;
    label: string;
    size?: number;
    index?: number;
}

export const IconSpan = ({name, label, size, index}: IconSpanProps) => {

    const icon = icons[name].icon;

    return (
        <span key={index} className="flex items-center gap-1 text-nowrap">
            <IconElement icon={icon} size={size}/> {label}
        </span>
    )
}