export class CheckInputContainWhiteSpace {
    constructor() {
        this.validationErrorArray = [];
    }
    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        let propertyContain = propertyValue[0];
        let propertyStart = propertyValue[1];

        let regexPropertyStart = /^\s/;
        let regexPropertyContain = /\s+/g;

        //cannot contain and cannot start
        if (propertyContain === false && propertyStart === false) {
            if (regexPropertyContain.test(formInputValue)) {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            } else {
                return true;
            }
            //can contain but cannot start with white spaces
        } else if (propertyContain === true && propertyStart === false) {
            if (regexPropertyStart.test(formInputValue)) {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            } else {
                return true;
            }
            //can contain and can start
        } else {
            return true;
        }
    }
}