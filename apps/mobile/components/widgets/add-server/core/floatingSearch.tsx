import { View } from 'react-native';
import { AppInputSimpleSearch } from '../../../lib/Inputs';
import { useEffect, useState } from 'react';
import { useSearchTermContext } from '../../../../hooks/forms/useSearchTerm';
import { useDebounce } from 'use-debounce';
import { useLocalAppMenuControllerContext } from '../../../../states/useLocalAppMenuController';

function KnownServerSearchWidget() {
	const { searchText, setIsResultLoading, setSearchText, isResultLoading } =
		useSearchTermContext();
	const { fabItemScale, isFabExpanded, setIsFabExpanded, activeMenu } =
		useLocalAppMenuControllerContext();

	const [Value, setValue] = useState('');

	const [searchInput] = useDebounce(Value, 200);
	useEffect(() => {
		setSearchText(searchInput);
	}, [searchInput]);

	return (
		<View
			style={{
				position: 'absolute',
				bottom: 0,
				backgroundColor: '#363636',
				marginHorizontal: 16,
				marginRight: 80,
				borderRadius: 8,
				marginBottom: 20,
				zIndex: 99,
				display: activeMenu === 'drawer' ? 'none' : 'flex',
				// backgroundColor: 'red',
			}}
		>
			<AppInputSimpleSearch
				placeholder={'mastodon.social'}
				value={Value}
				setValue={setValue}
				IsLoading={false}
			/>
		</View>
	);
}

export default KnownServerSearchWidget;
