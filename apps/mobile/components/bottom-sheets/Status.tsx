import { ListItem, Text } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { useActivitypubStatusContext } from '../../states/useStatus';
import { Image } from 'expo-image';
import { Divider } from '@rneui/base';
import { BottomSheetActionButtonContainer } from '../../styles/Containers';
import activitypubAdapterService from '../../services/activitypub-adapter.service';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';

type StatusActionsProps = {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

function Status() {
	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;
	const domain = primaryAcct?.domain;
	const { status } = useActivitypubStatusContext();
	const userI = useMemo(() => {
		return activitypubAdapterService.adaptUser(status.getUser(), domain);
	}, [status]);

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
					>
						<View style={{ flexShrink: 1 }}>
							<Text
								style={{
									color: '#fff',
									opacity: 0.87,
									fontSize: 18,
								}}
							>
								Posted By
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
					<Divider width={10} color={'#fff'} />
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<View style={{ flexGrow: 0 }}>
							<View
								style={{
									width: 52,
									height: 52,
									borderColor: 'gray',
									borderWidth: 1,
									borderRadius: 4,
								}}
							>
								<Image
									style={{
										flex: 1,
										width: '100%',
										backgroundColor: '#0553',
										padding: 2,
									}}
									source={userI.getAvatarUrl()}
								/>
							</View>
						</View>
						<View>
							<Text>{userI.getDisplayName()}</Text>
						</View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<BottomSheetActionButtonContainer>
								<Ionicons
									name={'chatbox-ellipses-outline'}
									color={'#ffffff87'}
									size={24}
								/>
							</BottomSheetActionButtonContainer>
							<BottomSheetActionButtonContainer>
								<Ionicons
									name={'volume-mute-outline'}
									color={'#ffffff87'}
									size={24}
								/>
							</BottomSheetActionButtonContainer>
							<BottomSheetActionButtonContainer>
								<Ionicons
									name={'stop-circle-outline'}
									color={'#ffffff87'}
									size={24}
								/>
							</BottomSheetActionButtonContainer>
						</View>
					</View>
				</ListItem.Content>
			</ListItem>
		</View>
	);
}

export default Status;
