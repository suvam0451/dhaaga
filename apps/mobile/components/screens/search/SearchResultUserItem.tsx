import { AppUserObject } from '../../../types/app-user.types';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppDivider } from '../../lib/Divider';

type SearchResultUserItemProps = {
	item: AppUserObject;
};

const ICON_SIZE = 42;

function SearchResultUserItem({ item }: SearchResultUserItemProps) {
	const { theme } = useAppTheme();
	return (
		<View style={{ paddingHorizontal: 10 }}>
			<View style={{ flexDirection: 'row' }}>
				<View>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{ uri: item.avatarUrl }}
						style={{
							width: ICON_SIZE,
							height: ICON_SIZE,
							borderRadius: ICON_SIZE / 2,
						}}
					/>
				</View>
				<View style={{ marginLeft: 12 }}>
					<Text
						style={{
							color: theme.secondary.a0,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							fontSize: 16,
						}}
					>
						{item.displayName}
					</Text>
					<Text
						style={{
							color: theme.secondary.a30,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							fontSize: 13,
						}}
					>
						{item.handle}
					</Text>
				</View>
				<View></View>
			</View>
			<AppDivider.Hard
				style={{ marginVertical: 12, backgroundColor: '#232323' }}
			/>
		</View>
	);
}

export default SearchResultUserItem;
