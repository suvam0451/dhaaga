declare module 'react-dom/client' {
	import * as ReactDOM from 'react-dom';

	export function createRoot(container: HTMLElement | null): {
		render(children: React.ReactNode): void;
		unmount(): void;
	};
}
