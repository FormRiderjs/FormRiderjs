export class CustomError extends Error{
    constructor(errorName, message) {
        super(message);
        this.name = errorName;
    }


    static yup(){
        throw new CustomError("FormRider.js ERROR", "Property value of dateFormat more that a single true value located at the propertyDateValueArray[1] ");
    }
}