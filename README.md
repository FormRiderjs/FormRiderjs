

# FormRider.js
Javascript front-end form validation and notification library, simple, fast, polyvalent and opensource 

----------
Usage :
-------
- Start by cloning FormRider.js :  
```GIT
git clone https://github.com/iLoveSemicolons/validateOnTheFly.git
```

- put validateOnTheFly script at the bottom of your web page template
   file, main html file or any html file you want, then replace **PATH**
   by the path to validateOnTheFly file in your project.
  
```HTML
<script src="<PATH>/formRiderjs/src/index.js"> </script> 
```

----------

JSON Configuration
------------------

**Configurations are done in  `validateOnTheFlyJsonConfig.json` :**

this file has 2 essential elements : 
 - `notifications` : notification configuration are done here
 - `elementsToApplyValidationOn` : indicate form to be validated as well as inputs and      what to validate in inputs, error messages are written here too.


 - **`notifications` configuration** : 
  you can make as much notification as you want.
   
	 - `notificationCode` : int type value,  it should be a unique number for every single notification.
	 - `validationStatus` : bool type.
		 - true : means this notification is used when form is confirmed.
		 - false : means this notification is used for when form is rejected.
	 - `text` :  string type, this is the text that will be shown
   in the notification.
	 - `textColor` : #HexCode, a good color is #E6E6E6 
	 - `backgroundColor` : #HexCode, a good color for confirmation , #5CD8AA, for rejection #E66767 .
	 
	
```JSON
   "notifications":
            [
                {
                    "notificationCode": number,
                    "validationStatus": bool,
                    "text": string,
                    "textColor": "#E6E6E6",
                    "backgroundColor": "#5CD8AA",
                },
                {
                    "notificationCode": number,
                    "validationStatus": bool,
                    "text": string,
                    "textColor": "#E6E6E6",
                    "backgroundColor": "#E66767",
                }
            ],
```


- **`elementsToApplyValidationOn` configuration** :

	- `formId` : replace formId by the id of form you want to validate
	- `notificationCode` : has 2 values, both are directly linked to `notificationCode` in `notifications`,  so the code you put here should match the number you put in `notificationCode` in `notifications`
		- `validated`: int type, code of the notification to be shown in case form is validated.
		- `notValidated` :  int type, code of the notification to be shown in case form is not validated.
	- `formValidation` : value of bool type true/false
		- true : if form need to be validated.
		- false : if form is not to be validated.
	- `resetFormUponSubmit` : value of bool type true/false
		- true : means that form inputs will be reset after submission.
		- false : means that form inputs will not be reset after submission.
	- `inputName` : replace inputName by the name of input you want to validate.
	- `properties` : validation to be used, look at properties.md for more information.

```JSON
    "elementsToApplyValidationOn":
            {
                formId:
                {
                  "notificationCode":
                  {
                    "validated" : number,
                    "notValidated" : number
                  },
                  "formValidation": boolean,
                  "resetFormUponSubmit": boolean,
                  "inputNameToValidate":
                  {
                    inputName:
                    {
	                    ---PROPERTIES---
                    }
                  }
                }
            },
            ```
