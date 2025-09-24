import { Animated, StyleSheet, View } from 'react-native';
import { APP_THEME } from '../../styles/AppTheme';
import TopNavbarGeneric from '../shared/topnavbar/fragments/TopNavbarGeneric';

type TitleOnlyStackHeaderContainerProps = {
	HIDDEN_SECTION_HEIGHT?: number;
	SHOWN_SECTION_HEIGHT?: number;
	headerTitle: string;
	children: any;
};

function TitleOnlyNoScrollContainer({
	headerTitle,
	children,
}: TitleOnlyStackHeaderContainerProps) {
	return (
		<View
			style={{
				height: '100%',
				backgroundColor: APP_THEME.BACKGROUND,
				display: 'flex',
			}}
		>
			<Animated.View style={[styles.header]}>
				<TopNavbarGeneric title={headerTitle} />
			</Animated.View>
			{children}
		</View>
	);
}

export default TitleOnlyNoScrollContainer;

const styles = StyleSheet.create({
	header: {
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
});
