import NowBrowsingHeader from '../../../widgets/feed-controller/core/NowBrowsingHeader';
import { StyleProp, Text, TextStyle } from 'react-native';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_FONTS } from '../../../../styles/AppFonts';

function AppBottomSheetTimelineDetails() {
	const { colorScheme, show, setPostRef } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			colorScheme: o.colorScheme,
			show: o.bottomSheet.show,
			setPostRef: o.bottomSheet.setPostRef,
		})),
	);

	const headerTextStyle: StyleProp<TextStyle> = {
		color: colorScheme.textColor.high,
		fontSize: 20,
		textAlign: 'center',
		marginVertical: 16,
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
	};

	return (
		<>
			<Text style={headerTextStyle}>Now Browsing</Text>
			<NowBrowsingHeader />
		</>
	);
}

export default AppBottomSheetTimelineDetails;
