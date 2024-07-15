import { useCallback, useState } from 'react';

function useSensitiveContent(isSensitive: boolean) {
	const [Show, setShow] = useState(!isSensitive);

	const toggleShow = useCallback(() => {
		if (!isSensitive) return;
		setShow((Show) => !Show);
	}, [isSensitive]);

	return { Show, toggleShow };
}

export default useSensitiveContent;
