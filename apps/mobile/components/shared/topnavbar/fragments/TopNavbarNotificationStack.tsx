import { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@rneui/themed';
import TimelineWidgetModal from '../../../widgets/timelines/core/Modal';
import * as React from 'react';

const NotificationsHeader = memo(() => {
	function onIconPress() {}
	function onCreatePost() {}

	return (
		<View style={styles.root}>
			<View style={{ width: 42 }}>
				<Ionicons name="menu" size={24} color={APP_FONT.DISABLED} />
			</View>
			<TouchableOpacity
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 16,
				}}
				onPress={onIconPress}
			>
				<Text style={[styles.label, { fontSize: 16 }]}>Social</Text>
				<Text
					style={{
						width: 16,
						fontSize: 16,
						color: APP_FONT.DISABLED,
						textAlign: 'center',
					}}
				>
					/
				</Text>
				<Text
					style={[
						styles.label,
						{ fontSize: 20, color: APP_FONT.MONTSERRAT_HEADER },
					]}
				>
					Chat
				</Text>
				<Text
					style={{
						width: 16,
						fontSize: 16,
						color: APP_FONT.DISABLED,
						textAlign: 'center',
					}}
				>
					/
				</Text>
				<Text style={[styles.label, { fontSize: 16 }]}>Updates</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 12,
					paddingHorizontal: 16,
				}}
				onPress={onCreatePost}
			>
				<Ionicons
					name="settings-outline"
					size={24}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
			</TouchableOpacity>
			<TimelineWidgetModal />
		</View>
	);
});

export default NotificationsHeader;

const styles = StyleSheet.create({
	root: {
		width: '100%',
		paddingLeft: 10,
		backgroundColor: APP_THEME.DARK_THEME_MENUBAR,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 50,
	},
	label: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_700_BOLD,
		fontSize: 14,
	},
});
