import {CustomError} from "./customError.js";

export class InputValidation {
    constructor(otfFormNameToProcess, formData, onTheFlyConfigs) {
        /*this array is accessible from all methods. whenever an error occurred, it
        will be pushed to this array and passed to notificationGenerator after  */
        this.inputValidationRecap = [];
        this.validationErrorArray = [];
        /* validated is set to true, but in case the validation didnt work
         it will be set to false in order to return the false statement
         using the returnValidatedBool() */
        this.validated = true;

        this.resetFormUponSubmitValue = false;

        this.hasInCommon = false;
        this.hasinCommonGroup = [];
        this.validatedInCommonGroup = [];

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


            //propertyKey will give us only the function in string format
            for (let propertyKey in this.jsonInputNameToValidate[formInputName]) {

                //wantedFunctionValues will give us propertyKey values in an object format !
                let wantedFunctionValues = this.jsonInputNameToValidate[formInputName][propertyKey];
                let propertyValue = wantedFunctionValues[0];
                let propertyErrorText = wantedFunctionValues[1];

                //======================================================================================
                //get all inCommon from json file => put it in a inCommon array => replace propertyValue by inCommon => send this value  to the concerned function
                let hasOwnPropertyInCommon = propertyValue.hasOwnProperty("inCommon");
                //hasInCommon set to true when hasOwnPropertyInCommon set to true
                if (hasOwnPropertyInCommon) {
                    propertyValue = [formInputName, propertyValue.inCommon[0]];
                    this.hasInCommon = true;
                }

                if (!hasOwnPropertyInCommon) {
                    this.hasInCommon = false;
                }
                //======================================================================================


                this.callFunction(this.hasInCommon, propertyKey, propertyValue, formInputName, formInputValue, propertyErrorText);
            }
        }


        window.setTimeout(() => {
            if (this.hasInCommon === true) {
                let purifiedValidationErrorArray = this.purifyValidationErrorArray(this.validationErrorArray, this.hasinCommonGroup,this.validatedInCommonGroup);
                this.inputValidationRecap.push(purifiedValidationErrorArray);
            }
            if (this.hasInCommon === false) {
                this.inputValidationRecap.push(this.validationErrorArray);
            }
            this.returnValidatedBool(this.validationErrorArray);
            this.resetFormUponSubmit(otfFormNameToProcess, this.resetFormUponSubmitValue, this.validationErrorArray);
            return this;
        }, 100);
    }


//==============================================================================
    // this function will call other functions starting with "checkInput" prefix
    callFunction(hasInCommon, propertyKey, propertyValue, formInputName, formInputValue, propertyErrorText) {

        //TODO maybe creating a new then block instead of the window.setTimeout done previously
        let propertyKeyCapitalized = propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1);
        import ("./validators/checkInput" + propertyKeyCapitalized + ".js")
            .then((validator) => {
                let usedValidation = new validator["CheckInput" + propertyKeyCapitalized];
                if (hasInCommon === true) {
                    this.hasinCommonGroup.push(propertyValue);

                    usedValidation["validateInCommon"](propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText);

                    //when validated
                    if (usedValidation["inCommonValidatedStatus"] === true) {
                        this.validatedInCommonGroup.push(propertyValue);
                    }
                }


                if (hasInCommon === false) {
                    usedValidation["validate"](propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText);
                }

                let usedValidationErrorArray = usedValidation.validationErrorArray;
                //push into errors array only when usedValidationErrorArray is not empty
                if (usedValidationErrorArray.length !== 0) {
                    this.validationErrorArray.push(usedValidationErrorArray);
                }
            })
            .catch((error) => {
                this.validated = false;
                console.log(error);
                throw new CustomError("OnTheFly.js ERROR", "Unknown validator property '" + propertyKey + "' in onTheFlyJsonConfig ");
            })


    }

//==============================================================================

    purifyValidationErrorArray(validationErrorArray,hasInCommonGroup,validatedInCommonGroup) {
        let toBeDeleted = [];
        for(let i = 0; i<hasInCommonGroup.length; i++){
            for(let j=0; j<validatedInCommonGroup.length; j++){
                if(hasInCommonGroup[i][1] === validatedInCommonGroup[j][1] && hasInCommonGroup[i][0] !== validatedInCommonGroup[j][0]){
                    toBeDeleted.push(hasInCommonGroup[i][0]);
                }
            }
        }

        for (let i=0;i<validationErrorArray.length;i++) {
            for(let j=0; j<toBeDeleted.length; j++) {
                if(toBeDeleted[j] === validationErrorArray[i][0]){
                    validationErrorArray.splice(i,1);
                }
            }
        }

        return validationErrorArray;
    }


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
            document.querySelector("[data-otfForm = " + otfFormNameToProcess + "]").reset();
        }
    }

    //returning the bool
    returnValidatedBool(validationErrorArray) {
        this.validated = validationErrorArray.length === 0;
    }
}