import {
	TagInterface,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
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

export type ComposeMediaTargetItem = {
	previewUrl?: string;
	remoteId?: string;
	url?: string;
	uploaded: boolean;
	localUri: string;
	status?: string;
	cw?: string;
};

type KeyboardSelection = { start: number; end: number };
type Type = {
	editMode: 'txt' | 'alt' | 'misc';
	setEditMode: React.Dispatch<React.SetStateAction<'txt' | 'alt' | 'misc'>>;
	cw: string;
	setCw: React.Dispatch<React.SetStateAction<string>>;
	cwShown: boolean;
	setAltText: (index: number, o: string) => void;
	setCwShown: React.Dispatch<React.SetStateAction<boolean>>;
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

	// media items to track upload for
	mediaTargets: ComposeMediaTargetItem[];
	addMediaTarget: ({}: {
		localUri: string;
		uploaded: boolean;
		remoteId: string;
		previewUrl?: string;
	}) => void;
	removeMediaTarget: (index: number) => void;
};

const defaultValue: Type = {
	editMode: 'txt',
	setEditMode: () => {},
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
	editorText: <Text />,
	setEditorText: () => {},
	selection: {
		start: 0,
		end: 0,
	},
	setSelection: () => {},

	// media items to track upload for
	mediaTargets: [],
	addMediaTarget: () => {},
	removeMediaTarget: () => {},
	cw: '',
	cwShown: false,
	setCwShown: () => {},
	setCw: () => {},
	setAltText: () => {},
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
	const [Cw, setCw] = useState('');
	const [CwSectionShown, setCwSectionShown] = useState(false);
	const [EditMode, setEditMode] = useState<'txt' | 'alt' | 'misc'>('txt');
	const [AutoCompletion, setAutoCompletion] = useState<ComposerAutocompletion>({
		accounts: [],
		emojis: [],
		hashtags: [],
	});
	const [Selection, setSelection] = useState<KeyboardSelection>({
		start: 0,
		end: 0,
	});

	/**
	 * Media Targets
	 */
	const [MediaTargets, setMediaTargets] = useState<ComposeMediaTargetItem[]>(
		[],
	);
	const addMediaTarget = useCallback(
		({
			localUri,
			uploaded,
			remoteId,
			previewUrl,
		}: {
			localUri: string;
			uploaded: boolean;
			remoteId: string;
			previewUrl?: string;
		}) => {
			setMediaTargets((o) =>
				o.concat([
					{
						localUri,
						uploaded: uploaded || false,
						remoteId,
						previewUrl,
					},
				]),
			);
		},
		[],
	);

	const removeMediaTarget = useCallback((index: number) => {
		setMediaTargets((o) => [...o.slice(0, index), ...o.slice(index + 1)]);
	}, []);

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

	function setAltText(index: number, text: string) {
		if (index >= MediaTargets.length) return;

		MediaTargets[index].cw = text;
		setMediaTargets(MediaTargets);
	}

	return (
		<ComposerContext.Provider
			value={{
				editMode: EditMode,
				setEditMode,
				cw: Cw,
				setCw,
				setAltText,
				cwShown: CwSectionShown,
				setCwShown: setCwSectionShown,
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
				mediaTargets: MediaTargets,
				addMediaTarget,
				removeMediaTarget,
			}}
		>
			{children}
		</ComposerContext.Provider>
	);
}

export default WithComposerContext;
