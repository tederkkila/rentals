"use client"

import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

interface DotImageSliderProps {
    images: Media[] | undefined;
    aspectRatio: number;
}

export function DotImageSlider( { images, aspectRatio }: DotImageSliderProps) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    // Sync state with Embla API changes
    React.useEffect(() => {
        if (!api) return

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    //console.log("DotImageSlider images:" + JSON.stringify(images));
    console.log("DotImageSlider images:" + images);

    return (
        <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
                loop: true, // Enables infinite looping
            }}
        >
            <CarouselContent className="ml-0">
                {images.map((image, index) => (
                    <CarouselItem key={index} className="pl-0 basis-full">
                        <div className="p-0">
                            <div className="flex items-center justify-center rounded-xl bg-muted font-semibold">

                                <AspectRatio ratio={aspectRatio}>
                                    <Image
                                        loading="eager"
                                        alt={image.alt}
                                        src={image.url}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        className="flex-1"

                                    />
                                </AspectRatio>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {/* Navigation Layout Container */}
            <div className="mt-4 flex items-center justify-between px-2">
                {/* Left Side: Navigation Arrows */}
                <div className="flex items-center gap-2">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                </div>

                {/* Right Side: Dot Indicators */}
                <div className="flex items-center gap-2">
                    {Array.from({ length: count }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all duration-300",
                                current === index
                                    ? "bg-primary w-4" // Makes the active dot slightly elongated
                                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </Carousel>
    )
}
