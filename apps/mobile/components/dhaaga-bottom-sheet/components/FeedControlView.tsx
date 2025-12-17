import { useAppApiClient, useAppTheme } from '#/states/global/hooks';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Fragment } from 'react';
import FeedControlSheetActions from '#/components/dhaaga-bottom-sheet/components/FeedControlSheetActions';
import { AppDividerSoft } from '#/ui/Divider';
import { LinkingUtils } from '#/utils/linking.utils';
import { PostTimelineStateType } from '@dhaaga/core';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';
import {
	NativeTextMedium,
	NativeTextNormal,
	NativeTextBold,
} from '#/ui/NativeText';
import FeedControlSelections from '#/components/dhaaga-bottom-sheet/components/FeedControlSelections';

type SUPPORTED_FEED_QUERY_CATEGORIES =
	| 'source'
	| 'media_only'
	| 'reply_control'
	| 'repost_control';

type Props = {
	title: string;
	context: PostTimelineStateType;
	subtitle?: string;
	description: string[];
	supportedFilters: SUPPORTED_FEED_QUERY_CATEGORIES[];
};

function FeedControlView({
	title,
	context,
	subtitle,
	description,
	supportedFilters,
}: Props) {
	const { theme } = useAppTheme();
	const { client } = useAppApiClient();

	async function onOpenInBrowser() {
		try {
			LinkingUtils.openFeedInBrowser(client, context);
		} catch (e) {
			console.log(e);
		}
	}

	async function shareFeed() {
		LinkingUtils.shareFeed(client, context);
	}

	return (
		<Fragment>
			<BottomSheetMenu
				title={'N/A'}
				variant={'raised'}
				CustomHeader={
					<View>
						<NativeTextBold
							style={[
								styles.title,
								{
									color: theme.primary,
								},
							]}
						>
							{title}
						</NativeTextBold>
						{subtitle && (
							<NativeTextMedium
								style={[
									styles.subtitle,
									{
										color: theme.complementary,
									},
								]}
							>
								{subtitle}
							</NativeTextMedium>
						)}
					</View>
				}
				style={{ paddingBottom: 10 }}
			/>
			<ScrollView
				contentContainerStyle={{
					marginVertical: 16,
					paddingBottom: 28,
					paddingHorizontal: 10,
				}}
			>
				{description.map((item, i) => (
					<NativeTextNormal
						key={i}
						style={[
							styles.desc,
							{
								color: theme.secondary.a10,
							},
						]}
					>
						{item}
					</NativeTextNormal>
				))}
				<AppDividerSoft style={{ marginVertical: 8 }} />
				<FeedControlSelections supported={supportedFilters ?? []} />
				{supportedFilters?.length > 0 ? (
					<AppDividerSoft style={{ marginVertical: 8 }} />
				) : (
					<View />
				)}
				<FeedControlSheetActions
					onPinToggle={() => {}}
					onShare={shareFeed}
					isPinned={false}
					onOpenInBrowser={onOpenInBrowser}
				/>
			</ScrollView>
		</Fragment>
	);
}

export default FeedControlView;

export const styles = StyleSheet.create({
	desc: {
		marginBottom: 4,
	},
	title: {
		fontSize: 20,
	},
	subtitle: {
		fontSize: 16,
	},
});
