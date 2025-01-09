import { View } from 'react-native';
import { AppInputSimpleSearch } from '../../../lib/Inputs';
import { useEffect, useState } from 'react';
import { useSearchTermContext } from '../../../../hooks/forms/useSearchTerm';
import { useFabController } from '../../../shared/fab/hooks/useFabController';

function KnownServerSearchWidget() {
	const { setSearchText } = useSearchTermContext();
	const { activeMenu } = useFabController();

	const [Value, setValue] = useState('');

	const searchInput = Value;
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
