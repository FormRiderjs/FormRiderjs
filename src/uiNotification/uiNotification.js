class uiNotification {
    constructor(inputValidationErrorLength) {

        let uiNotificationBox = this.createNotificationBox();
        let uiErrorBox = this.createErrorBox();
        let uiCloseButton = this.createCloseBoxButton(uiNotificationBox);
        this.closeNotificationAutomatically(inputValidationErrorLength, 5000);
    }

    createNotificationBox() {
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


    createErrorBox(){
        let uiErrorBox = document.createElement("div");

        uiErrorBox.style.marginTop = "10px";
        uiErrorBox.style.fontWeight = "normal";

        return uiErrorBox;
    }


    createCloseBoxButton(uiNotificationBox){
        let uiCloseBoxButton = document.createElement("span");
        uiCloseBoxButton.innerHTML = "close Notification";
        uiCloseBoxButton.style.marginLeft = "5px";
        uiCloseBoxButton.style.cursor = "pointer";

        return uiCloseBoxButton;
    }


    closeNotificationManually(uiCloseButton, notification) {
        uiCloseButton.addEventListener("click", function () {
            notification.parentNode.removeChild(notification);
        });
    }



    closeNotificationAutomatically(inputValidationErrorLength, delay) {
        if (inputValidationErrorLength === 0) {
            setTimeout(function () {
                notification.parentNode.removeChild(notification);
            }, delay);
        }
    }

}