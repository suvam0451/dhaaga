import { Animated, StyleSheet, View } from 'react-native';
import NavBar_Feed from '../../../components/shared/topnavbar/NavBar_Feed';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';

type Props = {
	error: any;
};

function TimelineErrorView({ error }: Props) {
	const { theme } = useAppTheme();
	const { translateY } = useScrollMoreOnPageEnd();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.palette.bg,
				paddingTop: 52,
			}}
		>
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<NavBar_Feed animatedStyle={{}} />
			</Animated.View>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'Failed to load Timeline'}
				errorDescription={error?.toString()}
			/>
		</View>
	);
}

export default TimelineErrorView;

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
});
