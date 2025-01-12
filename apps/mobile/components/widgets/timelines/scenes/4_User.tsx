import { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import AppInput from '../../../lib/Inputs';
import { Image } from 'expo-image';
import HideOnKeyboardVisibleContainer from '../../../containers/HideOnKeyboardVisibleContainer';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import { ActivitypubHelper } from '@dhaaga/bridge';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { TimelineFetchMode } from '../../../../states/reducers/post-timeline.reducer';
import { useApiSearchUsers } from '../../../../hooks/api/useApiSearch';
import {
	useAppAcct,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';

function TimelineWidgetUserScene() {
	const [SearchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = SearchTerm;
	const { setTimelineType, setQuery, setShowTimelineSelection } =
		useTimelineController();
	const { theme } = useAppTheme();
	const { acct: acctItem } = useAppAcct();

	const { data } = useApiSearchUsers(debouncedSearchTerm, null);

	function onUserClicked(o: string, acct: string) {
		setQuery({
			id: o,
			label: ActivitypubHelper.getHandle(acct, acctItem?.server),
		});
		setTimelineType(TimelineFetchMode.USER);
		setShowTimelineSelection(false);
	}

	return (
		<View style={{ flexGrow: 1, padding: 8 }}>
			<View style={{ flexGrow: 1 }}>
				<HideOnKeyboardVisibleContainer>
					<Text
						style={{
							marginTop: 16,
							color: theme.secondary.a20,
							marginBottom: 4,
							fontFamily: APP_FONTS.MONTSERRAT_500_MEDIUM,
						}}
					>
						Search Results:
					</Text>
				</HideOnKeyboardVisibleContainer>
				<View>
					{data.map((o, i) => (
						<TouchableOpacity
							key={i}
							style={{
								display: 'flex',
								flexDirection: 'row',
								marginBottom: 8,
							}}
							onPress={() => {
								onUserClicked(o.id, o.handle);
							}}
						>
							<View
								style={{
									borderColor: '#363663',
									borderWidth: 2,
									marginRight: 4,
								}}
							>
								{/*@ts-ignore-next-line*/}
								<Image
									source={o.avatarUrl}
									style={{ width: 36, height: 36, borderRadius: 4 }}
								/>
							</View>
							<View>
								<Text style={styles.userDisplayName} numberOfLines={1}>
									{o.displayName}
								</Text>
								<Text style={styles.userInstanceInfo} numberOfLines={1}>
									{o.handle}
								</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</View>

			<View>
				<AppInput
					placeholder={'Search or Enter'}
					onChangeText={setSearchTerm}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	userInstanceInfo: {
		fontSize: 12,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
	},
	userDisplayName: {
		fontSize: 14,
		fontFamily: APP_FONTS.MONTSERRAT_500_MEDIUM,
	},
});

export default TimelineWidgetUserScene;
