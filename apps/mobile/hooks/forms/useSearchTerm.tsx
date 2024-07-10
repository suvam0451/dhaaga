import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from 'react';

type Type = {
	searchText: string;
	setSearchText: Dispatch<SetStateAction<string>>;
	isResultLoading: boolean;
	setIsResultLoading: Dispatch<SetStateAction<boolean>>;
};

const defaultValue: Type = {
	setSearchText(value: ((prevState: string) => string) | string): void {},
	isResultLoading: false,
	searchText: '',
	setIsResultLoading(
		value: ((prevState: boolean) => boolean) | boolean,
	): void {},
};

const SearchTermContext = createContext<Type>(defaultValue);

export function useSearchTermContext() {
	return useContext(SearchTermContext);
}

type Props = {
	children: any;
};

/**
 * Used to
 * @param children
 * @constructor
 */
function WithSearchTermContext({ children }: Props) {
	const [SearchTerm, setSearchTerm] = useState('');
	const [IsResultLoading, setIsResultLoading] = useState(false);
	return (
		<SearchTermContext.Provider
			value={{
				searchText: SearchTerm,
				setSearchText: setSearchTerm,
				isResultLoading: IsResultLoading,
				setIsResultLoading: setIsResultLoading,
			}}
		>
			{children}
		</SearchTermContext.Provider>
	);
}

export default WithSearchTermContext;
