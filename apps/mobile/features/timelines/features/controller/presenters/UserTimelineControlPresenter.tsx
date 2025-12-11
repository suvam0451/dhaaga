import ControlSegmentView from '#/components/lib/ControlSegmentView';
import { View } from 'react-native';
import { InlineCheckboxView } from '#/components/lib/Checkboxes';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { AppText } from '#/components/lib/Text';

type Props = {
	onClickHideReply: () => void;
	onClickHideReblog: () => void;
	MediaOpt: Set<string>;
	onMediaOptSelected: (index: number) => void;
	onMediaOptAllSelected: () => void;
	HideReplies: boolean;
	HideReposts: boolean;
	hash: string;
};

function UserTimelineControlPresenter({
	onClickHideReply,
	onClickHideReblog,
	MediaOpt,
	onMediaOptSelected,
	onMediaOptAllSelected,
	HideReplies,
	HideReposts,
	hash,
}: Props) {
	const { theme } = useAppTheme();

	return (
		<View style={{ paddingHorizontal: 12 }}>
			<ControlSegmentView
				label={'Timeline Options'}
				buttons={[
					{
						label: 'All',
						lookupId: 'all',
						onClick: onMediaOptAllSelected,
					},
					{
						label: 'Media Only',
						lookupId: 'media-only',
						onClick: () => {
							onMediaOptSelected(0);
						},
					},
				]}
				hash={hash}
				selection={MediaOpt}
			/>

			<AppText.SemiBold
				style={{
					color: theme.secondary.a10,
					marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
					fontSize: 16,
				}}
			>
				Extra Filters
			</AppText.SemiBold>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
				}}
			>
				<InlineCheckboxView
					label={'Hide Replies'}
					checked={HideReplies}
					onClick={onClickHideReply}
				/>
				<InlineCheckboxView
					label={'Hide Reblogs'}
					checked={HideReposts}
					onClick={onClickHideReblog}
				/>
			</View>
		</View>
	);
}

export default UserTimelineControlPresenter;
