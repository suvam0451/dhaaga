import { memo } from 'react';
import { RelationshipDialogProps } from '../fragments/_common';
import RelationDialogFactory from './_RelationDialogFactory';
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
		return (
			<RelationDialogFactory
				visible={visible}
				setVisible={setVisible}
				loading={loading}
				label={'Not Following'}
				desc={['You are not following this user.']}
			>
				<ActionButton
					label={'Follow'}
					setVisible={setVisible}
					onPress={follow}
				/>
			</RelationDialogFactory>
		);
	},
);

export default RDFollow;
