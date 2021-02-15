import { Processor } from "./processor.js";



export class FormRiderjs {
    constructor() {
        let formRiderJSLocation =
            import.meta.url.slice(0, -9);
        //===================================================================================================
        let pathToJSONConfig = formRiderJSLocation + "/formRiderJsonConfig.json";
        fetch(pathToJSONConfig, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                console.log("FormRider.js loaded successfully, thank you for using it, Happy validating ❤️ ");
                return response.json();
            })
            .then((formRiderConfigs) => {
                new Processor(formRiderConfigs);
            })
            .catch((error) => {
                console.log(error);
            })
    }



    static setValidationStatus(status) {
        if (status === true) {
            this.validationStatus = true;
        }
        if (status === false) {
            this.validationStatus = false;
        }
    }


    static getValidationStatus() {
        return this.validationStatus;
    }
}

export default new FormRiderjs;