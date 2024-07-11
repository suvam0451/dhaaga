import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from 'react';

type Type = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

const defaultValue: Type = {
	open: false,
	setOpen: undefined,
};

const AppDrawerContext = createContext<Type>(defaultValue);

export function useAppDrawerContext() {
	return useContext(AppDrawerContext);
}

type Props = {
	children: any;
};

/**
 * Provides controller for showing/hiding the FAB
 * abd right-hand drawer menu
 *
 * NOTE: needs to be wrapped with WithLocalAppMenuControllerContext
 * @param children
 * @constructor
 */
function WithAppDrawerContext({ children }: Props) {
	const [IsOpen, setIsOpen] = useState(false);

	return (
		<AppDrawerContext.Provider
			value={{
				open: IsOpen,
				setOpen: setIsOpen,
			}}
		>
			{children}
		</AppDrawerContext.Provider>
	);
}

export default WithAppDrawerContext;
