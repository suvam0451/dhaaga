import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Create a single query client instance for testing
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false, // optional, disable retry to simplify tests
		},
	},
});

export const createQueryClientWrapper = () => {
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
