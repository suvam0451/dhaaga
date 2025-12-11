import { AppIcon } from '#/components/lib/Icon';
import { Pressable } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';

type Props = {
	active: boolean;
	toggle: () => void;
};

function UserPinSearchResultControllerView({ active, toggle }: Props) {
	const { theme } = useAppTheme();
	return (
		<Pressable onPress={toggle}>
			{active ? (
				<AppIcon
					id={'checkmark-circle'}
					size={32}
					color={theme.primary.a0}
					onPress={toggle}
				/>
			) : (
				<AppIcon
					id={'add-circle-outline'}
					size={32}
					color={theme.secondary.a30}
					onPress={toggle}
				/>
			)}
		</Pressable>
	);
}

export default UserPinSearchResultControllerView;
