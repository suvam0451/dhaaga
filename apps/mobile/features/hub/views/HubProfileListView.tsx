import { useMemo } from 'react';
import { useAppTheme, useHub } from '#/states/global/hooks';
import { FlatList, Pressable, View } from 'react-native';
import { AppDividerSoft } from '#/ui/Divider';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { NativeTextMedium } from '#/ui/NativeText';
import { appDimensions } from '#/styles/dimensions';

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

	const tabLabels = useMemo(() => {
		return [
			...profiles.map((o) => ({
				label: o.name,
				id: o.id.toString(),
			})),
		];
	}, [profiles, pageIndex]);

	return (
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
							paddingVertical: 16,
							paddingHorizontal: 10,
						}}
						onPress={() => {
							onPressProfile(item.id);
						}}
						onLongPress={() => {
							onLongPressProfile(item.id);
						}}
					>
						<NativeTextMedium
							style={{
								textAlign: 'center',
								fontSize: 18,
								color:
									pageIndex === index ? theme.primary : theme.secondary.a20,
							}}
						>
							{item.label}
						</NativeTextMedium>
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
	);
}

export default HubProfileListView;
