import { View } from 'react-native';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';

type Props = {
	error: any;
};

function TimelineErrorView({ error }: Props) {
	return (
		<View
			style={{
				paddingTop: 52,
				margin: 'auto',
				borderRadius: 12,
				alignItems: 'center',
			}}
		>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'Failed to load Timeline'}
				errorDescription={error?.toString()}
			/>
		</View>
	);
}

export default TimelineErrorView;
