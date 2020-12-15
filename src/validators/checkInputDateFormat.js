export class CheckInputDateFormat{
    constructor() {

        this.validationErrorArray = [];
    }

    validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        let propertyDateValueArray = propertyValue[0];
        let propertyDateLimitationArray = propertyValue[1];
        let propertyDateSeparator = propertyValue[2][0];

        let propertyDateValueArrayLength = propertyDateValueArray.length;
        let propertyDateLimitationArrayLength = propertyDateLimitationArray.length;
        let formInputValueLength = formInputValue.length;


        let dateSeparatorCounter = function (string, regex) {
            return (string.match(regex) || []).length;
        }

        let numberCounter = function (string) {
            let numberOfNumbersInFormInput = 0;

            for (let character of string) {
                let characterAsNumber = Number(character);
                if (characterAsNumber !== characterAsNumber || character === " ") {
                } else {
                    numberOfNumbersInFormInput++;
                }
            }
            return numberOfNumbersInFormInput;
        };

        let sumOfNumbersInPropertyDateValueArray = function () {
            let characterNumber = 0;
            for (let i = 0; i < propertyDateValueArrayLength; i++) {
                if (typeof (propertyDateValueArray[i]) === "number") {
                    characterNumber = characterNumber + propertyDateValueArray[i];
                }
            }
            return characterNumber;
        };

        let numberOfDateValueFieldContainingNumber = 0;
        let indexOfDateValueFieldContainingNumber = [];
        let numberOfDateValueFieldsContainingTrue = 0;
        let indexOfDateValueFieldContainingTrue = [];
        let checkAllDateValueArrayFieldsType = function () {
            for (let i = 0; i < propertyDateValueArrayLength; i++) {
                if (typeof (propertyDateValueArray[i]) === "number") {
                    numberOfDateValueFieldContainingNumber++;
                    indexOfDateValueFieldContainingNumber.push(i);
                }

                if (propertyDateValueArray[i] === true) {

                    numberOfDateValueFieldsContainingTrue++;
                    indexOfDateValueFieldContainingTrue.push(i);
                }
            }
        };
        checkAllDateValueArrayFieldsType();


        let checkCharacterIfNumber = function (character) {
            let regex = /[0-9]/g;
            return regex.test(character);
        }

        let doCheckForWhiteSpace = function (string) {
            let regex = /\s+/g;
            return regex.test(string);
        }


        let doTestStringForSpecialChars = function (string) {
            let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
            return regex.test(string);
        }


        let numberOfNumbersInFormInputValue = numberCounter(formInputValue);
        let testForSpecialChars = doTestStringForSpecialChars(formInputValue);
        let numberOfNumbersInPropertyDateValueArray = sumOfNumbersInPropertyDateValueArray();
        let startingIndex = 0;


        if (propertyDateSeparator === "") {

            /*  ERROR CASES MANAGEMENT
                -if the input is not only numbers but but JSON said the input should be only numbers
                -if the input is only numbers but JSON said it should be numbers and characters
                -if sum of numbers in JSON is not equal to number of numbers in form input
                -if there is white spaces in the input
            * */
            if ((testForSpecialChars === true)
                || ((numberOfNumbersInFormInputValue !== formInputValueLength && numberOfDateValueFieldContainingNumber === propertyDateValueArrayLength) && (formInputValueLength > 0))
                || ((numberOfNumbersInFormInputValue === formInputValueLength && numberOfDateValueFieldsContainingTrue > 0) && (formInputValueLength > 0))
                || ((numberOfNumbersInFormInputValue !== numberOfNumbersInPropertyDateValueArray) && (formInputValueLength > 0))
                || doCheckForWhiteSpace(formInputValue) === true) {

                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            } else {

                //another way of saying "Input should contain only numbers"
                if (numberOfDateValueFieldContainingNumber === propertyDateValueArrayLength
                    && formInputValueLength > 0) {

                    for (let i = 0; i < propertyDateValueArrayLength; i++) {

                        let propertyDateValue = propertyDateValueArray[i];

                        let propertyDateLimitationMinValue = propertyDateLimitationArray[i][0];
                        let propertyDateLimitationMaxValue = propertyDateLimitationArray[i][1];

                        let slicedValue = formInputValue.slice(startingIndex, startingIndex + propertyDateValue);
                        startingIndex += propertyDateValue;

                        // incrementing the startingIndex so next value will be a new slice
                        if (slicedValue < propertyDateLimitationMinValue
                            || slicedValue > propertyDateLimitationMaxValue) {

                            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                        }
                    }
                }


                // IT SHOULD CONTAIN a STRING e.g. 04september1994
                if (numberOfDateValueFieldsContainingTrue === 1) {

                    for (let i = 0; i < propertyDateValueArrayLength; i++) {
                        let characterIsNumber = checkCharacterIfNumber(formInputValue[startingIndex]);
                        let propertyDateValue = propertyDateValueArray[i];
                        let stringLength = 0;
                        let slicedValue;

                        if (typeof (propertyDateValue) === "number" && formInputValueLength > 0) {

                            if (characterIsNumber === false) {
                                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                            }

                            if (characterIsNumber === true) {
                                let propertyDateLimitationMinValue = propertyDateLimitationArray[i][0];
                                let propertyDateLimitationMaxValue = propertyDateLimitationArray[i][1];

                                slicedValue = formInputValue.slice(startingIndex, startingIndex + propertyDateValue);
                                startingIndex += propertyDateValue;

                                if (slicedValue < propertyDateLimitationMinValue
                                    || slicedValue > propertyDateLimitationMaxValue) {

                                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                                }
                            }
                        }

                        if (propertyDateValue === true && formInputValueLength > 0) {
                            if (characterIsNumber === true) {

                                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                            }

                            for (let x = startingIndex; x < formInputValueLength; x++) {

                                let characterIsNumber = checkCharacterIfNumber(formInputValue[x]);

                                if (characterIsNumber === false) {
                                    stringLength++;
                                } else if (stringLength >= 12) {

                                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                                } else if (characterIsNumber === true) {
                                    startingIndex += stringLength;

                                    //get out of loop if it encounters a number
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }


        if (propertyDateSeparator !== "") {

            let dateSeparatorRegex = new RegExp(propertyDateSeparator, "g")
            let dateSeparatorNumberInFormInput = dateSeparatorCounter(formInputValue, dateSeparatorRegex);


            if (dateSeparatorNumberInFormInput !== propertyDateValueArrayLength - 1 && formInputValueLength > 0) {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            } else {
                let formInputValueSplit = formInputValue.split(propertyDateSeparator);

                for (let i = 0; i < propertyDateValueArrayLength; i++) {
                    let numberOfNumbersInOneSplit = numberCounter(formInputValueSplit[i]);

                    if (typeof (propertyDateValueArray[i]) === "number") {
                        if (numberOfNumbersInOneSplit !== propertyDateValueArray[i]
                            || formInputValueSplit[i].length !== propertyDateValueArray[i]) {
                            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                        } else {
                            let propertyDateLimitationMinValue = propertyDateLimitationArray[i][0];
                            let propertyDateLimitationMaxValue = propertyDateLimitationArray[i][1];

                            if (formInputValueSplit[i] < propertyDateLimitationMinValue
                                || formInputValueSplit[i] > propertyDateLimitationMaxValue) {
                                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                            }
                        }
                    }

                    if (propertyDateValueArray[i] === true) {
                        let characterIsNumber = checkCharacterIfNumber(formInputValueSplit[i]);

                        if ((formInputValueSplit[i].length > 12)
                            || (characterIsNumber === true)) {
                            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                        }
                    }
                }
            }
        }
    }
}

