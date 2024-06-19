import { mastodon } from '@dhaaga/shared-provider-mastodon/src';
import { Pressable, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Divider, Skeleton, Text } from '@rneui/themed';
import { StandardView } from '../../../styles/Containers';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { formatDistanceToNowStrict } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import OriginalPoster from '../../post-fragments/OriginalPoster';
import { Note } from '@dhaaga/shared-provider-misskey/src';
import StatusInteraction from '../../../screens/timelines/fragments/StatusInteraction';
import ImageCarousal from '../../../screens/timelines/fragments/ImageCarousal';
import { useNavigation } from '@react-navigation/native';
import { useActivitypubStatusContext } from '../../../states/useStatus';
import MfmService from '../../../services/mfm.service';
import Status from '../../bottom-sheets/Status';
import { ActivityPubUserAdapter } from '@dhaaga/shared-abstraction-activitypub/src';
import { randomUUID } from 'expo-crypto';
import { useRealm } from '@realm/react';
import WithActivitypubUserContext from '../../../states/useProfile';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import activitypubAdapterService from '../../../services/activitypub-adapter.service';
import { APP_FONT, APP_THEME } from '../../../styles/AppTheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import ExplainOutput from '../explanation/ExplainOutput';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import StatusItemSkeleton from '../../skeletons/StatusItemSkeleton';
import useMfm from '../../hooks/useMfm';

const POST_SPACING_VALUE = 4;

type StatusItemProps = {
	// a list of color ribbons to indicate replies
	replyContextIndicators?: string[];
	hideReplyIndicator?: boolean;
};

type StatusFragmentProps = {
	// status: mastodon.v1.Status | Note;
	mt?: number;
	isRepost?: boolean;
} & StatusItemProps;

/**
 * This is the individual status component (without the re-blogger info)
 * @param status
 * @param mt
 * @constructor
 */
function RootStatusFragment({ mt, isRepost }: StatusFragmentProps) {
	const navigation = useNavigation<any>();
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const subdomain = primaryAcct?.subdomain;

	const { status, statusRaw, sharedStatus } = useActivitypubStatusContext();
	const _status = isRepost ? sharedStatus : status;
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
		const user = _status.getUser();
		setPosterContent(
			<WithActivitypubUserContext user={user}>
				<OriginalPoster
					id={_status.getAccountId_Poster()}
					avatarUrl={_status.getAvatarUrl()}
					displayName={_status.getDisplayName()}
					createdAt={_status.getCreatedAt()}
					username={_status.getUsername()}
					subdomain={subdomain}
					visibility={_status?.getVisibility()}
					accountUrl={_status.getAccountUrl()}
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

	const [BottomSheetVisible, setBottomSheetVisible] = useState(false);

	function statusActionListClicked() {
		setBottomSheetVisible(!BottomSheetVisible);
	}

	const isSensitive = status?.getIsSensitive();
	const spoilerText = status?.getSpoilerText();

	function onSpoilerClick() {
		setShowSensitiveContent(!ShowSensitiveContent);
	}

	return useMemo(() => {
		if ((statusContent !== '' && !isLoaded) || !PosterContent)
			return <StatusItemSkeleton />;
		return (
			<>
				<Status
					visible={BottomSheetVisible}
					setVisible={setBottomSheetVisible}
				/>
				<TouchableOpacity
					delayPressIn={100}
					onPress={() => {
						navigation.navigate('Post', {
							id: status.getId(),
						});
					}}
				>
					<View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								marginTop: mt === undefined ? 0 : mt,
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
											size={24}
											color="yellow"
											style={{ opacity: 0.6 }}
										/>
									</View>
									<View style={{ marginLeft: 8, maxWidth: '90%' }}>
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
							<View style={{ marginBottom: 0 }}>
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
					<ImageCarousal attachments={status?.getMediaAttachments()} />
				)}
				<StatusInteraction
					post={status}
					statusId={statusRaw?.id}
					openAiContext={aiContext}
					setExplanationObject={setExplanationObject}
					ExplanationObject={ExplanationObject}
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
}

export function RootFragmentContainer({
	mt,
	isRepost,
	replyContextIndicators,
}: StatusFragmentProps) {
	const replyIndicatorsPresent = replyContextIndicators?.length > 0;

	return (
		<View
			style={{
				padding: replyIndicatorsPresent ? 0 : 10,
				paddingBottom: 0,
				backgroundColor: APP_THEME.DARK_THEME_STATUS_BG,
				marginTop: mt == undefined ? 0 : mt,
				marginBottom: 4,
				borderRadius: 8,
			}}
		>
			{replyIndicatorsPresent ? (
				<View
					style={{
						borderLeftWidth: 2,
						borderLeftColor: 'red',
					}}
				>
					<View
						style={{
							paddingBottom: 4,
							padding: 10,
						}}
					>
						<RootStatusFragment
							mt={mt}
							isRepost={isRepost}
							replyContextIndicators={replyContextIndicators}
						/>
					</View>
				</View>
			) : (
				<View
					style={{
						paddingBottom: 4,
					}}
				>
					<RootStatusFragment
						mt={mt}
						isRepost={isRepost}
						replyContextIndicators={replyContextIndicators}
					/>
				</View>
			)}
		</View>
	);
}

/**
 * Adds parent thread's information on top
 *
 * NOTE: pass negative values to RootStatus margin
 * @constructor
 */
function RepliedStatusFragment() {
	const { status: _status, statusRaw: status } = useActivitypubStatusContext();
	if (!_status.isValid()) return <View></View>;

	return (
		<View
			style={{ backgroundColor: '#1e1e1e', marginBottom: POST_SPACING_VALUE }}
		>
			<StandardView
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: '#1e1e1e',
				}}
			>
				<Ionicons color={'#888'} name={'arrow-redo-outline'} size={12} />
				<Text style={{ color: '#888', fontWeight: '500', marginLeft: 4 }}>
					Continues a thread
				</Text>
			</StandardView>
			<RootFragmentContainer mt={-8} isRepost={false} />
		</View>
	);
}

/**
 * Adds booster's information on top
 *
 * NOTE: pass negative values to RootStatus margin
 * @param boostedStatus
 * @constructor
 */
function SharedStatusFragment({
	boostedStatus,
}: StatusFragmentProps & {
	postedBy: mastodon.v1.Account;
	boostedStatus: mastodon.v1.Status | Note;
}) {
	const { status: _status } = useActivitypubStatusContext();
	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;
	const domain = primaryAcct?.domain;
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const userI = useMemo(() => {
		return activitypubAdapterService.adaptUser(_status.getUser(), domain);
	}, [_status]);

	const ParsedDisplayName = useMemo(() => {
		const target = userI?.getDisplayName();
		if (target === '') return <View></View>;
		const { reactNodes } = MfmService.renderMfm(target, {
			emojiMap: new Map(),
			domain,
			subdomain,
			db,
			globalDb,
			remoteSubdomain: userI?.getInstanceUrl(),
		});
		return reactNodes?.map((para, i) => {
			const uuid = randomUUID();
			return (
				<Text
					key={uuid}
					style={{
						opacity: 0.6,
						color: '#888',
						fontFamily: 'Montserrat-ExtraBold',
					}}
				>
					{para.map((o, j) => (
						<Text key={j}>{o}</Text>
					))}
				</Text>
			);
		});
	}, [userI?.getDisplayName()]);

	return useMemo(() => {
		if (!_status.isValid()) return <View></View>;

		return (
			<View
				style={{
					backgroundColor: '#1e1e1e',
					marginBottom: POST_SPACING_VALUE,
				}}
			>
				<StandardView
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-start',
					}}
				>
					<Ionicons color={'#888'} name={'rocket-outline'} size={12} />
					<Text
						style={{
							color: '#888',
							fontWeight: '500',
							marginLeft: 4,
							fontFamily: 'Montserrat-ExtraBold',
							opacity: 0.6,
						}}
					>
						{ParsedDisplayName}
					</Text>
					<Text style={{ color: 'gray', marginLeft: 2, marginRight: 2 }}>
						•
					</Text>
					<View style={{ marginTop: 2 }}>
						<Text
							style={{
								color: '#888',
								fontSize: 12,
								fontFamily: 'Inter-Bold',
								opacity: 0.6,
							}}
						>
							{formatDistanceToNowStrict(new Date(boostedStatus?.createdAt))}
						</Text>
					</View>
				</StandardView>
				<RootFragmentContainer mt={-8} isRepost={true} />
			</View>
		);
	}, [_status, ParsedDisplayName]);
}

/**
 * Renders a status/note
 * @constructor
 */
function StatusItem({
	replyContextIndicators,
	hideReplyIndicator,
}: StatusItemProps) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const { status: _status, statusRaw } = useActivitypubStatusContext();

	return useMemo(() => {
		switch (domain) {
			case 'mastodon': {
				const _statusRaw = statusRaw as mastodon.v1.Status;
				if (_status && _status.isReposted() && !hideReplyIndicator) {
					return (
						<SharedStatusFragment
							isRepost={true}
							postedBy={_statusRaw?.reblog?.account}
							boostedStatus={_statusRaw?.reblog}
						/>
					);
				}
				if (_status && _status.isReply() && !hideReplyIndicator) {
					return <RepliedStatusFragment />;
				}

				return (
					<RootFragmentContainer
						replyContextIndicators={replyContextIndicators}
					/>
				);
			}
			case 'misskey': {
				if (_status && _status.isReposted() && !hideReplyIndicator) {
					const _status = statusRaw as Note;
					return (
						<SharedStatusFragment
							postedBy={_status.renote.user as any}
							isRepost={true}
							boostedStatus={_status}
						/>
					);
				}
				return (
					<RootFragmentContainer
						replyContextIndicators={replyContextIndicators}
					/>
				);
			}
			default: {
				return <View></View>;
			}
		}
	}, [_status, primaryAcct]);
}

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
