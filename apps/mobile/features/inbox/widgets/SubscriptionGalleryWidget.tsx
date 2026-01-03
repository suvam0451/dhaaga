import { useAppTheme } from '#/states/global/hooks';
import { useState } from 'react';
import { useSubscriptionGalleryState } from '@dhaaga/react';
import AppWidget from '#/features/widgets/AppWidget';
import AppSegmentedControl from '#/ui/AppSegmentedControl';
import SubscriptionWidgetView from '#/features/inbox/widgets/SubscriptionWidgetView';

type Props = {
	pagerIndex: number;
	chips: {
		label: string;
		active: boolean;
		onPress: () => void;
	}[];
};

function SubscriptionGalleryWidget({ pagerIndex, chips }: Props) {
	const [WidgetOpen, setWidgetOpen] = useState(false);
	const State = useSubscriptionGalleryState();
	const { theme } = useAppTheme();

	/**
	 * Animations
	 */

	function onPress() {
		setWidgetOpen((o) => !o);
	}

	return (
		<AppWidget
			visible={pagerIndex === 3}
			isOpen={WidgetOpen}
			ForegroundSlot={<SubscriptionWidgetView visible={pagerIndex === 3} />}
			occupyFullWidth
			BackgroundSlot={<AppSegmentedControl items={chips} />}
			activeIcon={'clear'}
			inactiveIcon={'search'}
			onWidgetPress={() => {
				setWidgetOpen(!WidgetOpen);
			}}
		/>
	);
}

export default SubscriptionGalleryWidget;
