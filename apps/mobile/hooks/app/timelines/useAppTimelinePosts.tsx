import { StatusInterface, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import {
	createContext,
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useReducer,
	useRef,
} from 'react';
import ActivityPubService from '../../../services/activitypub.service';
import * as Haptics from 'expo-haptics';
import { HuggingFaceService } from '../../../services/openai.service';
import postArrayReducer, {
	TIMELINE_POST_LIST_DATA_REDUCER_TYPE,
	TimelineDataReducerFunction,
} from '../../../components/common/timeline/api/postArrayReducer';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppPostObject } from '../../../types/app-post.types';

type Type = {
	data: AppPostObject[];
	addPosts: (items: StatusInterface[]) => void;
	clear: () => void;
	/**
	 * Interaction Actions
	 */
	toggleBookmark: (
		key: string,
		dispatch: Dispatch<SetStateAction<boolean>>,
	) => void;
	toggleLike: (
		key: string,
		dispatch: Dispatch<SetStateAction<boolean>>,
	) => void;
	explain: (
		key: string,
		ctx: string[],
		dispatch: Dispatch<SetStateAction<boolean>>,
	) => void;
	boost: (key: string, dispatch: Dispatch<SetStateAction<boolean>>) => void;
	getBookmarkState: (
		key: string,
		dispatch: Dispatch<SetStateAction<boolean>>,
	) => void;
	count: number;
	getPostListReducer: () => TimelineDataReducerFunction;
};

const defaultValue: Type = {
	data: [],
	addPosts: () => {},
	clear: () => {},
	getBookmarkState: () => {},
	toggleBookmark: () => {},
	toggleLike: () => {},
	explain: () => {},
	boost: () => {},
	count: 0,
	getPostListReducer: function (): TimelineDataReducerFunction {
		throw new Error('Function not implemented.');
	},
};

const AppTimelineDataContext = createContext<Type>(defaultValue);

/**
 * Perform operations on a list
 * of status objects
 *
 * e.g. - like, share, translate
 */
export function useAppTimelinePosts() {
	return useContext(AppTimelineDataContext);
}

type Props = {
	children: any;
};

/**
 *
 */
function WithAppTimelineDataContext({ children }: Props) {
	const { acct, driver, client } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			driver: o.driver,
			client: o.router,
		})),
	);
	const [Posts, postListReducer] = useReducer(postArrayReducer, []);

	// lists

	const Seen = useRef(new Set<string>());

	const clear = useCallback(() => {
		postListReducer({ type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.CLEAR });
		Seen.current.clear();
	}, []);

	const addPosts = useCallback(
		(items: StatusInterface[]) => {
			postListReducer({
				type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.ADD,
				payload: {
					more: items,
					seen: Seen,
					domain: driver,
					subdomain: acct?.server,
				},
			});
		},
		[driver, acct?.server, Posts],
	);

	function findById(id: string) {
		let match = Posts.find((o) => o.id === id);
		if (!match) match = Posts.find((o) => o.boostedFrom?.id === id);
		return match;
	}

	const boost = useCallback(
		async (key: string, setLoading: Dispatch<SetStateAction<boolean>>) => {
			if (!client) return;
			setLoading(true);
			const match = findById(key);
			if (!match) {
				setLoading(false);
				return;
			}

			// apply operation to current post
			// exclude boost (not quotes)
			let target = !!match.boostedFrom
				? match.boostedFrom.interaction.boosted
				: match.interaction.boosted;

			try {
				const state = await ActivityPubService.toggleBoost(
					client,
					key,
					target,
					driver,
				);
				if (state !== null) {
					postListReducer({
						type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_BOOST_STATUS,
						payload: {
							id: key,
							value: state,
						},
					});
				}
			} finally {
				setLoading(false);
			}
		},
		[Posts, driver],
	);

	/**
	 * Called when the post is rendered on screen
	 *
	 * Does the following:
	 *
	 * - Obtain the current bookmark status (Misskey forks)
	 *
	 * Once obtained, all info is cached for
	 * next re-render
	 * */
	// const initialize = useCallback(() => {}, []);

	const getBookmarkState = useCallback(
		async (key: string, setLoading: Dispatch<SetStateAction<boolean>>) => {
			if (
				!client ||
				[
					KNOWN_SOFTWARE.MASTODON,
					KNOWN_SOFTWARE.PLEROMA,
					KNOWN_SOFTWARE.AKKOMA,
				].includes(driver)
			) {
				return;
			}
			setLoading(true);
			const match = findById(key);
			if (!match) {
				setLoading(false);
				return;
			}

			try {
				const res = await ActivityPubService.getBookmarkState(client, key);
				if (res === null) {
					setLoading(false);
					return;
				}
			} finally {
				setLoading(false);
			}
		},
		[Posts, driver],
	);

	const toggleBookmark = useCallback(
		(key: string, setLoading: Dispatch<SetStateAction<boolean>>) => {
			if (!client) return;
			setLoading(true);
		},
		[Posts],
	);

	const toggleLike = useCallback(
		async (key: string, setLoading: Dispatch<SetStateAction<boolean>>) => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).then(() => {});
			setLoading(true);
		},
		[Posts, driver],
	);

	const explain = useCallback(
		async (
			key: string,
			ctx: string[],
			setLoading: Dispatch<SetStateAction<boolean>>,
		) => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).then(() => {});
			setLoading(true);
			try {
				const response = await HuggingFaceService.inferServerless(
					ctx.join(','),
				);
				postListReducer({
					type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_TRANSLATION_OUTPUT,
					payload: {
						id: key,
						outputText: response,
						outputType: 'OpenAI',
					},
				});
			} catch (e) {
				console.log(e);
			} finally {
				setLoading(false);
			}
		},
		[Posts],
	);

	const getPostListReducer = () => postListReducer;

	return (
		<AppTimelineDataContext.Provider
			value={{
				data: Posts,
				count: Posts.length,
				addPosts,
				clear,
				toggleBookmark,
				getBookmarkState,
				explain,
				toggleLike,
				boost,

				// function getters
				getPostListReducer,
			}}
		>
			{children}
		</AppTimelineDataContext.Provider>
	);
}

export default WithAppTimelineDataContext;
