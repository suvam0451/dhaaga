import { memo } from 'react';
import { RelationshipDialogProps } from '../fragments/_common';
import RelationDialogFactory from './_RelationDialogFactory';
import { Text, View } from 'react-native';
import { ActionButton, modalStyles } from './_common';

const RDFollowing = memo(
	({
		visible,
		setVisible,
		loading,
		unfollow,
	}: RelationshipDialogProps & { unfollow: () => void }) => {
		return (
			<RelationDialogFactory
				visible={visible}
				setVisible={setVisible}
				loading={loading}
			>
				<Text style={modalStyles.modalTitle}>Following</Text>
				<Text style={modalStyles.modalDescription}>
					You currently follow this user
				</Text>
				<View style={modalStyles.actionButtonContainer}>
					<ActionButton
						label={'Unfollow'}
						setVisible={setVisible}
						onPress={unfollow}
					/>
				</View>
			</RelationDialogFactory>
		);
	},
);

export default RDFollowing;
