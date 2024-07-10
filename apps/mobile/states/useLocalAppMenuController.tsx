import { createContext, useContext, useEffect, useState } from 'react';
import {
	Easing,
	SharedValue,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { undefined } from 'zod';

type Type = {
	activeMenu: 'fab' | 'drawer' | null;
	setActiveMenu: (activeMenu: 'fab' | 'drawer' | null) => void;
	isFabExpanded: boolean;
	setIsFabExpanded: React.Dispatch<React.SetStateAction<boolean>>;
	fabItemScale: SharedValue<number>;
};

const defaultValue: Type = {
	setIsFabExpanded(isFabExpanded: boolean): void {},
	activeMenu: 'fab',
	setActiveMenu: function (activeMenu: 'fab' | 'drawer'): void {
		throw new Error('Function not implemented.');
	},
	isFabExpanded: false,
	// @ts-ignore
	fabItemScale: undefined,
};

const LocalAppMenuControllerContext = createContext<Type>(defaultValue);

export function useLocalAppMenuControllerContext() {
	return useContext(LocalAppMenuControllerContext);
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

	const fabItemScale = useSharedValue(1);

	/**
	 * Hide FAB items
	 * + Collapse this parent
	 */
	useEffect(() => {
		if (ActiveMenu === 'drawer') {
			setIsFabExpanded(false);
			fabItemScale.value = withTiming(0, {
				duration: 200,
				easing: Easing.linear,
			});
		} else {
			fabItemScale.value = withTiming(1, {
				duration: 200,
				easing: Easing.linear,
			});
		}
	}, [ActiveMenu]);

	return (
		<LocalAppMenuControllerContext.Provider
			value={{
				activeMenu: ActiveMenu,
				setActiveMenu,
				isFabExpanded: IsFabExpanded,
				setIsFabExpanded: setIsFabExpanded,
				fabItemScale,
			}}
		>
			{children}
		</LocalAppMenuControllerContext.Provider>
	);
}

export default WithLocalAppMenuControllerContext;
