export class CheckInputContainSpecialCharacters {
    constructor() {
        this.validationErrorArray = [];
    }


    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {


        //return true if input is being used / return false if not
        let inputIsBeingUsed = function(formInputValue){
            if(formInputValue.length > 0) {
                return true;
            }
            if(formInputValue.length === 0) {
                return false;
            }
        }



        let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        let specialCharacterCount = (string) => {
            return (string.match(regex) || []).length;
        };
        let numberOfSpecialCharacters = specialCharacterCount(formInputValue);

        let formInputLength = formInputValue.length;

        if (typeof (propertyValue === "boolean")) {

            if (propertyValue === true) {
                if (formInputLength > numberOfSpecialCharacters) {
                    this.validationErrorArray.push(formInputName, propertyErrorText);
                } else {
                    return true;
                }
            } else if (propertyValue === false) {
                if (regex.test(formInputValue)) {
                    this.validationErrorArray.push(formInputName, propertyErrorText);
                } else {
                    return true;
                }
            }
        }
        if (typeof (propertyValue) === "number" && inputIsBeingUsed(formInputValue)) {
            if (numberOfSpecialCharacters !== propertyValue) {
                this.validationErrorArray.push(formInputName, propertyErrorText);
            } else {
                return true;
            }
        }
        if (typeof (propertyValue) === "object" && inputIsBeingUsed(formInputValue)) {
            let propertyValueMinimum = propertyValue[0];
            let propertyValueMaximum = propertyValue[1];

            if (typeof (propertyValueMinimum) === "number"
                && propertyValueMaximum === true) {
                if (numberOfSpecialCharacters < propertyValueMinimum) {
                    this.validationErrorArray.push(formInputName, propertyErrorText);
                } else {
                    return true;
                }
            } else if (propertyValueMinimum === true
                && typeof (propertyValueMaximum) === "number") {

                if (numberOfSpecialCharacters > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName, propertyErrorText);
                } else {
                    return true;
                }
            } else if (typeof (propertyValueMinimum) === "number"
                && typeof (propertyValueMaximum) === "number") {

                if (numberOfSpecialCharacters < propertyValueMinimum
                    || numberOfSpecialCharacters > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName, propertyErrorText);
                }
            }
        }
    }
}




