import { useMemo } from 'react';
import { useAppTheme, useHub } from '#/states/global/hooks';
import { FlatList, Pressable, View } from 'react-native';
import { AppText } from '#/components/lib/Text';

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
			{ label: 'Add +', id: '__add__' },
		];
	}, [profiles, pageIndex]);

	return (
		<View
			style={{
				position: 'absolute',
				bottom: 0,
				paddingBottom: 8,
				paddingHorizontal: 4,
				backgroundColor: 'transparent',
			}}
		>
			<FlatList
				horizontal={true}
				data={tabLabels}
				renderItem={({ item, index }) => (
					<Pressable
						style={{
							paddingVertical: 6,
							paddingHorizontal: 10,
						}}
						onPress={() => {
							if (index === tabLabels.length - 1) {
								onPressAddProfile();
							} else {
								onPressProfile(item.id);
							}
						}}
						onLongPress={() => {
							if (index === tabLabels.length - 1) {
								onPressAddProfile();
							} else {
								onLongPressProfile(item.id);
							}
						}}
					>
						<AppText.Medium
							style={{
								textAlign: 'center',
								fontSize: 18,
								color:
									pageIndex === index ? theme.primary.a0 : theme.secondary.a20,
							}}
						>
							{item.label}
						</AppText.Medium>
					</Pressable>
				)}
				contentContainerStyle={{ paddingVertical: 6 }}
			/>
		</View>
	);
}

export default HubProfileListView;
