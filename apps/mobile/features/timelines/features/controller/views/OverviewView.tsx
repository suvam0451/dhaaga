import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../../../components/lib/Text';
import { StyleSheet } from 'react-native';
import { Fragment } from 'react';

type Props = {
	title: string;
	subtitle?: string;
	description: string[];
};

function OverviewView({ title, subtitle, description }: Props) {
	const { theme } = useAppTheme();

	return (
		<Fragment>
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
		</Fragment>
	);
}

export default OverviewView;

export const styles = StyleSheet.create({
	desc: {
		marginBottom: 4,
		fontSize: 14,
	},
	title: {
		fontSize: 20,
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 16,
	},
});
