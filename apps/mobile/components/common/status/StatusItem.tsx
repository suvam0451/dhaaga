import { Fragment, memo, useMemo } from 'react';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { RepliedStatusFragment } from './_static';
import SharedStatusFragment from './fragments/SharedStatusFragment';
import { useAppStatusItem } from '../../../hooks/ap-proto/useAppStatusItem';
import StatusCore from './fragments/StatusCore';

/**
 * Renders a status/note
 * @constructor
 */
const StatusItem = memo(function Foo() {
	const { primaryAcct } = useActivityPubRestClientContext();
	const { dto } = useAppStatusItem();

	return useMemo(() => {
		if (dto.meta.isBoost) {
			// Quote Boost
			if (
				dto.content.raw !== undefined &&
				dto.content.raw !== null &&
				dto.content.raw !== ''
			) {
				return (
					<Fragment>
						<StatusCore />
					</Fragment>
				);
			} else {
				// Normal Boost + Has Reply
				if (dto.meta.isReply) {
					return (
						<Fragment>
							<SharedStatusFragment />
							<RepliedStatusFragment />
							<StatusCore />
						</Fragment>
					);
				} else {
					return (
						<Fragment>
							<SharedStatusFragment />
							<StatusCore />
						</Fragment>
					);
				}
			}
		} else if (dto.meta.isReply) {
			return (
				<Fragment>
					<SharedStatusFragment />
					<StatusCore />
				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<StatusCore />
				</Fragment>
			);
		}
	}, [dto, primaryAcct]);
});

export default StatusItem;
