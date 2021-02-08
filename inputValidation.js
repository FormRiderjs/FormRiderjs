import {CustomError} from "./customError.js";

export class InputValidation {
    constructor(frFormNameToProcess, formData, formRiderConfigs) {
        /*this array is accessible from all methods. whenever an error occurred, it
        will be pushed to this array and passed to notificationGenerator after  */
        this.inputValidationRecap = [];
        this.validationErrorArray = [];

        //validated is always set to true, but will be set to false in case there is an error when calling a validator/importing it e.g when there is an error and the validator does not exist for example
        this.validated = true;

        this.resetFormUponSubmitValue = false;


        //for every formInputName, store the inCommonStatus, like true,false,true,true etc..
        this.hasInCommon = [];
        //always set to false, changes to true only when there is a inCommon => so purifyErrorValidation could be called
        this.doesHasInCommon = false;

        //put every validated "propertyValue" here, knowing that property values are replaced by the data-name in json configs and the inCommon value
        this.validatedInCommonGroup = [];


        //extracting the elementsToApplyValidationOn from json file and passing it to the next then
        let elementToApplyValidationOn = this.extractJsonElementToApplyValidationOn(formRiderConfigs, frFormNameToProcess);
        this.jsonInputNameToValidate = elementToApplyValidationOn.inputNameToValidate;

        this.resetFormUponSubmitValue = elementToApplyValidationOn.resetFormUponSubmit;
        this.extractNotificationCode(elementToApplyValidationOn);

        //get the inCommonCorrespondence arrays located in the json file
        this.inCommonCorrespondence = elementToApplyValidationOn.inCommonCorrespondence;


        //==================================================================
        //array of arrays where in every array : key is the input and value is the inputs value
        let formKeyValueOfInputValue = [];
        for (let i = 0; i < formData.length; i++) {
            //splitting because "=" was added in getFormDataToKeyValueArray function in processor class in order to encode the form data
            formKeyValueOfInputValue.push(formData[i].split('='));
        }
        //==================================================================


        //only get inputNameToValidate from json configs
        let jsonInputNameToValidateKeys = Object.keys(elementToApplyValidationOn["inputNameToValidate"]);


        for (let i = 0; i < formKeyValueOfInputValue.length; i++) {
            let formInputName = formKeyValueOfInputValue[i][0]; //data-name
            let formInputValue = formKeyValueOfInputValue[i][1]; //data-value
            let jsonInputNameToValidateKey = jsonInputNameToValidateKeys[i]; //indicated inputNameToValidate in json configs


            //Throw an error when formInputName in HTML is not defined in formRiderJsonConfigs
            if (formInputName !== jsonInputNameToValidateKey) {
                if (jsonInputNameToValidateKey === undefined) {
                    throw new CustomError("FormRider.js ERROR", "Unknown data-name" + ' "' + formInputName + '" ' + "not declared in formRiderJsonConfig");
                }
                throw new CustomError("FormRider.js ERROR", "Unknown data-name" + ' "' + jsonInputNameToValidateKey + '" ' + "in formRiderJsonConfig ");
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


                //for every formInputName in json configs check if it has an inCommon, if it does then set doesHasInCommon to true and tell there is an inCommon here
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
                let purifiedValidationErrorArray = this.purifyValidationErrorArray(this.validationErrorArray, this.validatedInCommonGroup, this.inCommonCorrespondence);
                this.inputValidationRecap.push(purifiedValidationErrorArray);
            }
            if (this.doesHasInCommon === false) {
                this.inputValidationRecap.push(this.validationErrorArray);
            }
            this.resetFormUponSubmit(frFormNameToProcess, this.resetFormUponSubmitValue, this.validationErrorArray);
            return this;
        }, 100);
    }


//==============================================================================
    // this function will call other functions starting with "checkInput" prefix
    callFunction(hasInCommon, propertyKey, propertyValue, formInputName, formInputValue, propertyErrorText) {

        //only detecting the last element because we are getting an array and the last element of it is the element we want to check
        let lastElementInHasInCommon = hasInCommon.slice(-1)[0];

        //Capitalize first letter of the property key
        let propertyKeyCapitalized = propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1);

        import ("./src/validators/checkInput" + propertyKeyCapitalized + ".js")
            .then((validator) => {
                let usedValidation = new validator["CheckInput" + propertyKeyCapitalized];
                //if the element has an inCommon then launch the validateInCommon function
                if (lastElementInHasInCommon === true) {
                    usedValidation.validateInCommon(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText);


                    //when validated push into validatedInCommonGroup array
                    if (usedValidation.inCommonValidatedStatus === true) {
                        this.validatedInCommonGroup.push(propertyValue);
                    }
                }

                //when the element does not have an inCommon then launch the normal validate function
                if (lastElementInHasInCommon === false) {
                    usedValidation.validate(propertyKeyCapitalized, propertyValue, formInputName, formInputValue, propertyErrorText);
                }


                let usedValidationErrorArray = usedValidation.validationErrorArray;
                //push into errors array only when usedValidationErrorArray is not empty
                if (usedValidationErrorArray.length !== 0) {
                    this.validationErrorArray.push(usedValidationErrorArray);
                }
            })


            .catch((error) => {
                this.validated = false;
                 throw new CustomError("FormRider.js ERROR", "Unknown validator property '" + propertyKey + "' in formRiderJsonConfig ");
            })
    }

//==============================================================================

    purifyValidationErrorArray(validationErrorArray, validatedInCommonGroup, inCommonCorrespondence) {
        //for every input, the inCommon name will be put in [0], the sum of givenPoints will be put in [1], in [2] false will be replace by true if the inCommon is validated otherwise it well be kept false
        let sumValidatedInCommonPointsGiven = [[undefined, 0, false]];

        //index in sumValidatedInCommonPointsGiven to be filled, this value will be incremented every time the validatedInCommonName of a validatedInCommonGroup is not equal to the validatedInCommonName of the next validatedInCommonGroup
        let indexToBeFilled = 0;


        for (let i = 0; i < validatedInCommonGroup.length; i++) {
            let validatedInCommonName = validatedInCommonGroup[i][1].name;
            let inCommonPointsGiven = validatedInCommonGroup[i][1].pointsGiven;
            let validatedInCommonNextName;
            if (i !== validatedInCommonGroup.length) {
                if (validatedInCommonGroup[i + 1] !== undefined) {

                    validatedInCommonNextName = validatedInCommonGroup[i + 1][1].name;

                    if (validatedInCommonName === validatedInCommonNextName) {
                        sumValidatedInCommonPointsGiven[indexToBeFilled][0] = validatedInCommonName;
                        sumValidatedInCommonPointsGiven[indexToBeFilled][1] += inCommonPointsGiven;
                    }
                    if (validatedInCommonName !== validatedInCommonNextName) {
                        sumValidatedInCommonPointsGiven[indexToBeFilled][0] = validatedInCommonName;
                        sumValidatedInCommonPointsGiven[indexToBeFilled][1] += inCommonPointsGiven;

                        let array = [undefined, 0, false];
                        sumValidatedInCommonPointsGiven.push(array);
                        indexToBeFilled++;
                    }
                }

                if (validatedInCommonGroup[i + 1] === undefined) {
                    sumValidatedInCommonPointsGiven[indexToBeFilled][0] = validatedInCommonName;
                    sumValidatedInCommonPointsGiven[indexToBeFilled][1] += inCommonPointsGiven;
                }
            }
        }

        let inCommonCorrespondenceLength = inCommonCorrespondence.length;
        let declaredInCommonNameCounter = 0; //used for testing
        let inCommonNameCounter = 0; //used for testing

        for (let j = 0; j < inCommonCorrespondenceLength; j++) {
            for (let i = 0; i < sumValidatedInCommonPointsGiven.length; i++) {
                if (inCommonCorrespondence[j].name === sumValidatedInCommonPointsGiven[i][0]) {
                    if (inCommonCorrespondence[j].neededPointsToValidate === sumValidatedInCommonPointsGiven[i][1]) {
                        sumValidatedInCommonPointsGiven[i][2] = true;
                    }
                    if (inCommonCorrespondence[j].neededPointsToValidate !== sumValidatedInCommonPointsGiven[i][1]) {
                        sumValidatedInCommonPointsGiven[i][2] = false
                    }
                    //incrementation used for testing
                    declaredInCommonNameCounter++;
                }
                //incrementation used for testing
                inCommonNameCounter++;
            }
        }

        //TESTING ======================================================================================================
        /*
        * Testing if inCommon name is not defined, test only working when the checkbox is clicked, how it works ?
        * declaredInCommonNameCounter : incremented every time the inCommon name is declared
        * inCommonNameCounter : incremented every time, whether it is declared or not.
        * */
        if (inCommonNameCounter / declaredInCommonNameCounter === Infinity && sumValidatedInCommonPointsGiven[0][0] !== undefined) {
            throw new CustomError("FormRider.js ERROR", "an inCommon name was not defined in inCommon correspondence");
        }
        if (inCommonNameCounter / declaredInCommonNameCounter !== Infinity) {
            if (declaredInCommonNameCounter * inCommonCorrespondenceLength !== inCommonNameCounter) {
                throw new CustomError("FormRider.js ERROR", "an inCommon name was not defined in inCommon correspondence");
            }
        }
        //==============================================================================================================


        for (let i = 0; i < sumValidatedInCommonPointsGiven.length; i++) {
            if (sumValidatedInCommonPointsGiven[i][2] === true) {
                for (let j = 0; j < validationErrorArray.length; j++) {
                    if (validationErrorArray[j][0][1].name === sumValidatedInCommonPointsGiven[i][0]) {
                        validationErrorArray.splice(j, 1);
                        j--;
                    }
                }
            }
        }

        // sumValidatedInCommonPointsGiven.length = 0;

        return validationErrorArray;
    }


    //extract the elementsToApplyValidationOn depending on form id, so frFormNameToProcess should be the same as the formId in json file
    extractJsonElementToApplyValidationOn(jsonData, frFormNameToProcess) {
        return jsonData["elementsToApplyValidationOn"][frFormNameToProcess];
    }

    //returning notification Code from json File
    extractNotificationCode(jsonData) {
        this.inputValidationRecap.push(jsonData["notificationCode"]);
    }
//==============================================================================

    //resetting form upon submit
    resetFormUponSubmit(frFormNameToProcess, resetFormUponSubmitValue, errorArray) {
        if (resetFormUponSubmitValue === true && errorArray.length === 0) {
            document.querySelector("[data-otfForm = " + frFormNameToProcess + "]").reset();
        }
    }

}