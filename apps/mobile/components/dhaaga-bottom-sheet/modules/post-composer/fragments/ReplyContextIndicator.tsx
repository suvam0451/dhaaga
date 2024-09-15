import { memo, useMemo } from 'react';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import { Text, View } from 'react-native';
import appTextStyling from '../../../../../styles/AppTextStyling';
import { Image } from 'expo-image';

/**
 * Indicates in which context this reply is being composed
 */
const ReplyContextIndicator = memo(() => {
	const { replyToRef, requestId } = useAppBottomSheet();

	const component = useMemo(() => {
		if (replyToRef.current) {
			return (
				<View
					style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center' }}
				>
					<Text style={[appTextStyling.postContext, { flexShrink: 1 }]}>
						Replying to{' '}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: '#161616',
							borderRadius: 8,
							padding: 4,
							paddingHorizontal: 6,
						}}
					>
						{/*@ts-ignore-next-line*/}
						<Image
							source={{ uri: replyToRef.current.postedBy.avatarUrl }}
							style={{ width: 24, height: 24, borderRadius: 8 }}
						/>
						<Text
							style={[appTextStyling.postContext, { maxWidth: 208 }]}
							numberOfLines={1}
						>
							{replyToRef.current.postedBy.handle}
						</Text>
					</View>
				</View>
			);
		}

		return <View />;
	}, [replyToRef, requestId]);
	return <View>{component}</View>;
});

export default ReplyContextIndicator;
