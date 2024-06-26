import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { useQuery } from '@realm/react';
import { ActivityPubServer } from '../../../entities/activitypub-server.entity';
import { useEffect, useState } from 'react';
import { APP_FONT } from '../../../styles/AppTheme';

function ServerDebuggerStack() {
	const servers = useQuery(ActivityPubServer);
	const [SearchResults, setSearchResults] = useState([]);
	console.log(servers);

	useEffect(() => {
		setSearchResults(servers.slice(0, 10));
	}, [servers]);
	return (
		<View style={{ backgroundColor: '#121212', height: '100%' }}>
			<View style={{ paddingHorizontal: 8 }}>
				{SearchResults.map((o, i) => (
					<View
						key={i}
						style={{
							marginBottom: 8,
							backgroundColor: '#1e1e1e',
							padding: 8,
							borderRadius: 8,
						}}
					>
						<View
							style={{ display: 'flex', flexDirection: 'row', flexShrink: 1 }}
						>
							<View
								style={{
									flex: 1,
									flexGrow: 1,
									justifyContent: 'space-between',
								}}
							>
								<Text
									style={{
										fontFamily: 'Montserrat-Bold',
										color: APP_FONT.MONTSERRAT_HEADER,
									}}
								>
									{o.url}
								</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text style={{ textAlign: 'right' }}>{o.type}</Text>
							</View>
						</View>

						<Text style={{ color: APP_FONT.MONTSERRAT_BODY, fontSize: 12 }}>
							`Emojis cached: {o.emojis.length}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}

export default ServerDebuggerStack;
