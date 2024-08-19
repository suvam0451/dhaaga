import { memo } from 'react';
import { Dialog } from '@rneui/themed';
import { RelationshipDialogProps } from '../fragments/_common';
import { StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';
import { ActionButton } from './_common';

/**
 * Dialog for Pending state
 *
 * Expected to be wrapped with
 */
const RDPending = memo(
	({
		visible,
		setVisible,
		refresh,
	}: RelationshipDialogProps & {
		cancelFollowRequest: () => void;
		refresh: () => void;
	}) => {
		return (
			<Dialog
				overlayStyle={{ backgroundColor: '#2c2c2c' }}
				isVisible={visible}
				onBackdropPress={() => {
					setVisible(false);
				}}
			>
				<Text style={styles.modalTitle}>Follow Request Pending</Text>
				<Text style={styles.modalDescription}>
					This user has a closed profile and your follow request has not been
					approved yet
				</Text>
				<View style={styles.actionButtonContainer}>
					<ActionButton
						label={'Cancel the Request'}
						onPress={() => {}}
						setVisible={setVisible}
					/>
					<ActionButton
						label={'Refresh Status'}
						onPress={refresh}
						setVisible={setVisible}
					/>
				</View>
			</Dialog>
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

export default RDPending;
