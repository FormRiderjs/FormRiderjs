[ TASKS ]=======================================================================


-   creating an online json generator, client put the html code
    a script will then recognize what to do with the html form
    and then thye chose what to do as validation + error text
    then copy past...


-   check validation when inputs starting with white space + error messages
-   containCpitalLetters/containSmallLetters, what about special characters
-   check for capital letters/small letters of non English letters
    because é will pass the test even if containSmallLetters:[false, error text].
    regex code /[^\x00-\x7F]/ of non ASCII characters might be used, but even 
    after using it, how to distinguish between É and é ???? ,
    for now, containSmallLetters/containCapitalLetters work only for English characters






[ FIX ]=======================================================================

- White space in number function
- using  "   in regexTest
-   test for regex code and try for /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, "" wont work

[ IDEAS ]=======================================================================


-   error handling system in order to verify if the formInputName exist in json file
    and this should be in the catch function of the InputValidation class
	
-	checkBox
-	Radiobuttons
-	DropDown list