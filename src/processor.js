// this class will get formData, process data, call other necessary class
import {InputValidation} from "./inputValidation.js";
import {Notification} from "./notificationGenerator.js";
import {CustomError} from "./customError.js";

export class Processor {
    constructor(jsonConfigURL) {


        this.getJsonData(jsonConfigURL)
            .then((jsonData) => {
                let elementsToApplyValidationOn = jsonData["elementsToApplyValidationOn"];
                for (let formId in elementsToApplyValidationOn) {
                    if (elementsToApplyValidationOn.hasOwnProperty(formId)
                        && document.getElementById(formId) !== null) {
                        this.processing("#" + formId, jsonConfigURL);
                    }
                    //terminate process and show error when formId in jsonConfigs !== formId to validate in the DOM
                    if(elementsToApplyValidationOn.hasOwnProperty(formId)
                    && document.getElementById(formId) === null) {
                        throw new CustomError("OnTheFly.js ERROR", "Unknown formId" + ' "' + formId + '" ' + "in onTheFlyJsonConfig");
                    }
                }
                return jsonData;
            })
            .catch(function (error) {
                console.log(error);
            });

    }


    /*    1- Block the submit while validating
        2- Block the DOM using setTimeout while validating
        3 - when validation is done => show error notification / show confirmation notification + unblock the DOM + submit
        */
    processing(selector, jsonConfigURL) {
        let form = document.querySelector(selector);
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            let postURL = this.getFormAction(form);
            let requestMethod = this.getFormRequestMethod(form);
            let formDataEncoded = this.getFormDataToKeyValueArrayEncodedURL(form);
            let formData = this.getFormDataToKeyValue(form);
            let formId = this.getFormId(form);
            let dataToSubmit = formDataEncoded.join("&");

            //create a new instance of InputValidation in order to validate the input
            let inputValidation = new InputValidation(formId, formData, jsonConfigURL);

            let that = this;
            let timer = setTimeout(function () {
                if (inputValidation["validated"] === true) {
                    //submit data when form is validated
                    that.sendData(requestMethod, postURL, dataToSubmit);
                }
                if (typeof (inputValidation["resetFormUponSubmitValue"]) !== "undefined") {
                    new Notification(inputValidation["inputValidationRecap"], jsonConfigURL);
                }
                clearTimeout(timer);
            }, 100);
        });
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

            //checking if
            if(elementName !== null){
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

    getJsonData(jsonConfigFileURL) {
        let xhr = new XMLHttpRequest();

        return new Promise(function (resolve, reject) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve(JSON.parse(this.responseText));
                }
            };
            xhr.open("GET", jsonConfigFileURL, true);
            xhr.send();
        });
    }
}

