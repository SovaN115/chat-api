import { Node } from "../node/node.interface"

export interface Edge<T> {
    edges: Node<T>[],
    totalCount: number;
}
