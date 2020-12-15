import {CustomError} from "./customError.js";

export class InputValidation {
    constructor(formId, formData, jsonConfigURL) {
        /*this array is accessible from all methods. whenever an error occurred, it
        will be pushed to this array and passed to notificationGenerator after  */
        this.inputValidationRecap = [];
        this.validationErrorArray = [];

        /* validated is set to true, but in case the validation didnt work
         it will be set to false in order to return the false statemenet
         using the returnValidatedBool() */
        this.validated = true;

        this.resetFormUponSubmitValue;


        this.getJsonData(jsonConfigURL)
            .then((jsonData) => {
                //extracting the elementsToApplyValidationOn from json file and passing it to the next then
                return this.extractJsonElementToApplyValidationOn(jsonData, formId);

            })
            .then((elementToApplyValidationOn) => {
                this.resetFormUponSubmitValue = elementToApplyValidationOn.resetFormUponSubmit;
                this.extractNotificationCode(elementToApplyValidationOn);
                return elementToApplyValidationOn["inputNameToValidate"];

            })
            .then((jsonInputNameToValidate) => {

                //array of arrays where in every array : key is the input and value is the inputs value
                let formKeyValueOfInputValue = [];
                for (let i = 0; i < formData.length; i++) {
                    //splitting because "=" was added in getFormDataToKeyValueArray function in FormControl class in order to encode the form data
                    formKeyValueOfInputValue.push(formData[i].split('='));
                }


                let jsonInputNameToValidateKeys = Object.keys(jsonInputNameToValidate);

                for (let i = 0; i < formKeyValueOfInputValue.length; i++) {
                    let formInputName = formKeyValueOfInputValue[i][0];
                    let formInputValue = formKeyValueOfInputValue[i][1];
                    let jsonInputNameToValidateKey = jsonInputNameToValidateKeys[i];


                    if (formInputName !== jsonInputNameToValidateKey) {

                        if (jsonInputNameToValidateKey === undefined) {
                            throw new CustomError("OnTheFly.js ERROR", "Unknown data-name" + ' "' + formInputName + '" ' + "not declared in onTheFlyJsonConfig");
                        }
                        throw new CustomError("OnTheFly.js ERROR", "Unknown data-name" + ' "' + jsonInputNameToValidateKey + '" ' + "in onTheFlyJsonConfig ");
                    }


                    for (let propertyKey in jsonInputNameToValidate[formInputName]) {

                        //capitalize the first letter of jsonProperty name in order to be able to call the function
                        let propertyKeyCapitalized = propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1);
                        let propertyValue = jsonInputNameToValidate[formInputName][propertyKey][0];
                        let propertyErrorText = jsonInputNameToValidate[formInputName][propertyKey][1];

                        //calling the prefix function, this will call functions depending on propertyKey after capitalizing it's first letter
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
        // this["checkInput" + propertyKeyCapitalized](propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText);

        console.log(propertyKeyCapitalized);
        import ("./validators/checkInput" + propertyKeyCapitalized + ".js")
            .then((validator) => {
                let usedValidation = new validator["CheckInput" + propertyKeyCapitalized];
                let usedValidationErrorArray = usedValidation.validationErrorArray;
                usedValidation["validate"](propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText);

                //push into errors array only when usedValidationErrorArray is not empty
                if (usedValidationErrorArray.length !== 0) {
                    this.validationErrorArray.push(usedValidation.validationErrorArray);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

//==============================================================================


    //extract the elementsToApplyValidationOn depending on form id, so formId should be the same as the formId in json file
    extractJsonElementToApplyValidationOn(jsonData, formId) {
        return jsonData["elementsToApplyValidationOn"][formId];
    }


    //returning notification Code from json File
    extractNotificationCode(jsonData) {
        this.inputValidationRecap.push(jsonData["notificationCode"]);
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