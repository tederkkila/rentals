import { Flex, Box, Card, Text, Inset, Strong } from '@radix-ui/themes';
import Link from "next/link";
import Image from "next/image";

const TestRow = () => {
    return (
        <Flex direction={{ initial: 'column', md: 'row' }} gap="2">
            {/*<Box width="64px" height="64px">*/}
            {/*    <DecorativeBox />*/}

            {/*</Box>*/}

            <Card className="mb-4">
                <Flex direction={{ initial: 'column', md: 'row' }} gap="3">
                    <Inset clip="padding-box" side={{ initial: 'top', md: 'left' }} pb="0" mb="0">
                        <Image
                            alt={"alt"}
                            width={256}
                            height={256}
                            src={"/api/media/file/gray_map.jpg"}
                            className="object-cover"
                        />
                    </Inset>
                    <Box flexGrow="1">
                        <Text as="p" size="3">
                            <Strong>Typography</Strong> is the art and technique of arranging type to
                            make written language legible, readable and appealing when displayed.
                        </Text>
                        <Text as="div" size="2" weight="bold">
                            Teodros Girmay
                        </Text>
                        <Text as="div" size="2" color="gray">
                            Engineering
                        </Text>
                    </Box>
                </Flex>
            </Card>

        </Flex>
    )
}

export default TestRow;