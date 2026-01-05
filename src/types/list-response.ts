export type PaginationMeta = {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export type ListResponse<T> = {
    items: T[];
    pagination: PaginationMeta;
};
