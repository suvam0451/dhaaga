import { mastodon } from "@dhaaga/shared-provider-mastodon/dist";
import { Dimensions, View, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
// import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

type ImageCarousalProps = {
	attachments: mastodon.v1.MediaAttachment[];
};

const MEDIA_CONTAINER_MAX_HEIGHT = 540;
const MEDIA_CONTAINER_WIDTH = Dimensions.get("window").width - 20;

function TimelineImageRendered({
	attachment,
	CalculatedHeight,
}: {
	attachment: mastodon.v1.MediaAttachment;
	CalculatedHeight: number;
}) {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				width: MEDIA_CONTAINER_WIDTH,
				height: CalculatedHeight,
			}}
		>
			<Image
				style={{
					flex: 1,
					width: MEDIA_CONTAINER_WIDTH,
				}}
				resizeMethod={"scale"}
				resizeMode={"contain"}
				source={{ uri: attachment.previewUrl }}
			/>
		</View>
	);
}

function ImageCarousal({ attachments }: ImageCarousalProps) {
	const [CalculatedHeight, setCalculatedHeight] = useState(
		MEDIA_CONTAINER_MAX_HEIGHT
	);

	useEffect(() => {
		let MIN_HEIGHT = 0;
		for (const item of attachments) {
			if (item?.meta?.original && item.meta.original.height > MIN_HEIGHT) {
				const deviceWidth = Dimensions.get("window").width;
				const multiplier = deviceWidth / item.meta.original.width;
				MIN_HEIGHT = Math.min(
					item.meta.original.height * multiplier,
					MEDIA_CONTAINER_MAX_HEIGHT
				);
			}
		}
		setCalculatedHeight(MIN_HEIGHT);
	}, [attachments]);

	if (attachments.length === 1) {
		return (
			<TimelineImageRendered
				attachment={attachments[0]}
				CalculatedHeight={CalculatedHeight}
			/>
		);
	}
	return (
		attachments.length > 0 && (
			<View
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<View style={{ display: "flex", flexDirection: "row" }}>
					<View style={{ flexGrow: 1 }}></View>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "flex-end",
						}}
					>
						<Ionicons name="ios-arrow-back" size={32} color="white" />
						<Ionicons name="ios-arrow-forward" size={32} color="white" />
					</View>
				</View>

				<Carousel
					width={Dimensions.get("window").width - 20}
					height={CalculatedHeight}
					data={attachments}
					scrollAnimationDuration={1000}
					onSnapToItem={(index) => {
						// console.log("current index:", index)
					}}
					snapEnabled={true}
					renderItem={(o) => (
						<TimelineImageRendered
							attachment={o.item}
							CalculatedHeight={CalculatedHeight}
						/>
					)}
				/>
			</View>
		)
	);
}

export default ImageCarousal;
