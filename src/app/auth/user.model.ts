export class User {

    public tokenExpires!: Date;

    constructor(
        public _id: string,
        public email: string,
        public name: string,
        public token: string,
        tokenExpires: string) {
            this.tokenExpires = new Date(tokenExpires);
        }
    
    isTokenValid(): boolean {
        return this.tokenExpires && this.tokenExpires > new Date(Date.now());
    }
}