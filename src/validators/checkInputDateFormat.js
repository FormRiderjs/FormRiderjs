import { CustomError } from "../../customError.js";

export class CheckInputDateFormat {
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


        //=====================================================================================
        let dateSeparatorCounter = function(string, regex) {
                return (string.match(regex) || []).length;
            }
            //=====================================================================================




        //=====================================================================================
        let numberCounter = function(string) {
            let numberOfNumbersInFormInput = 0;

            for (let character of string) {
                let characterAsNumber = Number(character);
                if (characterAsNumber !== characterAsNumber || character === " ") {} else {
                    numberOfNumbersInFormInput++;
                }
            }
            return numberOfNumbersInFormInput;
        };
        //=====================================================================================



        //=====================================================================================
        let sumOfNumbersInPropertyDateValueArray = function() {
            let characterNumber = 0;
            for (let i = 0; i < propertyDateValueArrayLength; i++) {
                if (typeof(propertyDateValueArray[i]) === "number") {
                    characterNumber = characterNumber + propertyDateValueArray[i];
                }
            }
            return characterNumber;
        };
        //=====================================================================================



        //=====================================================================================
        let numberOfDateValueFieldContainingNumber = 0;
        let indexOfDateValueFieldContainingNumber = [];
        let numberOfDateValueFieldsContainingTrue = 0;
        let indexOfDateValueFieldContainingTrue = [];


        //check all date values, if it is a number or true, then increment values above here ^
        let checkAllDateValueArrayFieldsType = function() {
            for (let i = 0; i < propertyDateValueArrayLength; i++) {
                if (typeof(propertyDateValueArray[i]) === "number") {
                    numberOfDateValueFieldContainingNumber++;
                    indexOfDateValueFieldContainingNumber.push(i);
                }

                if (propertyDateValueArray[i] === true) {
                    numberOfDateValueFieldsContainingTrue++;
                    indexOfDateValueFieldContainingTrue.push(i);
                }



                //throw an error, when  it is nor true nor number type
                if (propertyDateValueArray[i] !== true && typeof(propertyDateValueArray[i]) !== "number") {
                    window.alert("FormRider.js ERROR : Property value of dateFormat can only contain values type of number or true");
                }
            }
        };
        checkAllDateValueArrayFieldsType();
        //=====================================================================================



        //=====================================================================================
        //return true if a character is number, otherwise return false
        let checkCharacterIfNumber = function(character) {
                let regex = /[0-9]/g;
                return regex.test(character);
            }
            //=====================================================================================



        //=====================================================================================
        //return true if a string contains white space, otherwise return false
        let doCheckForWhiteSpace = function(string) {
                let regex = /\s+/g;
                return regex.test(string);
            }
            //=====================================================================================


        //=====================================================================================
        //return true if a string contains special characters, otherwise return false
        let doTestStringForSpecialChars = function(string) {
                let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
                return regex.test(string);
            }
            //=====================================================================================


        let numberOfNumbersInFormInputValue = numberCounter(formInputValue);
        let testForSpecialChars = doTestStringForSpecialChars(formInputValue);
        let numberOfNumbersInPropertyDateValueArray = sumOfNumbersInPropertyDateValueArray();
        let startingIndex = 0;


        if (checkCharacterIfNumber(formInputValue[formInputValueLength - 1]) === false && formInputValueLength > 0) {
            this.validationErrorArray.push(formInputName, propertyErrorText);
        }


        //when there is no separator
        if (propertyDateSeparator === "" && formInputValueLength > 0) {
            /*  ERROR CASES MANAGEMENT
                -if the input is not only numbers but but JSON said the input should be only numbers
                -if the input is only numbers but JSON said it should be numbers and characters
                -if sum of numbers in JSON is not equal to number of numbers in form input
                -if there is white spaces in the input
            * */
            if ((testForSpecialChars === true) ||
                ((numberOfNumbersInFormInputValue !== formInputValueLength && numberOfDateValueFieldContainingNumber === propertyDateValueArrayLength) && (formInputValueLength > 0)) ||
                ((numberOfNumbersInFormInputValue === formInputValueLength && numberOfDateValueFieldsContainingTrue > 0) && (formInputValueLength > 0)) ||
                ((numberOfNumbersInFormInputValue !== numberOfNumbersInPropertyDateValueArray) && (formInputValueLength > 0)) ||
                doCheckForWhiteSpace(formInputValue) === true) {

                this.validationErrorArray.push(formInputName, propertyErrorText);
            } else {
                //another way of saying that JSON wants "Input should contain only numbers"
                if (numberOfDateValueFieldContainingNumber === propertyDateValueArrayLength) {

                    for (let i = 0; i < propertyDateValueArrayLength; i++) {

                        let propertyDateValue = propertyDateValueArray[i];

                        let propertyDateLimitationMinValue = propertyDateLimitationArray[i][0];
                        let propertyDateLimitationMaxValue = propertyDateLimitationArray[i][1];

                        let slicedValue = formInputValue.slice(startingIndex, startingIndex + propertyDateValue);
                        startingIndex += propertyDateValue;

                        // incrementing the startingIndex so next value will be a new slice
                        if (slicedValue < propertyDateLimitationMinValue ||
                            slicedValue > propertyDateLimitationMaxValue) {

                            this.validationErrorArray.push(formInputName, propertyErrorText);
                        }
                    }
                }

                //====================================================================================================
                // IT SHOULD CONTAIN a STRING e.g. 04september1994
                if (numberOfDateValueFieldsContainingTrue === 1) {

                    for (let i = 0; i < propertyDateValueArrayLength; i++) {
                        let characterIsNumber = checkCharacterIfNumber(formInputValue[startingIndex]);
                        let propertyDateValue = propertyDateValueArray[i];
                        let stringLength = 0;
                        let slicedValue;



                        if (typeof(propertyDateValue) === "number") {

                            //thi"s might only catch the first character in the input
                            if (characterIsNumber === false) {
                                this.validationErrorArray.push(formInputName, propertyErrorText);
                            }


                            if (characterIsNumber === true) {
                                let propertyDateLimitationMinValue = propertyDateLimitationArray[i][0];
                                let propertyDateLimitationMaxValue = propertyDateLimitationArray[i][1];

                                slicedValue = formInputValue.slice(startingIndex, startingIndex + propertyDateValue);
                                startingIndex += propertyDateValue;


                                if (slicedValue < propertyDateLimitationMinValue ||
                                    slicedValue > propertyDateLimitationMaxValue) {
                                    this.validationErrorArray.push(formInputName, propertyErrorText);
                                }
                            }
                        }

                        if (propertyDateValue === true) {

                            if (characterIsNumber === true) {
                                this.validationErrorArray.push(formInputName, propertyErrorText);
                            }

                            for (let x = startingIndex; x < formInputValueLength; x++) {

                                let characterIsNumber = checkCharacterIfNumber(formInputValue[x]);

                                if (characterIsNumber === false) {
                                    stringLength++;
                                } else if (stringLength >= 20) {

                                    this.validationErrorArray.push(formInputName, propertyErrorText);
                                } else if (characterIsNumber === true) {
                                    startingIndex += stringLength;

                                    //get out of loop if it encounters a number
                                    break;
                                }
                            }
                        }
                    }
                }

                //when there is more than one field in property date value containing true
                if (numberOfDateValueFieldsContainingTrue > 1) {
                    window.alert("FormRider.js ERROR ::: Property value of dateFormat more than a single true value located at the propertyDateValueArray[1]");
                }
                //====================================================================================================

            }
        }



        //when there is a separator
        if (propertyDateSeparator !== "" && formInputValueLength > 0) {
            let dateSeparatorRegex = new RegExp(propertyDateSeparator, "g");

            //number of date separator in formInput
            let dateSeparatorNumberInFormInput = dateSeparatorCounter(formInputValue, dateSeparatorRegex);

            if (dateSeparatorNumberInFormInput !== propertyDateValueArrayLength - 1) {
                this.validationErrorArray.push(formInputName, propertyErrorText);
            }

            if (dateSeparatorNumberInFormInput === propertyDateValueArrayLength - 1) {
                let formInputValueSplit = formInputValue.split(propertyDateSeparator);
                for (let i = 0; i < propertyDateValueArrayLength; i++) {
                    let numberOfNumbersInOneSplit = numberCounter(formInputValueSplit[i]);

                    if (typeof(propertyDateValueArray[i]) === "number") {
                        if (numberOfNumbersInOneSplit !== propertyDateValueArray[i] ||
                            formInputValueSplit[i].length !== propertyDateValueArray[i]) {
                            this.validationErrorArray.push(formInputName, propertyErrorText);
                        } else {
                            let propertyDateLimitationMinValue = propertyDateLimitationArray[i][0];
                            let propertyDateLimitationMaxValue = propertyDateLimitationArray[i][1];

                            if (formInputValueSplit[i] < propertyDateLimitationMinValue ||
                                formInputValueSplit[i] > propertyDateLimitationMaxValue) {
                                this.validationErrorArray.push(formInputName, propertyErrorText);
                            }
                        }
                    }

                    if (propertyDateValueArray[i] === true) {
                        let characterIsNumber = checkCharacterIfNumber(formInputValueSplit[i]);


                        if ((formInputValueSplit[i].length > 12) ||
                            (characterIsNumber === true)) {
                            this.validationErrorArray.push(formInputName, propertyErrorText);
                        }
                    }
                }
            }
        }
    }
}