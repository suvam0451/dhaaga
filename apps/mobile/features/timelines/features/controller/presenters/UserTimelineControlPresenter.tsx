import ControlSegment from '../../../../../components/widgets/feed-controller/components/ControlSegment';
import { Text, View } from 'react-native';
import { styles } from '../../../../../components/widgets/feed-controller/controllers/_shared';
import { AppInlineCheckbox } from '../../../../../components/lib/Checkboxes';
import { Fragment } from 'react';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';

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
		<Fragment>
			<ControlSegment
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

			<Text
				style={[
					styles.controlSectionLabel,
					{
						color: theme.secondary.a20,
					},
				]}
			>
				Extra Filters
			</Text>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
				}}
			>
				<AppInlineCheckbox
					label={'Hide Replies'}
					checked={HideReplies}
					onClick={onClickHideReply}
				/>
				<AppInlineCheckbox
					label={'Hide Reblogs'}
					checked={HideReposts}
					onClick={onClickHideReblog}
				/>
			</View>
		</Fragment>
	);
}

export default UserTimelineControlPresenter;
