import { ListItem } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import useMfm from '../hooks/useMfm';
import { AppTimelineAction } from '../lib/Buttons';
import Octicons from '@expo/vector-icons/Octicons';
import { APP_FONT } from '../../styles/AppTheme';
import { APP_FONTS } from '../../styles/AppFonts';
import Feather from '@expo/vector-icons/Feather';
import { memo } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import PostMoreActionsPostTarget from '../dhaaga-bottom-sheet/modules/post-actions/fragments/PostMoreActionsPostTarget';
import { useGorhomActionSheetContext } from '../../states/useGorhomBottomSheet';
import { ActivityPubStatusAppDtoType } from '../../services/approto/activitypub-status-dto.service';

type Props = {
	dto: ActivityPubStatusAppDtoType;
};

const Status = memo(({ dto }: Props) => {
	const { PostRef } = useGorhomActionSheetContext();
	const { content: ParsedDisplayName } = useMfm({
		content: dto.postedBy.displayName,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis as any,
		deps: [dto.postedBy.displayName],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	});

	return (
		<View>
			<ListItem containerStyle={{ backgroundColor: '#2C2C2C' }}>
				<ListItem.Content style={{ width: '100%' }}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<View style={{ flexShrink: 1 }}>
							<Text
								style={{
									color: APP_FONT.MONTSERRAT_BODY,
									fontSize: 18,
									fontFamily: APP_FONTS.INTER_500_MEDIUM,
								}}
							>
								More Actions
							</Text>
						</View>
						<View
							style={{
								height: 1,
								backgroundColor: APP_FONT.DISABLED,
								marginLeft: 8,
								flexGrow: 1,
							}}
						/>
					</View>

					<PostMoreActionsPostTarget setEditMode={() => {}} />

					<View style={{ flexDirection: 'row', paddingVertical: 8 }}>
						<Ionicons
							name={'link-outline'}
							color={'#ffffff87'}
							size={24}
							style={{ paddingHorizontal: 8 }}
						/>
						<Text
							style={{
								color: APP_FONT.MONTSERRAT_BODY,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								marginLeft: 6,
								fontSize: 18,
							}}
						>
							Copy Link
						</Text>
					</View>

					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: '100%',
						}}
					>
						<View style={styles.postActionButtonContainer}>
							<Ionicons name={'link-outline'} color={'#ffffff87'} size={24} />
							<Text style={styles.buttonText}>Copy Link</Text>
						</View>
						<View style={styles.postActionButtonContainer}>
							<Feather
								name="arrow-up-right"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
							<Text style={styles.buttonText}>Open Original</Text>
						</View>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: '100%',
						}}
					>
						<View style={styles.postActionButtonContainer}>
							<AntDesign
								name="like2"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
							<Text style={styles.buttonText}>
								{PostRef.current.interaction.liked ? 'Remove Like' : 'Like'}
							</Text>
						</View>
						<View style={styles.postActionButtonContainer}>
							<Feather
								name="share"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
							<Text style={styles.buttonText}>Share</Text>
						</View>
						<View style={styles.postActionButtonContainer}>
							<Feather
								name="refresh-ccw"
								size={21}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
							<Text style={styles.buttonText}>Refresh</Text>
						</View>
					</View>
					<Text
						style={{
							fontSize: 13,
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: APP_FONTS.INTER_400_REGULAR,
							marginLeft: 4,
						}}
					>
						TIP: Press and hold Boost to Quote the Post
					</Text>
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
								source={dto.postedBy.avatarUrl}
							/>
						</View>
						<View style={{ marginLeft: 8 }}>
							{ParsedDisplayName}
							<Text
								style={{
									color: '#888',
									fontSize: 12,
									fontFamily: APP_FONTS.INTER_700_BOLD,
								}}
							>
								{dto.postedBy.handle}
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
});

const styles = StyleSheet.create({
	postActionButtonContainer: {
		flex: 1,
		borderColor: '#ffffff30',
		// backgroundColor: '#282828',
		borderWidth: 1,
		borderRadius: 6,
		padding: 8,
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 4,
		marginBottom: 10,
	},
	buttonText: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		marginLeft: 6,
	},
});

export default Status;
