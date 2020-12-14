//===================================================================================================
// let onTheFlyLocation = document.currentScript.src.slice(0,-12);
import {Processor} from "./processor.js";

let onTheFlyjsLocation = import.meta.url.slice(0, -12);
//===================================================================================================

let pathToJSONConfig = onTheFlyjsLocation + "/validateOnTheFlyJsonConfig.json";
new Processor(pathToJSONConfig);
