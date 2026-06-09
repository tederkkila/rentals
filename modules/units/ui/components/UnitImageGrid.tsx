import React from "react";
import type { Media, Unit } from "@/payload-types";
import { Box, Grid, AspectRatio } from "@radix-ui/themes";
import Image from "next/image";
import { DotImageSlider } from "@/modules/ui/DotImageSlider";
//import DecorativeBox from "@/modules/ui/DecorativeBox";

interface UnitCardProps {
    unit: Unit,
}
export const UnitImageGrid = ({ unit } : UnitCardProps) => {

    const firstFive = unit.gallery?.slice(0, 5).map(item => item as Media);
    //console.log("firstFive:" + JSON.stringify(firstFive));
    // console.log(Object.values(firstFive)[0])

    if (!firstFive) return <div>No images found</div>

    return (
        <div>

            <div className="hidden sm:block">
                <Grid columns={{ initial: '1', xs: '4' }} rows={{ initial: '1', xs: '2' }} gap={"2"}>
                    <Box className="col-span-2 row-span-2">
                        <UnitImageGridImage image={Object.values(firstFive)[0]} radius={"left"} />
                    </Box>
                    <UnitImageGridImage image={Object.values(firstFive)[1]} radius={""}/>
                    <UnitImageGridImage image={Object.values(firstFive)[2]} radius={"topRight"}/>
                    <UnitImageGridImage image={Object.values(firstFive)[3]} radius={""}/>
                    <UnitImageGridImage image={Object.values(firstFive)[4]} radius={"bottomRight"}/>
                </Grid>
            </div>

            <div className="block sm:hidden">
                {/*<UnitImageGridImage image={Object.values(firstFive)[0]} radius={""} />*/}
                {firstFive &&
                    <Box>
                        <DotImageSlider images={ firstFive } aspectRatio={1}/>
                    </Box>
                }

            </div>


        </div>
    )
}

interface UnitImageGridImageProps {
    image: Media,
    radius: string,
}

export const UnitImageGridImage = ({ image, radius }: UnitImageGridImageProps) => {
    //console.log(image)
    let style: object = { objectFit: 'cover' }
    if (radius === "left") {
        style = {
            ...style,
            borderTopLeftRadius: "var(--radius-2)",
            borderBottomLeftRadius: "var(--radius-2)"
        }
    } else if (radius === "topRight") {
        style = {
            ...style,
            borderTopRightRadius: "var(--radius-2)",
        }
    } else if (radius === "bottomRight") {
        style = {
            ...style,
            borderBottomRightRadius: "var(--radius-2)"
        }
    }

    let imageUrl = '/file.svg';
    if (image.url) imageUrl = image.url;

    let imageAlt = 'image missing';
    if (image.alt) imageAlt = image.alt;

    return (
        <div key={image.id} className="w-full bg-neutral-200">
            <AspectRatio ratio={1}>
                <Image
                    loading="eager"
                    alt={imageAlt}
                    src={imageUrl}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="flex-1"
                    style={style}
                />
            </AspectRatio>
        </div>
    )
};

export const UnitImageGridSkeleton = () => {
    return (
        <div className="w-full aspect-4/1 bg-neutral-200 rounded-lg animate-pulse"/>
    );
};




