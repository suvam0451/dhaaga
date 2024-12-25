import type {
	UserDetailed,
	Note,
	User,
	UserDetailedNotMe,
} from 'misskey-js/autogen/models.js';

export type MissUserDetailed = UserDetailed;
export type MissNote = Note;
export type MissUser = User;
export type MissUserDetailedNotMe = UserDetailedNotMe;
export type MissContext = {
	ancestors: any[];
	descendants: any[];
};
