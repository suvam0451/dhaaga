import { Box, Button } from "@mantine/core";
import MastadonPostListing from "../mastadon/PostListing";
import { useAdvancedScrollAreaProviderHook } from "../../contexts/AdvancedScrollArea";
import { MastodonTimelinesProviderHook } from "../../contexts/MastodonTimeline";
import { useEffect } from "react";
import { TextSubtitle } from "../../styles/Mastodon";

function TimelineRenderer() {
	const { store, dispatch } = MastodonTimelinesProviderHook();
	const { dispatch: scrollDispatch } = useAdvancedScrollAreaProviderHook();
	function onLinkAccessAttempt(s: string) {
		console.log("trying to access", s);
	}

	useEffect(() => {
		// redirect all hrefs
		const $elems = document.querySelectorAll("a");
		var elems = Array.from($elems);
		elems.map((a) => {
			const localLinks = /\/(.*?)/;
			if (/\/(.*?)/.test(a.getAttribute("href")!)) {
				return;
			}
			// @ts-ignore
			a.onclick = (e) => {
				e.preventDefault();
				const targetItem = e.currentTarget;
				// @ts-ignore
				const val = targetItem.getAttribute("data-original-href");
				if (val) {
					onLinkAccessAttempt(val);
				}
			};
		});
	}, [store.posts]);

	return (
		<Box
			style={{
				paddingBottom: "3em",
				paddingTop: "0.75em",
			}}
		>
			<TextSubtitle mb={"md"}>
				Showing for first {(store.page - 1) * 100}-
				{(store.page - 1) * 100 + store.posts.length} results
			</TextSubtitle>
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

export default TimelineRenderer;
