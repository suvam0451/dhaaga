import {
	TagInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Text } from 'react-native';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import { APP_POST_VISIBILITY } from '../../../../../hooks/app/useVisibility';

type ComposerAutocompletion = {
	accounts: UserInterface[];
	hashtags: TagInterface[];
	emojis: InstanceApi_CustomEmojiDTO[];
};

type ComposerAutoCompletionPrompt = {
	q: string;
	type: 'acct' | 'tag' | 'emoji' | 'none';
};

type KeyboardSelection = { start: number; end: number };
type Type = {
	rawText: string;
	setRawText: (rawText: string) => void;
	editorText: React.JSX.Element;
	setEditorText: (content: React.JSX.Element) => void;
	autoCompletion: ComposerAutocompletion;
	setAutoCompletion: (autoCompletion: ComposerAutocompletion) => void;
	visibility: APP_POST_VISIBILITY;
	setVisibility: (o: APP_POST_VISIBILITY) => void;
	autoCompletionPrompt: ComposerAutoCompletionPrompt;
	setAutoCompletionPrompt: (dto: ComposerAutoCompletionPrompt) => void;
	selection: KeyboardSelection;
	setSelection: (dto: KeyboardSelection) => void;
};

const defaultValue: Type = {
	autoCompletion: {
		accounts: [],
		hashtags: [],
		emojis: [],
	},
	setAutoCompletion: () => {},
	visibility: APP_POST_VISIBILITY.PUBLIC,
	setVisibility: () => {},
	autoCompletionPrompt: {
		q: '',
		type: 'acct',
	},
	setAutoCompletionPrompt: () => {},
	rawText: '',
	setRawText: () => {},
	editorText: undefined,
	setEditorText: () => {},
	selection: {
		start: 0,
		end: 0,
	},
	setSelection: () => {},
};

const ComposerContext = createContext<Type>(defaultValue);

export function useComposerContext() {
	return useContext(ComposerContext);
}

type Props = {
	children: any;
};

function WithComposerContext({ children }: Props) {
	const [RawText, setRawText] = useState('');
	const [EditorText, setEditorText] = useState(<Text></Text>);
	const [AutoCompletion, setAutoCompletion] = useState<ComposerAutocompletion>({
		accounts: [],
		emojis: [],
		hashtags: [],
	});
	const [Selection, setSelection] = useState<KeyboardSelection>({
		start: 0,
		end: 0,
	});

	const [AutoCompletionPrompt, setAutoCompletionPrompt] =
		useState<ComposerAutoCompletionPrompt>({
			q: '',
			type: 'none',
		});

	useEffect(() => {
		if (AutoCompletionPrompt.type === 'none') {
			setAutoCompletion({
				accounts: [],
				emojis: [],
				hashtags: [],
			});
		}
	}, [AutoCompletionPrompt]);
	const [DebouncedAutoCompletionPrompt] = useDebounce(
		AutoCompletionPrompt,
		200,
	);

	const [Visibility, setVisibility] = useState<APP_POST_VISIBILITY>(
		APP_POST_VISIBILITY.PUBLIC,
	);

	return (
		<ComposerContext.Provider
			value={{
				rawText: RawText,
				setRawText,
				editorText: EditorText,
				setEditorText,
				autoCompletion: AutoCompletion,
				setAutoCompletion,
				visibility: Visibility,
				setVisibility,
				autoCompletionPrompt: DebouncedAutoCompletionPrompt,
				setAutoCompletionPrompt: setAutoCompletionPrompt,
				selection: Selection,
				setSelection,
			}}
		>
			{children}
		</ComposerContext.Provider>
	);
}

export default WithComposerContext;
