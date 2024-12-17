import { Text } from '@rneui/themed';
import { View } from 'react-native';
import { APP_THEME } from '../../styles/AppTheme';
import GlobalMmkvCacheServices from '../../services/globalMmkvCache.services';
import { useGlobalMmkvContext } from '../../states/useGlobalMMkvCache';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type ExternalLinDisplayNameProps = {
	displayName: string;
};

function ExternalLinkDisplayName({ displayName }: ExternalLinDisplayNameProps) {
	const httpsRemoved = displayName.replace(/(https:\/\/)(.+)/, '$2');
	const wwwRemoved = httpsRemoved.replace(/(www\.)(.+)/, httpsRemoved);
	const { globalDb } = useGlobalMmkvContext();
	const { show, db, mmkv } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
			db: o.db,
			mmkv: o.mmkv,
		})),
	);

	function onTextPress() {
		GlobalMmkvCacheServices.setBottomSheetProp_Link(globalDb, {
			url: displayName,
			displayName: wwwRemoved,
		});
		show(APP_BOTTOM_SHEET_ENUM.LINK);
	}

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'flex-end',
				marginBottom: -4,
				maxWidth: 196,
			}}
		>
			<Text
				numberOfLines={1}
				style={{
					color: APP_THEME.LINK,
					fontFamily: 'Inter-Bold',
				}}
				onPress={onTextPress}
			>
				{wwwRemoved}
			</Text>
			{/*<View style={{marginLeft: 2}}>*/}
			{/*  <Ionicons*/}
			{/*      name="open-outline"*/}
			{/*      size={16}*/}
			{/*      color={APP_THEME.LINK}*/}
			{/*  />*/}
			{/*</View>*/}
		</View>
	);
}

export default ExternalLinkDisplayName;
