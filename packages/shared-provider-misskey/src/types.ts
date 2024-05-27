import type {UserDetailed} from "misskey-js/built/esm/entities";

export type MiauthSessionCheckResponse =
    | { ok: false }
    | {
  ok: true;
  token: string;
  user: UserDetailed;
};
