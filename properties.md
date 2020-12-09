## Properties :

- "`required`": 
   - [true(input is required), error text],
----------

- "`maxlength`": 
    - [number(NUMBER of characters in input), error text],
----------
- "`minlength`":    
   - [number(NUMBER of characters in input), error text],
----------
- "`containNumber`" :   
    - [true (should only contain numbers of int type), error text]
    - [false (should not contain numbers), error text]
    - [[NUMBER, true] (should contain at least NUMBER of numbers), error text]
    - [[true, NUMBER] (can contain up to NUMBER of numbers), error text]
    - [[NUMBER1, NUMBER2] (should contain between NUMBER1 and NUMBER2 numbers), error text],
   ----------
- "`numberBiggerThan`" :    
   - [number (return true if input is bigger than NUMBER), error text],
   ----------

- "`numberSmallerThan`":    
    - [number (return true if input is smaller than NUMBER), error text],
----------
- "`containSpecialCharacters`": 
    - [true (should contain only special characters), error text],
    - [false (should not contain special characters), error text],
    - [NUMBER (should contain only NUMBER of special characters), error text],
    - [[NUMBER, true] (should contain at least NUMBER of special characters), error text],
    - [[true, NUMBER] (can contain up to NUMBER of special characters), error text],
    - [[NUMBER1, NUMBER2] (should contain between NUMBER1 and NUMBER2 special characters), error text],
----------

- "`containWhiteSpace`":
    - [[true(contain), true(start)](input can contain and can start with white spaces), error text]
    - [[true, false](input can contain but cannot start with white spaces), error text]
    - [[false, false](input should not contain nor start with white spaces), error text]


----------

- "`containCapitalLetters`":
    - [true (should contain only capital letters), error text],
    - [false (should not contain any capital letters), error text],
    - [NUMBER (should contain only NUMBER of capital letters), error text],
    - [[true, NUMBER] (should contain between from 1 up to NUMBER of capital letters), error text],
    - [[NUMBER, true] (should contain at least NUMBER of capital letters), error text],
    - [[NUMBER1, NUMBER2] (should contain between NUMBER1 and NUMBER2 capital letters), error text],
                     
   ----------

- "`containSmallLetters`":  
    - [true (should contain only small letters), error text],
    - [false (should not contain small letters), error text],
    - [NUMBER (should contain only NUMBER of small letters), error text],
    - [[NUMBER, true] (should contain at least NUMBER of small letters), error text],
    - [[true, NUMBER] (can contain up to NUMBER of small letters), error text],
    - [[NUMBER1, NUMBER2] (should contain between NUMBER1 and NUMBER2 small letters), error text],
                        
    ----------

- "`email`": 
     - [true (should only contain an email),propertyErrorText]
    
----------

- "`dateFormat`" : 
	- [[[nbr1 , nbr2 , nbr3 ], [ [val1 , val2 ],[ val3, val4],[ val5 , val6 ] ] ] ,["SEPARATOR"] , error text] 
	- nbr1, nbr2, nbr3 should be replaced by the wanted number of characters in input 
	- val1, val2,val3,val4,val5,val6 are limitations for nbr1 nbr2 nbr3. 
		- nbr1 is limited between val1 and val2,
		- nbr2 is limited between val3 and val4,
		- nbr3 is limited between val5 and val6,
	- if instead of nbr1/nbr2 you put a true then the correspandant location in input should be a string.
	- instead of SEPARATOR, anything can be used e.g. " " or "/" or "-" etc or "" for an input without separator.
	- example of use and explanations : 
		- [[[2 , 2 , 4 ], [ [0 , 31 ],[ 0, 12],[ 1900 , 2000 ] ] ] ,["/"] , "not the wanted format"]
			it means that user input should be like 05/06/1994, otherwise it will be rejected
		- [[[1 , 2 , 4 ], [ [0 , 9 ],[ 0, 12],[ 1900 , 2000 ] ] ] ,["-"] , "not the wanted format"]
			it means that user input should be like 5-06-1994, otherwise it will be rejected
		- [[[2 , true , 4 ], [ [0 , 9 ],[true],[ 1900 , 2000 ] ] ] ,["-"] , "not the wanted format"]
			it means that user input should be like 05-june-1994, otherwise it will be rejected
		- [[[2 , true , 4 ], [ [0 , 9 ],[true],[ 1900 , 2000 ] ] ] ,[""] , "not the wanted format"]
			it means that user input should be like 05june1994, otherwise it will be rejected

----------


- "`regexTest`": 
    - [["source" (without slashes), "flag (put the marker you need, if no marker needed than put nothing)"], error text],
    e.g. : regexTest [["-+","g"],"Input should not contain any dashes"] this test is same as /-+/g
    e.g. : regexTest [["-+",""],"Input should not contain any dashes"] this test is same as /-+/


----------


Example of combination for a password input 

```JSON
        "userPassword" : 
         {
	     "required" : [true, "input is empty"],
	     "containNumber" : [true, "does not contain any numbers"],
	     "maxlength" : [20, "longer than 20 characters"],
	     "minlength" : [8, "shorter than 8 characters"],
	     "containSpecialCharacters" : [1, "does not contain 1 special character"],
	     "containCapitalLetters" : [2, "contain more than 2 special characters"]
		 }
```


