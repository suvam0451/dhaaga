import { Note } from "@dhaaga/shared-provider-misskey/dist";
import { mastodon } from "masto";

export class StatusInstance {
	instance: mastodon.v1.Status;
	constructor(instance: mastodon.v1.Status) {
		this.instance = instance;
	}
}

export class NoteInstance {
	instance: Note;
	constructor(instance: Note) {
		this.instance = instance;
	}
}
