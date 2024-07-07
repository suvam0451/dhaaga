import { UserDetailed } from 'misskey-js/autogen/models.js';

export type MiauthSessionCheckResponse =
	| { ok: false }
	| {
			ok: true;
			token: string;
			user: UserDetailed;
	  };
