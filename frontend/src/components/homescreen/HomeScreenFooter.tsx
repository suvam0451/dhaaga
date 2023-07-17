import { Box, Flex, Text } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

const HEART_ICON_MARGIN_ADJUSTMENT = "3px";
const HEART_ICON_PADDING_ADJUSTMENT = "4px";

function HomeScreenFooter() {
	return (
		<Box bg="#ddd" style={{ flexGrow: 1 }} py={"lg"}>
			<Flex style={{ alignItems: "center", justifyContent: "center" }}>
				<Text size={18} style={{ fontWeight: 500 }} span>
					Made with
				</Text>{" "}
				<IconHeartFilled
					style={{
						paddingTop: HEART_ICON_PADDING_ADJUSTMENT,
						marginLeft: HEART_ICON_MARGIN_ADJUSTMENT,
						marginRight: HEART_ICON_MARGIN_ADJUSTMENT,
					}}
					size={20}
					color="blue"
				/>
				<Text size={18} style={{ fontWeight: 500 }} span>
					{" in India • By"}
				</Text>
				<Text span size={18} style={{ fontWeight: 700, marginLeft: "4px" }}>
					{"Debashish Patra"}
				</Text>
			</Flex>
		</Box>
	);
}

export default HomeScreenFooter;
