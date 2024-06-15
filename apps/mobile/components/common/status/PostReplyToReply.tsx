import { useActivitypubStatusContext } from '../../../states/useStatus';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityPubUserAdapter } from '@dhaaga/shared-abstraction-activitypub/src';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import useMfm from '../../hooks/useMfm';
import WithActivitypubUserContext from '../../../states/useProfile';
import ReplyOwner from '../user/ReplyOwner';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONT, APP_THEME } from '../../../styles/AppTheme';
import { Text } from '@rneui/themed';
import StyleService from '../../../services/style.service';

type PostReplyToReplyProps = {
	colors: string[];
	lookupId: string;
};

type PostReplyToReplyContentProps = {
	lookupId: string;
	color: React.MutableRefObject<string>;
	IsReplyThreadVisible: boolean;
	setIsReplyThreadVisible: any;
};

function PostReplyToReplyContent({
	lookupId,
	color,
	IsReplyThreadVisible,
	setIsReplyThreadVisible,
}: PostReplyToReplyContentProps) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const { contextItemLookup, stateKey } = useActivitypubStatusContext();

	const status = useMemo(() => {
		return contextItemLookup.current?.get(lookupId);
	}, [lookupId, stateKey]);

	const userI = useMemo(() => {
		return ActivityPubUserAdapter(status?.getUser() || null, domain);
	}, [status]);

	const replyCount = status?.getRepliesCount();

	const [IsMediaShown, setIsMediaShown] = useState(false);

	function toggleMediaVisibility() {
		setIsMediaShown(!IsMediaShown);
	}

	function toggleReplyVisibility() {
		setIsReplyThreadVisible(!IsReplyThreadVisible);
	}

	const { content, aiContext, isLoaded } = useMfm({
		content: status?.getContent(),
		remoteSubdomain: userI?.getInstanceUrl(),
		emojiMap: userI?.getEmojiMap(),
		deps: [status?.getContent(), !userI?.getInstanceUrl()],
	});

	return (
		<View
			style={{
				marginTop: 8,
				backgroundColor: '#1e1e1e',
				padding: 8,
				paddingBottom: 0,
			}}
		>
			<WithActivitypubUserContext userI={userI}>
				<ReplyOwner />
				{content}

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
			</WithActivitypubUserContext>
		</View>
	);
}

function PostReplyToReply({ colors, lookupId }: PostReplyToReplyProps) {
	const { contextChildrenLookup, contextItemLookup } =
		useActivitypubStatusContext();

	const status = useMemo(() => {
		return contextItemLookup.current.get(lookupId);
	}, [lookupId]);

	const children = useMemo(() => {
		if (!contextChildrenLookup.current) return [];
		return contextChildrenLookup.current?.get(status?.getId()) || [];
	}, [status?.getId()]);

	const [IsReplyThreadVisible, setIsReplyThreadVisible] = useState(false);

	const color = useRef(StyleService.generateRandomColorHex());
	// console.log(color.current);

	useEffect(() => {
		if (IsReplyThreadVisible) {
			console.log('flipped', color.current);
		}
	}, [IsReplyThreadVisible]);

	return (
		<View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					marginVertical: 8,
					marginLeft: 6,
					borderRadius: 8,
				}}
			>
				{colors.map((o, i) => (
					<View
						key={i}
						style={{ height: '100%', width: 2, backgroundColor: o }}
					></View>
				))}
				<PostReplyToReplyContent
					color={color}
					lookupId={lookupId}
					IsReplyThreadVisible={IsReplyThreadVisible}
					setIsReplyThreadVisible={setIsReplyThreadVisible}
				/>
			</View>
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

export default PostReplyToReply;
