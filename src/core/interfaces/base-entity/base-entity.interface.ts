export interface BaseEntityInterface {
    id: number;
    uuid: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}