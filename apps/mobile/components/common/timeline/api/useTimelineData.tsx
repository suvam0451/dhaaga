import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub';
import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';
import {
	createContext,
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { ActivitypubStatusService } from '../../../../services/ap-proto/activitypub-status.service';
import { ListItemEnum, ListItemType } from '../utils/itemType.types';
import ActivityPubService from '../../../../services/activitypub.service';
import * as Haptics from 'expo-haptics';
import { OpenAiService } from '../../../../services/openai.service';

type Type = {
	data: ActivityPubStatusAppDtoType[];
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
	count: number;
};

const defaultValue: Type = {
	data: [],
	flashListItems: [],
	append: () => {},
	clear: () => {},
	toggleBookmark: () => {},
	explain: () => {},
	count: 0,
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
	const [Data, setData] = useState<ActivityPubStatusAppDtoType[]>([]);
	const [LegacyData, setLegacyData] = useState<StatusInterface[]>([]);

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
		setData([]);
		Seen.current.clear();
	}, [Seen, Data]);

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
			setData(Data.concat(toAdd));
			setLegacyData(LegacyData.concat(toAdd2));
		},
		[Seen, Data, domain, subdomain],
	);

	const toggleBookmark = useCallback(
		(key: string, dispatch: Dispatch<SetStateAction<boolean>>) => {
			if (!client) return;
			dispatch(true);
			const match = Data.find((o) => o.id === key);
			ActivityPubService.toggleBookmark(
				client,
				key,
				match.interaction.bookmarked,
			)
				.then((res) => {
					setData((prev) =>
						[...prev].map((o) => ({
							...o,
							interaction: {
								...o.interaction,
								bookmarked: o.id === key ? res : o.interaction.bookmarked,
							},
						})),
					);
				})
				.finally(() => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).finally(() => {
						dispatch(false);
					});
				});
		},
		[Data],
	);

	const explain = useCallback(
		async (
			key: string,
			ctx: string[],
			dispatch: Dispatch<SetStateAction<boolean>>,
		) => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).then(() => {});
			dispatch(true);
			try {
				const response = await OpenAiService.explain(ctx.join(','));
				setData((prev) =>
					[...prev].map((o) => ({
						...o,
						calculated: {
							...o.calculated,
							translationOutput:
								o.id === key ? response : o.calculated.translationOutput,
							translationType:
								o.id === key ? 'OpenAI' : o.calculated.translationType,
						},
					})),
				);
			} catch (e) {
				console.log(e);
			} finally {
				dispatch(false);
			}
		},
		[Data],
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
			}}
		>
			{children}
		</AppTimelineDataContext.Provider>
	);
}

export default WithAppTimelineDataContext;
