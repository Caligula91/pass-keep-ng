export enum Status {
    Success = 'SUCCESS',
    Error = 'ERROR',
    Loading = 'LOADING',
}

export enum ActionTypes {
    FetchAccounts = 'FETCH_ACCOUNTS',
    GetAccountPassword = 'GET_ACCOUNT_PASSWORD',
    UpdateAccount = 'UPDATE_ACCOUNT',
    ResetPassword = 'RESET_PASSWORD',
    DeleteAccount = 'DELETE_ACCOUNT',
    AddAccount = 'ADD_ACCOUNT',
    Login = 'LOGIN',
    Signup = 'SIGNUP',
    ReSendEmail = 'RESEND_EMAIL',
    ForgotPassword = 'FORGOT_PASSWORD',
    UpdatePassword = 'UPDATE_PASSWORD',
    GetMe = 'GET_ME',
    UpdateName = 'UPDATE_NAME',
    DeactivateUser = 'DEACTIVATE_USER',
    DeleteUser = 'DELETE_USER',
    ConfirmEmail = 'CONFIRM_EMAIL'
}

export interface ServerAlert {
    status: Status,
    message?: string,
    action: ActionTypes,
    payload?: string | number,
}
