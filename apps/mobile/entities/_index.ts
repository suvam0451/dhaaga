import {ActivityPubServer} from './activitypub-server.entity';
import {ActivityPubUser} from "./activitypub-user.entity";
import {ActivityPubStatus} from "./activitypub-status.entity";
// import {ActivityPubChatRoom} from "./activitypub-chatroom.entity";
import {
  ActivityPubConversation
} from "./activitypub-conversation.entity";
import {ActivityPubChatRoom} from "./activitypub-chatroom.entity";

export const schemas = [
    ActivityPubServer,
  ActivityPubUser,
  ActivityPubChatRoom, ActivityPubStatus,
  ActivityPubConversation];
