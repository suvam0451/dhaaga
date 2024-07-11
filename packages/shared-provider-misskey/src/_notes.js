export class NoteService {
    static async show({ client, noteId, }) {
        return await client.request('notes/show', { noteId });
    }
    static async getReactions({ client, noteId, }) {
        return await client.request('notes/reactions', { noteId });
    }
    static async searchByTag({ client, tag, }) {
        return await client.request('notes/search-by-tag', { limit: 20, tag });
    }
}
