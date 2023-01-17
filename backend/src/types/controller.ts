import { Delete, Get, Post } from "./rest-methods";

export interface IController<T>  extends Get<T>, Post<T>, Delete<T> {

    get(context:T):Promise<void>;

    create(context:T):Promise<void>;
        
    delete(context:T):Promise<void>;

    getById(context:T):Promise<void>;

    updateById(context:T):Promise<void>;

}
