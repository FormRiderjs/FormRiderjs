export class CustomError extends Error{
    constructor(errorName, message) {
        super(message);
        this.name = errorName;
    }
}