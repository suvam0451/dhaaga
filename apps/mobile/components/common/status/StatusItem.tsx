import { memo, useMemo } from 'react';
import { ParentPostFragment } from './_static';
import SharedStatusFragment from './fragments/SharedStatusFragment';
import { useAppStatusItem } from '../../../hooks/ap-proto/useAppStatusItem';
import StatusCore from './fragments/StatusCore';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { View } from 'react-native';

type StatusItemProps = {
	// disables all interactions
	isPreview?: boolean;
};

function PostContainer({ children }: any) {
	return (
		<View
			style={{
				paddingHorizontal: 8,
				paddingVertical: 6,
				backgroundColor: '#242424',
				margin: 6,
				marginVertical: 6,
				borderRadius: 16,
			}}
		>
			{children}
		</View>
	);
}

/**
 * Renders a status/note
 * @constructor
 */
const StatusItem = memo(function Foo({ isPreview }: StatusItemProps) {
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);
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
						<StatusCore hasBoost={true} isPreview={isPreview} />
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
							/>
						</PostContainer>
					);
				} else {
					return (
						<PostContainer>
							<SharedStatusFragment />
							<StatusCore hasBoost={true} isPreview={isPreview} />
						</PostContainer>
					);
				}
			}
		} else if (dto.meta.isReply) {
			return (
				<PostContainer>
					<ParentPostFragment />
					<StatusCore hasParent={true} isPreview={isPreview} />
				</PostContainer>
			);
		} else {
			return (
				<PostContainer>
					<StatusCore isPreview={isPreview} />
				</PostContainer>
			);
		}
	}, [dto, acct]);
});

export default StatusItem;
