import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { atomWithStorage, createJSONStorage } from 'jotai/utils';

type Account = {
	id: string;
	identifier: string;
	software: string;
	server: string;
	username: string;
	selected: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export const appAccountCreateDto = z.object({
	identifier: z.ostring(),
	software: z.string(),
	server: z.string(),
	username: z.string(),
});

const storage = createJSONStorage(() => sessionStorage);
const someAtom = atomWithStorage('Zustand_Persist_Accounts', [], {
	getItem(key, initialValue) {
		const storedValue = localStorage.getItem(key);
		try {
			// return appAccountCreateDto.parse(JSON.parse(storedValue ?? ''));
		} catch {
			return initialValue;
		}
	},
	setItem(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	},
	removeItem(key) {
		localStorage.removeItem(key);
	},
});
