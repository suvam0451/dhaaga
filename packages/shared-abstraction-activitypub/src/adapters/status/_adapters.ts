import MisskeyToStatusAdapter from "./misskey";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import MastodonToStatusAdapter from "./mastodon";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import UnknownToStatusAdapter from "./default";
import {NoteInstance, StatusInstance, StatusInterface} from "./_interface";

/**
 * @param status any status object
 * @param domain domain from database
 * @returns StatusInterface
 */
export function ActivitypubStatusAdapter(
    status: any,
    domain: string): StatusInterface {
  switch (domain) {
    case "misskey": {
      return new MisskeyToStatusAdapter(new NoteInstance(status as Note));
    }
    case "mastodon": {
      return new MastodonToStatusAdapter(
          new StatusInstance(status as mastodon.v1.Status)
      );
    }
    default: {
      return new UnknownToStatusAdapter();
    }
  }
}