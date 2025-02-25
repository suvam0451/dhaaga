import { memo, useEffect, useRef, useState } from 'react';
import { APP_FONT } from '../../../styles/AppTheme';
import { View, Text } from 'react-native';
import { AppSetting } from '@dhaaga/db';

type SingleChoiceSettingProps = {
	label: string;
	settingKey: string;
	items: { label: string; id: string }[];
};

export const SingleChoiceSetting = memo(function Foo({
	label,
	settingKey,
	items,
}: SingleChoiceSettingProps) {
	const [Setting, setSetting] = useState<AppSetting | null>(null);

	const targetProfile = useRef(null);

	useEffect(() => {
		// if (profile.length > 0) {
		// 	if (targetProfile.current === profile[0]._id.toString()) return;
		// 	targetProfile.current = profile[0]._id.toString();
		// 	setSetting(profile[0].settings.find((o) => o.key === settingKey));
		// }
	}, []);

	return (
		<View style={{ marginBottom: 12 }}>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_HEADER,
				}}
			>
				{label}
			</Text>
			<View
				style={{ display: 'flex', flexDirection: 'row', marginVertical: 8 }}
			>
				{items.map((o, i) => (
					<View
						key={i}
						style={{
							borderRadius: 8,
							backgroundColor:
								Setting?.value === o.id
									? 'rgba(170, 170, 170, 0.87)'
									: 'rgba(72, 72, 72, 0.87)',
							padding: 8,
							marginRight: 8,
						}}
					>
						<Text
							key={i}
							style={{
								color:
									Setting?.value === o.id
										? 'rgba(0, 0, 0, 1)'
										: APP_FONT.MONTSERRAT_BODY,
								fontFamily: 'Montserrat-Bold',
							}}
						>
							{o.label}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
});
