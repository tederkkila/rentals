import {IconSpan} from "@/modules/ui/icon-span";
import React from "react";

export const AmenitiesList = ({unit}) => {

    if (!unit.tags) return <p className="text-nowrap flex">No amenities found</p>

    const amenities = unit.tags.filter( (tag) => tag.isAmenity === true);

    return (
        <div className="grow">
            {amenities.map((amenity) => (
                <IconSpan name={amenity.icon} label={amenity.name} size={15} key={amenity.id} />
            ))}

        </div>



    )
}

