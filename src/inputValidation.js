import {CustomError} from "./customError.js";

export class InputValidation {
    constructor(otfFormNameToProcess, formData, onTheFlyConfigs) {
        /*this array is accessible from all methods. whenever an error occurred, it
        will be pushed to this array and passed to notificationGenerator after  */
        this.inputValidationRecap = [];
        this.validationErrorArray = [];

        /* validated is set to true, but in case the validation didnt work
         it will be set to false in order to return the false statemenet
         using the returnValidatedBool() */
        this.validated = true;

        this.resetFormUponSubmitValue = false;


        //extracting the elementsToApplyValidationOn from json file and passing it to the next then
        let elementToApplyValidationOn = this.extractJsonElementToApplyValidationOn(onTheFlyConfigs, otfFormNameToProcess);

        this.resetFormUponSubmitValue = elementToApplyValidationOn.resetFormUponSubmit;

        this.extractNotificationCode(elementToApplyValidationOn);

        this.jsonInputNameToValidate = elementToApplyValidationOn["inputNameToValidate"];


       //==================================================================
        //array of arrays where in every array : key is the input and value is the inputs value
        let formKeyValueOfInputValue = [];
        for (let i = 0; i < formData.length; i++) {
            //splitting because "=" was added in getFormDataToKeyValueArray function in processor class in order to encode the form data
            formKeyValueOfInputValue.push(formData[i].split('='));
        }
        //==================================================================


        let jsonInputNameToValidateKeys = Object.keys(elementToApplyValidationOn["inputNameToValidate"]);


        for (let i = 0; i < formKeyValueOfInputValue.length; i++) {
            let formInputName = formKeyValueOfInputValue[i][0]; //data-name
            let formInputValue = formKeyValueOfInputValue[i][1]; //data-value
            let jsonInputNameToValidateKey = jsonInputNameToValidateKeys[i];




            if (formInputName !== jsonInputNameToValidateKey) {
                if (jsonInputNameToValidateKey === undefined) {
                    throw new CustomError("OnTheFly.js ERROR", "Unknown data-name" + ' "' + formInputName + '" ' + "not declared in onTheFlyJsonConfig");
                }
                throw new CustomError("OnTheFly.js ERROR", "Unknown data-name" + ' "' + jsonInputNameToValidateKey + '" ' + "in onTheFlyJsonConfig ");
            }




            for (let propertyKey in this.jsonInputNameToValidate[formInputName]) {

                let propertyValue = this.jsonInputNameToValidate[formInputName][propertyKey][0];

                let propertyErrorText = this.jsonInputNameToValidate[formInputName][propertyKey][1];




                //calling the prefix function, this will call functions depending on propertyKey after capitalizing it's first letter
                this.callFunction(propertyKey, propertyValue, formInputName, formInputValue, propertyErrorText);
            }
        }


        this.inputValidationRecap.push(this.validationErrorArray);
        this.returnValidatedBool(this.validationErrorArray);
        this.resetFormUponSubmit(otfFormNameToProcess, this.resetFormUponSubmitValue, this.validationErrorArray);


        return this;
    }


//==============================================================================
    // this function will call other functions starting with "checkInput" prefix
    callFunction(propertyKey, propertyValue, formInputName, formInputValue, propertyErrorText) {
        // this["checkInput" + propertyKeyCapitalized](propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText);

        let propertyKeyCapitalized = propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1);
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
                this.validated = false;
                throw new CustomError("OnTheFly.js ERROR", "Unknown validator property '"+propertyKey+"' in onTheFlyJsonConfig ");
            })
    }

//==============================================================================


    //extract the elementsToApplyValidationOn depending on form id, so otfFormNameToProcess should be the same as the formId in json file
    extractJsonElementToApplyValidationOn(jsonData, otfFormNameToProcess) {
        return jsonData["elementsToApplyValidationOn"][otfFormNameToProcess];
    }


    //returning notification Code from json File
    extractNotificationCode(jsonData) {
        this.inputValidationRecap.push(jsonData["notificationCode"]);
    }


//==============================================================================

    //resetting form upon submit
    resetFormUponSubmit(otfFormNameToProcess, resetFormUponSubmitValue, errorArray) {
        if (resetFormUponSubmitValue === true && errorArray.length === 0) {
            document.getElementById(otfFormNameToProcess).reset();
        }
    }

    //returning the bool
    returnValidatedBool(validationErrorArray) {
        this.validated = validationErrorArray.length === 0;
    }
}