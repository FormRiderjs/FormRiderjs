export class CheckInputEmail{
    constructor() {
        this.validationErrorArray = [];
    }


    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        if (propertyValue === true) {
            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (regex.test(String(formInputValue).toLowerCase())) {
                return true;
            } else {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            }
        }
    }
}