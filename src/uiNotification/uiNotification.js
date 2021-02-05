


export class UINotification {

    static uiNotification;


    constructor(inputValidationErrorArray, notificationText, notificationTextColor, notificationBackgroundColor) {


        this.notificationBox = this.createNotificationBox(notificationBackgroundColor);
        this.errorBox = this.createErrorBox();
        let closeBoxButton = this.createCloseBoxButton(notificationTextColor);
        this.notificationContent = this.createNotificationContent(notificationTextColor, notificationText);


        this.notificationContent.appendChild(closeBoxButton);
        this.notificationBox.appendChild(this.notificationContent);

        this.createNotification(inputValidationErrorArray);

        this.notification = this.uiShowNotification(this.notificationBox);
        UINotification.uiNotification = this.notification;



        this.closeNotificationAutomatically(this.notification, inputValidationErrorArray, 20000);
        this.closeNotificationManually(this.notification, closeBoxButton);
    }

    static closePrecedentNotifications(notification){
        notification.parentNode.removeChild(notification);
    }



    createNotificationBox(notificationBackgroundColor) {

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
        uiNotificationBox.style.backgroundColor = notificationBackgroundColor;

        return uiNotificationBox;
    }

    createErrorBox() {
        let uiErrorBox = document.createElement("div");

        uiErrorBox.style.marginTop = "10px";
        uiErrorBox.style.fontWeight = "normal";

        return uiErrorBox;
    }

    createCloseBoxButton(notificationTextColor) {

        let uiCloseBoxButton = document.createElement("span");
        uiCloseBoxButton.innerHTML = "close Notification";
        uiCloseBoxButton.style.marginLeft = "5px";
        uiCloseBoxButton.style.cursor = "pointer";
        uiCloseBoxButton.style.color = notificationTextColor
        uiCloseBoxButton.style.borderBottom = "solid 2px" + notificationTextColor;
        return uiCloseBoxButton;
    }

    createNotificationContent(notificationTextColor, notificationText) {
        let uiNotificationContent = document.createElement("div");
        uiNotificationContent.style.color = notificationTextColor;
        uiNotificationContent.innerHTML = notificationText;

        return uiNotificationContent;
    }

    createSingleLineError(errorLine) {
        let uiErrorLine = document.createElement("div");
        uiErrorLine.innerHTML = "<span style='line-height: 125%'>&#8226;</span> " + errorLine;

        return uiErrorLine
    }


    createNotification(inputValidationErrorArray) {

        for (let i = 0; i < inputValidationErrorArray.length; i++) {
            this.errorBox.append(this.createSingleLineError(inputValidationErrorArray[i][1]));
        }
        if (inputValidationErrorArray.length !== 0) {
            this.notificationContent.appendChild(this.errorBox);
        }

    }

    uiShowNotification(notification) {
        return document.body.appendChild(notification);
    }


    closeNotificationAutomatically(notification, inputValidationErrorArray, delay) {
        //Close notification automatically only when there is no errors
        if (inputValidationErrorArray.length === 0) {
            setTimeout(() => {
                //if notification is already closed then do nothing
                if (notification.parentNode !== null) {
                    notification.parentNode.removeChild(notification);
                    UINotification.activationStatus = false;
                }
            }, delay);
        }

    }

    closeNotificationManually(notification, closeBoxButton) {
        closeBoxButton.addEventListener("click", (e) => {
            notification.parentNode.removeChild(notification);
            UINotification.activationStatus = false;
        });
    }

}














/*
export class UINotification {

    // static lastNotificationInstanceId = 0;

    static notificationActivated = false;
    static uiNotification;



    constructor(inputValidationErrorArray, notificationText, notificationTextColor, notificationBackgroundColor) {

        // this.notificationInstanceId = UINotification.lastNotificationInstanceId++;

        this.notificationBox = this.createNotificationBox(notificationBackgroundColor);
        this.errorBox = this.createErrorBox();
        let closeBoxButton = this.createCloseBoxButton(notificationTextColor);
        this.notificationContent = this.createNotificationContent(notificationTextColor, notificationText);


        this.notificationContent.appendChild(closeBoxButton);
        this.notificationBox.appendChild(this.notificationContent);

        this.createNotification(inputValidationErrorArray);

        this.notification = this.uiShowNotification(this.notificationBox);
        UINotification.uiNotification = this.notification;


        this.closeNotificationAutomatically(this.notification, inputValidationErrorArray, 2000);
        this.closeNotificationManually(this.notification, closeBoxButton);

    }




    static closePrecedentNotifications(notification){
        notification.parentNode.removeChild(notification);
        UINotification.notificationActivated = false;
    }


    createNotificationBox(notificationBackgroundColor) {

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
        uiNotificationBox.style.backgroundColor = notificationBackgroundColor;

        return uiNotificationBox;
    }

    createErrorBox() {
        let uiErrorBox = document.createElement("div");

        uiErrorBox.style.marginTop = "10px";
        uiErrorBox.style.fontWeight = "normal";

        return uiErrorBox;
    }

    createCloseBoxButton(notificationTextColor) {

        let uiCloseBoxButton = document.createElement("span");
        uiCloseBoxButton.innerHTML = "close Notification";
        uiCloseBoxButton.style.marginLeft = "5px";
        uiCloseBoxButton.style.cursor = "pointer";
        uiCloseBoxButton.style.color = notificationTextColor
        uiCloseBoxButton.style.borderBottom = "solid 2px" + notificationTextColor;
        return uiCloseBoxButton;
    }

    createNotificationContent(notificationTextColor, notificationText) {
        let uiNotificationContent = document.createElement("div");
        uiNotificationContent.style.color = notificationTextColor;
        uiNotificationContent.innerHTML = notificationText;

        return uiNotificationContent;
    }

    createSingleLineError(errorLine) {
        let uiErrorLine = document.createElement("div");
        uiErrorLine.innerHTML = "<span style='line-height: 125%'>&#8226;</span> " + errorLine;

        return uiErrorLine
    }


    createNotification(inputValidationErrorArray) {

        for (let i = 0; i < inputValidationErrorArray.length; i++) {
            this.errorBox.append(this.createSingleLineError(inputValidationErrorArray[i][1]));
        }
        if (inputValidationErrorArray.length !== 0) {
            this.notificationContent.appendChild(this.errorBox);
        }

    }

    uiShowNotification(notification) {
        return document.body.appendChild(notification);
    }


    closeNotificationAutomatically(notification, inputValidationErrorArray, delay) {
        //Close notification automatically only when there is no errors
        if (inputValidationErrorArray.length === 0) {
            setTimeout(() => {
                //if notification is already closed then do nothing
                if (notification.parentNode !== null) {
                    notification.parentNode.removeChild(notification);
                    UINotification.notificationActivated = false;
                }
            }, delay);
        }

    }

    closeNotificationManually(notification, closeBoxButton) {
        closeBoxButton.addEventListener("click", (e) => {
            notification.parentNode.removeChild(notification);
            UINotification.notificationActivated = false;
        });
    }
}
*/
