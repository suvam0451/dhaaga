import { ReactNode } from 'react';
import { ScrollView, StyleProp, ViewStyle, View } from 'react-native';
import TopNavbarGeneric from './fragments/TopNavbarGeneric';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import Animated from 'react-native-reanimated';

export enum APP_TOPBAR_TYPE_ENUM {
	GENERIC,
	TIMELINE,
	NOTIFICATION_CENTER,
	PROFILE,
	APP_SETTINGS,
	MY_ACCOUNT,
	MY_PROFILE,
}

type AutoHideNavBarProps = {
	title: string;
	children: any;
	translateY: any;
	type?: APP_TOPBAR_TYPE_ENUM;
	onRefresh?: () => void;
	contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * @deprecated use NavBar_ collection, instead
 * @param title
 * @param children
 * @param translateY
 * @param type
 * @param contentContainerStyle
 * @constructor
 */
function AppTopNavbar({
	title,
	children,
	translateY,
	type = APP_TOPBAR_TYPE_ENUM.GENERIC,
	contentContainerStyle,
}: AutoHideNavBarProps) {
	const { theme } = useAppTheme();

	let Header: ReactNode;

	switch (type) {
		case APP_TOPBAR_TYPE_ENUM.GENERIC:
			Header = <TopNavbarGeneric title={title} />;
			break;
		default:
			Header = <TopNavbarGeneric title={title} />;
			break;
	}

	return (
		<View
			style={{
				backgroundColor: theme.palette.bg,
				height: '100%',
			}}
		>
			<Animated.View
				style={[
					{
						position: 'absolute',
						zIndex: 1,
						transform: [
							{
								translateY,
							},
						],
					},
				]}
			>
				{Header}
			</Animated.View>
			<ScrollView
				contentContainerStyle={[
					{
						paddingHorizontal: 8,
						marginTop: 54,
					},
					contentContainerStyle,
				]}
			>
				{children}
			</ScrollView>
		</View>
	);
}

export default AppTopNavbar;
