import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../../../components/lib/Text';
import { StyleSheet, View } from 'react-native';
import { Fragment } from 'react';
import { appDimensions } from '../../../../../styles/dimensions';

type Props = {
	title: string;
	subtitle?: string;
	description: string[];
};

function OverviewView({ title, subtitle, description }: Props) {
	const { theme } = useAppTheme();

	return (
		<Fragment>
			<View
				style={[
					styles.sheetHeader,
					{
						backgroundColor: theme.background.a30,
					},
				]}
			>
				<AppText.SemiBold
					style={[
						styles.title,
						{
							color: theme.primary.a0,
						},
					]}
				>
					{title}
				</AppText.SemiBold>
				{subtitle && (
					<AppText.Medium
						style={[
							styles.subtitle,
							{
								color: theme.complementary.a0,
							},
						]}
					>
						{subtitle}
					</AppText.Medium>
				)}
			</View>
			<View style={styles.descContainer}>
				{description.map((item, i) => (
					<AppText.Normal
						key={i}
						style={[
							styles.desc,
							{
								color: theme.secondary.a10,
							},
						]}
					>
						{item}
					</AppText.Normal>
				))}
			</View>
		</Fragment>
	);
}

export default OverviewView;

export const styles = StyleSheet.create({
	sheetHeader: {
		paddingTop: appDimensions.bottomSheet.clearanceTop,
		paddingBottom: appDimensions.timelines.sectionBottomMargin * 1.5,
		marginBottom: appDimensions.timelines.sectionBottomMargin * 1.5,
		paddingHorizontal: 12,
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
	},
	descContainer: {
		paddingHorizontal: 12,
	},
	desc: {
		marginBottom: 4,
	},
	title: {
		fontSize: 20,
	},
	subtitle: {
		fontSize: 16,
	},
});
