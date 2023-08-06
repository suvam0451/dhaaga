import type { UserDetailed } from "misskey-js/built/entities";

export type MiauthSessionCheckResponse =
	| { ok: false }
	| {
			ok: true;
			token: string;
			user: UserDetailed;
	  };
