export class CheckInputRequired{
    constructor() {
         this.validationErrorArray = [];
    }


    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        if (propertyValue === true) {
            let regex = /^\s+/;
            if (regex.test(String(formInputValue)) || formInputValue.length === 0) {
                // this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            } else if (typeof (formInputValue) === "undefined") {
                // this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            }
        }
    }
}