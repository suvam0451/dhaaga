import { createContext, useContext } from 'react';
import { ActivityPubStatusAppDtoType } from '../../services/approto/activitypub-status-dto.service';

type Type = {
	dto: ActivityPubStatusAppDtoType;
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
	dto: ActivityPubStatusAppDtoType;
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
