import { api } from 'misskey-js';
import { UserDetailed } from 'misskey-js/built/entities';

type MiauthSessionCheckResponse = {
    ok: false;
} | {
    ok: true;
    token: string;
    user: UserDetailed;
};

declare const createClient: (instanceUrl: string, token: string) => api.APIClient;
declare const verifyToken: (host: string, session: string) => Promise<MiauthSessionCheckResponse>;
declare const createCodeRequestUrl: (instanceUrl: string) => string;

export { createClient, createCodeRequestUrl, verifyToken };
