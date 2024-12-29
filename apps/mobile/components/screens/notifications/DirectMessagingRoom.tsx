import { useQuery } from '@tanstack/react-query';
import WithActivitypubStatusContext, {
	useActivitypubStatusContext,
} from '../../../states/useStatus';
import { useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ActivitypubProviderService from '../../../services/activitypub-provider.service';
import ActivityPubProviderService from '../../../services/activitypub-provider.service';
import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';
import ChatItem from './fragments/dm/ChatItem';
import { Input } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT, APP_THEME } from '../../../styles/AppTheme';
import WithAutoHideTopNavBar from '../../containers/WithAutoHideTopNavBar';
import useTopbarSmoothTranslate from '../../../states/useTopbarSmoothTranslate';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_BOTTOM_SHEET_ENUM } from '../../dhaaga-bottom-sheet/Core';
import { MastoConversation } from '@dhaaga/shared-abstraction-activitypub/dist/types/mastojs.types';

type DirectMessagingRoomProps = {
	conversationIds: string[];
};

function WithContextWrapped() {
	const { client } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
		})),
	);
	const { setStatusContextData } = useActivitypubStatusContext();
	const route = useRoute<any>();
	const q = route?.params?.id;

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.statuses.getContext(q);
		return data;
	}

	// Queries
	const { status, data, refetch, fetchStatus } = useQuery<
		MastoConversation[] | any[]
	>({
		queryKey: ['conversation/context', q],
		queryFn: api as any,
		enabled: client !== null,
	});

	useEffect(() => {
		if (status === 'success') {
			setStatusContextData(data);
		}
	}, [status, fetchStatus]);

	return <View></View>;
}

type ChatItemPointer = {
	id: string;
	parentId: string;
	parentAcctId: string;
	createdAt: Date;
	conversationId: string;
};

function DirectMessagingRoom() {
	const { client, driver } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
		})),
	);

	const route = useRoute<any>();
	const roomId = route?.params?.roomId;

	// const chatroom = useObject(ActivityPubChatRoom, roomId);
	const [LatestStatuses, setLatestStatuses] = useState<string[]>([]);
	const [MessageHistory, setMessageHistory] = useState<StatusInterface[]>([]);

	const [ChatHistory, setChatHistory] = useState<ChatItemPointer[]>([]);
	const { show } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
		})),
	);

	const conversationMapper = useMemo(() => {
		return new Map<string, string>();
	}, [roomId]);

	function onComposerRequested() {
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER);
	}

	useEffect(() => {
		// const latestStatuses = chatroom.conversations.map(
		// 	(o) => o.latestStatus.statusId,
		// );
		// let needsReevaluation = false;
		// for (let i = 0; i < latestStatuses.length; i++) {
		// 	if (!LatestStatuses.includes(latestStatuses[i])) {
		// 		needsReevaluation = true;
		// 		break;
		// 	}
		// }
		// if (LatestStatuses.length !== latestStatuses.length)
		// 	needsReevaluation = true;
		//
		// if (needsReevaluation) {
		// 	setLatestStatuses(latestStatuses);
		// }
	}, [roomId]);

	function resolveHistory(input: ChatItemPointer[]) {
		input = input.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
		setChatHistory(input);
	}

	useEffect(() => {
		const promises = [];
		for (let i = 0; i < LatestStatuses.length; i++) {
			promises.push(
				ActivityPubProviderService.getStatusAsArray(client, LatestStatuses[i]),
			);
			promises.push(
				ActivitypubProviderService.getStatusContext(client, LatestStatuses[i]),
			);
		}

		Promise.all(promises)
			.then(async (res) => {
				let statuses = [];
				/**
				 * For each conversation, we make two requests.
				 * One for the context chain. One for the status itself.
				 */
				let count = 0;
				conversationMapper.clear();
				for await (const item of res) {
					if (item.ancestors !== undefined) {
						const interfaces = ActivityPubAdapterService.adaptContextChain(
							item,
							driver,
						);
						statuses = statuses.concat(interfaces);
						// for (let i = 0; i < interfaces.length; i++)
						// 	conversationMapper.set(
						// 		interfaces[i].getId(),
						// 		chatroom.conversations[count % 2].conversationId,
						// 	);
					} else {
						const interfaces = ActivityPubAdapterService.adaptManyStatuses(
							item,
							driver,
						);
						// for (let i = 0; i < interfaces.length; i++)
						// 	conversationMapper.set(
						// 		interfaces[i].getId(),
						// 		chatroom.conversations[count % 2].conversationId,
						// 	);

						statuses = statuses.concat(interfaces);
					}
					count++;
				}
				setMessageHistory(statuses);
			})
			.catch((e) => {
				console.log('[ERROR]: populating chatroom history', e);
			});
	}, [LatestStatuses]);

	useEffect(() => {
		resolveHistory(
			MessageHistory.map((o) => ({
				id: o.getId(),
				parentId: o.getParentStatusId(),
				parentAcctId: o.getUserIdParentStatusUserId(),
				createdAt: new Date(o.getCreatedAt()),
				conversationId: conversationMapper.get(o.getId()),
			})),
		);
	}, [MessageHistory]);

	const { onScroll, translateY } = useTopbarSmoothTranslate({
		onScrollJsFn: () => {},
		totalHeight: 100,
		hiddenHeight: 50,
	});

	// @ts-ignore
	return (
		<WithAutoHideTopNavBar title={'Your Conversation'} translateY={translateY}>
			<View style={styles.container}>
				<View style={{ flexGrow: 1 }}></View>
				<View style={{ flexShrink: 1 }}>
					{ChatHistory.map((o, i) => (
						<View key={i} style={{ paddingHorizontal: 4 }}>
							<WithActivitypubStatusContext status={[]}>
								<ChatItem />
							</WithActivitypubStatusContext>
						</View>
					))}
				</View>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						maxWidth: '100%',
						height: 'auto',
						backgroundColor: '#1c1c1c',
						padding: 8,
						alignItems: 'flex-start',
						marginTop: 32,
					}}
				>
					<TouchableOpacity onPress={onComposerRequested}>
						<View
							style={{
								flexShrink: 1,
								display: 'flex',
								flexDirection: 'row',
								paddingTop: 8,
								minWidth: 20,
								backgroundColor: 'red',
							}}
						>
							<FontAwesome5.default
								name="plus"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</View>
					</TouchableOpacity>
					<View style={{ flexShrink: 1 }}>
						<Input
							/*@ts-ignore-next-line*/
							multiline={true}
							inputContainerStyle={{
								// borderRadius: 16,
								paddingLeft: 8,
								borderBottomWidth: 0,
							}}
							containerStyle={
								{
									// borderRadius: 16,
								}
							}
							inputStyle={{
								textDecorationLine: 'none',
							}}
							style={styles.inputStyle}
							placeholder={'Type Message here'}
						/>
					</View>
					<View
						style={{
							marginTop: 8,
						}}
					>
						<FontAwesome
							name="send"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</View>
			</View>
		</WithAutoHideTopNavBar>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		height: '100%',
		backgroundColor: APP_THEME.BACKGROUND,
	},
	inputStyle: {
		fontSize: 16,
		borderRadius: 8,
		paddingLeft: 8,
		marginBottom: -24,
		lineHeight: 24,
		backgroundColor: '#363636',
		textDecorationLine: 'none',
	},
});

export default DirectMessagingRoom;
