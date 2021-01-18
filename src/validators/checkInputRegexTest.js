export class CheckInputRegexTest {
    constructor() {
        this.validationErrorArray = [];
    }

    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        let regexSource = propertyValue[0];
        let regexFlag = propertyValue[1];

        let regex = new RegExp(regexSource, regexFlag);

        if (typeof (propertyValue) === "object") {
            if (regex.test(formInputValue)) {
                this.validationErrorArray.push(formInputName,propertyErrorText);
            } else {
                return true;
            }
        }
    }
}
