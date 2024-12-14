import { memo } from 'react';
import { RelationshipDialogProps } from '../fragments/_common';
import RelationDialogFactory from './_RelationDialogFactory';
import { View } from 'react-native';
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
				label={'Following'}
				desc={['You currently follow this user.']}
			>
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
