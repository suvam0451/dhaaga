import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import { Props, styles } from './_common';
import { NotificationSenderInterface } from '../fragments/NotificationSender';
import { NotificationPostPeek } from '../fragments/NotificationPostPeek';
import { NotificationDescriptionText } from '../fragments/NotificationDescriptionText';
import { APP_FONT } from '../../../../../styles/AppTheme';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const MentionNotificationFragment = memo(({ item }: Props) => {
	const acct = item.acct;
	const post = item.post;

	return (
		<View style={styles.container}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<NotificationSenderInterface
					acct={acct}
					type={DhaagaJsNotificationType.MENTION}
				/>
				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity
						style={{
							backgroundColor: '#121212',
							paddingHorizontal: 12,
							paddingVertical: 8,
							borderRadius: 8,
						}}
					>
						<Entypo name="reply" size={20} color={APP_FONT.DISABLED} />
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: '#121212',
							paddingHorizontal: 12,
							paddingVertical: 8,
							borderRadius: 8,
							marginLeft: 8,
						}}
					>
						<MaterialIcons
							name="add-reaction"
							size={20}
							color={APP_FONT.DISABLED}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<NotificationDescriptionText
				type={DhaagaJsNotificationType.MENTION}
				createdAt={item.createdAt}
				id={item.id}
			/>
			<NotificationPostPeek acct={acct} post={post} />
		</View>
	);
});

export default MentionNotificationFragment;
