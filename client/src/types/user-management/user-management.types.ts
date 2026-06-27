export type User = {
    id: string;
    image?: string;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    phone?: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    avatarUrl: string;
};

export type GetUserParams = {
    page: number;
    limit: number;
    search: string;
    status: string;
    roleId: string;
};

export type GetUserResponse = {
    users: User[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
};
