import { memo } from 'react';
import useScrollMoreOnPageEnd from '../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from './WithAutoHideTopNavBar';
import { Animated, StyleProp, ViewStyle } from 'react-native';

type TitleOnlyScrollContainerProps = {
	title: string;
	children: any;
	contentContainerStyle?: StyleProp<ViewStyle>;
};

const TitleOnlyScrollContainer = memo(
	({
		title,
		children,
		contentContainerStyle,
	}: TitleOnlyScrollContainerProps) => {
		const { translateY } = useScrollMoreOnPageEnd({
			itemCount: 0,
			updateQueryCache: () => {},
		});
		return (
			<WithAutoHideTopNavBar title={title} translateY={translateY}>
				<Animated.ScrollView
					contentContainerStyle={[{ paddingTop: 54 }, contentContainerStyle]}
				>
					{children}
				</Animated.ScrollView>
			</WithAutoHideTopNavBar>
		);
	},
);

export default TitleOnlyScrollContainer;
