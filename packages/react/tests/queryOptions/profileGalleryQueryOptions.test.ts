import { vi } from 'vitest';

// Mock the query options module
vi.mock('../../src/queryOptions', () => ({
	userGalleryQueryOpts: vi.fn(() => ({
		queryKey: ['profileGallery', 'mockUser'],
		queryFn: () => Promise.resolve([{ id: 1, name: 'mocked gallery item' }]),
	})),
}));