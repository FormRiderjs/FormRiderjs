// this class will get formData, process data, call other necessary class
import {InputValidation} from "./inputValidation.js";
import {Notification} from "./notificationGenerator.js";
import {CustomError} from "./customError.js";

export class Processor {
    constructor(onTheFlyConfigs) {


        let elementsToApplyValidationOn = onTheFlyConfigs["elementsToApplyValidationOn"];

        let otfFormName = document.querySelectorAll("[data-otfForm]");

        /*      1- detect all otfForms in the page
                2- check if the data-otfForm is declared in the jsonConfigs file
                3- if it is declared call the processing function otherwise show an error*/
        otfFormName.forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();


                let otfFormNameToProcess = event.currentTarget.attributes["data-otfForm"].nodeValue;
                if (elementsToApplyValidationOn.hasOwnProperty(otfFormNameToProcess)) {
                    this.processing(form, otfFormNameToProcess, onTheFlyConfigs)
                }
                //Throw an error when the custom form name does not exist in json configs
                if (!elementsToApplyValidationOn.hasOwnProperty(otfFormNameToProcess)) {
                    throw new CustomError("OnTheFly.js ERROR", "Unknown data-otfForm" + ' "' + otfFormNameToProcess + '"' + ", was not declared in onTheFlyJsonConfig");
                }
            })
        });
    }


    /*  1- Block the submit while validating
        2- Block the DOM using setTimeout while validating
        3- when validation is done => show error notification / show confirmation notification + unblock the DOM + submit
        */

    processing(otfForm, otfFormNameToProcess, onTheFlyConfigs) {

        let postURL = this.getFormAction(otfForm);
        let requestMethod = this.getFormRequestMethod(otfForm);
        let formDataEncoded = this.getFormDataToKeyValueArrayEncodedURL(otfForm);
        let formData = this.getFormDataToKeyValue(otfForm);
        let dataToSubmit = formDataEncoded.join("&");

        // console.log(formDataEncoded); // for submit purpose

        //create a new instance of InputValidation in order to validate the input
        let inputValidation = new InputValidation(otfFormNameToProcess, formData, onTheFlyConfigs);

        let that = this;
        let timer = setTimeout(function () {
            that.sendData(requestMethod, postURL, dataToSubmit);
            if (inputValidation["validated"] === true) {

                //submit data when form is validated
                that.sendData(requestMethod, postURL, dataToSubmit);

                console.log(inputValidation["inputValidationRecap"]);
                new Notification(inputValidation["inputValidationRecap"], onTheFlyConfigs);
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


            //anticipate the validation
                if (element.type === "checkbox") {
                    if (element.checked === false) {
                        elementValue = "otfCheckBoxNoValue";
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

