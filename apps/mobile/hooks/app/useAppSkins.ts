import { useState } from 'react';
import { DHAAGA_SKIN } from '#/types/app.types';

export default function useAppSkins() {
	const [ActiveSkin, setActiveSkin] = useState<DHAAGA_SKIN | null>(null);

	function changeActiveSkin(skin: DHAAGA_SKIN) {
		setActiveSkin(skin);
	}

	return { activeSkin: ActiveSkin, changeActiveSkin };
}
