import { Host, DropdownMenu, DropdownMenuItem } from '@expo/ui/jetpack-compose';
import { Pressable, Platform } from 'react-native';
import { useState } from 'react';
import { NativeTextMedium } from '#/ui/NativeText';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { AppIcon } from '#/components/lib/Icon';
import { useAppTheme } from '#/states/global/hooks';
import { MenuView } from '@expo/ui/community/menu';

type AppInlinePickerProps = {
	value: string;
	options: { id: string; label: string }[];
	onSelect: (id: string) => void;
};

function AppInlinePicker({ value, options, onSelect }: AppInlinePickerProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const { theme } = useAppTheme();

	if (Platform.OS === 'android') {
		return (
			<Host matchContents>
				<DropdownMenu
					expanded={isExpanded}
					onDismissRequest={() => setIsExpanded(false)}
				>
					<DropdownMenu.Trigger>
						<Pressable
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'flex-end',
								flex: 1,
							}}
							onPress={() => setIsExpanded(true)}
						>
							<NativeTextMedium
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
								style={{ textAlign: 'right' }}
								color={theme.complementary}
							>
								{value}
							</NativeTextMedium>
							<AppIcon
								id={'chevron-right'}
								color={theme.complementary}
								size={28}
							/>
						</Pressable>
					</DropdownMenu.Trigger>
					<DropdownMenu.Items>
						{options.map((option) => (
							<DropdownMenuItem
								onClick={() => {
									onSelect(option.id);
									setIsExpanded(false);
								}}
							>
								<DropdownMenuItem.Text>
									<NativeTextMedium>{option.label}</NativeTextMedium>
								</DropdownMenuItem.Text>
							</DropdownMenuItem>
						))}
					</DropdownMenu.Items>
				</DropdownMenu>
			</Host>
		);
	} else {
		return (
			<MenuView
				style={{
					flex: 1,
					alignItems: 'flex-end',
				}}
				actions={options.map((option) => ({
					id: option.id,
					title: option.label,
				}))}
			>
				<Pressable
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-end',
					}}
				>
					<NativeTextMedium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
						style={{ textAlign: 'right' }}
						color={theme.complementary}
					>
						Show Five
					</NativeTextMedium>
					<AppIcon id={'chevron-right'} color={theme.complementary} size={28} />
				</Pressable>
			</MenuView>
		);
	}
}

export default AppInlinePicker;
