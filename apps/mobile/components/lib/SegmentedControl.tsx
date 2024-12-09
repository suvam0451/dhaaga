import { memo } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../styles/AppTheme';
import { APP_FONTS } from '../../styles/AppFonts';

type AppSegmentedControlProps = {
	items: {
		label: string;
	}[];
	leftDecorator?: any;
};

export const AppSegmentedControl = memo(
	({ items, leftDecorator }: AppSegmentedControlProps) => {
		return (
			<ScrollView
				style={{
					flexDirection: 'row',
					overflow: 'visible',
					// flex: 1,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						overflow: 'visible',
						flex: 1,
					}}
				>
					{items.map((o, i) => (
						<View
							key={i}
							style={{
								backgroundColor: '#444',
								borderRadius: 24,
								padding: 10,
								paddingHorizontal: 16,
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
		);
	},
);
