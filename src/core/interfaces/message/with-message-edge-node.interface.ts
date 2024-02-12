import {MessageInterface} from "./message.interface";
import {Edge} from "../edge/edge.interface";

export interface WithMessageEdgeNodeInterface {
    messages: Edge<MessageInterface>
}