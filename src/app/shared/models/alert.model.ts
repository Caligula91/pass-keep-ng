export enum AlertType {
    Success = 'SUCCESS',
    Error = 'ERROR',
    Warning = 'WARNING',
    Primary = 'PRIMARY',
}

export enum ActionType {
    FetchAccounts = '[FETCH_ACCOUNTS] Reload',
    FetchUser = '[FETCH_USER] Reload',
    ResendEmailConfirm = '[RESEND_EMAIL_CONFIRM] Send Email Again',
}

export class Alert {
    dismissible: boolean = true;
    action?: ActionType;
    constructor(public type: AlertType, public message: string, public options?: { action?: ActionType, dismissible?: boolean }) {
        if (options && options.dismissible !== undefined) {
            this.dismissible = options.dismissible;
        }
        this.action = options?.action;
    }
}