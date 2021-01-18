export class CheckInputMinLength {
    constructor() {
        this.validationErrorArray = [];
    }
    //check input min length, this function is sensible to empty space
    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText)
    {
        formInputValue = formInputValue.toString();
        if (formInputValue.length < propertyValue) {
            this.validationErrorArray.push(formInputName,propertyErrorText);
        } else {
            return true;
        }
    }

}


