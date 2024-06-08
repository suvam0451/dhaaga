import {BSON, Realm, UpdateMode} from "realm"
import {Account, KeyValuePair} from "../entities/account.entity";
import UUID = BSON.UUID;

export type AccountCreateDTO = {
  domain: string;
  subdomain: string;
  username: string;
  avatarUrl: string
  password?: string;
  last_login_at?: Date;
  verified?: boolean;
};

class AccountRepository {
  static removeAll(db: Realm) {
    db.delete(db.objects(Account))
  }

  static remove(db: Realm, id: string) {
    db.delete(db.objects(Account).find((o) => o._id.toString() === id))
  }

  static select(db: Realm, _id: UUID) {
    const match = db.objectForPrimaryKey(Account, _id)
    const rem = db.objects(Account).filter((o) =>
        o._id.toString() !== _id.toString())
    match.selected = true
    rem.forEach((o) => {
      o.selected = false
    })
  }

  static deselect(db: Realm, _id: UUID) {
    const match = db.objectForPrimaryKey(Account, _id)
    const rem = db.objects(Account).filter((o) =>
        o._id.toString() !== _id.toString())
    match.selected = false
    rem.forEach((o) => {
      o.selected = false
    })
  }

  static upsert(db: Realm, account: AccountCreateDTO): Account {
    const match = this.find(db, account)
    return db.create(Account, {
      _id: match?._id || new Realm.BSON.UUID(),
      domain: account.domain,
      subdomain: account.subdomain,
      username: account.username,
      avatarUrl: account.avatarUrl,
      password: account.password,
      createdAt: match?.createdAt || new Date(),
      updatedAt: new Date(),
    }, UpdateMode.Modified);
  }

  static find(db: Realm, dto: AccountCreateDTO): Account {
    return db.objects(Account).find((o) => o.username === dto.username
        && o.domain === dto.domain
        && o.subdomain === dto.subdomain)
  }

  static findSecret(db: Realm, account: Account, key: string): KeyValuePair | null {
    if (!account) return null
    const acct = db.objects(Account).find((o) =>
        o._id?.toString() === account._id?.toString())
    if (!acct) return null
    return acct.secrets.find((o) => o.key === key)
  }

  static setSecret(db: Realm, account: Account, key: string, value: string):
      KeyValuePair | null {
    const match = this.findSecret(db, account, key)
    if (match) {
      match.value = value
      match.updatedAt = new Date()
      return match
    } else {
      const savedKvPair = db.create(KeyValuePair, {
        _id: new Realm.BSON.UUID(),
        key,
        value,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      account.secrets.push(savedKvPair)
      return savedKvPair
    }
  }

  static getAllSecrets(db: Realm, account: Account): Realm.List<KeyValuePair> {
    const acct = db.objects(Account).find((o) =>
        o._id.toString() === account._id.toString())
    if (!acct) return null
    return acct.secrets
  }
}

export default AccountRepository