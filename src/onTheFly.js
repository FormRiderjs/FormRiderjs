import {Processor} from "./processor.js";
import {CustomError} from "./customError.js";

let onTheFlyJSLocation = import.meta.url.slice(0, -12);
//===================================================================================================

let pathToJSONConfig = onTheFlyJSLocation + "/validateOnTheFlyJsonConfig.json";
fetch(pathToJSONConfig, {
    method: "GET",
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then((response) => {
        let style = "font-size:15px"
        console.log("%cOnTheFly.js loaded successfully, thank you for using it, Happy validating ❤️ ", style);
        return response.json();
    })
    .then((onTheFlyConfigs) => {
        new Processor(onTheFlyConfigs);
    })
    .catch((error) => {
        //TODO : if fetch request is 404 show something
        console.log(error);
    })

// new Processor(pathToJSONConfig);

