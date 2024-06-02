import {Realm} from "@realm/react"
import {UpdateMode} from "realm";
import {ActivityPubServerRepository} from "./activitypub-server.repo";
import {
  ActivityPubUserAdapter,
  StatusInterface,
} from "@dhaaga/shared-abstraction-activitypub/src";
import {ActivityPubUserRepository} from "./activitypub-user.repo";
import {
  ActivityPubStatus,
  ActivityPubStatusUpsertDTOType
} from "../entities/activitypub-status.entity";

export class ActivityPubStatusRepository {
  static upsert(db: Realm, {status, subdomain, domain}:
      { status: StatusInterface, subdomain: string, domain: string }) {
    const postedBy = ActivityPubUserAdapter(status.getUser(), domain)

    const payload: ActivityPubStatusUpsertDTOType = {
      url: status.getAccountUrl(),
      statusId: status.getId(),
      bookmarked: status.getIsBookmarked(),
      boostedCount: status.getRepostsCount(),
      content: status.getContent(),
      createdAt: status.getCreatedAt() ? new Date(status.getCreatedAt()) : new Date(),
      editedAt: status.getCreatedAt() ? new Date(status.getCreatedAt()) : new Date(),
      favourited: status.getIsFavourited(),
      reblogged: status.isReposted(),
      repliedCount: status.getRepliesCount(),
      replyToStatusId: null,
      replyToAcctId: null,
      sensitive: false,
      spoilerText: "",
      visibility: status.getVisibility()
    }
    const match = this.find(db, status.getId(), subdomain)
    const savedServer = ActivityPubServerRepository.upsert(db, subdomain)
    const savedPostedBy = ActivityPubUserRepository.upsert(db, {
      user: postedBy,
    })

    return db.create(
        ActivityPubStatus,
        {
          _id: match?._id || new Realm.BSON.UUID(),
          ...payload, server: savedServer,
          postedBy: savedPostedBy
        },
        UpdateMode.Modified,
    );
  }

  /**
   * Find a locally saved status, within a subdomain
   * @param db
   * @param statusId
   * @param subdomain
   */
  static find(db: Realm, statusId: string, subdomain: string) {
    return db.objects(ActivityPubStatus).find(
        (o) => o.statusId === statusId && o?.server?.url === subdomain)
  }
}