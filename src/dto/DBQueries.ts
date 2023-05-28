export interface DBConnectionResponse<T> {
    connected: boolean,
    client?: T
}

export interface DBSearchQueryResponseDTO {
    status: boolean,
    error?: any,
    data?: any
}

export interface DBInsertResponseDTO {
    status: boolean,
    error?: any
}

export interface DBUserCredentialQuery {
    email?: string,
    phone?: number,
    username?: string,
    password: string
}