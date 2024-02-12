import {ChatUserInterface} from "./chat-user.interface";
import {Edge} from "../edge/edge.interface";

export interface WithChatUserEdgeNodeInterface {
    chatUsers: Edge<ChatUserInterface>
}