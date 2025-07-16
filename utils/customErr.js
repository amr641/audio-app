export class AppError extends Error {
    constructor(messsage, status, success = false) {
        super(messsage);
        this.success = success;
        this.status = status;
    }
}
