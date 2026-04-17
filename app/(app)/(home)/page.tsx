import Image from "next/image";
import {cn} from "@/lib/utils";
import DecorativeBox from "@/modules/ui/DecorativeBox"
import {Flex, Box, Card, Text, TextArea, Switch, Button, Inset, Strong, Grid, AspectRatio} from '@radix-ui/themes';


export default function Home() {
    return (
        <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
            Home page

            <Grid columns="8" gap="4" className="bg-green-300 gap-4">
                <div className="col-span-2">
                    <AspectRatio ratio={1 / 1}>
                        <img
                            src="/api/media/file/gray1-1.jpg"
                            alt="A house in a forest"
                            style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                                borderRadius: "var(--radius-2)",
                            }}
                        />
                    </AspectRatio>
                </div>
                <div className="col-span-6">
                    <DecorativeBox/>
                </div>
                <div className="col-span-3">
                    <AspectRatio ratio={1 / 1}>
                    <img
                        src="/api/media/file/gray1-1.jpg"
                        alt="A house in a forest"
                        style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            borderRadius: "var(--radius-2)",
                        }}
                    />
                </AspectRatio>
                </div>
                <div className="col-span-5">
                    <Box className="prose-lg">
                        <h1>Discover Caspian Lake</h1>
                        <p>Caspian Lake has long been a favorite retreat for academics and
                        artists. Hidden away in Vermont's Northeast Kingdom, the lake and its surroundings are nestled
                        in a postcard setting of quiet pastures, green mountains and covered bridges. The famously
                        crystal clear waters of the lake itself offer opportunity for sailing, swimming or just a quiet,
                        care-free day out on the dock. Nature lovers will really enjoy the lush surroundings, endlessly
                        starry nights, and the occasional wild visitor (loons, black bear, mergansers, mink, and the
                        occasional moose have all been seen on the property).</p>
                        <p>Our lake properties are the perfect
                        way to experience Caspian Lake for yourself. To find out more about the unique features of each,
                        just click on the photos of each. There you can find descriptions, more photos, and rental
                        rates. If you are interested, you can&nbsp;contact us&nbsp;by phone or email. You can check the
                        availability of each property by checking the&nbsp;calendar.</p>
                    </Box>
                </div>
            </Grid>

            <Flex gap="3">
                <Box width="64px" height="64px">
                    <DecorativeBox/>
                </Box>
                <Box width="64px" height="64px">
                    <DecorativeBox/>
                </Box>
                <Box width="64px" height="64px">
                    <DecorativeBox/>
                </Box>
                <Box width="64px" height="64px">
                    <DecorativeBox/>
                </Box>
                <Box width="64px" height="64px">
                    <DecorativeBox/>
                </Box>
            </Flex>

            <Flex direction="column" gap="4" className="bg-red-500 p-4">
                <p>Inside Flex</p>
                <Box className="bg-blue-500 p-4">
                    <p>Inside Box</p>
                    <DecorativeBox/>
                    <Card>
                        filters
                    </Card>
                </Box>
            </Flex>

            <Box maxWidth="400px">
                <Card size="2">
                    <Flex direction="column" gap="3">
                        <Grid gap="1">
                            <Text as="div" weight="bold" size="2" mb="1">
                                Feedback
                            </Text>
                            <TextArea placeholder="Write your feedback…" />
                        </Grid>
                        <Flex asChild justify="between">
                            <label>
                                <Text color="gray" size="2">
                                    Attach screenshot?
                                </Text>
                                <Switch size="1" defaultChecked />
                            </label>
                        </Flex>
                        <Grid columns="2" gap="2">
                            <Button variant="surface">Back</Button>
                            <Button>Send</Button>
                        </Grid>
                    </Flex>
                </Card>
            </Box>
            {/*<Grid rows="0" columns={{ initial: '1', sm: '2', md: '2', lg: '6', xl: '8'  }} gap="3">
                <div className="lg:col-span-2 xl:col-span-2">
                    <Box>
                        <DecorativeBox/>
                        <Card>
                            filters
                        </Card>

                    </Box>
                </div>
                <div className="lg:col-span-4 xl:col-span-6">
                    <div className="grid grid-cols-1 gap-4">
                    </div>
                </div>
            </Grid>*/}
        </div>
    )
}
