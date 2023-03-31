export class User {
    constructor(public id: string | null = null, public email: string | null = null, private _token: string | null = null, public tokenExpirationDate: Date | null = null) {
    }

    get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate < new Date()) {
            return null;
        }
        return this._token;
    }
}