import {
	MisskeyRestClient,
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';
import {
	createContext,
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from 'react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import ActivityPubService from '../../../../services/activitypub.service';
import * as Haptics from 'expo-haptics';
import { OpenAiService } from '../../../../services/openai.service';
import GlobalMmkvCacheService from '../../../../services/globalMmkvCache.services';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import {
	InstanceApi_CustomEmojiDTO,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import postArrayReducer, {
	TIMELINE_POST_LIST_DATA_REDUCER_TYPE,
} from './postArrayReducer';
import { ActivityPubAppUserDtoType } from '../../../../services/ap-proto/activitypub-user-dto.service';
import userArrayReducer, {
	TIMELINE_USER_LIST_DATA_REDUCER_TYPE,
} from './userArrayReducer';
import FlashListService, {
	FlashListType_Post,
} from '../../../../services/flashlist.service';

enum TIMELINE_DATA_TYPE {
	POSTS = 'POSTS',
	USERS = 'USERS',
	TAGS = 'TAGS',
	NOTIFICATIONS = 'NOTIFICATIONS',
	NONE = 'NONE',
}

type Type = {
	data: ActivityPubStatusAppDtoType[] | ActivityPubAppUserDtoType[];
	dataFormat: TIMELINE_DATA_TYPE;
	setDataFormat: (to: TIMELINE_DATA_TYPE) => void;
	emojiCache: InstanceApi_CustomEmojiDTO[];
	listItems: FlashListType_Post[];
	addPosts: (items: StatusInterface[]) => void;
	addUsers: (items: UserInterface[]) => void;
	clear: () => void;
	/**
	 *
	 */
	toggleBookmark: (
		key: string,
		dispatch: Dispatch<SetStateAction<boolean>>,
	) => void;
	explain: (
		key: string,
		ctx: string[],
		dispatch: Dispatch<SetStateAction<boolean>>,
	) => void;
	boost: (key: string, dispatch: Dispatch<SetStateAction<boolean>>) => void;
	count: number;
};

const defaultValue: Type = {
	data: [],
	dataFormat: TIMELINE_DATA_TYPE.NONE,
	setDataFormat: () => {},
	listItems: [],
	addPosts: () => {},
	addUsers: () => {},
	clear: () => {},
	toggleBookmark: () => {},
	explain: () => {},
	boost: () => {},
	count: 0,
	emojiCache: [],
};

const AppTimelineDataContext = createContext<Type>(defaultValue);

export function useAppTimelineDataContext() {
	return useContext(AppTimelineDataContext);
}

type Props = {
	children: any;
};

/**
 * Assumptions
 * ---
 * - at any time, only one timeline can be active
 */
function WithAppTimelineDataContext({ children }: Props) {
	const { client, domain, subdomain } = useActivityPubRestClientContext();

	// template
	const [DataFormat, setDataFormat] = useState<TIMELINE_DATA_TYPE>(
		TIMELINE_DATA_TYPE.POSTS,
	);
	// lists
	const [Posts, postListReducer] = useReducer(postArrayReducer, []);
	const [Users, userListReducer] = useReducer(userArrayReducer, []);

	const EmojiCache = useRef<InstanceApi_CustomEmojiDTO[]>([]);
	const { globalDb } = useGlobalMmkvContext();

	useEffect(() => {
		const res = GlobalMmkvCacheService.getEmojiCacheForInstance(
			globalDb,
			subdomain,
		);
		EmojiCache.current = res ? res.data : [];
	}, [subdomain]);

	const FlashListItems = useMemo(() => {
		switch (DataFormat) {
			case TIMELINE_DATA_TYPE.POSTS:
				return FlashListService.posts(Posts);
			case TIMELINE_DATA_TYPE.USERS:
				return FlashListService.users(Users);
		}
		return [];
	}, [DataFormat, Users, Posts]);

	const Seen = useRef(new Set<string>());

	const clear = useCallback(() => {
		postListReducer({ type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.CLEAR });
		userListReducer({ type: TIMELINE_USER_LIST_DATA_REDUCER_TYPE.CLEAR });
		Seen.current.clear();
	}, []);

	const addPosts = useCallback(
		(items: StatusInterface[]) => {
			postListReducer({
				type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.ADD,
				payload: {
					more: items,
					seen: Seen,
					domain,
					subdomain,
				},
			});
		},
		[domain, subdomain, Posts],
	);

	const addUsers = useCallback(
		(items: UserInterface[]) => {
			userListReducer({
				type: TIMELINE_USER_LIST_DATA_REDUCER_TYPE.ADD,
				payload: {
					more: items,
					seen: Seen,
					domain,
					subdomain,
				},
			});
		},
		[domain, subdomain, Users],
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

			const localState = match.interaction.boosted;
			switch (domain) {
				case KNOWN_SOFTWARE.MISSKEY:
				case KNOWN_SOFTWARE.FIREFISH:
				case KNOWN_SOFTWARE.SHARKEY: {
					if (localState) {
						const { data, error } = await (
							client as MisskeyRestClient
						).statuses.unrenote(key);
						if (!error && data.success) {
							postListReducer({
								type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_BOOST_STATUS,
								payload: {
									id: key,
									value: data.renoted,
								},
							});
						}
					}
				}
			}
		},
		[Posts],
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

	const toggleBookmark = useCallback(
		(key: string, setLoading: Dispatch<SetStateAction<boolean>>) => {
			if (!client) return;
			setLoading(true);
			const match = findById(key);
			if (!match) {
				setLoading(false);
				return;
			}

			ActivityPubService.toggleBookmark(
				client,
				key,
				match.interaction.bookmarked,
			)
				.then((res) => {
					postListReducer({
						type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_BOOKMARK_STATUS,
						payload: {
							id: key,
							value: res,
						},
					});
				})
				.finally(() => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).finally(() => {
						setLoading(false);
					});
				});
		},
		[Posts],
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
				const response = await OpenAiService.explain(ctx.join(','));
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

	return (
		<AppTimelineDataContext.Provider
			value={{
				data: Posts,
				dataFormat: DataFormat,
				setDataFormat,
				listItems: FlashListItems as any[],
				count: Posts.length,
				addPosts,
				addUsers,
				clear,
				toggleBookmark,
				explain,
				emojiCache: EmojiCache.current,
				boost,
			}}
		>
			{children}
		</AppTimelineDataContext.Provider>
	);
}

export default WithAppTimelineDataContext;
