import {BSON, Realm} from "realm";
import UUID = BSON.UUID;
import AccountRepository from "../repositories/account.repo";

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
}

export default AccountService