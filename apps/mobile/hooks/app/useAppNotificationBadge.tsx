import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from 'react';

type Type = {
	notificationCount: number;
	setNotificationCount: (count: number) => void;
	vibrationOn: boolean;
	setVibrationOn: Dispatch<SetStateAction<boolean>>;
};

const defaultValue: Type = {
	notificationCount: 0,
	setNotificationCount: () => {},
	vibrationOn: false,
	setVibrationOn: () => {},
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
	const [IsVibrationOn, setIsVibrationOn] = useState(true);

	return (
		<AppNotificationBadge.Provider
			value={{
				notificationCount: NotificationCount,
				setNotificationCount,
				vibrationOn: IsVibrationOn,
				setVibrationOn: setIsVibrationOn,
			}}
		>
			{children}
		</AppNotificationBadge.Provider>
	);
}

export default WithAppNotificationBadge;
