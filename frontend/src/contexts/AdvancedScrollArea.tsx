import { Box } from "@mantine/core";
import { createContext, useContext, useRef, useState } from "react";

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
};

type DispatchType = {
	scrollToTop: () => void;
};

const storeDefault: StoreType = {
	scrollPosition: {
		x: 0,
		y: 0,
	},
	onScrollPositionChange: () => {},
	scrollRef: null,
};

const dispatchDefault: DispatchType = {
	scrollToTop: () => {},
};

const StoreContext = createContext<StoreType>(storeDefault);
const DispatchContext = createContext<DispatchType>(dispatchDefault);

const AdvancedScrollAreaProvider = ({ children }: any) => {
	const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
	const scrollRef = useRef<HTMLDivElement | null>(null);

	function onScollToTop() {
		scrollRef?.current?.scroll({
			top: 0,
			behavior: "smooth",
		});
	}

	return (
		<StoreContext.Provider
			value={{
				scrollPosition: scrollPosition,
				onScrollPositionChange,
				scrollRef,
			}}
		>
			<DispatchContext.Provider
				value={{
					scrollToTop: onScollToTop,
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
