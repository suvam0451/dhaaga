import { atom } from 'jotai';
import { randomUUID } from 'crypto';

export const isAppBottomSheetVisible = atom(false);
export const isNativeBottomSheetVisible = atom(false);

export const appBottomSheetRequestId = atom(randomUUID());
