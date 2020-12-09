export class InputValidation {

    /*this array is accessible from all methods. whenever an error occured, it
     will be pushed to this array and passed to notificationGenerator after  */
    inputValidationRecap = [];
    validationErrorArray = [];

    /* validated is set to true, but in case the validation didnt work
     it will be set to false in order to return the false statemenet
     using the returnValidatedBool() */
    validated;

    resetFormUponSubmitValue;

    constructor(formId, formData, jsonConfigURL) {
        this.getJsonData(jsonConfigURL)
            .then((jsonData) => {
                //extracting the elementsToApplyValidationOn from json file and passing it to the next then
                return this.extractJsonElementToApplyValidationOn(jsonData, formId);
            })
            .then((elementToApplyValidationOn) => {
                this.resetFormUponSubmitValue = elementToApplyValidationOn.resetFormUponSubmit;
                this.extractNotificationCode(elementToApplyValidationOn);
                let formNeedToBeValidated = this.verifyIfFormToBeValidated(elementToApplyValidationOn);
                if (formNeedToBeValidated === true) {
                    return this.extractJsonInputNameToValidate(elementToApplyValidationOn);

                } else if (formNeedToBeValidated === false) {
                    return elementToApplyValidationOn;
                }
            })
            .then((jsonInputNameToValidate) => {
                //array of arrays where in every array : key is the input and value is the inputs value
                let formKeyValueOfInputValue = [];
                for (let i = 0; i < formData.length; i++) {
                    //splitting because "=" was added in getFormDataToKeyValueArray function in FormControl class in order to encode the form data
                    formKeyValueOfInputValue.push(formData[i].split('='));
                }

                for (let i = 0; i < formKeyValueOfInputValue.length; i++) {

                    let formInputName = formKeyValueOfInputValue[i][0];
                    let formInputValue = formKeyValueOfInputValue[i][1];

                    for (let propertyKey in jsonInputNameToValidate[formInputName]) {

                        //capitalize the first letter of jsonProperty name in order to be able to call the function
                        let propertyKeyCapitalized = propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1);
                        let propertyValue = jsonInputNameToValidate[formInputName][propertyKey][0];
                        let propertyErrorText = jsonInputNameToValidate[formInputName][propertyKey][1];

                        //calling the prefix fucntion, this will call functions depending on propertyKey adter capitalizing it's first letter
                        this.callFunction(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText);
                    }
                }


                this.inputValidationRecap.push(this.validationErrorArray);
                this.returnValidatedBool(this.validationErrorArray);
                this.resetFormUponSubmit(formId, this.resetFormUponSubmitValue, this.validationErrorArray);

                return formKeyValueOfInputValue;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getJsonData(jsonConfigURL) {
        var xhr = new XMLHttpRequest();

        return new Promise(function (resolve, reject) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve(JSON.parse(this.responseText));
                }
//                else {
//                    reject({
//                       status : xhr.status,
//                       statusText : xhr.statusText
//                    });
//                }
            };
            xhr.open("GET", jsonConfigURL, true);
            xhr.send();
        });
    }

//==============================================================================
    // this function will call other functions starting with "checkInput" prefix
    callFunction(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        this["checkInput" + propertyKeyCapitalized](propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText);
    }

//==============================================================================
    // if there is any repetetion of the same error in the array it will reduce error numbers
    reducevalidationErrorArray(array) {

    }

//==============================================================================

    //extract the elementsToApplyValidationOn depending on form id, so formId should be the same as the formId in json file
    extractJsonElementToApplyValidationOn(jsonData, formId) {
        return jsonData["elementsToApplyValidationOn"][formId];
    }

    //extract the InputNameToValidate from the json file, it should be the same as the input name of the given form
    extractJsonInputNameToValidate(jsonData) {
        return jsonData.inputNameToValidate;
    }


    //returning notification Code from json File
    extractNotificationCode(jsonData) {
        this.inputValidationRecap.push(jsonData["notificationCode"]);
    }

//==============================================================================
    //verify if form needs to be validated,
    verifyIfFormToBeValidated(jsonData) {
        if (jsonData.formValidation === true) {
            return true;
        } else {
            return false;
        }
    }

//==============================================================================

    //verify if the input type is int or float (number)
    //chek if inputs value is a number
    checkInputContainNumber(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        let formInputValueLength = formInputValue.length;

        var numberOfNumbersInFormInput = 0;
        var numberCounter = function (formInputValue) {
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
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                }

            } else if (typeof (propertyValueMinimum) === "number" && propertyValueMaximum === true) {
                numberCounter(formInputValue);

                // here below : && numberOfNumbersInFormInput > 0 is for empty inputs
                if (numberOfNumbersInFormInput < propertyValueMinimum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                }
            } else if (typeof (propertyValueMinimum) === "number" && typeof (propertyValueMaximum) === "number") {
                numberCounter(formInputValue);

                if (numberOfNumbersInFormInput < propertyValueMinimum || numberOfNumbersInFormInput > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                }
            }

        } else if (typeof (propertyValue) === "boolean" && formInputValueLength > 0) {

            if (propertyValue === true) {
                numberCounter(formInputValue);
                if (numberOfNumbersInFormInput < formInputValueLength) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                }
            } else if (propertyValue === false) {

                numberCounter(formInputValue);
                if (numberOfNumbersInFormInput > 0) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                }
            }
        }
    }


    checkInputNumberBiggerThan(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        if (formInputValue > propertyValue) {
            return true;
        } else {
            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
        }
    }

    checkInputNumberSmallerThan(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        if (formInputValue < propertyValue) {
            return true;
        } else {
            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
        }
    }

    //check input max length, this function is sensible to empty space
    checkInputMaxLength(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        formInputValue = formInputValue.toString();
        if (formInputValue.length >= propertyValue) {
            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
        } else {
            return true;
        }
    }

    //check input min length, this function is sensible to empty space
    checkInputMinLength(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        formInputValue = formInputValue.toString();
        if (formInputValue.length <= propertyValue) {
            this.validationErrorArray.push(formInputName + " " + propertyErrorText);
        } else {
            return true;
        }
    }

    //verify if the input is requried, this function is to be used with other functions
    checkInputRequired(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        if (propertyValue === true) {
            let regex = /^\s+/;
            if (regex.test(String(formInputValue)) || formInputValue.length === 0) {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);

            } else if (typeof (formInputValue) === "undefined") {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);

            }
        }
    }

    checkInputContainCapitalLetters(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

        let typeofPropertyValue = typeof (propertyValue);

        var numberOfCapitalLtters = 0;
        var capitalLettersCounter = function (formInputValue) {
            for (let i = 0; i < formInputValue.length; i++) {
                if (formInputValue[i] === formInputValue[i].toUpperCase()
                    && formInputValue[i] !== formInputValue[i].toLowerCase()) {
                    numberOfCapitalLtters++;
                }
            }
        };

        if (typeofPropertyValue === "boolean") {
            if (propertyValue === true) {
                let regex = /[a-z]/;

                // Regular expression in order to test if all characters are Uppercase
                if (regex.test(formInputValue)) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            }

            if (propertyValue === false) {
                let regex = /[A-Z]/;

                if (regex.test(formInputValue)) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            }

        } else if (typeofPropertyValue === "number") {

            capitalLettersCounter(formInputValue);
            if (propertyValue !== numberOfCapitalLtters) {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            } else {
                return true;
            }

        } else if (typeofPropertyValue === "object") {
            let propertyValueMinimum = propertyValue[0];
            let propertyValueMaximum = propertyValue[1];
            let typeofPropertyValueMinimum = typeof (propertyValueMinimum);
            let typeofPropertyValueMaximum = typeof (propertyValueMaximum);


            if (propertyValueMinimum === true && typeofPropertyValueMaximum === "number") {

                capitalLettersCounter(formInputValue);
                if (numberOfCapitalLtters === 0 || numberOfCapitalLtters > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }

            } else if (typeofPropertyValueMinimum === "number" && propertyValueMaximum === true) {
                capitalLettersCounter(formInputValue);
                if (numberOfCapitalLtters === 0 || numberOfCapitalLtters < propertyValueMinimum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            } else if (typeofPropertyValueMinimum === "number" && typeofPropertyValueMaximum === "number") {
                capitalLettersCounter(formInputValue);
                if (numberOfCapitalLtters < propertyValueMinimum || numberOfCapitalLtters > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            }
        }
    }

    checkInputContainSmallLetters(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        let typeofPropertyValue = typeof (propertyValue);

        var numberOfSmallLetters = 0;
        var smallLettersCounter = function (formInputValue) {
            for (let i = 0; i < formInputValue.length; i++) {
                if (formInputValue[i] === formInputValue[i].toLowerCase() && formInputValue[i] !== formInputValue[i].toUpperCase()) {
                    numberOfSmallLetters++;
                }
            }
        };

        if (typeofPropertyValue === "boolean") {
            if (propertyValue === true) {
                let regex = /[A-Z]/;
                // Regular expression in order to test if all characters are Uppercase
                if (regex.test(formInputValue)) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            }

            if (propertyValue === false) {
                let regex = /[a-z]/;
                if (regex.test(formInputValue)) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            }

        } else if (typeofPropertyValue === "number") {

            smallLettersCounter(formInputValue);
            if (propertyValue !== numberOfSmallLetters) {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            } else {
                return true;
            }

        } else if (typeofPropertyValue === "object") {
            let propertyValueMinimum = propertyValue[0];
            let propertyValueMaximum = propertyValue[1];
            let typeofPropertyValueMinimum = typeof (propertyValueMinimum);
            let typeofPropertyValueMaximum = typeof (propertyValueMaximum);


            if (propertyValueMinimum === true && typeofPropertyValueMaximum === "number") {

                smallLettersCounter(formInputValue);
                if (numberOfSmallLetters === 0 || numberOfSmallLetters > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }

            } else if (typeofPropertyValueMinimum === "number" && propertyValueMaximum === true) {
                smallLettersCounter(formInputValue);
                if (numberOfSmallLetters === 0 || numberOfSmallLetters < propertyValueMinimum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            } else if (typeofPropertyValueMinimum === "number" && typeofPropertyValueMaximum === "number") {
                smallLettersCounter(formInputValue);
                if (numberOfSmallLetters < propertyValueMinimum || numberOfSmallLetters > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            }
        }
    }

    checkInputContainWhiteSpace(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
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

    checkInputContainSpecialCharacters(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        var regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        let specialCharacterCount = (string) => {
            return (string.match(regex) || []).length;
        };
        let numberOfSpecialCharacters = specialCharacterCount(formInputValue);

        let formInputLength = formInputValue.length;

        if (typeof (propertyValue === "boolean")) {

            if (propertyValue === true) {
                if (formInputLength > numberOfSpecialCharacters) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            } else if (propertyValue === false) {
                if (regex.test(formInputValue)) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            }
        }
        if (typeof (propertyValue) === "number") {
            if (numberOfSpecialCharacters !== propertyValue) {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            } else {
                return true;
            }
        }
        if (typeof (propertyValue) === "object") {
            let propertyValueMinimum = propertyValue[0];
            let propertyValueMaximum = propertyValue[1];

            if (typeof (propertyValueMinimum) === "number"
                && propertyValueMaximum === true) {
                if (numberOfSpecialCharacters < propertyValueMinimum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            } else if (propertyValueMinimum === true
                && typeof (propertyValueMaximum) === "number") {

                if (numberOfSpecialCharacters > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                } else {
                    return true;
                }
            } else if (typeof (propertyValueMinimum) === "number"
                && typeof (propertyValueMaximum) === "number") {

                if (numberOfSpecialCharacters < propertyValueMinimum
                    || numberOfSpecialCharacters > propertyValueMaximum) {
                    this.validationErrorArray.push(formInputName + " " + propertyErrorText);
                }
            }
        }
    }


    checkInputDateFormat(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {

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


    checkInputRegexTest(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        let regexSource = propertyValue[0];
        let regexFlag = propertyValue[1];

        let regex = new RegExp(regexSource, regexFlag);

        if (typeof (propertyValue) === "object") {
            if (regex.test(formInputValue)) {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            } else {
                return true;
            }
        }
    }


    //verifying the number of clicked checkBox that was clicked
    checkInputCheckedBoxNumber(propertyKeyCapitalized, propertyValue, formInputName, formInputValue) {

    }

    //verifying if the checkBox was not clicked or used if it was required
    checkInputCheckboxRequired(propertyKeyCapitalized, propertyValue, formInputName, formInputValue) {

    }

    //verifying if the radio was not clicked or used if it was required
    checkInputRadioRequired(propertyKeyCapitalized, propertyValue, formInputName, formInputValue) {

    }

    checkInputEmail(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText) {
        if (propertyValue === true) {
            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (regex.test(String(formInputValue).toLowerCase())) {
                return true;
            } else {
                this.validationErrorArray.push(formInputName + " " + propertyErrorText);
            }
        }
    }

//==============================================================================

    //resetting form upon submit
    resetFormUponSubmit(formId, resetFormUponSubmitValue, errorArray) {
        if (resetFormUponSubmitValue === true && errorArray.length === 0) {
            document.getElementById(formId).reset();
        }
    }


    //returning the bool
    returnValidatedBool(validationErrorArray) {
        this.validated = validationErrorArray.length === 0;
    }
}