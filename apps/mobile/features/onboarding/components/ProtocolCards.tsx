import { useAppTheme } from '#/states/global/hooks';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { Pressable, StyleSheet, FlatList } from 'react-native';
import { AppText } from '#/components/lib/Text';
import SoftwareHeader from '#/features/accounts/components/SoftwareHeader';

type ProtocolCardsProps = {
	onSelectSetPagerId: (id: number) => void;
};

/**
 * This UI fragment can be shared with other
 * screens (that might have a different header,
 * footer or page decorations)
 * @constructor
 */
function ProtocolCards({ onSelectSetPagerId }: ProtocolCardsProps) {
	const { theme } = useAppTheme();
	const options: {
		label: string;
		rightComponent: any;
		to: string;
		pagerId: number;
	}[] = [
		{
			label: 'Bluesky',
			rightComponent: (
				<SoftwareHeader height={54} software={KNOWN_SOFTWARE.BLUESKY} />
			),
			to: APP_ROUTING_ENUM.ATPROTO_SIGNIN,
			pagerId: 1,
		},
		{
			label: 'Mastodon',
			rightComponent: (
				<SoftwareHeader height={54} software={KNOWN_SOFTWARE.MASTODON} />
			),
			to: APP_ROUTING_ENUM.MASTODON_SERVER_SELECTION,
			pagerId: 2,
		},
		{
			label: 'Misskey',
			rightComponent: (
				<SoftwareHeader height={54} software={KNOWN_SOFTWARE.MISSKEY} />
			),
			to: APP_ROUTING_ENUM.MISSKEY_SERVER_SELECTION,
			pagerId: 3,
		},
		{
			label: 'Lemmy ⏳',
			rightComponent: (
				<SoftwareHeader height={54} software={KNOWN_SOFTWARE.LEMMY} />
			),
			to: APP_ROUTING_ENUM.MISSKEY_SERVER_SELECTION,
			pagerId: 4,
		},
	];

	return (
		<FlatList
			numColumns={2}
			data={options}
			renderItem={({ item }) => (
				<Pressable
					style={[
						styles.selectSnsBox,
						{
							backgroundColor: theme.background.a30,
						},
					]}
					onPress={() => {
						onSelectSetPagerId(item.pagerId);
					}}
				>
					{item.rightComponent}
					<AppText.SemiBold
						style={[
							styles.selectSnsLabel,
							{
								color: theme.secondary.a10,
							},
						]}
					>
						{item.label}
					</AppText.SemiBold>
				</Pressable>
			)}
		/>
	);
}

export default ProtocolCards;

const styles = StyleSheet.create({
	selectSnsBox: {
		paddingVertical: 20,
		alignItems: 'center',
		margin: 10,
		borderRadius: 16,
		flex: 1,
	},
	selectSnsLabel: {
		fontSize: 22,
		marginTop: 12,
	},
	tipContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
		marginTop: 32,
	},
	tipText: {
		marginLeft: 6,
	},
});
