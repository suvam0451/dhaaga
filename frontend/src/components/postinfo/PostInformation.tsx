import { Box, Text, Avatar, Group, Flex } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import { GalleryState } from "../../lib/redux/slices/gallerySlice";
import { useEffect, useState } from "react";
import { GetDatabasePostInfo } from "../../../wailsjs/go/main/App";
import { AvatarBase64Loader } from "../variants/search-recommendations/threadsDesktop";
import { formatDistance } from "date-fns";
import { GALLERY_FIXED_WIDTH } from "../../constants/app-dimensions";

type ReportRepostedPostProps = {
	opUsername: string;
	opProfilePic: string;
	repostedUsername?: string;
	repostedProfilePic?: string;
	postedOn: string;
	captionText: string;
	TakenAtDate: Date;
};

function ReportRepostedPost({
	opUsername,
	opProfilePic,
	repostedUsername,
	repostedProfilePic,
	captionText,
	TakenAtDate,
}: ReportRepostedPostProps) {
	return (
		<Flex w={GALLERY_FIXED_WIDTH} justify={"space-between"}>
			<Flex direction={"column"}>
				<Flex style={{ alignItems: "center" }}>
					<AvatarBase64Loader url={repostedProfilePic!} />
					<Flex direction={"column"} ml={"sm"}>
						<Box>
							<Text span fw={"lighter"}>
								{opUsername} reposted
							</Text>
						</Box>
						<Text maw={"100%"} fw={"bold"}>
							@{repostedUsername}
						</Text>
					</Flex>
				</Flex>
				<Text lineClamp={4}>{captionText}</Text>
			</Flex>
			<Flex>
				<Text fw={"lighter"}>
					{formatDistance(new Date(TakenAtDate), new Date(), {
						addSuffix: true,
					})}
				</Text>
			</Flex>
		</Flex>
	);
}

function ReportOriginalPost({
	opUsername,
	opProfilePic,
	captionText,
	TakenAtDate,
}: ReportRepostedPostProps) {
	return (
		<Flex w={GALLERY_FIXED_WIDTH} justify={"space-between"}>
			<Flex direction={"column"}>
				<Flex style={{ alignItems: "center" }}>
					<AvatarBase64Loader url={opProfilePic!} />
					<Flex direction={"column"} ml={"sm"}>
						<Box>
							<Text span fw={"lighter"}>
								original post by
							</Text>
						</Box>
						<Text maw={"100%"} fw={"bold"}>
							@{opUsername}
						</Text>
					</Flex>
				</Flex>
				<Text lineClamp={4}>{captionText}</Text>
			</Flex>
      <Flex>
				<Text fw={"lighter"}>
					{formatDistance(new Date(TakenAtDate), new Date(), {
						addSuffix: true,
					})}
				</Text>
			</Flex>
		</Flex>
	);
}

/**
 * This component shows information about the
 * post corresponding to the image being shown
 *
 * e.g. - OP info, Repost info
 */
function PostInformation() {
	const dispatch = useDispatch<AppDispatch>();
	const galleryState = useSelector<RootState, GalleryState>((o) => o.gallery);
	const [PostDetailsDTO, setPostDetailsDTO] = useState<any>(null);

	useEffect(() => {
		if (galleryState.galleryIndex === -1) {
			setPostDetailsDTO(null);
			return;
		}
		const item = galleryState.imageUrls[galleryState.galleryIndex];

		GetDatabasePostInfo(item.post_id)
			.then((res) => {
				setPostDetailsDTO(res);
			})
			.catch((e) => {
				console.log("[WARN] Failed to get post info", e);
			});
	}, [galleryState.galleryIndex]);

	return (
		PostDetailsDTO && (
			<Box
				pt={"sm"}
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
				}}
			>
				{/* <Text align="right">Posted By</Text> */}
				{PostDetailsDTO?.RepostedPost?.user ? (
					<ReportRepostedPost
						opUsername={PostDetailsDTO.OriginalPost.user.username}
						opProfilePic={PostDetailsDTO.OriginalPost.user.profile_pic_url}
						repostedUsername={PostDetailsDTO.RepostedPost.user.username}
						repostedProfilePic={
							PostDetailsDTO.RepostedPost.user.profile_pic_url
						}
						postedOn={PostDetailsDTO.OriginalPost.TakenAtDate}
						captionText={PostDetailsDTO.RepostedPost.CaptionText}
						TakenAtDate={PostDetailsDTO.OriginalPost.TakenAtDate}
					/>
				) : PostDetailsDTO?.OriginalPost?.user ? (
					<ReportOriginalPost
						opUsername={PostDetailsDTO.OriginalPost.user.username}
						opProfilePic={PostDetailsDTO.OriginalPost.user.profile_pic_url}
						postedOn={PostDetailsDTO.OriginalPost.TakenAtDate}
						captionText={PostDetailsDTO.OriginalPost.CaptionText}
						TakenAtDate={PostDetailsDTO.OriginalPost.TakenAtDate}
					/>
				) : (
					<Box></Box>
				)}
			</Box>
		)
	);
}

export default PostInformation;
