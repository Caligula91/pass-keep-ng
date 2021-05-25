export interface Device {
    _id: string,
    deviceId: string,
    ip: string,
    location: string,
    os: string,
    platform: string,
    browser: string,
    lastActivity: string, 
}

export interface User {
    _id: string,
    name: string,
    email: string,
    role: string,
    userCreated: string,
    lastCheckedAccount?: string,
    lastCheckedAccountDate?: string,
    totalAccounts?: number,
    loggedDevices?: Array<Device>
}

export interface Accounts extends Array<{
    _id: string,
    name: string,
    userEmail: string,
    modified: string,
    image: string
}> {}

export interface GetMe {
    status: string,
    user: User,
    currentDevice: Device
}

export interface FetchAccounts {
    status: string,
    accounts: Accounts,
}

export interface AddAccount {
    status: string,
    accounts: Accounts,
}

export interface GetAccountPassword {
    status: string,
    account: {
        _id: string,
        name: string,
        userEmail: string,
        modified: string,
        image: string,
        password: string,
    }
}

export interface UpdateAccount {
    status: string,
    accounts: Accounts,
}

export interface GetImages {
    status: string,
    images: string[],
}

export interface Login {
    status: string,
    token: string,
    tokenExpires: string,
    user: User,
    message?: string,
}

export interface Signup {
    status: string,
    message: string,
}

export interface ReSendEmail {
    status: string,
    message: string,
}

export interface EmailConfirmation {
    status: string,
    token: string,
    tokenExpires: string,
    user: User,
}

export interface CheckEmailToken {
    status: string,
    message: string,
}

export interface ResetPassword {
    status: string,
    message: string,
}

export interface RequestPasswordResetEmail {
    status: string,
    message: string,
}

export interface UpdateUser {
    status: string,
    user: User,
}

export interface UpdatePassword {
    status: string,
    token: string,
    tokenExpires: string,
    user: User,
}

export interface DeactivateUser {
    status: string,
    message: string,
}

export interface DeleteUser {
    status: string,
    message: string,
}

export interface deleteLoggedDevice {
    status: string,
    message: string,
    user: User,
    currentDevice: Device,
}

export interface ResetPin {
    status: string,
    message: string,
}