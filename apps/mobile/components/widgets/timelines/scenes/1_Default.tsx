import { View } from 'react-native';
import DefaultPinnedItem from '../../../screens/home/timeline-menu/DefaultPinnedItem';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT, APP_THEME } from '#/styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useTimelineController } from '#/features/timelines/api/useTimelineController';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { useAppApiClient } from '#/hooks/utility/global-state-extractors';
import { AppButtonVariantA } from '#/components/lib/Buttons';
const ICON_SIZE = 20;

function DefaultTimelineOptions() {
	const { driver } = useAppApiClient();
	const { setShowTimelineSelection } = useTimelineController();

	function onClickHome() {
		// setHomepageType(TimelineFetchMode.HOME);
		setShowTimelineSelection(false);
	}

	function onClickLocal() {
		// setHomepageType(TimelineFetchMode.LOCAL);
		setShowTimelineSelection(false);
	}

	function onClickFederated() {
		// setHomepageType(TimelineFetchMode.FEDERATED);
		setShowTimelineSelection(false);
	}

	function onClickGoToSocialHub() {
		// setHomepageType(TimelineFetchMode.IDLE);
		setShowTimelineSelection(false);
	}

	function onClickBubble() {
		// setHomepageType(TimelineFetchMode.BUBBLE);
		setShowTimelineSelection(false);
	}

	function onClickSocial() {
		// setHomepageType(TimelineFetchMode.SOCIAL);
		setShowTimelineSelection(false);
	}

	const BUBBLE_AVAILABLE = [
		KNOWN_SOFTWARE.SHARKEY,
		KNOWN_SOFTWARE.AKKOMA,
	].includes(driver);

	const SOCIAL_AVAILABLE = [
		KNOWN_SOFTWARE.SHARKEY,
		KNOWN_SOFTWARE.MISSKEY,
	].includes(driver);

	return (
		<View style={{ display: 'flex', height: '100%' }}>
			<View
				style={{ display: 'flex', marginTop: 16, flexGrow: 1, padding: 10 }}
			>
				<DefaultPinnedItem
					label={'Home'}
					Icon={
						<FontAwesome5
							name="home"
							size={ICON_SIZE}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					}
					onClick={onClickHome}
				/>
				<DefaultPinnedItem
					label={'Local'}
					Icon={
						<FontAwesome5
							name="user-friends"
							size={ICON_SIZE}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					}
					onClick={onClickLocal}
				/>
				{SOCIAL_AVAILABLE && (
					<DefaultPinnedItem
						label={'Social'}
						Icon={
							<FontAwesome6
								name="handshake"
								size={ICON_SIZE}
								color={APP_FONT.MONTSERRAT_HEADER}
							/>
						}
						onClick={onClickSocial}
					/>
				)}
				{BUBBLE_AVAILABLE && (
					<DefaultPinnedItem
						label={'Bubble'}
						Icon={
							<FontAwesome6
								name="droplet"
								size={ICON_SIZE}
								color={APP_FONT.MONTSERRAT_HEADER}
								style={{ marginLeft: 4 }}
							/>
						}
						onClick={onClickBubble}
					/>
				)}

				<DefaultPinnedItem
					label={
						[KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(driver)
							? 'Known Network'
							: 'Federated'
					}
					Icon={
						<FontAwesome6
							name="globe"
							size={ICON_SIZE}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					}
					onClick={onClickFederated}
				/>
				<DefaultPinnedItem
					label={'Private Mode'}
					Icon={
						<FontAwesome6
							name="redhat"
							size={ICON_SIZE}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					}
					disabled
					onClick={() => {
						console.log('[INFO]: private mode is not implemented');
					}}
				/>
			</View>
			<AppButtonVariantA
				label={'Go to Social Hub'}
				style={{
					backgroundColor: APP_THEME.COLOR_SCHEME_B,
				}}
				onClick={onClickGoToSocialHub}
				loading={false}
			/>
		</View>
	);
}

export default DefaultTimelineOptions;
