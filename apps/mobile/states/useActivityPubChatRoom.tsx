import { StatusInterface, UserInterface } from '@dhaaga/bridge';
import { createContext, useContext, useEffect, useState } from 'react';
import useGlobalState from './_global';
import { useShallow } from 'zustand/react/shallow';

type Type = {
	participants: UserInterface[];
	messages: StatusInterface[];
	/**
	 * Oldest status fetched, against each conversation id
	 */
	tails: StatusInterface[];
	/**
	 * Latest status fetched, against each conversation id
	 */
	heads: StatusInterface[];
	/**
	 * Color allocated to each conversation thread
	 */
	colors: string[];
	chatroomName: string;

	/**
	 * Need both the ids and tail statuses, because mastodon does
	 * not allow querying via conversation id
	 * @param ids list of chatroom ids
	 * @param items
	 */
	setHeads: (ids: string[], items: StatusInterface[]) => void;
};

const defaultValue: Type = {
	participants: [],
	messages: [],
	tails: [],
	heads: [],
	colors: [],
	chatroomName: '',
	setHeads: function (ids: string[], items: StatusInterface[]): void {
		throw new Error('Function not implemented.');
	},
};

const ActivitypubChatRoomContext = createContext<Type>(defaultValue);

export function useActivitypubChatRoomContext() {
	return useContext(ActivitypubChatRoomContext);
}

type Props = {
	participants: UserInterface[];
	tails: StatusInterface[];
	children: any;
};

function WithActivitypubChatRoomContext({
	participants,
	tails,
	children,
}: Props) {
	const [Messages, setMessages] = useState<StatusInterface[]>([]);
	const [Participants, setParticipants] = useState<UserInterface[]>([]);
	const [Tails, setTails] = useState([]);
	const [Heads, setHeads] = useState([]);

	const { client } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			me: o.me,
		})),
	);

	useEffect(() => {
		if (!client) return;
	}, [client, participants, tails]);

	function setHeadsWithData(ids: string[], items: StatusInterface[]) {
		if (ids.length !== items.length) {
			console.warn('[WARN]: length mismatch while setting up the chatroom');
		}
		console.log('[INFO]: loading chatroom with', ids);
	}

	return (
		<ActivitypubChatRoomContext.Provider
			value={{
				chatroomName: '',
				setHeads: setHeadsWithData,
				colors: [],
				heads: Heads,
				tails: Tails,
				messages: Messages,
				participants: Participants,
			}}
		>
			{children}
		</ActivitypubChatRoomContext.Provider>
	);
}

export default WithActivitypubChatRoomContext;
