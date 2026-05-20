import {IconElement} from "@/modules/ui/icon-element";
import { IconType } from "react-icons";

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
import { FaBed } from "react-icons/fa6";
import { PiBathtub } from "react-icons/pi";
import { PiToilet } from "react-icons/pi";
import { FaDice } from "react-icons/fa6";
import { GiPlantsAndAnimals } from "react-icons/gi";
import { MdOutlineForest } from "react-icons/md";
import { PiMountains } from "react-icons/pi";
import { FaFishFins } from "react-icons/fa6";
import { LuMicrowave } from "react-icons/lu";
import { FaHotTubPerson } from "react-icons/fa6";
import { MdOutlineKingBed } from "react-icons/md";
import { FaTv } from "react-icons/fa6";
import { LuCircleParking } from "react-icons/lu";
import { PiTennisBall } from "react-icons/pi";
import { BsBuildingSlash } from "react-icons/bs";
import React from "react";



const icons = {
    MdCabin: MdCabin,
    HiHomeModern: HiHomeModern,

    MdOutlineWaterDrop: MdOutlineWaterDrop,
    LuSunSnow: LuSunSnow,

    FaKitchenSet: FaKitchenSet,
    LuMicrowave: LuMicrowave,
    FaWifi: FaWifi,
    FaUmbrellaBeach: FaUmbrellaBeach,
    BiSolidWasher: BiSolidWasher,
    MdOutlineLocalLaundryService: MdOutlineLocalLaundryService,
    PiTowel: PiTowel,
    PiToilet: PiToilet,
    FaBed: FaBed,
    MdOutdoorGrill: MdOutdoorGrill,
    PiBathtub: PiBathtub,
    MdFireplace: MdFireplace,

    GiCanoe: GiCanoe,
    FaSailboat: FaSailboat,
    MdDeck: MdDeck,
    FaSwimmingPool: FaSwimmingPool,
    GiBoatFishing: GiBoatFishing,
    RiDiamondLine: RiDiamondLine,
    PiSunglassesFill: PiSunglassesFill,

    ImBooks: ImBooks,
    TbScubaMask: TbScubaMask,
    FaDice: FaDice,
    GiPlantsAndAnimals: GiPlantsAndAnimals,
    MdOutlineForest: MdOutlineForest,
    PiMountains: PiMountains,
    FaFishFins: FaFishFins,

    FaHotTubPerson: FaHotTubPerson,
    MdOutlineKingBed: MdOutlineKingBed,
    FaTv: FaTv,
    LuCircleParking: LuCircleParking,
    PiTennisBall: PiTennisBall,
    BsBuildingSlash: BsBuildingSlash,
}

interface IconSpanProps {
    name: string;
    label: string;
    size?: number;
    key?: React.Key;
}

export const IconSpan = ({name, label, size, index}: IconSpanProps) => {

    const icon: IconType = icons[name as keyof typeof icons];

    return (
        <span className="flex items-center gap-1 text-nowrap">
            <IconElement icon={icon} size={size}/> {label}
        </span>
    )
}