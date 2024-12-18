import { Dispatch, memo, SetStateAction } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../styles/AppFonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type AppSegmentedControlProps = {
	items: {
		label: string;
	}[];
	leftDecorator?: any;
	style?: StyleProp<ViewStyle>;

	index: number;
	setIndex: Dispatch<SetStateAction<number>>;
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

export function AppInstagramTabControl() {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const ICON_SIZE = 32;

	const ACTIVE_TINT = theme.textColor.medium;
	const INACTIVE_TINT = theme.textColor.low;

	return (
		<View style={{ flexDirection: 'row', width: '100%' }}>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Ionicons name="logo-instagram" size={ICON_SIZE} color={ACTIVE_TINT} />
				<View
					style={{
						backgroundColor: ACTIVE_TINT,
						width: 64,
						height: 3,
						marginTop: 8,
						borderRadius: 16,
					}}
				/>
			</View>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Octicons
					name="pin"
					size={ICON_SIZE}
					color={INACTIVE_TINT}
					style={{ width: 40 }}
				/>
				<View
					style={{
						backgroundColor: 'transparent',
						width: 64,
						height: 3,
						marginTop: 8,
						borderRadius: 16,
					}}
				/>
			</View>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Ionicons name={'newspaper-outline'} size={36} color={INACTIVE_TINT} />
				<View
					style={{
						backgroundColor: 'transparent',
						width: 64,
						height: 3,
						marginTop: 8,
						borderRadius: 16,
					}}
				/>
			</View>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Ionicons
					name={'chatbox-ellipses-outline'}
					size={36}
					color={INACTIVE_TINT}
				/>
				<View
					style={{
						backgroundColor: 'transparent',
						width: 64,
						height: 3,
						marginTop: 8,
						borderRadius: 16,
					}}
				/>
			</View>
		</View>
	);
}
