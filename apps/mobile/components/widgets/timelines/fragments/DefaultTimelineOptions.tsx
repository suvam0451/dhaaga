import { View } from 'react-native';
import DefaultPinnedItem from '../../../screens/home/timeline-menu/DefaultPinnedItem';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Button, Text } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
	TimelineFetchMode,
	useTimelineControllerContext,
} from '../../../../states/useTimelineController';

const ICON_SIZE = 20;

function DefaultTimelineOptions() {
	const { setTimelineType, setShowTimelineSelection } =
		useTimelineControllerContext();

	function onClickGoToSocialHub() {
		setTimelineType(TimelineFetchMode.IDLE);
		setShowTimelineSelection(false);
	}

	return (
		<View style={{ display: 'flex', height: '100%' }}>
			<View style={{ display: 'flex', marginTop: 32, flexGrow: 1 }}>
				<DefaultPinnedItem
					label={'Home'}
					Icon={
						<FontAwesome5
							name="home"
							size={ICON_SIZE}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					}
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
				/>
				<DefaultPinnedItem
					label={'Federated'}
					Icon={
						<FontAwesome6
							name="globe"
							size={ICON_SIZE}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					}
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
