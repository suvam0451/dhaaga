import { Fragment, memo, useMemo } from 'react';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { ParentPostFragment } from './_static';
import SharedStatusFragment from './fragments/SharedStatusFragment';
import { useAppStatusItem } from '../../../hooks/ap-proto/useAppStatusItem';
import StatusCore from './fragments/StatusCore';

type StatusItemProps = {
	// disables all interactions
	isPreview?: boolean;
};

/**
 * Renders a status/note
 * @constructor
 */
const StatusItem = memo(function Foo({ isPreview }: StatusItemProps) {
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
						<StatusCore hasBoost={true} isPreview={isPreview} />
					</Fragment>
				);
			} else {
				// Normal Boost + Has Reply
				if (dto.meta.isReply) {
					return (
						<Fragment>
							<SharedStatusFragment />
							<ParentPostFragment />
							<StatusCore
								hasBoost={true}
								hasParent={true}
								isPreview={isPreview}
							/>
						</Fragment>
					);
				} else {
					return (
						<Fragment>
							<SharedStatusFragment />
							<StatusCore hasBoost={true} isPreview={isPreview} />
						</Fragment>
					);
				}
			}
		} else if (dto.meta.isReply) {
			return (
				<Fragment>
					<ParentPostFragment />
					<StatusCore hasParent={true} isPreview={isPreview} />
				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<StatusCore isPreview={isPreview} />
				</Fragment>
			);
		}
	}, [dto, primaryAcct]);
});

export default StatusItem;
