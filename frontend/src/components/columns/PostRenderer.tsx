import { useMastadonAccountStatusesStoreHook } from "../../contexts/MastadonAccountStatuses";
import { Box, Button, Text } from "@mantine/core";
import MastadonPostListing from "../mastadon/PostListing";
import { useAdvancedScrollAreaProviderHook } from "../../contexts/AdvancedScrollArea";

function PostRenderer() {
	const { store, dispatch } = useMastadonAccountStatusesStoreHook();
	const { dispatch: scrollDispatch } = useAdvancedScrollAreaProviderHook();

	return (
		<Box
			style={{
				paddingBottom: "3em",
				paddingTop: "0.75em",
			}}
		>
			<Text mb={"md"} style={{ fontSize: 14, color: "gray" }}>
				Showing for first {(store.page - 1) * 100}-
				{(store.page - 1) * 100 + store.posts.length} results
			</Text>
			{store.posts?.map((o, i) => (
				<MastadonPostListing key={i} post={o} />
			))}
			<Button
				onClick={async () => {
					if (store.posts.length >= 100) {
						await scrollDispatch.scrollToTop();
						await dispatch.fetchNextPage();
					} else {
						dispatch.fetchMore();
					}
				}}
				loading={store.loading}
			>
				{store.posts.length >= 100 ? "Load Next Page" : "Load More..."}
			</Button>
		</Box>
	);
}

export default PostRenderer;
