import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : T;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;


export type Account = {
    id: Generated<number>;
    password: string;
    user_id: Generated<number | null>;
    coordinator_id: Generated<number | null>;
    admin_id: Generated<number | null>;
    created_at: Generated<Timestamp | null>;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
};

export type User = {
    id: Generated<number>;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    birthdate: Timestamp | null;
    email: string;
    contact_number: string | null;
    role: Generated<string>;
    created_at: Generated<Timestamp | null>;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;
};

export type CoopCoordinator = {
    id: Generated<number>;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    email: string;
    address: string;
    contact_number: string;
    coop_id: Generated<number>;
    role: Generated<string | null>;
    created_at: Generated<Timestamp | null>;
    updated_at: Timestamp | null;
    deleted_at: Timestamp | null;

};

export type Admin = {
    id: Generated<number>;
    first_name: string;
    last_name: string;
    birthdate: Timestamp | null;
    email: string;
    contact_number: string | null;
    role: Generated<string>;
    loginAttempts: Generated<number>;
    lastLoginAttempt: Timestamp | null;
    created_at: Generated<Timestamp | null>;
    updated_at: Timestamp | null;
    account: Account[];
};

export type Cooperative = {
    id: Generated<number>;
    name: string;
    description: string;
    province: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
};

export type CoopBank = {
    id: Generated<number>;
    cooperativeId: Generated<number>;
    name: string;
    accountNumber: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
};

export type UserAddress = {
    id: Generated<number>;
    userId: Generated<number>;
    address: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
};

export type Payment = {
    id: Generated<number>;
    userId: Generated<number>;
    billId: Generated<number>;
    coopId: Generated<number>;
    amount: Generated<number>;
    date: Generated<Timestamp>;
    status: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
};

export type Bill = {
    id: Generated<number>;
    meterAccountId: Generated<number>;
    coopId: Generated<number>;
    amount: Generated<number>;
    dueDate: Generated<Timestamp>;
    kwhConsume: Generated<number>;
    rate: Generated<number>;
    status: string;
    issuedDate: Generated<Timestamp>;
    referenceNumber: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
};

export type MeterAccount = {
    id: Generated<number>;
    meterId: string;
    userId: Generated<number>;
    coopId: Generated<number>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
};

export type MeterAddress = {
    id: Generated<number>;
    meterId: Generated<number>;
    meterProvince: string;
    meterTown: string;
    meterBrgy: string;
    meterSt: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
};

export type Settlement = {
    id: Generated<number>;
    coopId: Generated<number>;
    amount: Generated<number>;
    commission: Generated<number>;
    netAmount: Generated<number>;
    date: Generated<Timestamp>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
};

export type Role = {
    id: Generated<number>;
    name: string;
    permissions: string[];
    modules: string[];
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
};

export type CoordinatorRole = {
    id: Generated<number>;
    coordinatorId: Generated<number>;
    roleId: Generated<number>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
};

export type AdminLog = {
    id: Generated<number>;
    admin_id: Generated<number>;
    name: string;
    email: string;
    date: Generated<Timestamp>;
    time: string;
    activity: string;
};

export type PasswordReset = {
    id: Generated<number>;
    adminId: Generated<number | null>;
    userId: Generated<number | null>;
    coorId: Generated<number | null>;
    token: string;
    expiresAt: string;
};

export type DB = {
    account: Account;
    user: User;
    coopCoordinator: CoopCoordinator;
    admin: Admin;
    cooperative: Cooperative;
    coopBank: CoopBank;
    userAddress: UserAddress;
    payment: Payment;
    bill: Bill;
    meterAccount: MeterAccount;
    meterAddress: MeterAddress;
    settlement: Settlement;
    role: Role;
    coordinatorRole: CoordinatorRole;
    adminLog: AdminLog;
    passwordReset: PasswordReset;
};
