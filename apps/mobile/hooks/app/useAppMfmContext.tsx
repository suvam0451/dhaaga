import { createContext, useContext } from 'react';

type Type = {
	acceptTouch: boolean;
};

const defaultValue: Type = {
	acceptTouch: true,
};

const AppMfmContext = createContext<Type>(defaultValue);

/**
 * A hook to control interactivity of a
 * rendered mfm component
 */
export const useAppMfmContext = () => useContext(AppMfmContext);

type Props = {
	acceptTouch: boolean;
	children: any;
};

function WithAppMfmContext({ children, acceptTouch }: Props) {
	return (
		<AppMfmContext.Provider
			value={{
				acceptTouch,
			}}
		>
			{children}
		</AppMfmContext.Provider>
	);
}

export default WithAppMfmContext;
