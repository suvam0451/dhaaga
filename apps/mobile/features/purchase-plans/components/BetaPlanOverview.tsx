import { useAppTheme } from '#/states/global/hooks';
import FlyingMoney from '#/components/svgs/plans/FlyingMoney';
import { NativeTextSpecial } from '#/ui/NativeText';
import { PlanOverviewFactoryData } from '#/features/purchase-plans/components/PlanOverviewFactory';

function BetaPlanOverview() {
	const { theme } = useAppTheme();

	const featureList: PlanOverviewFactoryData[] = [
		{
			type: 'feature',
			title: 'Free Services',
			description: 'Everything from all paid tiers',
			Icon: <FlyingMoney />,
		},
	];
	return (
		<>
			<NativeTextSpecial
				style={{ fontSize: 32, marginTop: 32, color: theme.primary }}
			>
				INCLUDES
			</NativeTextSpecial>
		</>
	);
}

export default BetaPlanOverview;
