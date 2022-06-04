# Symbol Table

## Purpose
   1. to provide a data structure with all of the defined symbols
   1. to include the associated values with these symbols
   1. to promulgate this structure to be used by other tools
      - possible include the registers in this symbol table

### Note:
   1. Registers could be placed within the "core" and exposed from there
      - for transporting the state of the machine, this is preferred 
   1. Registers could be placed within the symbol table and expose from there
      - for exposing the associated values, this is preferred
      - said data structure can be part of the session data between applications

## BNF
   * symbol_table -> '{' data_symbols ",""  text_symbols '}'
   * data_symbol  -> //


```json
   "labels": {
       "defines":  [
                 // example:    .eqv Hello 3
                 { "labels": ["Hello"], "scope": "file",
                   "declared": { "file": "file://", "subroutine": null, "line": 25 },
                   "value":  "3",
                   "refs": [],    // a list of references 
                 },
               ],

       "macros":[
                 // example: 
                 //    .macro my_macro(%1, %2)   <- line 25
                 //       instruction 1
                 //    .end_macro
                 { "labels": ["my_macrop"], "scope": "file",
                   "declared": { "file": "file://", "subroutine": null, "line": 25 },
                   "statements": [ 
                       // the statements are the same as those found in "source-files"
                       // note that labels defined within this section, should NOT be
                       // added to the symbol table
                   ],        
                   "refs": [],    // a list of references 
                 },
               ],

       // note that we use label"s" and not label
       // a single address may have multiple labels, but only one entry in the symbol table
       "text": [  // a label that is not is not a .entry nor contained within has a
                  // a subroutine that is null
                 { "labels": ["top"], "scope": "subroutine",
                   "declared": { "file": "file://", "subroutine": "main", "line": 25 },
                   "address": "0x02345",
                   "refs": [],    // a list of references 
                 }
                 { "labels": ["main"], "scope": "global",
                   "declared": { "file": "file://", "subroutine": "main", "line": 25 },
                   "address": "0x02345",
                   "refs": [],    // a list of references 
                 }
               ],

       "data": [  
                 // should the section include the values.
                 // 1. values can be obtained from the given address
                 // 2. the number of bytes should be provide
                 // 3. the type could be float, but its just
                 { "labels": ["W"], "scope": "global",
                   "declared": { "file": "file://", "subroutine": null, "line": 15 },
                   "address": "0x02345", 
                   "bytes": 4, 
                   "refs": [],    // a list of references 
                 },
                 { "labels": ["A"], "scope": "file",
                   "declared": { "file": "file://", "subroutine": null, "line": 25 },
                   "address": "0x02345", 
                   "bytes": 1,
                   "refs": [],    // a list of references  
                 }
               ]
    }
```