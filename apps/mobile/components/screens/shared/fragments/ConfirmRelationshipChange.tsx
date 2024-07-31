import { Dispatch, memo, SetStateAction } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Dialog } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AppButtonClassicInverted } from '../../../lib/Buttons';
import { APP_FONTS } from '../../../../styles/AppFonts';

type Props = {
	visible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
	onUnfollow: () => void;
};

const ConfirmRelationshipChangeDialog = memo(
	({ visible, setVisible, onUnfollow }: Props) => {
		return (
			<Dialog
				overlayStyle={{ backgroundColor: '#2c2c2c' }}
				isVisible={visible}
				onBackdropPress={() => {
					setVisible(false);
				}}
			>
				<View>
					<Text style={styles.modalTitle}>
						Are you sure you want to unfollow this user?
					</Text>

					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							marginTop: 16,
							marginBottom: 16,
						}}
					>
						<View style={{ width: 24 }}>
							<FontAwesome5
								name="volume-mute"
								size={20}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</View>
						<View style={{ flexGrow: 1, marginLeft: 16 }}>
							<Text style={styles.actionDescription}>
								Mute posts in home timeline
							</Text>
						</View>
					</View>

					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							marginBottom: 16,
						}}
					>
						<View style={{ width: 24 }}>
							<FontAwesome6
								name="bell-slash"
								size={20}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</View>
						<View style={{ flexGrow: 1, marginLeft: 16, marginRight: 16 }}>
							<Text style={styles.actionDescription}>
								Disable notifications
							</Text>
						</View>
					</View>
					<View style={{ marginTop: 16 }}>
						<AppButtonClassicInverted label={'Unfollow'} onClick={onUnfollow} />
					</View>
				</View>
			</Dialog>
		);
	},
);

const styles = StyleSheet.create({
	modalTitle: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		textAlign: 'center',
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
	},
	actionDescription: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
	},
});

export default ConfirmRelationshipChangeDialog;
