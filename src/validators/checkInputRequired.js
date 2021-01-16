export class CheckInputRequired {
    constructor() {
        this.validationErrorArray = [];
        this.inCommonValidatedStatus = false;
    }


    validateInCommon(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        if (typeof (propertyValue) === "object") {

            let regex = /^\s+/;
            if (regex.test(String(formInputValue)) || formInputValue.length === 0) {
                this.validationErrorArray.push(propertyValue, formInputName + " " + propertyErrorText);
                this.inCommonValidatedStatus = false;
            }
            if (typeof (formInputValue) === "undefined") {
                this.validationErrorArray.push(propertyValue, formInputName + " " + propertyErrorText);
                this.inCommonValidatedStatus = false;
            }
            if (!regex.test(String(formInputValue)) && formInputValue.length !== 0) {
                //we pushing even when validated because otherwise when checking all checkboxes we will get an empty validation error array and it wont get purified later, so inCommonGivenPoints wont even get noticed
                this.validationErrorArray.push(propertyValue,formInputName + " " + propertyErrorText);
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