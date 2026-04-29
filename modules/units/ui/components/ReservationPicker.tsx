import type { Unit } from "@/payload-types";
import { Box, Card, Button, Text } from "@radix-ui/themes";
import { Grid } from "@radix-ui/themes/dist/esm";
import { DatePickerWithRange } from "@/modules/ui/DatePickerWithRange";


interface UnitCardProps {
    unit: Unit,
}

export const ReservationPicker = ({unit}: UnitCardProps) => {
    return (
        <Box >
            <Card size="1">

                <DatePickerWithRange title={"Select Reservation Dates"} className="mb-2"/>

                <Grid gap="2">
                    <Button>Request Reservation</Button>
                    <Text color={"gray"}>You will not be charged yet!</Text>
                </Grid>

            </Card>
        </Box>

    )
};