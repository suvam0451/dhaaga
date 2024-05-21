import {UserInterface} from "./_interface";

export class DefaultUser implements UserInterface {
  getAvatarBlurHash(): string {
    throw new Error("Method not implemented.");
  }

  getAvatarUrl(): string {
    throw new Error("Method not implemented.");
  }

  getBannerUrl(): string | null {
    throw new Error("Method not implemented.");
  }

  getBannerBlurHash(): string | null {
    throw new Error("Method not implemented.");
  }

  getDescription(): string | null {
    throw new Error("Method not implemented.");
  }

  getCreatedAt(): Date {
    throw new Error("Method not implemented.");
  }

  getBirthday(): Date | null {
    throw new Error("Method not implemented.");
  }

  getFields(): any[] {
    throw new Error("Method not implemented.");
  }

  getFollowersCount(): number {
    throw new Error("Method not implemented.");
  }

  getFollowingCount(): number {
    throw new Error("Method not implemented.");
  }

  hasPendingFollowRequestFromYou(): boolean | null {
    throw new Error("Method not implemented.");
  }

  hasPendingFollowRequestToYou(): boolean | null {
    throw new Error("Method not implemented.");
  }

  getId(): string {
    throw new Error("Method not implemented.");
  }

  getIsBot(): boolean {
    throw new Error("Method not implemented.");
  }

  getDisplayName(): string | null {
    throw new Error("Method not implemented.");
  }

  getPostCount(): number {
    throw new Error("Method not implemented.");
  }

  getUsername(): string {
    throw new Error("Method not implemented.");
  }

  getOnlineStatus(): "unknown" | "online" | "active" | "offline" {
    throw new Error("Method not implemented.");
  }


}

export default DefaultUser