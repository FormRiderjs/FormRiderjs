
export class CheckInputContainCapitalLetters{
    constructor() {
        this.validationErrorArray = [];
    }



    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        let typeofPropertyValue = typeof (propertyValue);


        //return true if input is being used / return false if not
        let inputIsBeingUsed = function(formInputValue){
            if(formInputValue.length > 0) {
                return true;
            }
            if(formInputValue.length === 0) {
                return false;
            }
        }


        let numberOfCapitalLetters = 0;
        let capitalLettersCounter = function (formInputValue) {
            for (let i = 0; i < formInputValue.length; i++) {
                if (formInputValue[i] === formInputValue[i].toUpperCase()
                    && formInputValue[i] !== formInputValue[i].toLowerCase()) {
                    numberOfCapitalLetters++;
                }
            }
        };

        if (typeofPropertyValue === "boolean") {
            if (propertyValue === true) {
                let regex = /[a-z]/;

                // Regular expression in order to test if all characters are Uppercase
                if (regex.test(formInputValue)) {
                    this.validationErrorArray.push(formInputName,propertyErrorText);
                } else {
                    return true;
                }
            }

            if (propertyValue === false) {
                let regex = /[A-Z]/;

                if (regex.test(formInputValue)) {
                    this.validationErrorArray.push(formInputName,propertyErrorText);
                } else {
                    return true;
                }
            }

        } else if (typeofPropertyValue === "number" && inputIsBeingUsed(formInputValue)) {

            capitalLettersCounter(formInputValue);

            if (propertyValue !== numberOfCapitalLetters) {
                this.validationErrorArray.push(formInputName,propertyErrorText);
            } else {
                return true;
            }

        } else if (typeofPropertyValue === "object" && inputIsBeingUsed(formInputValue)) {
            let propertyValueMinimum = propertyValue[0];
            let propertyValueMaximum = propertyValue[1];
            let typeofPropertyValueMinimum = typeof (propertyValueMinimum);
            let typeofPropertyValueMaximum = typeof (propertyValueMaximum);


            if (propertyValueMinimum === true && typeofPropertyValueMaximum === "number") {

                capitalLettersCounter(formInputValue);
                if (numberOfCapitalLetters === 0 || numberOfCapitalLetters > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName,propertyErrorText);
                } else {
                    return true;
                }

            } else if (typeofPropertyValueMinimum === "number" && propertyValueMaximum === true) {
                capitalLettersCounter(formInputValue);
                if (numberOfCapitalLetters === 0 || numberOfCapitalLetters < propertyValueMinimum) {
                    this.validationErrorArray.push(formInputName,propertyErrorText);
                } else {
                    return true;
                }
            } else if (typeofPropertyValueMinimum === "number" && typeofPropertyValueMaximum === "number") {
                capitalLettersCounter(formInputValue);
                if (numberOfCapitalLetters < propertyValueMinimum || numberOfCapitalLetters > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName,propertyErrorText);
                } else {
                    return true;
                }
            }
        }
    }
}
