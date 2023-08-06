import { mastodon } from "@dhaaga/shared-provider-mastodon/dist";
import { Dimensions, View, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ImageWrapper, ImageViewer } from "react-native-reanimated-viewer";
import React from "react";
import { MediaAttachmentInterface } from "@dhaaga/shared-abstraction-activitypub/dist";

type ImageCarousalProps = {
	attachments: MediaAttachmentInterface[];
};

const MEDIA_CONTAINER_MAX_HEIGHT = 540;
const MEDIA_CONTAINER_WIDTH = Dimensions.get("window").width - 20;

/**
 * The image component is rendered
 * by a third-party library
 * @param param0
 */
function TimelineImageWrapped({
	attachment,
	CalculatedHeight,
	index,
	viewerRef,
}: {
	attachment: mastodon.v1.MediaAttachment;
	CalculatedHeight: number;
	index: number;
	viewerRef: React.RefObject<any>;
}) {
	return (
		<ImageWrapper
			key={index}
			viewerRef={viewerRef}
			index={index}
			source={{
				uri: attachment.remoteUrl,
			}}
			style={{ marginTop: 8 }}
		>
			<Image
				source={{
					uri: attachment.previewUrl,
				}}
				style={{ width: MEDIA_CONTAINER_WIDTH, height: CalculatedHeight }}
			/>
		</ImageWrapper>
	);
}

function TimelineImageRendered({
	attachment,
	CalculatedHeight,
}: {
	attachment: MediaAttachmentInterface;
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
				source={{ uri: attachment.getPreviewUrl() }}
			/>
		</View>
	);
}

function ImageCarousal({ attachments }: ImageCarousalProps) {
	const imageRef = useRef(null);

	const [CalculatedHeight, setCalculatedHeight] = useState(
		MEDIA_CONTAINER_MAX_HEIGHT
	);

	useEffect(() => {
		let MIN_HEIGHT = 0;
		for (const item of attachments) {
			const meta = item.getMeta();

			const width = item.getWidth();
			const height = item.getHeight();

			if (height && height > MIN_HEIGHT) {
				const deviceWidth = Dimensions.get("window").width;
				const multiplier = deviceWidth / width;
				MIN_HEIGHT = Math.min(height * multiplier, MEDIA_CONTAINER_MAX_HEIGHT);
			}
		}
		setCalculatedHeight(MIN_HEIGHT);
	}, [attachments]);

	if (attachments.length === 1) {
		return (
			<React.Fragment>
				<ImageViewer
					ref={imageRef}
					data={attachments.map((o) => ({
						source: { uri: o.getUrl() },
						key: o.getId(),
					}))}
				/>
				<TimelineImageRendered
					attachment={attachments[0]}
					CalculatedHeight={CalculatedHeight}
				/>
				{/* <TimelineImageWrapped
					viewerRef={imageRef}
					attachment={attachments[0]}
					index={0}
					CalculatedHeight={CalculatedHeight}
				/> */}
			</React.Fragment>
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
