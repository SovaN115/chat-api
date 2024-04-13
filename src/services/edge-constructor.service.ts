import {Injectable} from '@nestjs/common';
import {Edge} from "../core/interfaces/edge/edge.interface";

@Injectable()
export class EdgeConstructorService {
    getEdgeFromArray<T>(array: T[]): Edge<T> {
        return {
            edges: array.map((item) => ({node: item})),
            totalCount: array.length
        } 
    }

    getEdgeFromEntity<T>(entity: T) {

        for (const entityKey in entity) {
            const keyValue = entity[entityKey];
            if(Array.isArray(keyValue))   {
                const value = (keyValue as Array<any>).map(item => this.getEdgeFromEntity(item));
                console.log(value)
                //@ts-ignore
                entity[entityKey] = this.getEdgeFromArray(value);
            }
        }
        console.log(entity)
        return entity;
    }
}
