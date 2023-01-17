export interface Get<T> {
    get(context:T):Promise<void>;
}

export interface Post<T> {
    post(context:T):Promise<void>;
}

export interface Put<T> {
    put(context:T):Promise<void>;
}

export interface Delete<T> {
    delete(context:T):Promise<void>;
}
