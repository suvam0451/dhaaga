import { createContext, useContext, useState } from 'react';

type Type = {
	notificationCount: number;
	setNotificationCount: (count: number) => void;
};

const defaultValue: Type = {
	notificationCount: 0,
	setNotificationCount: () => {},
};

const AppNotificationBadge = createContext<Type>(defaultValue);

/**
 *
 */
export const useAppNotificationBadge = () => useContext(AppNotificationBadge);

type Props = {
	children: any;
};

function WithAppNotificationBadge({ children }: Props) {
	const [NotificationCount, setNotificationCount] = useState(0);

	return (
		<AppNotificationBadge.Provider
			value={{
				notificationCount: NotificationCount,
				setNotificationCount,
			}}
		>
			{children}
		</AppNotificationBadge.Provider>
	);
}

export default WithAppNotificationBadge;
