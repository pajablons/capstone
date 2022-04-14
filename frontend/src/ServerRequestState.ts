export enum RequestState {
    READY,
    LOADING
}

export enum RequestType {
    NONE,
    INTERDICTING
}

export default interface ServerRequestStatus {
    status: RequestState
    start: Date
    requestType: RequestType
}