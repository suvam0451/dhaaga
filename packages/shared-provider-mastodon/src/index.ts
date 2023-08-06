import { mastodon } from "masto";

export { MastodonService } from "./_auth";
export { RestClient as RestClient } from "./native-client";
export { default as RestServices } from "./native";
export type { mastodon } from "masto";

// export commonly used types
// type MediaAttachment = mastodon.v1.MediaAttachment;
// type Status = mastodon.v1.Status;

// export type { MediaAttachment, Status };
