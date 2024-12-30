import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import { Fragment, memo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppNotifSeenContext } from '../state/useNotifSeen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DatetimeUtil } from '../../../../../utils/datetime.utils';
import { LocalizationService } from '../../../../../services/localization.service';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';

type Props = {
	id: string;
	type: DhaagaJsNotificationType;
	createdAt: Date;
};

export const NotificationDescriptionText = memo(
	({ type, createdAt, id }: Props) => {
		const { theme } = useAppTheme();

		const TextContent = LocalizationService.notificationLabel(type);
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
