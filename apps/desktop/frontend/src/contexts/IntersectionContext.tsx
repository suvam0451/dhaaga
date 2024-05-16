import { createContext, useContext, useEffect, useState } from "react";

type StoreType = {
	inView: Set<number>;
	containerRef?: React.RefObject<HTMLDivElement>;
	scrollbarRef?: React.RefObject<HTMLDivElement>;
};

type DispatchType = {
	add: (index: number) => void;
	remove: (index: number) => void;
	snapToNext: () => void;
	snapToPrevious: () => void;
	setContainerRef: (ref: React.RefObject<HTMLDivElement>) => void;
	setScrollbarRef: (ref: React.RefObject<HTMLDivElement>) => void;
};

const storeDefault = {
	inView: new Set<number>(),
};

const dispatchDefault = {
	add: (index: number) => {},
	remove: (index: number) => {},
	snapToNext: () => {},
	snapToPrevious: () => {},
	setContainerRef: (ref: React.RefObject<HTMLDivElement>) => {},
	setScrollbarRef: (ref: React.RefObject<HTMLDivElement>) => {},
};

const StoreContext = createContext<StoreType>(storeDefault);
const DispatchContext = createContext<DispatchType>(dispatchDefault);

function IntersectionProvider({ children }: { children: any }) {
	const [InViewDraft, setInView] = useState<StoreType>(storeDefault);

	useEffect(() => {
		console.log("state changed internally", InViewDraft)
	}, [InViewDraft])
	
	function add(index: number) {
		setInView({
			...InViewDraft,
			inView: InViewDraft.inView.add(index),
		});
	}

	function remove(index: number) {
		InViewDraft.inView.delete(index);
		setInView({
			...InViewDraft,
			inView: InViewDraft.inView,
		});
	}

	function snapToNext() {
		console.log("snap to next");
	}

	function snapToPrevious() {
		console.log("snap to previous");
	}

	function setContainerRef(ref: React.RefObject<HTMLDivElement>) {
		setInView({
			...InViewDraft,
			containerRef: ref,
		});
	}

	function setScrollbarRef(ref: React.RefObject<HTMLDivElement>) {
		setInView({
			...InViewDraft,
			scrollbarRef: ref,
		});
	}
	return (
		<StoreContext.Provider value={InViewDraft}>
			<DispatchContext.Provider
				value={{
					add,
					remove,
					snapToNext,
					snapToPrevious,
					setContainerRef,
					setScrollbarRef,
				}}
			>
				{children}
			</DispatchContext.Provider>
		</StoreContext.Provider>
	);
}

export function useInViewHook() {
	return {
		store: useContext(StoreContext),
		dispatch: useContext(DispatchContext),
	};
}

export default IntersectionProvider;
