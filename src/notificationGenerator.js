
import {CustomError} from "./customError.js";


export class NotificationGenerator {

    constructor(inputValidationRecap, onTheFlyConfigs) {

        let inputValidationErrorArray = inputValidationRecap[1];


        let inputValidationErrorLength = inputValidationErrorArray.length;

        //terminate process and show uncaught error, anyway...this will happen only if there is previous errors it is done to prevent unnecessary errors to be shown
        if (inputValidationErrorArray === undefined) {
            throw new CustomError("OnTheFly.js ERROR", "Uncaught error");
        }


        let uiNotificationBox = this.extractNotificationBoxCss();
        let uiErrorBox = this.extractErrorBoxCss();
        let uiCloseButton = this.extractCloseBoxButton(uiNotificationBox);



        let uiNotification = new uiNotification(inputValidationErrorLength);




        let notificationCode = this.extractNotificationCode(inputValidationRecap[0], inputValidationErrorLength);
        let notificationAssembled = this.notificationAssembler(onTheFlyConfigs.notifications, notificationCode, inputValidationErrorArray, uiNotificationBox, uiErrorBox, uiCloseButton);
        let notification = this.uiShowNotification(notificationAssembled);
        this.closeNotificationManually(uiCloseButton, notification);
        this.closeNotificationAutomatically(notification, inputValidationErrorLength, 5000);

    }
    //not showing the same notification more than one time
    //creating the notification and showing it
    uiShowNotification(notificationAssembled) {
        return document.body.appendChild(notificationAssembled);
    }

    //extracting uiNotificationBoxCss form jsonConfig file and create a div with theses CSS specifications
    extractNotificationBoxCss() {

        let uiNotificationBox = document.createElement("div");

        uiNotificationBox.style.position = "fixed";
        uiNotificationBox.style.zIndex = "1000";
        uiNotificationBox.style.left = "0";
        uiNotificationBox.style.top = "0";
        uiNotificationBox.style.width = "100%";
        uiNotificationBox.style.margin = "auto";
        uiNotificationBox.style.padding = "17px";
        uiNotificationBox.style.textAlign = "";
        uiNotificationBox.style.fontSize = "16px";
        uiNotificationBox.style.fontWeight = "bold";

        return uiNotificationBox;
    }


    //extracting uiErrorBoxCss form jsonConfig file and create a div with theses CSS specifications
    extractErrorBoxCss() {
        let uiErrorBox = document.createElement("div");

        uiErrorBox.style.marginTop = "10px";
        uiErrorBox.style.fontWeight = "normal";

        return uiErrorBox;
    }


    //extracting uiCloseBoxButton form jsonConfig file and create a div with theses CSS specifications
    extractCloseBoxButton() {

        let uiCloseBoxButton = document.createElement("span");
        uiCloseBoxButton.innerHTML = "close Notification";
        uiCloseBoxButton.style.marginLeft = "5px";
        uiCloseBoxButton.style.cursor = "pointer";

        return uiCloseBoxButton;
    }


    //this function will create the final notification (after extracting all necessary data such as error array + error button css specifications)
    //FINAL STEP BEFORE SHOWING THE NOTIFICATION
    notificationAssembler(jsonNotifications, notificationCode, inputValidationErrorArray, uiNotificationBox, uiErrorBox, uiCloseBoxButton) {

        let validationStatus = true;

        if (inputValidationErrorArray.length !== 0) {
            validationStatus = false;
        }

        let notificationText;
        let notificationTextColor;
        let notificationBackgroundColor;


        for (let i = 0; i < jsonNotifications.length; i++) {
            if (jsonNotifications[i]["notificationCode"] === notificationCode
                && jsonNotifications[i]["validationStatus"] === validationStatus) {
                notificationText = jsonNotifications[i]["text"];
                notificationTextColor = jsonNotifications[i]["textColor"];
                notificationBackgroundColor = jsonNotifications[i]["backgroundColor"];
            }
        }


        for (let x = 0; x < inputValidationErrorArray.length; x++) {
            let uiError = document.createElement("div");
            uiError.innerHTML = "<span style='line-height: 125%'>&#8226;</span> " + inputValidationErrorArray[x][1];
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

























































































/*
import {CustomError} from "./customError.js";


export class NotificationGenerator {

    constructor(inputValidationRecap, onTheFlyConfigs) {

        let inputValidationErrorArray = inputValidationRecap[1];
        //terminate process and show uncaught error, anyway...this will happen only if there is previous errors it is done to prevent unnecessary errors to be shown
        if (inputValidationErrorArray === undefined) {
            throw new CustomError("OnTheFly.js ERROR", "Uncaught error");
        }


        let uiNotificationBox = this.extractNotificationBoxCss();
        let uiErrorBox = this.extractErrorBoxCss();
        let uiCloseButton = this.extractCloseBoxButton(uiNotificationBox);



        let inputValidationErrorLength = inputValidationErrorArray.length;
        let notificationCode = this.extractNotificationCode(inputValidationRecap[0], inputValidationErrorLength);
        let notificationAssembled = this.notificationAssembler(onTheFlyConfigs.notifications, notificationCode, inputValidationErrorArray, uiNotificationBox, uiErrorBox, uiCloseButton);
        let notification = this.uiShowNotification(notificationAssembled);
        this.closeNotificationManually(uiCloseButton, notification);
        this.closeNotificationAutomatically(notification, inputValidationErrorLength, 5000);

    }
    //not showing the same notification more than one time
    //creating the notification and showing it
    uiShowNotification(notificationAssembled) {
        return document.body.appendChild(notificationAssembled);
    }

    //extracting uiNotificationBoxCss form jsonConfig file and create a div with theses CSS specifications
    extractNotificationBoxCss() {

        let uiNotificationBox = document.createElement("div");

        uiNotificationBox.style.position = "fixed";
        uiNotificationBox.style.zIndex = "1000";
        uiNotificationBox.style.left = "0";
        uiNotificationBox.style.top = "0";
        uiNotificationBox.style.width = "100%";
        uiNotificationBox.style.margin = "auto";
        uiNotificationBox.style.padding = "17px";
        uiNotificationBox.style.textAlign = "";
        uiNotificationBox.style.fontSize = "16px";
        uiNotificationBox.style.fontWeight = "bold";

        return uiNotificationBox;
    }


    //extracting uiErrorBoxCss form jsonConfig file and create a div with theses CSS specifications
    extractErrorBoxCss() {
        let uiErrorBox = document.createElement("div");

        uiErrorBox.style.marginTop = "10px";
        uiErrorBox.style.fontWeight = "normal";

        return uiErrorBox;
    }


    //extracting uiCloseBoxButton form jsonConfig file and create a div with theses CSS specifications
    extractCloseBoxButton() {

        let uiCloseBoxButton = document.createElement("span");
        uiCloseBoxButton.innerHTML = "close Notification";
        uiCloseBoxButton.style.marginLeft = "5px";
        uiCloseBoxButton.style.cursor = "pointer";

        return uiCloseBoxButton;
    }


    //this function will create the final notification (after extracting all necessary data such as error array + error button css specifications)
    //FINAL STEP BEFORE SHOWING THE NOTIFICATION
    notificationAssembler(jsonNotifications, notificationCode, inputValidationErrorArray, uiNotificationBox, uiErrorBox, uiCloseBoxButton) {

        let validationStatus = true;

        if (inputValidationErrorArray.length !== 0) {
            validationStatus = false;
        }

        let notificationText;
        let notificationTextColor;
        let notificationBackgroundColor;


        for (let i = 0; i < jsonNotifications.length; i++) {
            if (jsonNotifications[i]["notificationCode"] === notificationCode
                && jsonNotifications[i]["validationStatus"] === validationStatus) {
                notificationText = jsonNotifications[i]["text"];
                notificationTextColor = jsonNotifications[i]["textColor"];
                notificationBackgroundColor = jsonNotifications[i]["backgroundColor"];
            }
        }


        for (let x = 0; x < inputValidationErrorArray.length; x++) {
            let uiError = document.createElement("div");
            uiError.innerHTML = "<span style='line-height: 125%'>&#8226;</span> " + inputValidationErrorArray[x][1];
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

    /!*
    if the new notification is validated, then remove the first one after five seconds, otherwise it stays
     *!/
    notificationAnimation(notification) {


    }
}
*/
