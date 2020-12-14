import {CustomError} from "./customError.js";


export class Notification {

    constructor(inputValidationRecap, jsonConfigURL) {


        let inputValidationErrorArray = inputValidationRecap[1];
        //terminate process and show uncaught error, anyway...this will happen only if there is previous errors it is done to prevent unnecessary errors to be shown
        if(inputValidationErrorArray === undefined){
            throw new CustomError("OnTheFly.js ERROR", "Uncaught error");
        }

        let inputValidationErrorLength = inputValidationErrorArray.length;

        let notificationCode = this.extractNotificationCode(inputValidationRecap[0], inputValidationErrorLength);
        this.getJsonData(jsonConfigURL)
            .then((jsonData) => {
                let uiNotificationBox = this.extractNotificationBoxCss(jsonData["uiNotificationBoxCss"]);
                let uiErrorBox = this.extractErrorBoxCss(jsonData["uiErrorBoxCss"]);
                let uiCloseButton = this.extractCloseBoxButton(jsonData["uiCloseBoxButton"], uiNotificationBox);
                let notificationAssembled = this.notificationAssembler(jsonData["notifications"], notificationCode, inputValidationErrorArray, uiNotificationBox, uiErrorBox, uiCloseButton);
                let notification = this.uiShowNotification(notificationAssembled);
                this.closeNotificationManually(uiCloseButton, notification);
                this.closeNotificationAutomatically(notification, inputValidationErrorLength, 5000);
                return jsonData;
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
            };
            xhr.open("GET", jsonConfigURL, true);
            xhr.send();
        });
    }

    //not showing the same notification more than one time
    //creating the notification and showing it
    uiShowNotification(notificationAssembled) {
        return document.body.appendChild(notificationAssembled);
    }

    //extracting uiNotificationBoxCss form jsonConfig file and create a div with theses CSS specifications
    extractNotificationBoxCss(jsonData) {

        let uiNotificationBox = document.createElement("div");

        uiNotificationBox.style.position = jsonData.position;
        uiNotificationBox.style.zIndex = jsonData.zIndex;
        uiNotificationBox.style.left = jsonData.left;
        uiNotificationBox.style.top = jsonData.top;
        uiNotificationBox.style.width = jsonData.width;
        uiNotificationBox.style.margin = jsonData.margin;
        uiNotificationBox.style.padding = jsonData.padding;
        uiNotificationBox.style.textAlign = jsonData.textAlign;
        uiNotificationBox.style.fontSize = jsonData.fontSize;
        uiNotificationBox.style.fontWeight = jsonData.fontWeight;

        return uiNotificationBox;
    }


    //extracting uiErrorBoxCss form jsonConfig file and create a div with theses CSS specifications
    extractErrorBoxCss(jsonData) {
        let uiErrorBox = document.createElement("div");

        uiErrorBox.style.marginTop = jsonData.marginTop;
        uiErrorBox.style.fontWeight = jsonData.fontWeight;

        return uiErrorBox;
    }


    //extracting uiCloseBoxButton form jsonConfig file and create a div with theses CSS specifications
    extractCloseBoxButton(jsonData) {

        let uiCloseBoxButton = document.createElement("span");
        uiCloseBoxButton.innerHTML = jsonData["text"];
        uiCloseBoxButton.style.marginLeft = jsonData.marginLeft;
        uiCloseBoxButton.style.cursor = jsonData.cursor;

        return uiCloseBoxButton;
    }


    //this function will create the final notification (after extracting all necessary data such as error array + error button css specifications)
    //FINAL STEP BEFORE SHOWING THE NOTIFICATION
    notificationAssembler(jsonData, notificationCode, inputValidationErrorArray, uiNotificationBox, uiErrorBox, uiCloseBoxButton) {

        let validationStatus = true;

        if (inputValidationErrorArray.length !== 0) {
            validationStatus = false;
        }

        let notificationText;
        let notificationTextColor;
        let notificationBackgroundColor;


        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i]["notificationCode"] === notificationCode
                && jsonData[i]["validationStatus"] === validationStatus) {
                notificationText = jsonData[i]["text"];
                notificationTextColor = jsonData[i]["textColor"];
                notificationBackgroundColor = jsonData[i]["backgroundColor"];
            }
        }


        for (let x = 0; x < inputValidationErrorArray.length; x++) {
            let uiError = document.createElement("div");
            uiError.innerHTML = "<span style='line-height: 125%'>&#8226;</span> " + inputValidationErrorArray[x];
            uiErrorBox.appendChild(uiError);
        }


        let uiNotificationContent = document.createElement("div");
        uiNotificationContent.style.color = notificationTextColor;
        uiNotificationContent.innerHTML = notificationText;


        uiCloseBoxButton.style.borderBottom = "solid 2px" + notificationTextColor;
        uiNotificationContent.appendChild(uiCloseBoxButton);


        if (validationStatus === false) {
            uiNotificationContent.appendChild(uiErrorBox);
        }
        uiNotificationBox.appendChild(uiNotificationContent);
        uiNotificationBox.style.backgroundColor = notificationBackgroundColor;

        return uiNotificationBox;
    }


    extractNotificationCode(notificationCodeObject, inputValidationErrorLength) {
        if (inputValidationErrorLength !== 0) {
            return notificationCodeObject["notValidated"];
        } else {
            return notificationCodeObject["validated"];
        }
    }


    //create a X button on the right side in order to be able to close the notification
    //if not closing automatically via the animation function
    closeNotificationAutomatically(notification, inputValidationErrorLength, delay) {
        if (inputValidationErrorLength === 0) {
            setTimeout(function () {
                notification.parentNode.removeChild(notification);
            }, delay);
        }
    }


    closeNotificationManually(uiCloseButton, notification) {
        uiCloseButton.addEventListener("click", function () {
            notification.parentNode.removeChild(notification);
        });
    }

    /*
    if the new notification is validated, then remove the first one after five seconds, otherwise it stays
     */
    notificationAnimation(notification) {


    }
}



