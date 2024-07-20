import TimelineWidgetUserApi from '../api/4_User';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TouchableOpacity, View } from 'react-native';
import AppInput from '../../../lib/Inputs';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Text } from '@rneui/themed';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { Image } from 'expo-image';
import HideOnKeyboardVisibleContainer from '../../../containers/HideOnKeyboardVisibleContainer';
import {
	TimelineFetchMode,
	useTimelineController,
} from '../../../../states/useTimelineController';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';

function TimelineWidgetUserScene() {
	const [SearchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm] = useDebounce(SearchTerm, 100);
	const { setTimelineType, setQuery, setShowTimelineSelection } =
		useTimelineController();

	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct.subdomain;

	const { transformedData } = TimelineWidgetUserApi(debouncedSearchTerm);

	function onUserClicked(o: string, acct: string) {
		setQuery({
			id: o,
			label: ActivitypubHelper.getHandle(acct, subdomain),
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
								<Text>{o.getDisplayName()}</Text>
								<Text style={{ fontSize: 12, color: APP_FONT.MONTSERRAT_BODY }}>
									{o.getAppDisplayAccountUrl(subdomain)}
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

export default TimelineWidgetUserScene;
