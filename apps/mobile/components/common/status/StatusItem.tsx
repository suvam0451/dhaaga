import { TouchableOpacity, View, StyleSheet, Pressable } from 'react-native';
import { Divider, Text } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import {
	Fragment,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import OriginalPoster from '../../post-fragments/OriginalPoster';
import StatusInteraction from '../../../screens/timelines/fragments/StatusInteraction';
import MediaItem from '../media/MediaItem';
import { useActivitypubStatusContext } from '../../../states/useStatus';
import { ActivityPubUserAdapter } from '@dhaaga/shared-abstraction-activitypub';
import WithActivitypubUserContext from '../../../states/useProfile';
import { APP_FONT, APP_THEME } from '../../../styles/AppTheme';
import Entypo from '@expo/vector-icons/Entypo';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import StatusItemSkeleton from '../../skeletons/StatusItemSkeleton';
import useMfm from '../../hooks/useMfm';
import ExplainOutput from '../explanation/ExplainOutput';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { RepliedStatusFragment } from './_static';
import useAppNavigator from '../../../states/useAppNavigator';
import EmojiReactions from './fragments/EmojiReactions';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import SharedStatusFragment from './fragments/SharedStatusFragment';

/**
 * This is the individual status component (without the re-blogger info)
 */
const RootStatusFragment = memo(function Foo() {
	const { toPost } = useAppNavigator();
	const { domain, subdomain } = useActivityPubRestClientContext();

	const { status, sharedStatus } = useActivitypubStatusContext();

	const IS_REPOST = status?.isReposted();
	const IS_REPLY_OR_BOOST = status?.isReposted() || status?.isReply();
	const _status = IS_REPOST ? sharedStatus : status;
	const statusContent = _status?.getContent();

	const [PosterContent, setPosterContent] = useState(null);
	const [ExplanationObject, setExplanationObject] = useState<string | null>(
		null,
	);
	const [ShowSensitiveContent, setShowSensitiveContent] = useState(false);

	const userI = useMemo(() => {
		return ActivityPubUserAdapter(_status?.getUser() || null, domain);
	}, [_status]);

	useEffect(() => {
		// reset
		setExplanationObject(null);

		const user = _status.getUser();
		setPosterContent(
			<WithActivitypubUserContext user={user}>
				<OriginalPoster
					id={_status?.getAccountId_Poster()}
					avatarUrl={_status?.getAvatarUrl()}
					displayName={_status?.getDisplayName()}
					createdAt={_status?.getCreatedAt()}
					username={_status?.getUsername()}
					subdomain={subdomain}
					visibility={_status?.getVisibility()}
					accountUrl={_status?.getAccountUrl(subdomain)}
				/>
			</WithActivitypubUserContext>,
		);
	}, [_status]);

	const {
		content: PostContent,
		aiContext,
		isLoaded,
	} = useMfm({
		content: statusContent,
		remoteSubdomain: userI?.getInstanceUrl(),
		emojiMap: userI?.getEmojiMap(),
		deps: [statusContent, !userI?.getInstanceUrl()],
	});

	const isSensitive = _status?.getIsSensitive();
	const spoilerText = _status?.getSpoilerText();

	const onSpoilerClick = useCallback(() => {
		setShowSensitiveContent((o) => !o);
	}, []);

	return useMemo(() => {
		if (
			(statusContent !== '' && statusContent !== null && !isLoaded) ||
			!PosterContent
		) {
			return <StatusItemSkeleton />;
		}

		return (
			<>
				<TouchableOpacity
					delayPressIn={100}
					onPress={() => {
						toPost(_status.getId());
					}}
				>
					<View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								marginBottom: 8,
								position: 'relative',
							}}
						>
							{PosterContent}
							<Entypo name="cross" size={28} color={APP_FONT.MONTSERRAT_BODY} />
						</View>

						{isSensitive && spoilerText && (
							<View>
								<View
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									<View style={{ width: 24 }}>
										<FontAwesome
											name="warning"
											size={18}
											color="yellow"
											style={{ opacity: 0.6 }}
										/>
									</View>
									<View style={{ marginLeft: 0, maxWidth: '90%' }}>
										{spoilerText && (
											<Text
												style={{
													fontFamily: 'Inter-Bold',
													color: 'yellow',
													opacity: 0.6,
												}}
											>
												{spoilerText}
											</Text>
										)}
									</View>
								</View>

								<View style={sensitive.toggleHideContainer}>
									<Divider style={{ flex: 1, flexGrow: 1, opacity: 0.6 }} />
									<Pressable
										style={sensitive.toggleHidePressableAreaContainer}
										onPress={onSpoilerClick}
									>
										<Text style={sensitive.toggleHideText}>
											{ShowSensitiveContent
												? 'Hide Sensitive'
												: 'Show' + ' Sensitive'}
										</Text>
										<View style={{ width: 24, marginLeft: 4 }}>
											<FontAwesome5
												name="eye-slash"
												size={18}
												color={APP_FONT.MONTSERRAT_BODY}
											/>
										</View>
									</Pressable>
									<Divider style={{ flex: 1, flexGrow: 1, opacity: 0.6 }} />
								</View>
							</View>
						)}

						{isSensitive && !spoilerText && (
							<View>
								<View
									style={{
										marginHorizontal: 'auto',
										alignItems: 'center',
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'center',
										width: '100%',
										marginBottom: 8,
									}}
								>
									<Divider style={{ flex: 1, flexGrow: 1, opacity: 0.6 }} />
									<Pressable
										style={{
											flexShrink: 1,
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											paddingHorizontal: 8,
											paddingVertical: 8,
										}}
										onPress={onSpoilerClick}
									>
										<View style={{ width: 24 }}>
											<FontAwesome
												name="warning"
												size={24}
												color="yellow"
												style={{ opacity: 0.6 }}
											/>
										</View>
										<View style={{ marginLeft: 4 }}>
											<Text
												style={{
													color: APP_FONT.MONTSERRAT_BODY,
													// backgroundColor: "red",
													flexShrink: 1,
													textAlign: 'center',
													fontSize: 16,
													fontFamily: 'Montserrat-Bold',
												}}
											>
												{ShowSensitiveContent
													? 'Hide Sensitive'
													: 'Show' + ' Sensitive'}
											</Text>
										</View>
										<View style={{ width: 24, marginLeft: 4 }}>
											<FontAwesome5
												name="eye-slash"
												size={18}
												color={APP_FONT.MONTSERRAT_BODY}
											/>
										</View>
									</Pressable>
									<Divider style={{ flex: 1, flexGrow: 1, opacity: 0.6 }} />
								</View>
							</View>
						)}

						{isSensitive && !ShowSensitiveContent ? (
							<View></View>
						) : (
							<View>
								{PostContent}
								{ExplanationObject !== null && (
									<ExplainOutput
										additionalInfo={'Translated using OpenAI'}
										fromLang={'jp'}
										toLang={'en'}
										text={ExplanationObject}
									/>
								)}
							</View>
						)}
					</View>
				</TouchableOpacity>
				{isSensitive && !ShowSensitiveContent ? (
					<View></View>
				) : (
					<MediaItem attachments={_status?.getMediaAttachments()} />
				)}
				<EmojiReactions />
				<StatusInteraction
					openAiContext={aiContext}
					setExplanationObject={setExplanationObject}
					ExplanationObject={ExplanationObject}
					isRepost={IS_REPOST}
				/>
			</>
		);
	}, [
		isLoaded,
		_status,
		ShowSensitiveContent,
		ExplanationObject,
		PosterContent,
	]);
});

export function RootFragmentContainer() {
	const { status: _status } = useActivitypubStatusContext();
	if (!_status?.isValid()) return <View></View>;

	const IS_REPLY_OR_BOOST = _status?.isReply() || _status?.isReposted();

	return (
		<View
			style={{
				padding: 10,
				paddingTop: IS_REPLY_OR_BOOST ? 4 : 10,
				paddingBottom: 4,
				backgroundColor: APP_THEME.DARK_THEME_STATUS_BG,
				marginBottom: 4,
				borderRadius: 8,
				borderTopLeftRadius: IS_REPLY_OR_BOOST ? 0 : 8,
				borderTopRightRadius: IS_REPLY_OR_BOOST ? 0 : 8,
			}}
		>
			<RootStatusFragment />
		</View>
	);
}

/**
 * Renders a status/note
 * @constructor
 */
const StatusItem = memo(function Foo() {
	const { primaryAcct } = useActivityPubRestClientContext();
	const { status: _status, sharedStatus } = useActivitypubStatusContext();

	return useMemo(() => {
		switch (primaryAcct.domain) {
			case KNOWN_SOFTWARE.MASTODON:
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.MEISSKEY:
			case KNOWN_SOFTWARE.KMYBLUE:
			case KNOWN_SOFTWARE.SHARKEY:
			case KNOWN_SOFTWARE.CHERRYPICK: {
				return (
					<Fragment>
						{_status.isReposted() && <SharedStatusFragment />}
						{_status.isReposted() && sharedStatus.isReply() && (
							<RepliedStatusFragment />
						)}
						{_status.isReply() && <RepliedStatusFragment />}
						<RootFragmentContainer />
					</Fragment>
				);
			}
			default: {
				return <View></View>;
			}
		}
	}, [_status, primaryAcct]);
});

export default StatusItem;

const sensitive = StyleSheet.create({
	toggleHideContainer: {
		marginHorizontal: 'auto',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
		marginBottom: 8,
	},
	toggleHideText: {
		color: APP_FONT.MONTSERRAT_BODY,
		flexShrink: 1,
		textAlign: 'center',
		fontSize: 16,
		fontFamily: 'Montserrat-Bold',
	},
	toggleHidePressableAreaContainer: {
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
});
