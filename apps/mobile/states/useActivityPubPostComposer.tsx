import { createContext, useContext, useState } from 'react';

type PostComposer_MediaAttachment = {
	order: number;
	uri: string;
	status: 'IDLE' | 'PENDING' | 'READY';
	remoteUrl: string | null;
};

type Type = {
	mediaAttachments: PostComposer_MediaAttachment[];
	addMediaAttachment: (uri: string) => void;
	removeMediaAttachment: (index: number) => void;
};

const defaultValue: Type = {
	mediaAttachments: [],
	addMediaAttachment: () => {},
	removeMediaAttachment: () => {},
};

const ActivityPubPostComposerContext = createContext<Type>(defaultValue);

export function useActivityPubPostComposerContext() {
	return useContext(ActivityPubPostComposerContext);
}

type Props = {
	children: any;
};

function WithActivityPubPostComposerContext({ children }: Props) {
	const [MediaAttachments, setMediaAttachments] = useState<
		PostComposer_MediaAttachment[]
	>([]);

	async function addMediaAttachment(uri: string) {
		const currentLength = MediaAttachments.length;
		setMediaAttachments(
			MediaAttachments.concat({
				order: currentLength + 1,
				uri,
				remoteUrl: null,
				status: 'PENDING',
			}),
		);
	}

	function removeMediaAttachment(index: number): void {
		setMediaAttachments(MediaAttachments.splice(index, 1));
	}

	return (
		<ActivityPubPostComposerContext.Provider
			value={{
				mediaAttachments: MediaAttachments,
				addMediaAttachment,
				removeMediaAttachment,
			}}
		>
			{children}
		</ActivityPubPostComposerContext.Provider>
	);
}

export default WithActivityPubPostComposerContext;
