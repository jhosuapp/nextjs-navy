export interface UserNameResponse {
    username: string | undefined;
    uuid: string | undefined;
}

export interface UsernameBody {
    uuid: string;
    nick: string;
}