import { Dispatch, memo, SetStateAction } from 'react';
import {
	Pressable,
	ScrollView,
	StyleProp,
	View,
	ViewStyle,
} from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../styles/AppFonts';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_ICON_ENUM, AppIcon } from './Icon';

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
	({
		items,
		leftDecorator,
		style,
		index,
		setIndex,
	}: AppSegmentedControlProps) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);
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
									backgroundColor: index === i ? theme.primary.a0 : '#444',
									borderRadius: 24,
									padding: 8,
									paddingHorizontal: 14,
									flexShrink: 1,
									marginHorizontal: 4,
								}}
							>
								<Text
									style={{
										color: index === i ? '#121212' : 'white',
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

type AppInstagramTabControlPops = {
	tabIcons: string[];
	index: number;
	onIndexChange: (index: number) => void;
};

export function AppInstagramTabControl({
	tabIcons,
	index,
	onIndexChange,
}: AppInstagramTabControlPops) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const ICON_SIZE = 32;

	const ACTIVE_TINT = theme.primary.a20;
	const INACTIVE_TINT = theme.textColor.low;

	return (
		<View style={{ flexDirection: 'row', width: '100%' }}>
			{tabIcons.map((tab, i) => (
				<Pressable
					key={i}
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
					onPress={() => {
						onIndexChange(i);
					}}
				>
					<AppIcon
						id={tab as APP_ICON_ENUM}
						size={ICON_SIZE}
						color={i === index ? ACTIVE_TINT : INACTIVE_TINT}
					/>
					<View
						style={{
							backgroundColor: i === index ? ACTIVE_TINT : 'transparent',
							width: 64,
							height: 3,
							marginTop: 8,
							borderRadius: 16,
						}}
					/>
				</Pressable>
			))}
		</View>
	);
}
