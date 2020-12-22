export class CheckInputCheckboxRequired {
    constructor() {
        this.validationErrorArray = [];
    }


    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        if (formInputValue === "otfCheckBoxNoValue") {
            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
        }

    }
}