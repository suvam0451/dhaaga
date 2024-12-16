import { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import appTextStyling from '../../../../../styles/AppTextStyling';
import { Image } from 'expo-image';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * Indicates in which context this reply is being composed
 */
const ReplyContextIndicator = memo(() => {
	const { ParentRef, stateId, theme } = useGlobalState(
		useShallow((o) => ({
			ParentRef: o.bottomSheet.ParentRef,
			stateId: o.bottomSheet.stateId,
			theme: o.colorScheme,
		})),
	);

	const component = useMemo(() => {
		if (ParentRef) {
			return (
				<View
					style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center' }}
				>
					<Text
						style={[
							appTextStyling.postContext,
							{ flexShrink: 1, color: theme.textColor.medium },
						]}
					>
						Replying to{' '}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: theme.palette.buttonUnstyled,
							borderRadius: 8,
							padding: 4,
							paddingHorizontal: 6,
						}}
					>
						{/*@ts-ignore-next-line*/}
						<Image
							source={{ uri: ParentRef.postedBy.avatarUrl }}
							style={{ width: 24, height: 24, borderRadius: 8 }}
						/>
						<Text
							style={[
								appTextStyling.postContext,
								{ maxWidth: 208, color: theme.textColor.medium },
							]}
							numberOfLines={1}
						>
							{ParentRef.postedBy.handle}
						</Text>
					</View>
				</View>
			);
		}

		return <View />;
	}, [ParentRef, stateId, theme]);
	return <View>{component}</View>;
});

export default ReplyContextIndicator;
