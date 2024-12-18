import NowBrowsingHeader from '../../../widgets/feed-controller/core/NowBrowsingHeader';
import { StyleProp, Text, TextStyle } from 'react-native';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_FONTS } from '../../../../styles/AppFonts';

function AppBottomSheetTimelineDetails() {
	const { colorScheme } = useGlobalState(
		useShallow((o) => ({
			colorScheme: o.colorScheme,
		})),
	);

	const headerTextStyle: StyleProp<TextStyle> = {
		color: colorScheme.textColor.high,
		fontSize: 20,
		textAlign: 'center',
		marginVertical: 24,
		marginLeft: 10,
		marginTop: 36,
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
