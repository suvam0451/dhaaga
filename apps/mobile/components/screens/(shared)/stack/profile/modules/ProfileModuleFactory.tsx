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
import { useAppTheme } from '../../../../../../hooks/app/useAppThemePack';

type ProfileModuleFactoryProps = {
	label: string;
	subtext?: string;
	children: any;
	style?: StyleProp<ViewStyle>;
	disabled?: boolean;
};

/**
 * Container and shared logic
 * for profile module blocks
 */
const ProfileModuleFactory = memo(
	({
		label,
		subtext,
		children,
		style,
		disabled,
	}: ProfileModuleFactoryProps) => {
		const [IsExpanded, setIsExpanded] = useState(false);
		const { colorScheme } = useAppTheme();

		return (
			<View style={style}>
				<TouchableOpacity
					onPress={() => {
						if (!disabled) {
							setIsExpanded(!IsExpanded);
						}
					}}
				>
					<View
						style={[
							styles.root,
							{ backgroundColor: colorScheme.palette.menubar },
						]}
					>
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								color: colorScheme.textColor.high,
								flexGrow: 1,
							}}
						>
							{label}{' '}
							<Text style={{ color: colorScheme.textColor.medium }}>
								({subtext})
							</Text>
						</Text>
						<Ionicons
							name={IsExpanded ? 'chevron-down' : 'chevron-forward'}
							size={24}
							color={APP_FONT.MEDIUM_EMPHASIS}
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
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
	},
	hiddenSection: {
		paddingLeft: 8,
		paddingRight: 8,
		paddingVertical: 8,
		borderRadius: 8,
		marginBottom: 8,
	},
});
