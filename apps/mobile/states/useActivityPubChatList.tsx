import { PostTargetInterface, UserTargetInterface } from '@dhaaga/bridge';
import { createContext, useContext, useMemo, useState } from 'react';

type AppConversationDTO = {
	id: string;
	participants: UserTargetInterface[];
	tail: PostTargetInterface;
};

type ActivityPubChatRoomDTO = {
	id: string;
	participants: UserTargetInterface[];
	tails: PostTargetInterface[];
	conversationIds: string[];
	conversationIdsSeen: Set<string>;
};

type Type = {
	/**
	 * A conversation contains a list of participants
	 */
	conversations: {
		id: string;
		participants: UserTargetInterface[];
		tail: PostTargetInterface;
		roomId: number;
	}[] /**
	 *
	 */;
	rooms: {
		id: number;
		participants: UserTargetInterface[]; // tail: PostTargetInterface
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

	const SeenRooms = useMemo(() => {
		return new Map<string, ActivityPubChatRoomDTO>();
	}, []);

	async function loadConversations(items: AppConversationDTO[]) {
		for (const item of items) {
			const participantIds = [
				// @ts-ignore-next-line
				...new Set(item.participants.map((o) => o.getId())),
			].sort((a, b) => a.localeCompare(b));
			const hash = ''; // await CryptoService.hashUserList(participantIds);

			if (SeenRooms.has(hash)) {
				const _hash = SeenRooms.get(hash)!;
				if (!_hash.conversationIdsSeen.has(item.id)) {
					_hash.conversationIdsSeen.add(item.id);
					_hash.conversationIds.push(item.tail.getId());
					_hash.tails.push(item.tail);
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
