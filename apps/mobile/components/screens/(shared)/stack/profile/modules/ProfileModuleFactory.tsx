import { memo, useState } from 'react';
import {
	StyleProp,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn } from 'react-native-reanimated';

type ProfileModuleFactoryProps = {
	label: string;
	subtext?: string;
	children: any;
	style?: StyleProp<ViewStyle>;
};

/**
 * Container and shared logic
 * for profile module blocks
 */
const ProfileModuleFactory = memo(
	({ label, subtext, children, style }: ProfileModuleFactoryProps) => {
		const [IsExpanded, setIsExpanded] = useState(false);

		return (
			<View style={style}>
				<TouchableOpacity
					onPress={() => {
						setIsExpanded(!IsExpanded);
					}}
				>
					<View style={styles.root}>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								color: APP_FONT.MONTSERRAT_BODY,
								flexGrow: 1,
							}}
						>
							{label}{' '}
							<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
								({subtext})
							</Text>
						</Text>
						<Ionicons
							name={IsExpanded ? 'chevron-down' : 'chevron-forward'}
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</TouchableOpacity>
				<Animated.View
					style={[
						{
							display: IsExpanded ? 'flex' : 'none',
						},
						styles.hiddenSection,
					]}
					entering={FadeIn}
				>
					{children}
				</Animated.View>
			</View>
		);
	},
);

export default ProfileModuleFactory;

const styles = StyleSheet.create({
	root: {
		marginVertical: 6,
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: '#272727',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
	},
	hiddenSection: {
		paddingLeft: 8,
		paddingRight: 8,
		paddingVertical: 8,
		backgroundColor: '#1E1E1E',
		borderRadius: 8,
		marginBottom: 8,
	},
});
