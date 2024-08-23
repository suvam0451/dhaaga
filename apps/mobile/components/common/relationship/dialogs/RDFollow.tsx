import { memo } from 'react';
import { RelationshipDialogProps } from '../fragments/_common';
import RelationDialogFactory from './_RelationDialogFactory';
import { StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Button } from '@rneui/themed';

const RDFollow = memo(
	({
		visible,
		setVisible,
		loading,
		follow,
	}: RelationshipDialogProps & {
		profileLocked: boolean;
		follow: () => void;
	}) => {
		return (
			<RelationDialogFactory
				visible={visible}
				setVisible={setVisible}
				loading={loading}
			>
				<Text style={styles.modalTitle}>Strangers</Text>
				<Text style={styles.modalDescription}>
					You are unrelated to this user. Send a follow request!
				</Text>
				<View style={styles.actionButtonContainer}>
					<Button
						size={'md'}
						buttonStyle={{
							backgroundColor: '#404040',
						}}
						containerStyle={{
							borderRadius: 8,
						}}
						title={'Follow'}
						titleStyle={{
							color: APP_FONT.MONTSERRAT_BODY,
						}}
						loading={loading}
						onPress={() => {
							setVisible(false);
							follow();
						}}
					/>
				</View>
			</RelationDialogFactory>
		);
	},
);

const styles = StyleSheet.create({
	modalTitle: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		textAlign: 'center',
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 18,
		marginBottom: 16,
	},
	modalDescription: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		textAlign: 'center',
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 14,
	},
	actionButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 16,
	},
});

export default RDFollow;
