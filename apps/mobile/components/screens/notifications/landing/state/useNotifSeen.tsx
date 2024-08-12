import {
	createContext,
	MutableRefObject,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { useAppNotificationBadge } from '../../../../../hooks/app/useAppNotificationBadge';
import * as Haptics from 'expo-haptics';

type Type = {
	Seen: Set<string>;
	All: MutableRefObject<Set<string>>;
	setAllNotifsSeen: () => void;
	appendNotifs: (items: string[]) => void;
	UnseenCount: number;
};

const defaultValue: Type = {
	Seen: undefined,
	All: undefined,
	setAllNotifsSeen: () => {},
	appendNotifs: () => {},
	UnseenCount: 0,
};

const AppNotifSeenContext = createContext<Type>(defaultValue);

export const useAppNotifSeenContext = () => useContext(AppNotifSeenContext);

type Props = {
	children: any;
};

function WithAppNotifSeenContext({ children }: Props) {
	const { setNotificationCount, vibrationOn } = useAppNotificationBadge();
	const [UnseenCount, setUnseenCount] = useState(0);
	const { client } = useActivityPubRestClientContext();

	useEffect(() => {
		setNotificationCount(UnseenCount);
	}, [UnseenCount]);

	// const Seen = useRef(new Set<string>());
	const [Seen, setSeen] = useState(new Set<string>());

	const All = useRef(new Set<string>());
	// const [, set] = useState();
	useEffect(() => {
		setUnseenCount(0);
		setSeen(new Set<string>());
		All.current.clear();
	}, [client]);

	const setAllNotifsSeen = useCallback(() => {
		setSeen((o) => {
			const newSet = new Set(o);
			// @ts-ignore-next-line
			for (const value of All.current) {
				newSet.add(value);
			}
			return newSet;
		});

		let unseenCount = 0;
		// @ts-ignore-next-line
		for (const value of All.current) {
			if (!Seen.has(value)) unseenCount++;
		}

		setUnseenCount(unseenCount);
	}, [Seen]);

	/**
	 * Add a set of notifications to stack
	 */
	const appendNotifs = useCallback(
		(items: string[]) => {
			/**
			 * Case A -- Treat a refresh/first-load as an all-seen collection
			 */
			if (All.current.size === 0) {
				for (const item of items) All.current.add(item);

				setSeen((o) => {
					const newSet = new Set(o);
					// @ts-ignore-next-line
					for (const value of All.current) {
						newSet.add(value);
					}
					return newSet;
				});

				return;
			}

			/**
			 * Case B
			 */
			for (const item of items) All.current.add(item);

			let lastUnseenCount = UnseenCount;
			let unseenCount = 0;
			// @ts-ignore-next-line
			for (const value of All.current) {
				if (!Seen.has(value)) unseenCount++;
			}

			/**
			 * Vibration alert for new notifications
			 */
			if (lastUnseenCount !== unseenCount && vibrationOn) {
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success,
				).then(() => {});
			}

			setUnseenCount(unseenCount);
		},
		[Seen, UnseenCount],
	);

	return (
		<AppNotifSeenContext.Provider
			value={{
				Seen,
				All,
				setAllNotifsSeen,
				appendNotifs,
				UnseenCount,
			}}
		>
			{children}
		</AppNotifSeenContext.Provider>
	);
}

export default WithAppNotifSeenContext;
