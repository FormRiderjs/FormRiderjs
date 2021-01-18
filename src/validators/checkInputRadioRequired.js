
export class CheckInputRadioRequired {
    constructor() {
        this.validationErrorArray = [];
        this.inCommonValidatedStatus = false;
    }




    validateInCommon(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        if (formInputValue === "otfRadioNoValue") {
            this.validationErrorArray.push(propertyValue,propertyErrorText);
            this.inCommonValidatedStatus = false;
        }
        if (formInputValue !== "otfRadioNoValue") {
            //we pushing even when validated because otherwise when checking all checkboxes we will get an empty validation error array and it wont get purified later, so inCommonGivenPoints wont even get noticed
            this.validationErrorArray.push(propertyValue,propertyErrorText);
            this.inCommonValidatedStatus = true;
        }
    }
}