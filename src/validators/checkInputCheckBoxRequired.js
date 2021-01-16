export class CheckInputCheckboxRequired {
    constructor() {
        this.validationErrorArray = [];
        this.inCommonValidatedStatus = false;
    }


    validateInCommon(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        if (formInputValue === "otfCheckBoxNoValue") {
            this.validationErrorArray.push(propertyValue,formInputName + " " + propertyErrorText);
            this.inCommonValidatedStatus = false;
        }
        if (formInputValue !== "otfCheckBoxNoValue") {
            //we pushing even when validated because otherwise when checking all checkboxes we will get an empty validation error array and it wont get purified later, so inCommonGivenPoints wont even get noticed
            this.validationErrorArray.push(propertyValue,formInputName + " " + propertyErrorText);
            this.inCommonValidatedStatus = true;
        }
    }




    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        if (formInputValue === "otfCheckBoxNoValue") {
            this.validationErrorArray.push(formInputName, formInputName + " " + propertyErrorText);
        }
    }
}