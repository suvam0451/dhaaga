import { View } from 'react-native';
import { router } from 'expo-router';
import TitleOnlyNoScrollContainer from '#/components/containers/TitleOnlyNoScrollContainer';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';
import { AppButtonVariantA } from '#/components/lib/Buttons';

function IdleTimelineView() {
	return (
		<TitleOnlyNoScrollContainer headerTitle={'Timelines'}>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'No Timeline Selected'}
				errorDescription={
					'You can pin and access various types of timelines from your personalised hub.'
				}
			/>
			<View style={{ marginTop: 32 }}>
				<AppButtonVariantA
					label={'To Hub'}
					loading={false}
					onClick={() => {
						router.navigate('/');
					}}
				/>
			</View>
		</TitleOnlyNoScrollContainer>
	);
}

export default IdleTimelineView;
