import { UserType } from "../profile/_interface";
import {Status, StatusInterface} from "./_interface";


class UnknownToStatusAdapter implements StatusInterface {
  getUser(): UserType {
      throw new Error("Method not implemented.");
  }

  isReply(): boolean {
      return false
  }
  getParentStatusId(): string {
      throw new Error("Method not implemented.");
  }
  getUserIdParentStatusUserId(): string {
      throw new Error("Method not implemented.");
  }
  getRepostedStatusRaw(): Status {
    return null
  }

  getIsBookmarked() {
    return false
  }

  getRepliesCount(): number {
    return -1;
  }

  isValid() {
    return false
  }

  getId(): string {
    return "";
  }

  getRepostsCount(): number {
    return -1;
  }

  getFavouritesCount(): number {
    return -1;
  }

  getUsername() {
    return "";
  }

  getDisplayName() {
    return "";
  }

  getAvatarUrl() {
    return "";
  }

  getCreatedAt() {
    return new Date().toString();
  }

  getVisibility() {
    return "";
  }

  getAccountUrl() {
    return "";
  }

  getRepostedStatus(): StatusInterface | null | undefined {
    return null;
  }

  isReposted() {
    return false;
  }

  getContent() {
    return "";
  }

  getMediaAttachments() {
    return [];
  }

  print() {
    console.log("Unknown status type");
  }

  getAccountId_Poster(): string {
    return "";
  }
}

export default UnknownToStatusAdapter