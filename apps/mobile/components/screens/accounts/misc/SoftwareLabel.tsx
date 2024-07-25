import { memo, useMemo } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import { View } from 'react-native';
import { Text } from '@rneui/themed';

type Props = {
	software: string;
};

const SoftwareLabel = memo(function Foo({ software }: Props) {
	const Styling = useMemo(() => {
		switch (software) {
			case KNOWN_SOFTWARE.MISSKEY:
				return { bg: '#8ae805', fg: 'white', label: 'Misskey' };
			case KNOWN_SOFTWARE.FIREFISH: {
				return { bg: '#f17c5b', fg: 'white', label: 'Firefish' };
			}
			case KNOWN_SOFTWARE.MASTODON: {
				return { bg: '#6365fe', fg: 'white', label: 'Mastodon' };
			}
			case KNOWN_SOFTWARE.GOTOSOCIAL: {
				return { bg: '#df8958', fg: '#e9e7e4', label: 'GoToSocial' };
			}
			default:
				return { bg: 'gray', label: 'Unknown' };
		}
	}, [software]);

	return (
		<View style={{ backgroundColor: Styling.bg, borderRadius: 8 }}>
			<Text>{Styling.label}</Text>
		</View>
	);
});

export default SoftwareLabel;
