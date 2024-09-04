import { View, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import {
	AppFeatureLargeGridItem,
	AppFeatureSmallGridItem,
} from '../../../../screens/settings/SettingsLandingPage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import AppListingBookmarkGallery from './bookmark-gallery/AppListingBookmarkGallery';
import AppsTabCta from './fragments/AppsTabCta';

function AppTabLanding() {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<WithAutoHideTopNavBar title={'Apps'} translateY={translateY}>
			<View style={style.rootContainer}>
				<AppsTabCta />
				<AppListingBookmarkGallery />
				<View style={style.appFeaturesGridRow}>
					<View style={{ flex: 1 }}>
						<AppFeatureLargeGridItem
							label={'Known Servers'}
							link={'/apps/known-servers'}
							Icon={
								<FontAwesome6
									name="server"
									size={24}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							}
							alignment={'left'}
						/>
					</View>
					<View style={{ flex: 1 }}>
						<View style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
							<AppFeatureSmallGridItem
								Icon={
									<FontAwesome5
										name="download"
										size={24}
										color={APP_FONT.MONTSERRAT_BODY}
										disabled
										style={{
											opacity: 0.36,
										}}
									/>
								}
								alignment={'left'}
								iconSize={24}
								disabled={true}
							/>
							<AppFeatureSmallGridItem
								Icon={
									<FontAwesome5
										name="download"
										size={24}
										color={APP_FONT.MONTSERRAT_HEADER}
										disabled
										style={{
											opacity: 0.36,
										}}
									/>
								}
								alignment={'right'}
								iconSize={24}
								disabled={true}
							/>
						</View>
					</View>
				</View>
			</View>
		</WithAutoHideTopNavBar>
	);
}

const style = StyleSheet.create({
	rootContainer: {
		marginTop: 54,
	},

	sectionContainer: {
		borderWidth: 2,
		borderColor: '#383838',
		borderRadius: 8,
		padding: 8,
		margin: 8,
	},
	texStyle: {
		textAlign: 'center',
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		fontSize: 20,
		color: APP_FONT.MONTSERRAT_BODY,
	},
	appFeaturesGridRow: {
		marginHorizontal: 8,
		marginBottom: 8,
		display: 'flex',
		flexDirection: 'row',
	},
});

export default AppTabLanding;
