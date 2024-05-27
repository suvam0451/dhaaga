import MisskeyToStatusAdapter, {MisskeyToStatusContextAdapter} from "./misskey";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import MastodonToStatusAdapter, {
  MastodonToStatusContextAdapter
} from "./mastodon";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import UnknownToStatusAdapter, {UnknownToStatusContextAdapter} from "./default";
import {
  NoteInstance,
  StatusContextInstance, StatusContextInterface,
  StatusInstance,
  StatusInterface
} from "./_interface";

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

export function ActivityPubStatusContextAdapter
(
    status: any,
    domain: string): StatusContextInterface {
  switch (domain) {
    case "misskey": {
      const postInstance = new NoteInstance(status as Note)
      const postInterface = new MisskeyToStatusAdapter(postInstance)
      const ctxInstance = new StatusContextInstance(postInterface)
      return new MisskeyToStatusContextAdapter(postInterface, ctxInstance)
    }
    case "mastodon": {
      const postInstance = new StatusInstance(status as mastodon.v1.Status)
      const postInterface = new MastodonToStatusAdapter(postInstance)
      const ctxInstance = new StatusContextInstance(postInterface)
      return new MastodonToStatusContextAdapter(postInterface, ctxInstance)
    }
    default: {
      const postInterface = new UnknownToStatusAdapter()
      const ctxInstance = new StatusContextInstance(postInterface);
      return new UnknownToStatusContextAdapter(postInterface, ctxInstance)
    }
  }
}