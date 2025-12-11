import { Pressable } from 'react-native';
import { AppText } from '#/components/lib/Text';
import { DatetimeUtil } from '#/utils/datetime.utils';
import { AppIcon } from '#/components/lib/Icon';
import { useAppTheme } from '#/states/global/hooks';

type Props = {
	createdAt: Date | string;
	onPress?: () => void;
};

function MoreOptionsButtonSectionView({ createdAt, onPress }: Props) {
	const { theme } = useAppTheme();

	return (
		<Pressable
			style={{
				paddingLeft: 16,
				flexDirection: 'row',
				height: '100%',
				alignItems: 'center',
			}}
		>
			<AppText.Normal
				style={{
					color: theme.secondary.a40,
					marginRight: 8,
					fontSize: 13,
				}}
			>
				{DatetimeUtil.timeAgo(createdAt)}
			</AppText.Normal>
			<AppIcon
				id={'ellipsis-v'}
				color={theme.secondary.a40}
				size={20}
				iconStyle={{ paddingRight: 6 }}
			/>
		</Pressable>
	);
}

export { MoreOptionsButtonSectionView };
