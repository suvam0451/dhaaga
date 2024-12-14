import { memo } from 'react';
import { RelationshipDialogProps } from '../fragments/_common';
import { ActionButton } from './_common';
import RelationDialogFactory from './_RelationDialogFactory';

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
			<RelationDialogFactory
				visible={visible}
				setVisible={setVisible}
				loading={false}
				label={'Follow Request Pending'}
				desc={[
					'You have sent this user a follow request.',
					'But, it seems to not have been accepted yet.',
					'You can try to refresh the status or wait.',
				]}
			>
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
			</RelationDialogFactory>
		);
	},
);

export default RDPending;
