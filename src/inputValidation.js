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


        //for every formInputName, store the inCommonStatus, like true,false,true,true etc..
        this.hasInCommon = [];
        //always set to false, changes to true only when there is a inCommon => so purifyErrorValidation could be called
        this.doesHasInCommon = false;
        //put here all inCommon groups
        this.inCommonGroup = [];
        //put every validated "propertyValue" here, knowing that property values are replaced by the data-name in json configs and the inCommon value
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
                    //when there is an inCommon, replace property value by an array of formInputName and the inCommon value
                    propertyValue = [formInputName, propertyValue.inCommon[0]];
                    this.hasInCommon.push(true);
                    this.doesHasInCommon = true;
                }

                if (!hasOwnPropertyInCommon) {
                    this.hasInCommon.push(false);
                }
                //======================================================================================

                this.callFunction(this.hasInCommon, propertyKey, propertyValue, formInputName, formInputValue, propertyErrorText);
            }
        }


        window.setTimeout(() => {
            //when there is an inCommon => purify error array, otherwise do the normal procedure
            if (this.doesHasInCommon === true) {
                let purifiedValidationErrorArray = this.purifyValidationErrorArray(this.validationErrorArray, this.inCommonGroup, this.validatedInCommonGroup);
                this.inputValidationRecap.push(purifiedValidationErrorArray);
            }
            if (this.doesHasInCommon === false) {
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

        //only detecting the last element because we are getting an array and the last element of it is the element we want to check
        let lastElementInHasInCommon = hasInCommon.slice(-1)[0];

        let propertyKeyCapitalized = propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1);
        import ("./validators/checkInput" + propertyKeyCapitalized + ".js")
            .then((validator) => {
                let usedValidation = new validator["CheckInput" + propertyKeyCapitalized];
                if (lastElementInHasInCommon === true) {
                    this.inCommonGroup.push(propertyValue);
                    usedValidation["validateInCommon"](propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText);

                    //when validated
                    if (usedValidation["inCommonValidatedStatus"] === true) {
                        this.validatedInCommonGroup.push(propertyValue);
                    }
                }


                if (lastElementInHasInCommon === false) {
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

    purifyValidationErrorArray(validationErrorArray, inCommonGroup, validatedInCommonGroup) {
        let validatedInCommonRepetition = [];


        //the  validated inCommon name
        let validatedInCommonValue = [];


        for (let i = 0; i < validatedInCommonGroup.length; i++) {
            validatedInCommonValue.push(validatedInCommonGroup[i][1]);
        }


        let noDuplicateValidatedInCommonValue = [...new Set(validatedInCommonValue)];
        for(let i = 0; i<noDuplicateValidatedInCommonValue.length; i++){
            for(let j=0; j<validationErrorArray.length; j++){
                if(validationErrorArray[j][0][1] === noDuplicateValidatedInCommonValue[i]){
                    validationErrorArray.splice(j,1);
                    j--;
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