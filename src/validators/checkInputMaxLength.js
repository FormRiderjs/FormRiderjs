export class CheckInputMaxLength {
    constructor() {
        this.validationErrorArray = [];

    }

    //check input max length, this function is sensible to empty space
    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        //return true if input is being used / return false if not
        let inputIsBeingUsed = function (formInputValue) {
            if (formInputValue.length > 0) {
                return true;
            }
            if (formInputValue.length === 0) {
                return false;
            }
        }



        formInputValue = formInputValue.toString();
        if (formInputValue.length > propertyValue && inputIsBeingUsed(formInputValue)) {
            this.validationErrorArray.push(formInputName,propertyErrorText);
        } else {
            return true;
        }
    }
}



