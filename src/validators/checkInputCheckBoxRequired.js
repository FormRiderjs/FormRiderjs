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
            this.inCommonValidatedStatus = true;
        }
    }




    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        if (formInputValue === "otfCheckBoxNoValue") {
            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
        }

    }
}