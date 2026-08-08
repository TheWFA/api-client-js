export type ListResponse<T> = {
    items: T[];
    totalItems: number;
    page: number;
    itemsPerPage: number;
};

/** A list response for endpoints that return every item in one go, without pagination. */
export type UnpaginatedListResponse<T> = {
    items: T[];
    totalItems: number;
};
