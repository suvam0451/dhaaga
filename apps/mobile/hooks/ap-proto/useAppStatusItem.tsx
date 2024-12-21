import { createContext, useContext } from 'react';
import { AppPostObject } from '../../types/app-post.types';

type Type = {
	dto: AppPostObject;
};

const defaultValue: Type = {
	dto: null,
};

const AppStatusItemContext = createContext<Type>(defaultValue);

/**
 * A leaner version of StatusInterface
 * passed around for efficient updates
 */
export const useAppStatusItem = () => useContext(AppStatusItemContext);

type Props = {
	children: any;
	dto: AppPostObject;
};

function WithAppStatusItemContext({ children, dto }: Props) {
	return (
		<AppStatusItemContext.Provider
			value={{
				dto,
			}}
		>
			{children}
		</AppStatusItemContext.Provider>
	);
}

export default WithAppStatusItemContext;
