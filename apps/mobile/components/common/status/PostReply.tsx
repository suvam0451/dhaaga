import { useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ExplainOutput from '../explanation/ExplainOutput';
import ImageCarousal from '../../../screens/timelines/fragments/ImageCarousal';
import WithActivitypubStatusContext, {
	useActivitypubStatusContext,
} from '../../../states/useStatus';
import { ActivityPubUserAdapter } from '@dhaaga/shared-abstraction-activitypub/src';
import useMfm from '../../hooks/useMfm';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { Text } from '@rneui/themed';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONT, APP_THEME } from '../../../styles/AppTheme';
import WithActivitypubUserContext from '../../../states/useProfile';
import ReplyOwner from '../user/ReplyOwner';
import PostReplyToReply from './PostReplyToReply';

type PostReplyProps = {
	lookupId: string;
};

function PostReplyContent({ lookupId }: PostReplyProps) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const { contextChildrenLookup, contextItemLookup } =
		useActivitypubStatusContext();

	const status = useMemo(() => {
		return contextItemLookup.current.get(lookupId);
	}, [lookupId]);

	const userI = useMemo(() => {
		return ActivityPubUserAdapter(status?.getUser() || null, domain);
	}, [status]);

	const [ExplanationObject, setExplanationObject] = useState<string | null>(
		null,
	);

	const children = useMemo(() => {
		if (!contextChildrenLookup.current) return [];
		return contextChildrenLookup.current?.get(status?.getId()) || [];
	}, [status?.getId()]);

	const { content } = useMfm({
		content: status?.getContent(),
		remoteSubdomain: userI?.getInstanceUrl(),
		emojiMap: userI?.getEmojiMap(),
		deps: [status?.getContent(), !userI?.getInstanceUrl()],
	});

	const [IsMediaShown, setIsMediaShown] = useState(false);
	const [IsReplyThreadVisible, setIsReplyThreadVisible] = useState(false);

	const replyCount = status?.getRepliesCount();
	const mediaCount = status?.getMediaAttachments()?.length;

	function toggleMediaVisibility() {
		setIsMediaShown(!IsMediaShown);
	}

	function toggleReplyVisibility() {
		setIsReplyThreadVisible(!IsReplyThreadVisible);
	}

	const color = useRef(APP_THEME.COLOR_SCHEME_C);
	return (
		<View style={{ marginTop: 8, backgroundColor: '#1e1e1e', padding: 8 }}>
			<WithActivitypubUserContext userI={userI}>
				<ReplyOwner />
			</WithActivitypubUserContext>
			{content}
			{ExplanationObject !== null && (
				<ExplainOutput
					additionalInfo={'Translated using OpenAI'}
					fromLang={'jp'}
					toLang={'en'}
					text={ExplanationObject}
				/>
			)}
			{IsMediaShown && (
				<ImageCarousal attachments={status?.getMediaAttachments()} />
			)}
			<View
				style={{
					paddingTop: 8,
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
				}}
			>
				<View style={{ flexShrink: 1, marginRight: 4 }}>
					{replyCount > 0 && (
						<TouchableOpacity
							style={styles.actionButton}
							onPress={toggleReplyVisibility}
						>
							<View style={{ width: 24 }}>
								{IsReplyThreadVisible ? (
									<FontAwesome6
										name="square-minus"
										size={20}
										color={
											IsReplyThreadVisible
												? color.current
												: APP_FONT.MONTSERRAT_BODY
										}
									/>
								) : (
									<FontAwesome6
										name="plus-square"
										size={20}
										color={
											IsReplyThreadVisible
												? color.current
												: APP_FONT.MONTSERRAT_BODY
										}
									/>
								)}
							</View>
							<View>
								<Text
									style={{
										color: IsReplyThreadVisible
											? color.current
											: APP_FONT.MONTSERRAT_BODY,
									}}
								>
									{replyCount} replies
								</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
				<View style={{ flexShrink: 1 }}>
					{mediaCount > 0 && (
						<TouchableOpacity
							style={styles.actionButton}
							onPress={toggleMediaVisibility}
						>
							<View style={{ width: 24 }}>
								<FontAwesome6
									name="image"
									size={20}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							</View>
							{IsMediaShown ? (
								<Text
									style={{ color: APP_FONT.MONTSERRAT_BODY, marginLeft: 4 }}
								>
									Shown ({mediaCount})
								</Text>
							) : (
								<Text
									style={{ color: APP_FONT.MONTSERRAT_BODY, marginLeft: 4 }}
								>
									Hidden ({mediaCount})
								</Text>
							)}
						</TouchableOpacity>
					)}
				</View>
			</View>
			{/*	Reply Thread*/}
			{IsReplyThreadVisible && (
				<View>
					{children.map((o, i) => (
						<PostReplyToReply
							key={i}
							colors={[color.current]}
							lookupId={o.getId()}
						/>
					))}
				</View>
			)}
		</View>
	);
}

/**
 * Direct reply to a root level post
 *
 * Must be wrapped with by
 * WithActivitypubStatusContext
 * @constructor
 */
function PostReply({ lookupId }: PostReplyProps) {
	return <PostReplyContent lookupId={lookupId} />;
}

const styles = StyleSheet.create({
	actionButton: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		// backgroundColor: 'red',
		paddingHorizontal: 8,
		marginLeft: -8,
		paddingVertical: 6,
		borderRadius: 8,
	},
});
export default PostReply;
