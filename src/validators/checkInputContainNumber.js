export class CheckInputContainNumber{
    constructor() {
        this.validationErrorArray = [];
    }

    //verify if the input type is int or float (number)
    //chek if inputs value is a number
    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        let formInputValueLength = formInputValue.length;

        let numberOfNumbersInFormInput = 0;
        let numberCounter = function (formInputValue) {
            for (let character of formInputValue) {
                let characterAsNumber = Number(character);
                if (characterAsNumber !== characterAsNumber || character === " ") {
                } else {
                    numberOfNumbersInFormInput++;
                }
            }
        };

        if (typeof (propertyValue) === "object" && formInputValueLength > 0) {
            let propertyValueMinimum = propertyValue[0];
            let propertyValueMaximum = propertyValue[1];


            if (propertyValueMinimum === true && typeof (propertyValueMaximum) === "number") {
                numberCounter(formInputValue);
                if (numberOfNumbersInFormInput > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName,propertyErrorText);
                }

            } else if (typeof (propertyValueMinimum) === "number" && propertyValueMaximum === true) {
                numberCounter(formInputValue);

                // here below : && numberOfNumbersInFormInput > 0 is for empty inputs
                if (numberOfNumbersInFormInput < propertyValueMinimum) {
                    this.validationErrorArray.push(formInputName,propertyErrorText);
                }
            } else if (typeof (propertyValueMinimum) === "number" && typeof (propertyValueMaximum) === "number") {
                numberCounter(formInputValue);

                if (numberOfNumbersInFormInput < propertyValueMinimum || numberOfNumbersInFormInput > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName,propertyErrorText);
                }
            }

        } else if (typeof (propertyValue) === "boolean" && formInputValueLength > 0) {
            if (propertyValue === true) {
                numberCounter(formInputValue);
                if (numberOfNumbersInFormInput < formInputValueLength) {
                    this.validationErrorArray.push(formInputName,propertyErrorText);
                }
            } else if (propertyValue === false) {

                numberCounter(formInputValue);
                if (numberOfNumbersInFormInput > 0) {
                    this.validationErrorArray.push(formInputName,propertyErrorText);
                }
            }
        }
        else if (typeof (propertyValue) === "number" && formInputValueLength > 0){
            numberCounter(formInputValue);
            if(numberOfNumbersInFormInput !== propertyValue){
                this.validationErrorArray.push(formInputName, propertyErrorText);
            }
        }
    }
}