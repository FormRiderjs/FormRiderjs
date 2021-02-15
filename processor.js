// this class will get formData, process data, call other necessary class
import { InputValidation } from "./inputValidation.js";
import { NotificationGenerator } from "./notificationGenerator.js";
import { CustomError } from "./customError.js";
import { FormRiderjs } from "./index.js";

export class Processor {
    constructor(formRiderConfigs) {


        let elementsToApplyValidationOn = formRiderConfigs["elementsToApplyValidationOn"];

        let frForms = document.querySelectorAll("[data-frform]");

        /*      1- detect all frForms in the page
                2- check if the data-frform is declared in the jsonConfigs file
                3- if it is declared call the processing function otherwise show an error*/
        frForms.forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();


                let frFormNameToProcess = event.currentTarget.attributes["data-frform"].nodeValue;
                if (elementsToApplyValidationOn.hasOwnProperty(frFormNameToProcess)) {
                    this.processing(form, frFormNameToProcess, formRiderConfigs)
                }
                //Throw an error when the custom form name does not exist in json configs
                if (!elementsToApplyValidationOn.hasOwnProperty(frFormNameToProcess)) {
                    throw new CustomError("FormRider.js ERROR", "Unknown data-frform" + ' "' + frFormNameToProcess + '"' + ", was not declared in formRiderJsonConfig");
                }
            })
        });
    }


    /*  1- Block the submit while validating
        2- Block the DOM using setTimeout while validating
        3- when validation is done => show error notification / show confirmation notification + unblock the DOM + submit
        */
    processing(frForm, frFormNameToProcess, formRiderConfigs) {

        let postURL = this.getFormAction(frForm);
        let requestMethod = this.getFormRequestMethod(frForm);
        let formDataEncoded = this.getFormDataToKeyValueArrayEncodedURL(frForm);
        let formData = this.getFormDataToKeyValue(frForm);
        let dataToSubmit = formDataEncoded.join("&");






        //create a new instance of InputValidation in order to validate the input
        let _this = this;
        let inputValidation = new InputValidation(frFormNameToProcess, formData, formRiderConfigs);


        let timer = setTimeout(function() {

            if (inputValidation.validated) {
                //check if the error array is empty or not, if it is empty then submit data and then show the notification, if not then do noting and only show the notification

                try {
                    if (inputValidation.inputValidationRecap[1].length === 0) {
                        _this.sendData(requestMethod, postURL, dataToSubmit);
                        FormRiderjs.setValidationStatus(true);
                    }
                    if (inputValidation.inputValidationRecap[1].length !== 0) {
                        FormRiderjs.setValidationStatus(false);
                    }
                } catch (error) {
                    throw new CustomError("FormRider.js ERROR", "Process stopped, an error has occurred");
                }
                new NotificationGenerator(inputValidation.inputValidationRecap, formRiderConfigs);
            }
            clearTimeout(timer);
        }, 100);
    }


    //get all form inputs and values as key value into an array
    getFormDataToKeyValueArrayEncodedURL(form) {
        let formDataEncoded = [];
        for (let i = 0; i < form.elements.length; i++) {
            let element = form.elements[i];
            formDataEncoded.push(encodeURIComponent(element.name) + "=" + encodeURIComponent(element.value));
        }
        return formDataEncoded;
    }

    //convert form data to array of key value, key is inputName, value is input value
    getFormDataToKeyValue(form) {
        let formData = [];
        for (let i = 0; i < form.elements.length; i++) {
            let element = form.elements[i];

            //HTML custom attribute
            let elementName = element.getAttribute("data-name");
            let elementValue = element.value;
            if (elementName !== null) {


                //anticipate checkbox validation
                if (element.type === "checkbox") {
                    if (element.checked === false) {
                        elementValue = "frCheckBoxNoValue";
                    }
                }


                //anticipate radio validation
                if (element.type === "radio") {
                    if (element.checked === false) {
                        elementValue = "frRadioNoValue";
                    }
                }


                formData.push(elementName + "=" + elementValue);
            }
        }
        return formData;
    }

    //get the form ID
    getFormId(element) {
        return element.getAttribute("id");
    }

    //getting the action attribute from a form
    getFormAction(element) {
        return element.getAttribute("action");
    }


    //getting the method attribute from a form
    getFormRequestMethod(element) {
        return element.getAttribute("method");
    }

    //sending data with an ajax request
    sendData(requestMethod, postURL, dataToSubmit) {
        let request = new XMLHttpRequest();

        request.open(requestMethod, postURL, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(dataToSubmit);
    }
}