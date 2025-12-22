import { View, StyleSheet } from 'react-native';
import ComposeMediaTargets from '#/components/dhaaga-bottom-sheet/modules/post-composer/fragments/MediaTargets';
import { useAppTheme } from '#/states/global/hooks';
import { AppBottomSheetMenu } from '#/components/lib/Menu';
import { AppIcon } from '#/components/lib/Icon';
import { AppText } from '#/components/lib/Text';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { usePostComposerState } from '@dhaaga/react';
import { useComposerMediaAttachments } from '#/features/composer/hooks/useComposerFeatureCompatibility';
import useComposerInputMode from '../hooks/useComposerInputMode';

function ComposerMediaModeView() {
	const state = usePostComposerState();
	const { theme } = useAppTheme();
	const { toTextMode } = useComposerInputMode();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { trigger } = useComposerMediaAttachments();

	return (
		<View>
			<AppBottomSheetMenu.WithBackNavigation
				backLabel={t(`sheets.backOption`)}
				nextLabel={''}
				onBack={toTextMode}
				onNext={() => {}}
				nextEnabled={false}
				MiddleComponent={
					<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
						<AppIcon
							id={'images'}
							color={theme.primary}
							onPress={trigger}
							size={28}
							containerStyle={{ paddingHorizontal: 8 }}
						/>
						<AppIcon
							id={'gallery'}
							color={theme.secondary.a50}
							size={28}
							containerStyle={{ paddingHorizontal: 8 }}
						/>
					</View>
				}
				style={{
					paddingHorizontal: 6,
				}}
			/>
			<ComposeMediaTargets />
			{state.medias.length === 0 && (
				<AppText.Medium
					style={[
						styles.noAttachments,
						{
							color: theme.secondary.a30,
						},
					]}
				>
					{t(`composer.noAttachments`)}
				</AppText.Medium>
			)}
		</View>
	);
}

export default ComposerMediaModeView;

const styles = StyleSheet.create({
	noAttachments: {
		textAlign: 'center',
		marginTop: 32,
		padding: 16,
		fontSize: 18,
	},
});
