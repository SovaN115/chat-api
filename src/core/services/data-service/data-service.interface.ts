export interface DataService<T> {
    get(uuid: string): T
    getAll(): T[]
    put(obj: T): T
    delete(uuid: string): T
    softDelete(uuid: string): T
    delete(uuid: string): T
    edit(uuid: string, edits: T): T
}
