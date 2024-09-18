import { memo, useMemo } from 'react';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import { Text, View } from 'react-native';
import appTextStyling from '../../../../../styles/AppTextStyling';
import { Image } from 'expo-image';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';

/**
 * Indicates in which context this reply is being composed
 */
const ReplyContextIndicator = memo(() => {
	const { ParentRef, requestId } = useAppBottomSheet();
	const { colorScheme } = useAppTheme();

	const component = useMemo(() => {
		if (ParentRef.current) {
			return (
				<View
					style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center' }}
				>
					<Text
						style={[
							appTextStyling.postContext,
							{ flexShrink: 1, color: colorScheme.textColor.medium },
						]}
					>
						Replying to{' '}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: colorScheme.palette.buttonUnstyled,
							borderRadius: 8,
							padding: 4,
							paddingHorizontal: 6,
						}}
					>
						{/*@ts-ignore-next-line*/}
						<Image
							source={{ uri: ParentRef.current.postedBy.avatarUrl }}
							style={{ width: 24, height: 24, borderRadius: 8 }}
						/>
						<Text
							style={[
								appTextStyling.postContext,
								{ maxWidth: 208, color: colorScheme.textColor.medium },
							]}
							numberOfLines={1}
						>
							{ParentRef.current.postedBy.handle}
						</Text>
					</View>
				</View>
			);
		}

		return <View />;
	}, [ParentRef, requestId, colorScheme]);
	return <View>{component}</View>;
});

export default ReplyContextIndicator;
