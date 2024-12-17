import { memo } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../styles/AppFonts';

type AppSegmentedControlProps = {
	items: {
		label: string;
	}[];
	leftDecorator?: any;
	style?: StyleProp<ViewStyle>;
};

export const AppSegmentedControl = memo(
	({ items, leftDecorator, style }: AppSegmentedControlProps) => {
		return (
			<View
				style={{
					width: '100%',
				}}
			>
				<ScrollView
					style={[
						{
							flexDirection: 'row',
							overflow: 'scroll',
						},
						style,
					]}
				>
					<View
						style={{
							flexDirection: 'row',
							overflow: 'visible',
							alignItems: 'center',
						}}
					>
						{leftDecorator}
						{items.map((o, i) => (
							<View
								key={i}
								style={{
									backgroundColor: '#444',
									borderRadius: 24,
									padding: 8,
									paddingHorizontal: 14,
									flexShrink: 1,
									marginHorizontal: 4,
								}}
							>
								<Text
									style={{
										color: 'white',
										fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
									}}
								>
									{o.label}
								</Text>
							</View>
						))}
					</View>
				</ScrollView>
			</View>
		);
	},
);
