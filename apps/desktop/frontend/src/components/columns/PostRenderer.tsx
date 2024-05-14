import { useMastadonAccountStatusesStoreHook } from "../../contexts/MastadonAccountStatuses";
import { Box, Button, LoadingOverlay, Text } from "@mantine/core";
import MastadonPostListing from "../mastadon/PostListing";
import { useAdvancedScrollAreaProviderHook } from "../../contexts/AdvancedScrollArea";
import { useEffect } from "react";
import LoadingStatusIndicator from "./common/LoadingStatusIndicator";

function PostRenderer() {
	const { store, dispatch } = useMastadonAccountStatusesStoreHook();
	const { store: scrollStore, dispatch: scrollDispatch } =
		useAdvancedScrollAreaProviderHook();

	/**
	 * NOTE: this avoids a deadlock in development
	 * environment
	 */
	useEffect(() => {
		scrollDispatch.setIfBroadcastReachBottom(false);
	}, []);

	useEffect(() => {
		if (scrollStore.reachedBottm) {
			scrollDispatch.setIfBroadcastReachBottom(false);
			dispatch.fetchMore();
		}
	}, [scrollStore.reachedBottm]);

	useEffect(() => {
		if (store.posts.length > 0 && store.posts.length < 100) {
			scrollDispatch.setIfBroadcastReachBottom(true);
		}
	}, [store.posts]);

	/**
	 * --- "Load More" controller block end ---
	 */

	return (
		<Box
			style={{
				paddingBottom: "3em",
				paddingTop: "0.75em",
				position: "relative",
			}}
		>
			<LoadingOverlay
				h={"100%"}
				visible={store.loading && store.posts.length === 0}
				overlayBlur={2}
				transitionDuration={500}
			/>
			<Text mb={"md"} style={{ fontSize: 14, color: "gray" }}>
				Showing for first {(store.page - 1) * 100}-
				{(store.page - 1) * 100 + store.posts.length} results
			</Text>
			{store.posts?.map((o, i) => (
				<MastadonPostListing key={i} post={o} index={i} />
			))}
			<LoadingStatusIndicator
				loading={store.loading}
				allowClicks={!store.loading}
				onClick={async () => {
					if (store.posts.length >= 100) {
						await scrollDispatch.scrollToTop();
						await dispatch.fetchNextPage();
					} else {
						dispatch.fetchMore();
					}
				}}
			/>
		</Box>
	);
}

export default PostRenderer;
