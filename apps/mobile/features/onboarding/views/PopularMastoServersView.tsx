import PopularServers from '../components/PopularServers';
import {
	POPULAR_AKKOMA_SERVERS,
	POPULAR_MASTODON_SERVERS,
	POPULAR_PLEROMA_SERVERS,
} from '../data/server-meta';
import HideOnKeyboardVisibleContainer from '../../../components/containers/HideOnKeyboardVisibleContainer';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

type Props = {
	onSelect: Dispatch<SetStateAction<string>>;
};

function PopularMastoServersView({ onSelect }: Props) {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	return (
		<HideOnKeyboardVisibleContainer>
			<PopularServers
				label={t(`onboarding.popularMastodon`)}
				items={POPULAR_MASTODON_SERVERS}
				onSelect={onSelect}
			/>
			<PopularServers
				label={t(`onboarding.popularPleroma`)}
				items={POPULAR_PLEROMA_SERVERS}
				onSelect={onSelect}
			/>
			<PopularServers
				label={t(`onboarding.popularAkkoma`)}
				items={POPULAR_AKKOMA_SERVERS}
				onSelect={onSelect}
			/>
		</HideOnKeyboardVisibleContainer>
	);
}

export default PopularMastoServersView;
