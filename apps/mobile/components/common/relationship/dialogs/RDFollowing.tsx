import { memo } from 'react';
import { RelationshipDialogProps } from '../fragments/_common';
import RelationDialogFactory from './_RelationDialogFactory';
import { Text, View } from 'react-native';
import { ActionButton, modalStyles } from './_common';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

const RDFollowing = memo(
	({
		visible,
		setVisible,
		loading,
		unfollow,
	}: RelationshipDialogProps & { unfollow: () => void }) => {
		const { colorScheme } = useAppTheme();
		return (
			<RelationDialogFactory
				visible={visible}
				setVisible={setVisible}
				loading={loading}
				label={'Following'}
			>
				<Text
					style={[
						modalStyles.modalDescription,
						{
							color: colorScheme.textColor.medium,
						},
					]}
				>
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
