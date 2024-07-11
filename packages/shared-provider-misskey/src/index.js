import axios from 'axios';
import { api as misskeyApi } from 'misskey-js';
export { api as misskeyApi } from 'misskey-js';
export const createClient = (instanceUrl, token) => {
    return new misskeyApi.APIClient({
        origin: instanceUrl,
        credential: token,
    });
};
export const verifyToken = async (host, session) => {
    const res = await axios.post(`${host}/api/miauth/${session}/check`);
    return res.data;
};
export const createCodeRequestUrl = (instanceUrl, uuid) => {
    const authEndpoint = `${instanceUrl}/miauth/${uuid}`;
    // Set up parameters for the query string
    const options = {
        name: 'Dhaaga',
        callback: 'https://example.com/',
        permission: 'write:notes,write:following,read:drive',
    };
    // Generate the query string
    const queryString = Object.keys(options)
        .map((key) => `${key}=${encodeURIComponent(options[key])}`)
        .join('&');
    return `${authEndpoint}?${queryString}`;
};
export class NotesAPI {
    static async localTimeline(client) {
        return await client.request('notes/local-timeline', { limit: 20 });
    }
}
