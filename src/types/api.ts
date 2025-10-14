export type MatchDayBaseListQuery = {
    page?: number;
    itemsPerPage?: number;
    query?: string;
};

export type MatchDayAPIResponse<T> = {
    data: T;
};

export type MatchDayAPIListResponse<T> = MatchDayAPIResponse<T> & {
    page: number;
    totalPages: number;
};
