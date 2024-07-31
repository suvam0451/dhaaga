import { View } from 'react-native';
import DefaultPinnedItem from '../../../screens/home/timeline-menu/DefaultPinnedItem';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Button, Text } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import { TimelineFetchMode } from '../../../common/timeline/utils/timeline.types';

const ICON_SIZE = 20;

function DefaultTimelineOptions() {
	const { domain } = useActivityPubRestClientContext();
	const { setTimelineType, setShowTimelineSelection } = useTimelineController();

	function onClickHome() {
		setTimelineType(TimelineFetchMode.HOME);
		setShowTimelineSelection(false);
	}

	function onClickLocal() {
		setTimelineType(TimelineFetchMode.LOCAL);
		setShowTimelineSelection(false);
	}

	function onClickFederated() {
		setTimelineType(TimelineFetchMode.FEDERATED);
		setShowTimelineSelection(false);
	}

	function onClickGoToSocialHub() {
		setTimelineType(TimelineFetchMode.IDLE);
		setShowTimelineSelection(false);
	}

	function onClickBubble() {
		setTimelineType(TimelineFetchMode.BUBBLE);
		setShowTimelineSelection(false);
	}

	function onClickSocial() {
		setTimelineType(TimelineFetchMode.SOCIAL);
		setShowTimelineSelection(false);
	}

	const BUBBLE_AVAILABLE = [KNOWN_SOFTWARE.SHARKEY].includes(
		domain as KNOWN_SOFTWARE,
	);
	const SOCIAL_AVAILABLE = [
		KNOWN_SOFTWARE.SHARKEY,
		KNOWN_SOFTWARE.MISSKEY,
	].includes(domain as KNOWN_SOFTWARE);

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
					label={'Federated'}
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
			<View>
				<Button
					buttonStyle={{
						backgroundColor: APP_THEME.COLOR_SCHEME_B,
					}}
					onPress={onClickGoToSocialHub}
				>
					<Ionicons
						name="navigate"
						size={20}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
					<Text
						style={{ fontFamily: 'Inter-Bold', marginLeft: 4, fontSize: 16 }}
					>
						Go to Your Social Hub
					</Text>
				</Button>
			</View>
		</View>
	);
}

export default DefaultTimelineOptions;
