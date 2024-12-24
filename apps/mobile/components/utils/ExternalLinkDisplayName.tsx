import { View, Text } from 'react-native';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_FONTS } from '../../styles/AppFonts';
import { APP_BOTTOM_SHEET_ENUM } from '../dhaaga-bottom-sheet/Core';

type ExternalLinDisplayNameProps = {
	displayName: string;
};

function ExternalLinkDisplayName({ displayName }: ExternalLinDisplayNameProps) {
	const httpsRemoved = displayName.replace(/(https:\/\/)(.+)/, '$2');
	const wwwRemoved = httpsRemoved.replace(/(www\.)(.+)/, httpsRemoved);
	const { show, appManager, theme } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
			appManager: o.appSession,
			theme: o.colorScheme,
		})),
	);

	function onTextPress() {
		appManager.storage.setLinkTarget(displayName, wwwRemoved);
		show(APP_BOTTOM_SHEET_ENUM.LINK, true);
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
					color: theme.complementary.a0,
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
				}}
				onPress={onTextPress}
			>
				{wwwRemoved}
			</Text>
		</View>
	);
}

export default ExternalLinkDisplayName;
