import {GetOptionsInterface} from "./get-options.interface";

export class GetOptions implements GetOptionsInterface{
    limit: number;
    offset: number;
}