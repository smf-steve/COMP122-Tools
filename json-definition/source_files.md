# Source Files

## Purpose
   1. to provide a data structure that contents the original source file
   1. to include the associated values with these symbols
   1. to promulgate this structure to be used by other tools
      - possible include the registers in this symbol table


```json
  "source_files": [ { "file": "file://blah/blah/data.asm",
                      "statements": [], 
                    },
                    { "file": "file://blah/blah/two.asm",
                      "statements": [], 
                    },
                    { "file": "file://blah/blah/three.asm",
                      "statements": [], 
                    }
                  ],

// Every source line is provided in the structure
// Labels associated with a type "none"are copied forward 
//   until the next non-none statement is found
// e.g., none -> instruction: all labels are part of the instruction
// e.g., none -> directive: all labels are effectively dumped
// type is one of: directive, declaration, or instruction, or none

statement -> 

Instruction:    // example of a instruction statement
    { "line": 3, 
      "text": "test: beq $s1, $zero, done  # Comment String",
      "labels":[ "test"],
      "type": "instruction",  
      "syntax": "label 3",
      "op":      "beq",
      "values": [ "$s1", "$zero", "done" ], 
      "comment": "# Comment String" },
   }

Declaration:
   // template of an declaration statement
   {  "line": 3, 
      "text": "A: .word 10:2, 5, 2:2 # Comment String",
      "labels":[ "A" ],
      "type": "declaration",
      "syntax": "list_pair", 
      "op":      ".word",
      "values": [ { "value": 10, "count": 2}, 
                  { "value":  5, "count": 1},
                  { "value":  2, "count": 2},
              ],    // is the construction of mine or is this valid
      "comment": "# Comment String" },

      // Do I or should I include a memory structure associated with this..
      // I thik that should go with the overlay...  Perhaps this is the encoding...
      "memory": [ { "address": "0x0040 0000", "value": 0},   // for 10 #1
                  { "address": "0x0040 0001", "value": 0},
                  { "address": "0x0040 0002", "value": 0},
                  { "address": "0x0040 0003", "value": 10},
                  { "address": "0x0040 0004", "value": 0},   // for 10 #2
                  { "address": "0x0040 0005", "value": 0},
                  { "address": "0x0040 0006", "value": 0},
                  { "address": "0x0040 0007", "value": 10},
                  // etc for 5:1 & 2:2
                ]

   }

Directives:  
    //   - .text, .data  (.ktext, .kdata)
    //   - .eqv,  .include, .align, .globl, .entry .end
    //   - .macro, .end_macro
    //   - .frame, .end_frame


   { "line": 3, 
     "text": ".text # Start of the Text section",
     "labels":[ "A" ],
     "type": "directive ",
     "syntax": "list_pair", 
     "op":     ".text",
     "values": null,
     "comment": "# Start of the Text section"
   },
   { "line": 12, 
     "text": ".eqv hello 7",
     "labels": [],
     "type": "directive",
     "syntax": "list",
     "op": ".eqv", 
     "values": [ "hello", "7"],
     "comment": "# Comment String" 
   },

   { "line": 12, "contents": ".macro name(%arg, %arg)",
     "labels":[],
     "type": "directive",
     "syntax": "paramaterized list",
     "op": ".macro", 
     "values": [ "name", "%arg", "%arg"],
     "comment": "# Comment String",
   }
```