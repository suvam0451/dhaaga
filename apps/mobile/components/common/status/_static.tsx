import { memo } from 'react';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@rneui/themed';
import { APP_THEME } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';

/**
 * Adds a reply indicator to the post
 *
 * NOTE: adjust margin and padding,
 * then the post is boosted and
 * is also a reply
 */
export const RepliedStatusFragment = memo(function Foo() {
	return (
		<View
			style={{
				backgroundColor: APP_THEME.DARK_THEME_STATUS_BG,
				borderRadius: 8,
				borderBottomLeftRadius: 0,
				borderBottomRightRadius: 0,
			}}
		>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					paddingTop: 6,
					paddingHorizontal: 12,
				}}
			>
				<Ionicons color={'#888'} name={'arrow-redo-outline'} size={14} />
				<Text
					style={{
						color: 'rgba(136,136,136,0.87)',
						fontWeight: '500',
						marginLeft: 4,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						fontSize: 13,
					}}
				>
					Replied to a thread
				</Text>
			</View>
		</View>
	);
});
