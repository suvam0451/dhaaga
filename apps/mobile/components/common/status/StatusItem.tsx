import { memo, useMemo } from 'react';
import { ParentPostFragment } from './_static';
import SharedStatusFragment from './fragments/SharedStatusFragment';
import { useAppStatusItem } from '../../../hooks/ap-proto/useAppStatusItem';
import StatusCore from './fragments/StatusCore';
import { View } from 'react-native';
import { useAppAcct } from '../../../hooks/utility/global-state-extractors';

type StatusItemProps = {
	// disables all interactions
	isPreview?: boolean;
	isPin?: boolean;
	// for post details page
	showFullDetails?: boolean;
};

function PostContainer({ children }: any) {
	return (
		<View>
			<View
				style={{
					paddingHorizontal: 10,
					backgroundColor: '#121212',
					borderRadius: 16,
				}}
			>
				{children}
			</View>
			<View
				style={{
					backgroundColor: '#1c1c1c',
					height: 1,
					marginVertical: 16,
				}}
			/>
		</View>
	);
}

/**
 * Renders a status/note
 * @constructor
 */
const StatusItem = memo(function Foo({
	isPreview,
	isPin,
	showFullDetails,
}: StatusItemProps) {
	const { acct } = useAppAcct();
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
					<PostContainer>
						<StatusCore
							hasBoost={true}
							isPreview={isPreview}
							isPin={isPin}
							showFullDetails={showFullDetails}
						/>
					</PostContainer>
				);
			} else {
				// Normal Boost + Has Reply
				if (dto.meta.isReply) {
					return (
						<PostContainer>
							<SharedStatusFragment />
							<ParentPostFragment />
							<StatusCore
								hasBoost={true}
								hasParent={true}
								isPreview={isPreview}
								isPin
								showFullDetails={showFullDetails}
							/>
						</PostContainer>
					);
				} else {
					return (
						<PostContainer>
							<SharedStatusFragment />
							<StatusCore
								hasBoost={true}
								isPreview={isPreview}
								isPin={isPin}
								showFullDetails={showFullDetails}
							/>
						</PostContainer>
					);
				}
			}
		} else if (dto.meta.isReply) {
			return (
				<PostContainer>
					<ParentPostFragment />
					<StatusCore
						hasParent={true}
						isPreview={isPreview}
						isPin={isPin}
						showFullDetails={showFullDetails}
					/>
				</PostContainer>
			);
		} else {
			return (
				<PostContainer>
					<StatusCore
						isPreview={isPreview}
						isPin={isPin}
						showFullDetails={showFullDetails}
					/>
				</PostContainer>
			);
		}
	}, [dto, acct]);
});

export default StatusItem;
