//===================================================================================================
// let onTheFlyLocation = document.currentScript.src.slice(0,-12);
import {Processor} from "./processor.js";

let onTheFlyjsLocation = import.meta.url.slice(0, -12);
//===================================================================================================

// console.log(import.meta.url.slice(0,-20));

//===================================================================================================
function scriptLoader(path, callback) {
    let script = document.createElement("script");
    // script.type = "text/javascript";
    script.type = "module";
    script.async = false;
    script.src = path;
    script.onload = function () {
        if (typeof (callback) === "function") {
            callback();
        }
    }

    try {
        let scriptOne = document.getElementsByTagName('script')[0];
        scriptOne.parentNode.insertBefore(script, scriptOne);
    } catch (e) {
        console.log(e);
    }
}

let pathToJSONConfig = onTheFlyjsLocation + "/validateOnTheFlyJsonConfig.json";
new Processor(pathToJSONConfig);


//===================================================================================================

// scriptLoader(onTheFlyLocation + "/processor.js", function () {
//     let pathToJSONConfig = onTheFlyLocation + "/validateOnTheFlyJsonConfig.json";
//     new Processor(pathToJSONConfig);
//     console.log("onTheFly.js loaded successfully. You can delete my line , i am located in onTheFly.js file");
// });
//===================================================================================================
/*scriptLoader(onTheFlyLocation+"/inputValidation.js");
scriptLoader(onTheFlyLocation+"/notificationGenerator.js");
scriptLoader(onTheFlyLocation+"/processor.js", function () {
    let pathToJSONConfig = onTheFlyLocation+"/validateOnTheFlyJsonConfig.json";
    new Processor(pathToJSONConfig);
    //!*********** DELETE the console.log line IF ValidateOnTheFly is loaded *******
    console.log("onTheFly.js loaded successfully. You can delete my line , i am located in onTheFly.js file");
});*/
//===================================================================================================