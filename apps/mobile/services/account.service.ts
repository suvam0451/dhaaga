import {BSON, Realm} from "realm";
import UUID = BSON.UUID;
import AccountRepository from "../repositories/account.repo";
import {ActivityPubClient} from "@dhaaga/shared-abstraction-activitypub/src";
import {ActivityPubTagRepository} from "../repositories/activitypub-tag.repo";

class AccountService {
  static selectAccount(db: Realm, _id: UUID) {
    db.write(() => {
      AccountRepository.select(db, _id)
    })
  }

  static deselectAccount(db: Realm, _id: UUID) {
    db.write(() => {
      AccountRepository.deselect(db, _id)
    })
  }

  static loadFollowedTags(db: Realm, client: ActivityPubClient) {
    client.getFollowedTags({limit: 200}).then((res: any) => {
      db.write(() => {
        ActivityPubTagRepository.clearFollowing(db)
        ActivityPubTagRepository.applyFollowing(db, res.data)
      })
    })
  }

  static updateTagStatus(db: Realm, name: string, followed: boolean) {

  }
}

export default AccountService