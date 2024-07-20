import { ListItem, Text } from '@rneui/themed';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { useActivitypubStatusContext } from '../../states/useStatus';
import { Image } from 'expo-image';
import { BottomSheetActionButtonContainer } from '../../styles/Containers';
import activitypubAdapterService from '../../services/activitypub-adapter.service';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import useMfm from '../hooks/useMfm';
import { AppTimelineAction } from '../lib/Buttons';
import Octicons from '@expo/vector-icons/Octicons';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';

function Status() {
	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;
	const domain = primaryAcct?.domain;
	const { status } = useActivitypubStatusContext();

	const userI = useMemo(() => {
		return activitypubAdapterService.adaptUser(status.getUser(), domain);
	}, [status]);

	const { content: ParsedDisplayName } = useMfm({
		content: userI?.getDisplayName(),
		remoteSubdomain: userI?.getInstanceUrl(),
		emojiMap: userI?.getEmojiMap(),
		deps: [userI?.getDisplayName()],
		fontFamily: 'Montserrat-Bold',
	});

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(userI?.getAccountUrl(), subdomain);
	}, [userI?.getAccountUrl()]);

	return (
		<View>
			<ListItem containerStyle={{ backgroundColor: '#2C2C2C' }}>
				<ListItem.Content style={{ width: '100%' }}>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							marginBottom: 24,
						}}
					>
						<View style={{ flexShrink: 1 }}>
							<Text
								style={{
									color: '#fff',
									opacity: 0.87,
									fontSize: 18,
								}}
							>
								Post Actions
							</Text>
						</View>
						<View
							style={{
								height: 1,
								backgroundColor: '#fff',
								marginLeft: 8,
								flexGrow: 1,
								opacity: 0.3,
							}}
						/>
					</View>

					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<BottomSheetActionButtonContainer style={{}}>
							<Ionicons name={'link-outline'} color={'#ffffff87'} size={24} />
						</BottomSheetActionButtonContainer>
						<BottomSheetActionButtonContainer>
							<Ionicons
								name={'bookmark-outline'}
								color={'#ffffff87'}
								size={24}
							/>
						</BottomSheetActionButtonContainer>
						<BottomSheetActionButtonContainer>
							<Ionicons name={'star-outline'} color={'#ffffff87'} size={24} />
						</BottomSheetActionButtonContainer>
						<BottomSheetActionButtonContainer>
							<Ionicons name={'rocket-outline'} color={'#ffffff87'} size={24} />
						</BottomSheetActionButtonContainer>
						<BottomSheetActionButtonContainer>
							<Ionicons
								name={'arrow-undo-outline'}
								color={'#ffffff87'}
								size={24}
							/>
						</BottomSheetActionButtonContainer>
					</View>
				</ListItem.Content>
			</ListItem>
			<ListItem containerStyle={{ backgroundColor: '#2C2C2C' }}>
				<ListItem.Content>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							marginBottom: 12,
							marginTop: 16,
						}}
					></View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							marginVertical: 8,
							alignItems: 'flex-start',
						}}
					>
						<View
							style={{
								width: 52,
								height: 52,
								borderColor: 'gray',
								borderWidth: 1,
								borderRadius: 4,
							}}
						>
							{/*@ts-ignore-next-line*/}
							<Image
								style={{
									flex: 1,
									width: '100%',
									backgroundColor: '#0553',
									padding: 2,
									opacity: 0.87,
								}}
								source={userI.getAvatarUrl()}
							/>
						</View>
						<View style={{ marginLeft: 4 }}>
							<Text>{ParsedDisplayName}</Text>
							<Text
								style={{
									color: '#888',
									fontSize: 12,
									fontFamily: 'Montserrat-Bold',
								}}
							>
								{handle}
							</Text>
						</View>
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<AppTimelineAction
							Icon={
								<Ionicons
									name="chatbox-ellipses-outline"
									color={'#ffffff87'}
									size={24}
								/>
							}
							label={'DM'}
						/>
						<AppTimelineAction
							Icon={<Octicons name="mention" size={20} color={'#ffffff87'} />}
							label={'Mention'}
						/>
						<AppTimelineAction
							label={'Mute'}
							Icon={
								<Ionicons
									name={'volume-mute-outline'}
									color={'#ffffff87'}
									size={24}
								/>
							}
						/>
						<AppTimelineAction
							label={'Block'}
							Icon={
								<Ionicons
									name={'stop-circle-outline'}
									color={'#ffffff87'}
									size={24}
								/>
							}
						/>
						{/*<BottomSheetActionButtonContainer>*/}
						{/*	<Ionicons*/}
						{/*		name={'chatbox-ellipses-outline'}*/}
						{/*		color={'#ffffff87'}*/}
						{/*		size={24}*/}
						{/*	/>*/}
						{/*</BottomSheetActionButtonContainer>*/}
						{/*<BottomSheetActionButtonContainer>*/}
						{/*	<Ionicons*/}
						{/*		name={'volume-mute-outline'}*/}
						{/*		color={'#ffffff87'}*/}
						{/*		size={24}*/}
						{/*	/>*/}
						{/*</BottomSheetActionButtonContainer>*/}
						{/*<BottomSheetActionButtonContainer>*/}
						{/*	<Ionicons*/}
						{/*		name={'stop-circle-outline'}*/}
						{/*		color={'#ffffff87'}*/}
						{/*		size={24}*/}
						{/*	/>*/}
						{/*</BottomSheetActionButtonContainer>*/}
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					></View>
				</ListItem.Content>
			</ListItem>
		</View>
	);
}

export default Status;
