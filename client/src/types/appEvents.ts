export type AppEvent =
    | {
        type: "LOGIN";
        userId: string;
    }
    | {
        type: "LOGOUT";
    }
    | {
        type: "COMPANY_CHANGED";
        companyId: string;
    } | {
        type: "ROLE_SELECTED";
        roleId: string;
    };