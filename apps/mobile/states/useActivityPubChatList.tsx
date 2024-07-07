import {
	StatusInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { createContext, useContext, useMemo, useState } from 'react';
import CryptoService from '../services/crypto.service';
import { useRealm } from '@realm/react';
import { useActivityPubRestClientContext } from './useActivityPubRestClient';

type AppConversationDTO = {
	id: string;
	participants: UserInterface[];
	tail: StatusInterface;
};

type ActivityPubChatRoomDTO = {
	id: string;
	participants: UserInterface[];
	tails: StatusInterface[];
	conversationIds: string[];
	conversationIdsSeen: Set<string>;
};

type Type = {
	/**
	 * A conversation contains a list of participants
	 */
	conversations: {
		id: string;
		participants: UserInterface[];
		tail: StatusInterface;
		roomId: number;
	}[];
	/**
	 *
	 */
	rooms: {
		id: number;
		participants: UserInterface[];
		// tail: StatusInterface
		conversationIds: Set<number>;
	}[];
	loadConversations: (items: AppConversationDTO[]) => void;
};

const defaultValue: Type = {
	conversations: [],
	rooms: [],
	loadConversations: function (items: AppConversationDTO[]): void {
		throw new Error('Function not implemented.');
	},
};

const ActivitypubChatListContext = createContext<Type>(defaultValue);

export function useActivitypubChatListContext() {
	return useContext(ActivitypubChatListContext);
}

type Props = {
	children: any;
};

function WithActivitypubChatRoomContext({ children }: Props) {
	const [Conversations, setConversations] = useState([]);
	const [Rooms, setRooms] = useState([]);
	const realm = useRealm();
	const { me } = useActivityPubRestClientContext();

	const SeenRooms = useMemo(() => {
		return new Map<string, ActivityPubChatRoomDTO>();
	}, []);

	async function loadConversations(items: AppConversationDTO[]) {
		for (const item of items) {
			const participantIds = [
				// @ts-ignore-next-line
				...new Set(item.participants.map((o) => o.getId())),
			].sort((a, b) => a.localeCompare(b));
			const hash = await CryptoService.hashUserList(participantIds);

			if (SeenRooms.has(hash)) {
				if (!SeenRooms.get(hash).conversationIdsSeen.has(item.id)) {
					SeenRooms.get(hash).conversationIdsSeen.add(item.id);
					SeenRooms.get(hash).conversationIds.push(item.tail.getId());
					SeenRooms.get(hash).tails.push(item.tail);
				}
			} else {
				SeenRooms.set(hash, {
					conversationIds: [],
					id: item.id,
					tails: [],
					conversationIdsSeen: new Set(),
					participants: item.participants,
				});
			}
		}
	}

	return (
		<ActivitypubChatListContext.Provider
			value={{
				conversations: Conversations,
				rooms: Rooms,
				loadConversations,
			}}
		>
			{children}
		</ActivitypubChatListContext.Provider>
	);
}

export default WithActivitypubChatRoomContext;
