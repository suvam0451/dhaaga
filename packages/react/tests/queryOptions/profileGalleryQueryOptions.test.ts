import { useQuery } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, expect, test } from 'vitest';
import { createQueryClientWrapper } from './_wrapper';

// Mock the query options module
vi.mock('../../src/queryOptions', () => ({
	profileGalleryQueryOptions: vi.fn(() => ({
		queryKey: ['profileGallery', 'mockUser'],
		queryFn: () => Promise.resolve([{ id: 1, name: 'mocked gallery item' }]),
	})),
}));

// Import the mocked module
import { userGallery } from '../../src/queryOptions';

function useCustomHook() {
	return useQuery(userGallery(null, null));
}

test('activitypub client is able to fetch profile gallery', async () => {
	const { result } = renderHook(() => useCustomHook(), {
		wrapper: createQueryClientWrapper(),
	});

	await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
