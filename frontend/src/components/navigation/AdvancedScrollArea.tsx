import { Box, Flex, ScrollArea } from "@mantine/core";
import { IconChevronUp } from "@tabler/icons-react";
import { useAdvancedScrollAreaProviderHook } from "../../contexts/AdvancedScrollArea";
import { useEffect, useRef } from "react";
import { useInViewHook } from "../../contexts/IntersectionContext";

/**
 * Parent component must be wrapped with
 * useAdvancedScrollAreaProvider
 * @param param0
 * @returns
 */
function AdvancedScrollArea({
	children,
	loading,
}: {
	children: any;
	loading?: boolean;
}) {
	const { store, dispatch } = useAdvancedScrollAreaProviderHook();
	const { store: inViewStore, dispatch: inViewDispatch } = useInViewHook();
	const scrollbarRef = useRef(null);

	useEffect(() => {
		if (!store?.scrollRef.current) return;
		console.log("setting scrollbar ref", store?.scrollRef.current)
		inViewDispatch.setScrollbarRef(store?.scrollRef);
	}, [store?.scrollRef.current]);

	// useEffect(() => {
	// 	if (!store?.scrollRef.current) return;
	// 	console.log("setting scrollbar ref", store?.scrollRef.current)
	// 	inViewDispatch.setScrollbarRef(store?.scrollRef);
	// }, [store?.scrollRef]);

	return (
		<ScrollArea
			h={"100%"}
			style={{ display: "flex", position: "relative" }}
			viewportRef={store?.scrollRef || null}
			onScrollPositionChange={store.onScrollPositionChange}
			offsetScrollbars
			ref={scrollbarRef}
		>
			<Box
				pos={"absolute"}
				style={{
					transform: "translate(-50%, -50%)",
					zIndex: 99,
				}}
				left={"50%"}
				bottom={"20px"}
				display={store.scrollPosition.y > 480 ? "flex" : "none"}
			>
				<Flex
					bg={"rgba(100, 100, 100, 0.36)"}
					style={{
						borderRadius: "100%",
						justifyContent: "center",
						alignItems: "center",
						transform: "translate(-50%, -50%)",
						padding: "8px",
					}}
					onClick={dispatch.scrollToTop}
				>
					<IconChevronUp />
				</Flex>
			</Box>

			{children}
		</ScrollArea>
	);
}

export default AdvancedScrollArea;
