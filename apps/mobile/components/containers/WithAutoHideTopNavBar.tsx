import { APP_THEME } from '../../styles/AppTheme';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TopNavBarStyles } from '../../styles/NavaigationItems';
import ProfilePageHeader from '../headers/ProfilePageHeader';

// constants
const HIDDEN_SECTION_HEIGHT = 50;
const SHOWN_SECTION_HEIGHT = 50;

type AutoHideNavBarProps = {
	title: string;
	children: any;
	translateY?: Animated.AnimatedInterpolation<string | number>;
};

/**
 * The header of this container will auto-hide.
 *
 * NOTE: This variant does not have a ScrollView
 * @param title
 * @param children
 * @param translateY
 * @constructor
 */
function WithAutoHideTopNavBar({
	title,
	children,
	translateY,
}: AutoHideNavBarProps) {
	const navigation = useNavigation();

	return (
		<Animated.View
			style={[
				{
					height: '100%',
					backgroundColor: APP_THEME.BACKGROUND,
					// paddingTop: translateY
				},
			]}
		>
			{translateY !== undefined ? (
				<Animated.View
					style={[
						TopNavBarStyles.navbar,
						{
							transform: [
								{
									translateY,
								},
							],
						},
					]}
				>
					<ProfilePageHeader
						title={title}
						SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
						HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
						onLeftIconPress={() => navigation.goBack()}
					/>
				</Animated.View>
			) : (
				<ProfilePageHeader
					title={title}
					SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
					HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
					onLeftIconPress={() => navigation.goBack()}
				/>
			)}
			{children}
		</Animated.View>
	);
}

export default WithAutoHideTopNavBar;
