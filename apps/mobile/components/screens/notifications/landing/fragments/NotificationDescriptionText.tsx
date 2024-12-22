import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { Fragment, memo, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppNotifSeenContext } from '../state/useNotifSeen';
import Ionicons from '@expo/vector-icons/Ionicons';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { DatetimeUtil } from '../../../../../utils/datetime.utils';

type Props = {
	id: string;
	type: DhaagaJsNotificationType;
	createdAt: Date;
};

export const NotificationDescriptionText = memo(
	({ type, createdAt, id }: Props) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		const TextContent = useMemo(() => {
			switch (type) {
				case DhaagaJsNotificationType.FAVOURITE: {
					return 'Liked your post';
				}
				case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED: {
					return 'Accepted your follow request';
				}
				case DhaagaJsNotificationType.FOLLOW: {
					return 'Followed You';
				}
				case DhaagaJsNotificationType.REBLOG:
				case DhaagaJsNotificationType.RENOTE: {
					return 'Boosted your post';
				}
				case DhaagaJsNotificationType.REACTION: {
					return 'Reacted to your post';
				}
				case DhaagaJsNotificationType.STATUS: {
					return 'Posted';
				}
				case DhaagaJsNotificationType.REPLY: {
					return 'Replied to your post';
				}
				case DhaagaJsNotificationType.MENTION: {
					return 'Mentioned you in a post';
				}
			}
		}, [type]);

		const { Seen } = useAppNotifSeenContext();
		const seen = Seen.has(id);

		return (
			<View style={styles.container}>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ width: 26 }}>
						<MaterialIcons
							name="subdirectory-arrow-right"
							size={24}
							color={theme.complementary.a0}
						/>
					</View>
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							paddingTop: 4,
							color: theme.complementary.a0,
						}}
					>
						{TextContent}
					</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={{ color: 'green' }}>
						{DatetimeUtil.timeAgo(createdAt || new Date())}
					</Text>
					{!seen && (
						<Fragment>
							<Text style={{ color: 'green' }}>{' • '}</Text>
							<Ionicons name="mail-unread-outline" size={16} color="orange" />
						</Fragment>
					)}
				</View>
			</View>
		);
	},
);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
		justifyContent: 'space-between',
	},
});
