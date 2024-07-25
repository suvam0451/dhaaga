import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../states/usePagination';
import { useQuery } from '@tanstack/react-query';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { useEffect } from 'react';
import { ActivityPubUserAdapter } from '@dhaaga/shared-abstraction-activitypub';
import { ScrollView, View } from 'react-native';
import { useQuery as useRealmQuery } from '@realm/react';
import { useRealm } from '@realm/react';
import CryptoService from '../../../services/crypto.service';
import { ActivityPubChatRoom } from '../../../entities/activitypub-chatroom.entity';
import ChatroomPreview from './fragments/dm/ChatroomPreviewType';
import ChatroomService from '../../../services/chatroom.service';
import { Text } from '@rneui/themed';
import { Divider } from '@rneui/base';
import WithAutoHideTopNavBar from '../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';

function WithApi() {
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const _domain = primaryAcct?.domain;
	const _subdomain = primaryAcct?.subdomain;

	const { me, meRaw } = useActivityPubRestClientContext();
	const {
		data: PageData,
		updateQueryCache,
		append,
	} = useAppPaginationContext();
	const db = useRealm();
	const chatrooms = useRealmQuery(ActivityPubChatRoom).filter(
		(o) => o.me.userId === me?.getId(),
	);

	async function api() {
		if (!client) {
			return [];
		}
		const data: mastodon.v1.Conversation[] = await client.getMyConversations();
		return data;
	}

	// Queries
	const { status, data, refetch, fetchStatus } = useQuery<
		mastodon.v1.Conversation[] | any[]
	>({
		queryKey: ['conversations'],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching') return;
		if (status !== 'success') return;
		append(data, (o: mastodon.v1.Conversation) => o.id);
	}, [fetchStatus]);

	async function populateChatrooms() {
		if (!me) return;

		for await (const _item of PageData) {
			const item: mastodon.v1.Conversation = _item;
			const participantIds = [
				// @ts-ignore
				...new Set(
					item.accounts.map((o) => ActivityPubUserAdapter(o, _domain).getId()),
				),
			].sort((a, b) => a.localeCompare(b));
			// User is also a participant
			const myId = me.getId();
			if (!participantIds.includes(myId)) {
				participantIds.push(myId);
				item.accounts.push(meRaw);
			}
			const hash = await CryptoService.hashUserList(participantIds);
			ChatroomService.upsertConversation(db, {
				me,
				hash,
				subdomain: _subdomain,
				domain: _domain,
				conversation: item,
			});
		}
	}

	useEffect(() => {
		populateChatrooms();
	}, [PageData]);

	async function onRefresh() {
		refetch();
	}

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: PageData.length,
		updateQueryCache,
	});

	return (
		<WithAutoHideTopNavBar title={'My Conversations'} translateY={translateY}>
			<ScrollView style={{ marginTop: 54 }}>
				<View style={{ paddingHorizontal: 12, paddingTop: 16 }}>
					<Text
						style={{
							fontSize: 28,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: 'rgba(255, 255, 255, 0.87)',
						}}
					>
						Your private chat
					</Text>
					<Divider style={{ height: 8, opacity: 0.3 }} width={2} />
				</View>
				<View style={{ paddingVertical: 8, paddingHorizontal: 8 }}>
					{chatrooms.map((o, i) => (
						<ChatroomPreview roomId={o._id} key={i} modeFilter={'me'} />
					))}
				</View>
				<View style={{ paddingHorizontal: 12, paddingTop: 16 }}>
					<Text
						style={{
							fontSize: 28,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
					>
						Your DMs
					</Text>
					<Divider style={{ height: 8, opacity: 0.3 }} width={2} />
				</View>
				<View style={{ paddingVertical: 8, paddingHorizontal: 8 }}>
					{chatrooms.map((o, i) => (
						<ChatroomPreview roomId={o._id} key={i} modeFilter={'dm'} />
					))}
				</View>

				<View style={{ paddingVertical: 8, paddingHorizontal: 8 }}>
					{chatrooms.map((o, i) => (
						<ChatroomPreview roomId={o._id} key={i} modeFilter={'group'} />
					))}
				</View>
			</ScrollView>
		</WithAutoHideTopNavBar>
	);
}

function WithContexts() {
	return (
		<WithAppPaginationContext>
			<WithApi />
		</WithAppPaginationContext>
	);
}

/**
 * This Screen lists the direct conversations
 * of the user.
 * @constructor
 */
function DirectMessaging() {
	return <WithContexts />;
}

export default DirectMessaging;
