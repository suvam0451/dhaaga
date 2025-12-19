import { useMemo } from 'react';
import { useAppBottomSheet, useAppTheme, useHub } from '#/states/global/hooks';
import { FlatList, Pressable, View } from 'react-native';
import { AppDividerSoft } from '#/ui/Divider';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { NativeTextBold } from '#/ui/NativeText';
import { appDimensions } from '#/styles/dimensions';
import AppWidget from '#/components/widget/AppWidget';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type Props = {
	onPressAddProfile: () => void;
	onPressProfile: (profileId: number | string) => void;
	onLongPressProfile: (profileId: number | string) => void;
};

function HubProfileListView({
	onPressAddProfile,
	onPressProfile,
	onLongPressProfile,
}: Props) {
	const { profiles, pageIndex } = useHub();
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet();

	const tabLabels = useMemo(() => {
		return [
			...profiles.map((o) => ({
				label: o.name,
				id: o.id.toString(),
			})),
		];
	}, [profiles, pageIndex]);

	function onPress() {
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
	}

	return (
		<AppWidget
			isOpen={false}
			inactiveIcon={'create'}
			activeIcon={'create'}
			onWidgetPress={onPress}
			ForegroundSlot={<View />}
			BackgroundSlot={
				<View
					style={{
						position: 'absolute',
						bottom: 0,
						paddingHorizontal: 4,
						backgroundColor: theme.background.a10,
						width: '100%',
						height: appDimensions.bottomNav.secondMenuBarHeight,
					}}
				>
					<AppDividerSoft />
					<FlatList
						horizontal={true}
						data={tabLabels}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item, index }) => (
							<Pressable
								style={{
									paddingHorizontal: 10,
								}}
								onPress={() => {
									onPressProfile(item.id);
								}}
								onLongPress={() => {
									onLongPressProfile(item.id);
								}}
							>
								<NativeTextBold
									style={{
										textAlign: 'center',
										fontSize: 18,
										marginVertical: 'auto',
										color:
											pageIndex === index ? theme.primary : theme.secondary.a20,
									}}
								>
									{item.label}
								</NativeTextBold>
							</Pressable>
						)}
						ListFooterComponent={
							<Pressable
								style={{
									marginVertical: 'auto',
									alignItems: 'center',
									flexDirection: 'row',
									paddingHorizontal: 8,
									paddingVertical: 9,
								}}
								onPress={onPressAddProfile}
								onLongPress={onPressAddProfile}
							>
								<AppIcon
									id={'add-circle-outline'}
									color={theme.secondary.a20}
									size={32}
									emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
								/>
							</Pressable>
						}
					/>
					<AppDividerSoft />
				</View>
			}
		/>
	);
}

export default HubProfileListView;
