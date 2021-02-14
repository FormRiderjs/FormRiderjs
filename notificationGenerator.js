import { CustomError } from "./customError.js";
import { UINotification } from "./src/uiNotification/uiNotification.js";



export class NotificationGenerator {
    constructor(inputValidationRecap, formRiderConfigs) {

        this.notificationText = "";
        this.notificationTextColor = "";
        this.notificationBackgroundColor = "";


        let inputValidationErrorArray = inputValidationRecap[1];
        let inputValidationErrorLength = inputValidationErrorArray.length;

        //terminate process and show uncaught error, anyway...this will happen only if there is previous errors it is done to prevent unnecessary errors to be shown
        if (inputValidationErrorArray === undefined) {
            throw new CustomError("FormRider.js ERROR", "Uncaught error");
        }


        let formNotificationCode = this.extractFormNotificationCode(inputValidationRecap[0], inputValidationErrorLength);
        this.notificationAssembler(formRiderConfigs.notifications, formNotificationCode, inputValidationErrorArray);


        let activationStatus = NotificationGenerator.getActivationStatus();

        if (activationStatus === true) {

            let notification = NotificationGenerator.getNotification();
            UINotification.closePrecedentNotifications(notification);
            NotificationGenerator.setActivationStatus(false);
        }


        let notification = new UINotification(inputValidationErrorArray, this.notificationText, this.notificationTextColor, this.notificationBackgroundColor);

        NotificationGenerator.setNotification(notification);
        NotificationGenerator.setActivationStatus(true);

    }



    //==================================================================================================================

    static setNotification(notification) {
        this.notification = notification.notification;
    }

    static getNotification() {
        return this.notification;
    }

    static setActivationStatus(newStatus) {
        if (newStatus === false) {
            this.activationStatus = false;
        }
        if (newStatus === true) {
            this.activationStatus = true;
        }
    }
    static getActivationStatus() {
            return this.activationStatus;
        }
        //==================================================================================================================



    notificationAssembler(jsonNotifications, formNotificationCode) {

        let notificationCodeIsFound = false;

        for (let i = 0; i < jsonNotifications.length; i++) {
            if (jsonNotifications[i].notificationCode === formNotificationCode) {
                this.notificationText = jsonNotifications[i]["text"];
                this.notificationTextColor = jsonNotifications[i]["textColor"];
                this.notificationBackgroundColor = jsonNotifications[i]["backgroundColor"];
                notificationCodeIsFound = true;
            }
        }

        if (notificationCodeIsFound === false) {
            throw new CustomError("FormRider.js ERROR", "Notification code is not defined in notifications");
        }
    }


    extractFormNotificationCode(notificationCodeObject, inputValidationErrorLength) {
        if (inputValidationErrorLength !== 0) {
            return notificationCodeObject["notValidated"];
        } else {
            return notificationCodeObject["validated"];
        }
    }

}