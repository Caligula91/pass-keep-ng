import { environment } from "src/environments/environment";

export class Account {
    image!: string;
    modified!: Date;
    constructor(
        public name: string,  
        modified: string, 
        image: string,
        public id: string, 
        public userEmail?: string) {
            this.image = `${environment.API_DOMAIN}/img/${image}`
            this.modified = new Date(modified)
        }
}