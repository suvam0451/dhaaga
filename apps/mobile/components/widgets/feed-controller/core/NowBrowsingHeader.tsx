import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { memo, useMemo } from 'react';
import { TimelineType } from '../../../../types/timeline.types';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import ControlSegment from '../components/ControlSegment';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type Props = {
	feedType: TimelineType;
};

const NowBrowsingHeader = memo(function Foo({ feedType }: Props) {
	const Comp = useMemo(() => {
		switch (feedType) {
			case TimelineType.LOCAL: {
				return (
					<View>
						<Text
							style={{
								fontFamily: 'Montserrat-Bold',
								color: APP_FONT.MONTSERRAT_BODY,
								fontSize: 16,
							}}
						>
							Public Timeline
						</Text>
						<Text
							style={{
								fontFamily: 'Montserrat-Bold',
								color: APP_THEME.COLOR_SCHEME_D_NORMAL,
								fontSize: 14,
								opacity: 0.75,
							}}
						>
							mastodon.social
						</Text>
						<ControlSegment
							label={'Show feed from:'}
							buttons={[
								{
									label: 'All',
									selected: true,
									onClick: () => {},
								},

								{
									label: 'Local',
									selected: false,
									onClick: () => {},
								},
								{
									label: 'Remote',
									selected: false,
									onClick: () => {},
								},
							]}
						/>

						<ControlSegment
							label={'More options:'}
							buttons={[
								{
									label: 'All',
									selected: true,
									onClick: () => {},
								},

								{
									label: 'Media Only',
									selected: false,
									onClick: () => {},
								},
							]}
						/>
					</View>
				);
			}
			default: {
				return (
					<View>
						<Text>Unsupported timeline type</Text>
					</View>
				);
			}
		}
	}, [feedType]);

	return (
		<View style={{ marginHorizontal: 8, marginBottom: 32 }}>
			<View
				style={{
					marginVertical: 16,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<View style={{ flex: 1, flexShrink: 1 }}>
					<Text
						style={{
							fontSize: 24,
							fontFamily: 'Inter-Bold',
							color: APP_FONT.MONTSERRAT_BODY,
							textAlign: 'center',
						}}
					>
						Now Browsing
					</Text>
				</View>
			</View>

			{Comp}
		</View>
	);
});

export default NowBrowsingHeader;
