import { View } from 'react-native';
import MediaThumbnail from '../../../../../components/common/media/Thumb';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';

type FlashListItemProps = {
	selected: boolean;
	type: string;
	url: string;
	width: number;
	height: number;
	activeIndex: number;
	myIndex: number;
	onClick: (index: number) => void;
};

function ThumbnailView({
	type,
	url,
	width,
	height,
	activeIndex,
	myIndex,
	onClick,
}: FlashListItemProps) {
	const { theme } = useAppTheme();
	const SELECTED = activeIndex === myIndex;
	return (
		<View
			style={{
				marginHorizontal: 2,
				borderColor: SELECTED ? theme.primary.a0 : theme.background.a50,
				borderWidth: 1.5,
				borderRadius: 8,
			}}
			onTouchEnd={() => {
				onClick(myIndex);
			}}
		>
			<MediaThumbnail
				type={type}
				url={url}
				width={width}
				height={height}
				size={72}
			/>
		</View>
	);
}

export default ThumbnailView;
