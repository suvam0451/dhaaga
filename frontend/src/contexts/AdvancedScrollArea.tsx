import { Box } from "@mantine/core";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type StoreType = {
	scrollPosition: {
		x: number;
		y: number;
	};
	onScrollPositionChange: React.Dispatch<
		React.SetStateAction<{
			x: number;
			y: number;
		}>
	>;
	scrollRef: React.MutableRefObject<HTMLDivElement | null> | null;
	reachedBottm: boolean;
};

type DispatchType = {
	scrollToTop: () => void;
	setIfBroadcastReachBottom: (x: boolean) => void;
};

const storeDefault: StoreType = {
	scrollPosition: {
		x: 0,
		y: 0,
	},
	onScrollPositionChange: () => {},
	scrollRef: null,
	reachedBottm: false,
};

const dispatchDefault: DispatchType = {
	scrollToTop: () => {},
	setIfBroadcastReachBottom: () => {},
};

const StoreContext = createContext<StoreType>(storeDefault);
const DispatchContext = createContext<DispatchType>(dispatchDefault);

const AdvancedScrollAreaProvider = ({ children }: any) => {
	const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [IfBroadcastReachBottom, setIfBroadcastReachBottom] = useState(false);
	const [ReachedBottom, setReachedBottom] = useState(false);

	useEffect(() => {
		if (
			IfBroadcastReachBottom &&
			!ReachedBottom &&
			scrollRef.current!.scrollHeight - scrollPosition.y - window.innerHeight <
				100
		) {
			console.log("infinite power")
			setIfBroadcastReachBottom(false);
			setReachedBottom(true);
		}
	}, [scrollPosition]);

	function onScollToTop() {
		scrollRef?.current?.scroll({
			top: 0,
			behavior: "smooth",
		});
	}

	function _setIfBroadcastReachBottom(x: boolean) {
		setReachedBottom(false);
		setIfBroadcastReachBottom(x);
	}
	return (
		<StoreContext.Provider
			value={{
				scrollPosition: scrollPosition,
				onScrollPositionChange,
				scrollRef,
				reachedBottm: ReachedBottom,
			}}
		>
			<DispatchContext.Provider
				value={{
					scrollToTop: onScollToTop,
					setIfBroadcastReachBottom: _setIfBroadcastReachBottom,
				}}
			>
				<Box
					display={"flex"}
					style={{
						flexDirection: "column",
					}}
					h={"100%"}
				>
					{children}
				</Box>
			</DispatchContext.Provider>
		</StoreContext.Provider>
	);
};

export function useAdvancedScrollAreaProviderHook() {
	return {
		store: useContext(StoreContext),
		dispatch: useContext(DispatchContext),
	};
}

export default AdvancedScrollAreaProvider;
