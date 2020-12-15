export class CheckInputNumberBiggerThan{
    constructor() {
        this.validationErrorArray = [];
    }

    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        if (formInputValue > propertyValue) {
            return true;
        } else {
            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
        }
    }
}