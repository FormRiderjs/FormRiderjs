import {CustomError} from "./customError.js";
import {UINotification} from "./uiNotification/uiNotification.js";

export class NotificationGenerator {

    constructor(inputValidationRecap, onTheFlyConfigs) {

        this.notificationText;
        this.notificationTextColor;
        this.notificationBackgroundColor;


        let inputValidationErrorArray = inputValidationRecap[1];
        let inputValidationErrorLength = inputValidationErrorArray.length;

        //terminate process and show uncaught error, anyway...this will happen only if there is previous errors it is done to prevent unnecessary errors to be shown
        if (inputValidationErrorArray === undefined) {
            throw new CustomError("OnTheFly.js ERROR", "Uncaught error");
        }


        let formNotificationCode = this.extractFormNotificationCode(inputValidationRecap[0], inputValidationErrorLength);
        this.notificationAssembler(onTheFlyConfigs.notifications, formNotificationCode, inputValidationErrorArray);


        new UINotification(inputValidationErrorArray, this.notificationText, this.notificationTextColor ,this.notificationBackgroundColor);


        // this.closeNotificationManually(uiCloseButton, notification);
        // this.closeNotificationAutomatically(notification, inputValidationErrorLength, 5000);

    }





    createSingleLineError (errorLin){
        let uiErrorLine = document.createElement("div");
        uiErrorLine.innerHTML = "<span style='line-height: 125%'>&#8226;</span> " + errorLin;

        return uiErrorLine
    }


    notificationAssembler(jsonNotifications, formNotificationCode) {

        for (let i = 0; i < jsonNotifications.length; i++) {
            if (jsonNotifications[i].notificationCode === formNotificationCode) {
                this.notificationText = jsonNotifications[i]["text"];
                this.notificationTextColor = jsonNotifications[i]["textColor"];
                this.notificationBackgroundColor = jsonNotifications[i]["backgroundColor"];
            }
        }
    }


    extractFormNotificationCode(notificationCodeObject, inputValidationErrorLength) {
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
}

