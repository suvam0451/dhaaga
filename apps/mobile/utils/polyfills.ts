export default function polyfills() {
	// Polyfill for AbortSignal.any (not available in React Native)
	if (typeof AbortSignal.any === 'undefined') {
		AbortSignal.any = function (signals: AbortSignal[]): AbortSignal {
			const controller = new AbortController();

			// If any signal is already aborted, abort immediately
			for (const signal of signals) {
				if (signal.aborted) {
					controller.abort();
					return controller.signal;
				}
			}

			// Listen for abort events on all signals
			const abortHandler = () => controller.abort();
			for (const signal of signals) {
				signal.addEventListener('abort', abortHandler);
			}

			return controller.signal;
		};
	}
}
