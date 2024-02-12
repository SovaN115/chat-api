import {FileInterface} from "./file.interface";
import {Edge} from "../edge/edge.interface";

export interface WithFileEdgeNodeInterface {
    files: Edge<FileInterface>
}