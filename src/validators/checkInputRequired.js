export class CheckInputRequired {
    constructor() {
        this.validationErrorArray = [];
        this.inCommonValidatedStatus = false;
    }


    validateInCommon(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        if (typeof (propertyValue) === "object") {
            let regex = /^\s+/;
            if (regex.test(String(formInputValue)) || formInputValue.length === 0) {
                this.validationErrorArray.push(formInputName, formInputName + " " + propertyErrorText);
                this.inCommonValidatedStatus = false;
            } if (typeof (formInputValue) === "undefined") {
                this.validationErrorArray.push(formInputName, formInputName + " " + propertyErrorText);
                this.inCommonValidatedStatus = false;
            }
            if(!regex.test(String(formInputValue)) && formInputValue.length !== 0){
                this.inCommonValidatedStatus = true;
            }
        }
    }


    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        if (propertyValue === true) {
            let regex = /^\s+/;
            if (regex.test(String(formInputValue)) || formInputValue.length === 0) {
                this.validationErrorArray.push(formInputName, formInputName + " " + propertyErrorText);
            } else if (typeof (formInputValue) === "undefined") {
                this.validationErrorArray.push(formInputName, formInputName + " " + propertyErrorText);
            }
        }
    }
}