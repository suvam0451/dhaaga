import { Box } from "@mantine/core";
import MastadonPostListing from "../mastadon/PostListing";
import { useAdvancedScrollAreaProviderHook } from "../../contexts/AdvancedScrollArea";
import { MastodonTimelinesProviderHook } from "../../contexts/MastodonTimeline";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextSubtitle } from "../../styles/Mastodon";
import LoadingStatusIndicator from "./common/LoadingStatusIndicator";
import { useInViewHook } from "../../contexts/IntersectionContext";
import { SecondSmallestInSet } from "../../utils/Maths";

function TimelineRenderer() {
	const { store, dispatch } = MastodonTimelinesProviderHook();
	const { store: scrollStore, dispatch: scrollDispatch } =
		useAdvancedScrollAreaProviderHook();

	const { store: inViewStore, dispatch: inViewDispatch } = useInViewHook();
	const inViwStoreRef = useRef<any>();
	inViwStoreRef.current = inViewStore;

	// FIXME: above store returns stale data. idk why.
	// const [InViewStoreReplica, setInViewStoreReplica] = useState(null);
	// useEffect(() => {
	// 	setInViewStoreReplica(inViewStore);
	// 	console.log("in-view store changed", inViewStore);
	// }, [inViewStore]);

	function onLinkAccessAttempt(s: string) {
		console.log("trying to access", s);
	}

	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;
		inViewDispatch.setContainerRef(containerRef);
	}, [containerRef.current]);

	const keyPressHandler = (e: any) => {
		switch (e.keyCode) {
			case 39: {
				if (!inViewStore.containerRef?.current) return;
				const items = inViewStore.containerRef.current.children.length || 0;
				const nextIdx = SecondSmallestInSet(inViewStore.inView, items);
				if (nextIdx === -1) return;

				// const nextItems = inViewStore.containerRef.current.children[nextIdx];
				// console.log(nextItems)

				console.log("prev pressed");
				console.log("visibility", inViewStore.inView);
				console.log("container ref", inViewStore.containerRef?.current);
				console.log("scroll bar ref", inViewStore.scrollbarRef?.current);
				break;
			}
			case 40: {
				console.log(inViwStoreRef.current);
				if (!inViewStore.containerRef?.current) return;

				const items = inViewStore.containerRef.current.children.length || 0;
				const nextIdx = SecondSmallestInSet(inViewStore.inView, items);
				if (nextIdx === -1) return;

				const nextItem = inViewStore.containerRef.current.children[nextIdx];
				console.log(nextItem);
				var divTop = nextItem.getBoundingClientRect().bottom;
				var scrollDivTop =
					inViewStore.scrollbarRef?.current.getBoundingClientRect().top;

				// test -- scroll to mid

				// to ensure that previous item is not in view
				const SCROLL_PADDDING = 4;

				inViewStore.scrollbarRef?.current.scrollTo({
					top:
						inViewStore.scrollbarRef?.current.scrollTop +
						(divTop - scrollDivTop) +
						SCROLL_PADDDING,
					behavior: "auto",
				});
				// console.log(elementTop, divTop);
				// var delta = elementTop - divTop;
				// console.log(elementTop, divTop, delta)

				// console.log("scrolling to top");
				// inViewStore.scrollbarRef?.current?.scroll({
				// 	top: scrollStore.scrollPosition.y + divTop,
				// 	behavior: "smooth",
				// });

				// console.log("next pressed", inViewStore.inView);
				// console.log("container ref", inViewStore.containerRef?.current);
				// console.log("scroll bar ref", inViewStore.scrollbarRef?.current);
				break;
			}
		}
	}

	useEffect(() => {
		document.addEventListener("keydown", keyPressHandler);
		return () => {
			document.removeEventListener("keydown", keyPressHandler);
		};
	}, []);

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
				{store.posts && (store.page - 1) * 100 + store.posts.length} results
			</TextSubtitle>
			<Box ref={containerRef}>
				{store.posts &&
					store.posts.map((o, i) => (
						<MastadonPostListing key={i} post={o} index={i} />
					))}
			</Box>
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

export default TimelineRenderer;
