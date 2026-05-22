import {IconSpan} from "@/modules/ui/icon-span";
import React from "react";
import { Unit, Tag } from "@/payload-types";

interface Props {
    unit: Unit,
}

const isTag = (tag: string | Tag): tag is Tag => {
    return typeof tag === "object" && tag !== null;
};

export const AmenitiesList = ({unit}: Props) => {

    if (!unit.tags) return <p className="text-nowrap flex">No amenities found</p>

    const amenities = unit.tags
        .filter(isTag)
        .filter((tag) => tag.isAmenity === true);

    return (
        <div className="grow">
            {amenities.map((amenity) => (
                <IconSpan name={amenity.icon} label={amenity.name} size={15} key={amenity.id} />
            ))}

        </div>



    )
}

