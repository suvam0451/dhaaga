import { View } from 'react-native';
import { Text } from '@rneui/themed';
import SimpleTutorialContainer from '../../../components/containers/SimpleTutorialContainer';
import { APP_FONT } from '../../../styles/AppTheme';

function NewToDhaaga() {
	return (
		<SimpleTutorialContainer title={'Overview of Dhaaga'}>
			<View style={{ paddingHorizontal: 8, paddingTop: 16 }}>
				<Text
					style={{
						fontSize: 20,
						fontFamily: 'Montserrat-Bold',
						color: APP_FONT.MONTSERRAT_HEADER,
						marginBottom: 8,
					}}
				>
					About
				</Text>
				<Text>This section is WIP</Text>
			</View>
		</SimpleTutorialContainer>
	);
}

export default NewToDhaaga;
