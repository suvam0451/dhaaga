import { memo } from 'react';
import { View } from 'react-native';
import SimpleTutorialContainer from '../../../components/containers/SimpleTutorialContainer';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../styles/AppTheme';

const PinnedTimelines = memo(function Foo() {
	return (
		<SimpleTutorialContainer title={'Pinned Timelines'}>
			<View>
				<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
					This feature is not implemented yet
				</Text>
			</View>
		</SimpleTutorialContainer>
	);
});

export default PinnedTimelines;
