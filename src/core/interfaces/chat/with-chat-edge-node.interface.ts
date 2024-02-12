import {Edge} from "../edge/edge.interface";
import {ChatInterface} from "./chat.interface";

export interface WithChatEdgeNodeInterface {
    chats: Edge<ChatInterface>
}