import { Dispatch, SetStateAction } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog } from '@rneui/themed';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Props = {
	visible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
};

function ConfirmRelationshipChangeDialog({ visible, setVisible }: Props) {
	if (!visible) return <View></View>;

	return (
		<Dialog
			overlayStyle={{ backgroundColor: '#2c2c2c' }}
			isVisible={visible}
			onBackdropPress={() => {
				setVisible(false);
			}}
		>
			<View>
				<Text
					style={{
						fontFamily: 'Montserrat-Bold',
						textAlign: 'center',
						color: APP_FONT.MONTSERRAT_HEADER,
						fontSize: 16,
					}}
				>
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
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					</View>
					<View style={{ flexGrow: 1, marginLeft: 16 }}>
						<Text
							style={{
								fontFamily: 'Montserrat-Bold',
								color: APP_FONT.MONTSERRAT_HEADER,
							}}
						>
							Mute posts in home timeline, instead
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
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					</View>
					<View style={{ flexGrow: 1, marginLeft: 16, marginRight: 16 }}>
						<Text
							style={{
								fontFamily: 'Montserrat-Bold',
								color: APP_FONT.MONTSERRAT_HEADER,
							}}
						>
							Disable notifications, instead
						</Text>
					</View>
				</View>
				<View style={{ marginTop: 16 }}>
					<Button type={'solid'}>
						<Text
							style={{
								fontFamily: 'Montserrat-Bold',
								color: APP_FONT.MONTSERRAT_HEADER,
								fontSize: 16,
							}}
						>
							Unfollow
						</Text>
					</Button>
				</View>
			</View>
		</Dialog>
	);
}

const styles = StyleSheet.create({
	alternativeButtonContainer: {},
});

export default ConfirmRelationshipChangeDialog;
