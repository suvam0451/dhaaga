import TimelineWidgetUserApi from '../api/4_User';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import AppInput from '../../../lib/Inputs';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Image } from 'expo-image';
import HideOnKeyboardVisibleContainer from '../../../containers/HideOnKeyboardVisibleContainer';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import { ActivitypubHelper } from '@dhaaga/bridge';
import { APP_FONTS } from '../../../../styles/AppFonts';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { TimelineFetchMode } from '../../../../states/reducers/post-timeline.reducer';

function TimelineWidgetUserScene() {
	const [SearchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm] = useDebounce(SearchTerm, 100);
	const { setTimelineType, setQuery, setShowTimelineSelection } =
		useTimelineController();

	const { acct: acctItem } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);

	const { transformedData } = TimelineWidgetUserApi(debouncedSearchTerm);

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
							color: APP_FONT.MONTSERRAT_BODY,
							marginBottom: 4,
							fontFamily: APP_FONTS.MONTSERRAT_500_MEDIUM,
						}}
					>
						Search Results:
					</Text>
				</HideOnKeyboardVisibleContainer>
				<View>
					{transformedData.map((o, i) => (
						<TouchableOpacity
							key={i}
							style={{
								display: 'flex',
								flexDirection: 'row',
								marginBottom: 8,
							}}
							onPress={() => {
								onUserClicked(o.getId(), o.getAccountUrl());
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
									source={o.getAvatarUrl()}
									placeholder={{ blurhash: o.getAvatarBlurHash() }}
									style={{ width: 36, height: 36, borderRadius: 4 }}
								/>
							</View>
							<View>
								<Text style={styles.userDisplayName} numberOfLines={1}>
									{o.getDisplayName()}
								</Text>
								<Text style={styles.userInstanceInfo} numberOfLines={1}>
									{o.getAppDisplayAccountUrl(acctItem?.server)}
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
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
	},
	userDisplayName: {
		fontSize: 14,
		color: APP_FONT.MONTSERRAT_HEADER,
		fontFamily: APP_FONTS.MONTSERRAT_500_MEDIUM,
	},
});

export default TimelineWidgetUserScene;
