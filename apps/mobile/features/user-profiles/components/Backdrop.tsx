import { Dimensions, Pressable, View } from 'react-native';

type UserPeekModalViewProps = {
	hide: () => void;
};

function Backdrop({ hide }: UserPeekModalViewProps) {
	const { height, width } = Dimensions.get('window');
	return (
		<View
			style={{
				height,
				width,
				position: 'absolute',
				zIndex: 90,
			}}
		>
			<Pressable
				style={{
					height,
					width,
					backgroundColor: 'transparent',
					zIndex: 100,
				}}
				onPress={(e: any) => {
					e.stopPropagation();
					hide();
				}}
			/>
		</View>
	);
}

export default Backdrop;
