# JSON File Format
Our MIPS assembler produces a .json file that represents a valid and assembled MIPS program.  This file is consumed by our MIPS simulator, as well as other tools.  This directory contains the specification for this file format.

This specification of this file format is defined via the combination of a BNF 

Program -> 
Program -> { "program": null, // A general 
    "timestamp": tag ,
    "entry": "main",
    "source_files": [], // an array of text representing the original source program
    "labels": {   // the symbol table of all labels
          "defines": [], "macros": [], "data" : [], "text" : [] 
          }, // See symbol_table.md for more information


    "overlays": [ // an array of segments defined by the user's program, with each segment providing an array of declarations or instructions
                  
    ],
 
   // DATA: 
   //    - source: defines the declarations as defined textual, with the given structure
   //    - memory: defines the raw values in memory, without any labels
   //    - overlay: defines the associate labels, alignment, structure, etc.

   // TEXT
   //    - source: defines the instructions as defined textual
   //    - memory: defines the encode instructions, without any any labels
   //    - overlay: defines the associate labels, structure (associated structure), etc.
   //               moreover the overlay does not contain non native instructions


    "core": { 
    }
}




=========


```json
{ "program": "<general description>",
    "entry": "main",
    "source_files": [], // an array of text representing the original source program
    "labels": {   // the symbol table of all labels
          "defines": [], "macros": [], "data" : [], "text" : [] 
          }, // See symbol_table.md for more information


    "overlays": [ // an array of segments defined by the user's program, with each segment providing an array of declarations or instructions
                  { "segment": ".text",   //
                    "alignment": "off",   //  { "on", "off" }     : Indicates if memory alignment was performed
                    "wordsize": 4,        //  --> Is this necessary?
                    "endianness": "big",  //  { "big", "little" } : Indicates the endianness used for byte ordering
                    "address": null,      //  The starting address of this associated segment
                    "size": null,         //  The number of bytes associated with the segment
                    "comment": null,      //  The comment that appeared on the ".text" directive line
                    "statements": []      //  The list of statements defined within the segment
                  },
    ],
 
   // DATA: 
   //    - source: defines the declarations as defined textual, with the given structure
   //    - memory: defines the raw values in memory, without any labels
   //    - overlay: defines the associate labels, alignment, structure, etc.

   // TEXT
   //    - source: defines the instructions as defined textual
   //    - memory: defines the encode instructions, without any any labels
   //    - overlay: defines the associate labels, structure (associated structure), etc.
   //               moreover the overlay does not contain non native instructions


    "core": { 
        "memory": [   // an array of named segments within main memory
            { "segment": ".data", "start": "0x01001000", "end": "0x01001000",
              "values": [ 
                {"address": "0xFFFF", "value": "0xFFFF" },
                {"address": "0xFFFF", "value": "0xFFFF" },
                {"address": "0xFFFF", "value": "0xFFFF" } 
                // any memory address not enumerated implies that value is undetermined
             ]
            },
            { "segment": ".text", "start": "0x01001000", "end": "0x01001000", 
              "values": [
                {"address": "0xFFFF", "value": "0xFFFF" },
                {"address": "0xFFFF", "value": "0xFFFF" },
                {"address": "0xFFFF", "value": "0xFFFF" },
                {"address": "0xFFFF", "value": "0xFFFF" }
                // any memory address not enumerated implies error
             ]
            }
            // additional memory segments can be provided
        ],
        "CPU": [ ], // a register array with current values
        "CPO": [ ], // a register array with current values
        "FPU": [ ] // a register array with current values
    }
}


