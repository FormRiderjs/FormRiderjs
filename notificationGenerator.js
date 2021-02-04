import {CustomError} from "./customError.js";
import {UINotification} from "./src/uiNotification/uiNotification.js";

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



        if(UINotification.notificationActivated === true){
            UINotification.closePrecedentNotifications(UINotification.uiNotification);
        }

        new UINotification(inputValidationErrorArray, this.notificationText, this.notificationTextColor ,this.notificationBackgroundColor);

        UINotification.notificationActivated = true;
    }




/*
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



        if(UINotification.notificationActivated === true){
            UINotification.closePrecedentNotifications(UINotification.uiNotification);
        }

        new UINotification(inputValidationErrorArray, this.notificationText, this.notificationTextColor ,this.notificationBackgroundColor);

        UINotification.notificationActivated = true;
    }
*/


/*    closeAllPrecedentNotification(notification)
    {
        let currentNotificationId = UINotification.lastNotificationInstanceId
        if(currentNotificationId > 1){
            notification.parentNode.removeChild(notification);
            UINotification.lastNotificationInstanceId = 0;
        }
    }*/



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

        if(notificationCodeIsFound === false){
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
