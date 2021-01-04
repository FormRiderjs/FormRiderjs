
export class CheckInputRadioRequired {
    constructor() {
        this.validationErrorArray = [];
        this.inCommonValidatedStatus = false;
    }




    validateInCommon(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        if (formInputValue === "otfRadioNoValue") {
            this.validationErrorArray.push(formInputName,formInputName + " " + propertyErrorText);
            this.inCommonValidatedStatus = false;
        }
        if (formInputValue !== "otfRadioNoValue") {
            this.inCommonValidatedStatus = true;
        }
    }

/*    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        if (formInputValue === "otfRadioNoValue") {
            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            this.updatedInCommon.push(propertyValue[0]);
        }
    }*/
}