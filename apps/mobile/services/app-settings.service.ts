import {Realm} from "@realm/react"
import UserDataTimelineRepository from "../repositories/userdata-timeline.repo";

class AppSettingsService {
  /**
   *  Currently, does the following:
   *
   *  - Populates Home/Local/Federated timeline
   */
  static populateSeedData(db: Realm) {
    db.write(() => {
      UserDataTimelineRepository.seed(db)
    })
  }
}

export default AppSettingsService;