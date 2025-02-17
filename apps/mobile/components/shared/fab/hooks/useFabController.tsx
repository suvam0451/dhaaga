import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
} from 'react-native-reanimated';
import { undefined } from 'zod';

type Type = {
	activeMenu: 'fab' | 'drawer' | null;
	setActiveMenu: (activeMenu: 'fab' | 'drawer' | null) => void;
	isFabExpanded: boolean;
	setIsFabExpanded: Dispatch<SetStateAction<boolean>>;
	textAnim: any;
};

const defaultValue: Type = {
	textAnim: undefined as any,
	setIsFabExpanded: () => {},
	activeMenu: 'fab',
	setActiveMenu: () => {},
	isFabExpanded: false,
};

const FabControllerContext = createContext<Type>(defaultValue);

export function useFabController() {
	return useContext(FabControllerContext);
}

type Props = {
	children: any;
};

/**
 * Helps provide smooth transition
 * between FAB hover menu item
 * and the sidebar menu item
 * @param children
 * @constructor
 */
function WithLocalAppMenuControllerContext({ children }: Props) {
	const [ActiveMenu, setActiveMenu] = useState<'fab' | 'drawer' | null>(null);
	const [IsFabExpanded, setIsFabExpanded] = useState(false);

	const textRotation = useSharedValue(0);
	const textOpacity = useSharedValue(0);

	/**
	 * Hide FAB, when drawer/bottom-sheet is invoked
	 */
	useEffect(() => {
		if (ActiveMenu === 'drawer') setIsFabExpanded(false);
	}, [ActiveMenu]);

	useEffect(() => {
		if (IsFabExpanded) {
			textRotation.value = withDelay(200, withSpring(0));
			textOpacity.value = withDelay(200, withSpring(1));
		} else {
			textRotation.value = withSpring(-15);
			textOpacity.value = withSpring(0);
		}
	}, [IsFabExpanded]);

	// @ts-ignore
	const textAnim = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: 50 },
				{ translateY: 50 },
				{ rotateZ: `${textRotation.value}deg` },
				{ translateX: -50 },
				{ translateY: -50 },
			],
			opacity: textOpacity.value,
		};
	});

	return (
		<FabControllerContext.Provider
			value={{
				activeMenu: ActiveMenu,
				setActiveMenu,
				isFabExpanded: IsFabExpanded,
				setIsFabExpanded: setIsFabExpanded,
				textAnim,
			}}
		>
			{children}
		</FabControllerContext.Provider>
	);
}

export default WithLocalAppMenuControllerContext;
