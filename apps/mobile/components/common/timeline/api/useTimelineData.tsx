import {
	MisskeyRestClient,
	StatusInterface,
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
import { ActivitypubStatusService } from '../../../../services/ap-proto/activitypub-status.service';
import { ListItemEnum, ListItemType } from '../utils/itemType.types';
import ActivityPubService from '../../../../services/activitypub.service';
import * as Haptics from 'expo-haptics';
import { OpenAiService } from '../../../../services/openai.service';
import GlobalMmkvCacheService from '../../../../services/globalMmkvCache.services';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import {
	InstanceApi_CustomEmojiDTO,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import timelineDataReducer, {
	TIMELINE_DATA_REDUCER_TYPE,
} from './timelineDataReducer';

type Type = {
	data: ActivityPubStatusAppDtoType[];
	emojiCache: InstanceApi_CustomEmojiDTO[];
	flashListItems: {
		type: ListItemEnum;
		props: {
			dto: ActivityPubStatusAppDtoType;
		};
	}[];
	append: (items: StatusInterface[]) => void;
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
	flashListItems: [],
	append: () => {},
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

function WithAppTimelineDataContext({ children }: Props) {
	const { client, domain, subdomain } = useActivityPubRestClientContext();
	const [Data, dispatch] = useReducer(timelineDataReducer, []);
	const [LegacyData, setLegacyData] = useState<StatusInterface[]>([]);
	const EmojiCache = useRef<InstanceApi_CustomEmojiDTO[]>([]);
	const { globalDb } = useGlobalMmkvContext();

	useEffect(() => {
		const res = GlobalMmkvCacheService.getEmojiCacheForInstance(
			globalDb,
			subdomain,
		);
		EmojiCache.current = res ? res.data : [];
	}, [subdomain]);

	const FlashListItems: ListItemType[] = useMemo(() => {
		return Data.map((o, i) => {
			const HAS_MEDIA = o.content.media.length > 0;
			if (HAS_MEDIA) {
				return {
					type: ListItemEnum.ListItemWithImage,
					props: {
						post: LegacyData[i],
						dto: Data[i],
					},
				};
			} else if (o.meta.sensitive) {
				return {
					type: ListItemEnum.ListItemWithSpoiler,
					props: {
						post: LegacyData[i],
						dto: Data[i],
					},
				};
			} else {
				return {
					type: ListItemEnum.ListItemWithText,
					props: {
						post: LegacyData[i],
						dto: Data[i],
					},
				};
			}
		});
	}, [Data]);

	const Seen = useRef(new Set<string>());

	const clear = useCallback(() => {
		dispatch({ type: TIMELINE_DATA_REDUCER_TYPE.CLEAR });
		Seen.current.clear();
	}, [Seen, Data, dispatch]);

	const append = useCallback(
		(items: StatusInterface[]) => {
			const toAdd: ActivityPubStatusAppDtoType[] = [];
			const toAdd2: StatusInterface[] = [];
			for (const item of items) {
				const k = item.getId();
				if (Seen.current.has(k)) continue;

				Seen.current.add(k);
				toAdd.push(
					ActivitypubStatusService.factory(item, domain, subdomain).export(),
				);
				toAdd2.push(item);
			}
			dispatch({
				type: TIMELINE_DATA_REDUCER_TYPE.APPEND,
				payload: {
					data: toAdd,
				},
			});
			setLegacyData(LegacyData.concat(toAdd2));
		},
		[Seen, Data, domain, subdomain, dispatch],
	);

	function findById(id: string) {
		let match = Data.find((o) => o.id === id);
		if (!match) match = Data.find((o) => o.boostedFrom?.id === id);
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
							dispatch({
								type: TIMELINE_DATA_REDUCER_TYPE.UPDATE_BOOST_STATUS,
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
		[Data, dispatch],
	);

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
					console.log('toggle response', res);
					dispatch({
						type: TIMELINE_DATA_REDUCER_TYPE.UPDATE_BOOKMARK_STATUS,
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
		[Data, dispatch],
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
				dispatch({
					type: TIMELINE_DATA_REDUCER_TYPE.UPDATE_TRANSLATION_OUTPUT,
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
		[Data, dispatch],
	);

	return (
		<AppTimelineDataContext.Provider
			value={{
				data: Data,
				flashListItems: FlashListItems,
				count: Data.length,
				append,
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
