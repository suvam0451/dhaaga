import { useEffect } from 'react';
import TabView from './views/TabView';
import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../states/_global';

function LandingPageStack() {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	useEffect(() => {
		const intervalFunction = () => {
			// refetch();
		};
		const intervalId = setInterval(intervalFunction, 15000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<View style={{ height: '100%', backgroundColor: theme.palette.bg }}>
			<TabView />
		</View>
	);
}

export default LandingPageStack;
