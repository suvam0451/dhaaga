import { memo } from 'react';
import { RelationshipDialogProps } from '../fragments/_common';
import RelationDialogFactory from './_RelationDialogFactory';
import { StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Button } from '@rneui/themed';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';
import { ActionButton } from './_common';

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
		const { colorScheme } = useAppTheme();
		return (
			<RelationDialogFactory
				visible={visible}
				setVisible={setVisible}
				loading={loading}
				label={'Strangers'}
			>
				<Text
					style={[
						styles.modalDescription,
						{
							color: colorScheme.textColor.medium,
						},
					]}
				>
					You are unrelated to this user. Send a follow request!
				</Text>
				<View style={[styles.actionButtonContainer]}>
					<ActionButton
						label={'Follow'}
						setVisible={setVisible}
						onPress={follow}
					/>
					<Button
						size={'md'}
						buttonStyle={{
							backgroundColor: colorScheme.palette.buttonUnstyled,
							borderRadius: 8,
						}}
						containerStyle={{
							borderRadius: 8,
						}}
						title={'Follow'}
						titleStyle={{
							color: colorScheme.textColor.high,
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
