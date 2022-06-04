// There are four types of statements in a MIPS program.
// A statement is a single line of text within a MIPS program.
// These types of statements are:
//   - declarations: A statement that declares and defines a location within the ".data" segment
//   - instructions: A statement that specifies an operation to be performed via the simulator
//   - directives: A statement used to specific an operation to be performed by the assembler
//   - none:       A statement that is either a blank line or only contains a comment.

To create the overlay...
  -- run through the source
  -- grab each instruction
  -- copy to the overlayer structure
  -- add the encoding


"overlays": [  
   // Overlays are associated with memory segments and 
   //     provide aggregate information about a set of bytes.
   // For example, an overlay for a "word" (a 4-byte value) will contain specific information
   //   about the "word" as a whole as opposed to its individual bytes.

   { "segment": ".text",   //
     "alignment": "off",   //  { "on", "off" }     : Indicates if memory alignment was performed
     "wordsize": 4,        //  --> Is this necessary?
     "endianness": "big",  //  { "big", "little" } : Indicates the endianness used for byte ordering
     "address": null,      //  The starting address of this associated segment
     "size": null,         //  The number of bytes associated with the segment
     "comment": null,      //  The comment that appeared on the ".text" directive line
     "statements": []      //  The list of statements defined within the segment
   },
   { "segment": ".data",   //
     "alignment": "on",    //  { "on", "off" }     : Indicates if memory alignment was performed
     "endianness": "big",  //  { "big", "little" } : Indicates the endianness used for byte ordering
     "wordsize": 4,        //  --> Is this necessary?
     "address": null,      //  The starting address of this associated segment
     "size": null,         //  The number of bytes associated with the segment
     "comment": null,      //  The comment that appeared on the ".data" directive line
     "statements": []      //  The list of statements defined within the segment
    }
 ]


// text_overlay: statements
// Examples:
//   lb   $s1, A
//   abs  $s1, $s2
//   addi $s1, $s1, -1

// 
// LINE 7:  "syntax":  memory direct

Three examples
  { "address": "0x0040 0014", "bytes": 8,  // size in number of bytes for the encoding
    "file": "file://blah/blah", "line":   7, 
    "labels": [ "main" ], 
    // statement_type: instruction 
    "syntax": "memory direct 2", 

    // I keep going back and forth from the following, and op: lb, values: []
    "statement": [ "lb", "$s1", "A" ], 

    "instruction_type": "pseudo",  // in an overlay this has meaning
    "encoding": [ 
            { "statement": ["lui", "$at", "upper(%2)"], 
              "syntax":  "bla", // print out the statement correctly
              "type": "native", // this will also be a native, so why have it
              "format": "I",   //--> the actual values are plugged in for the following fields
              "opcode": "0x0f", "rs": "0x00", "rt": "%1", "imm": "%2" },
            { "statement": ["lw",  "%1", "lower(%2)", "$at" ], 
              "type": "native",
              "syntax": "indirect 3", 
              "format": "I", 
              "opcode": "0x23", "rs": "%3", "rt": "%1", "imm": "%2" } ],  
     "comment": "" },  //  explicitly retain the comment, helpfully it is meaning full
          
/////


 { 
   "address": "0x0040 0014", "byte": 12,
   "line":  10, "labels": [],
   "syntax": "register 2", 
   "statement": [ "abs", "$s1", "$s2"],
   "instruction_type": "pseudo",
   "encoding" : [ 
           { "statement": [ "sra", "$at", "#2", "0x1F" ],
             "syntax": "bla", 
             "format": "X", 
             "op": "etc"},
           { "statement": ["xor", "#1", "$at", "#2" ],
             "syntax": "bla",  
             "format": "X", 
             "op": "etc"},
           { "statement": ["subu", "#1", "#1", "$at"],
             "syntax": "bla",  
             "format": "X", 
             "op": "etc"} ],
   "comment": "" },

{  "address": "0x0040 0014", "bytes": 4,
   "line":  11, "labels": [],
   "syntax": "immediate 3", 
   "statement": [ "addi","$s1", "$s1", "-1"],
   "instruction_type": "native",
   "encoding" : [ // redundant for native instruction, but keeps them uniform
                  { "statement": [ "addi","$s1", "$s1", "-1"],
                    "syntax": "bla",
                    "format": "I", 
                    "opcode": "0x08", "rs": 17, "rt": 17, "imm": -1, "sh": 00, "func": 23,
                  }
                 ]
}


// data_overlay
statements: 


{ "address": "0x0040 0014", "bytes": 4,
   "line":  10, "labels": ["F"],
   "syntax": "list", 
   "statement": [".float", "3.12" ],
   "instruction_type": null,
   "encoding" : [ 
            { "statement": [ ".float", "3.12" ],
              "syntax": "bla",
              "format": "float",
              "values": [ "40", "48", "f5", "c3" ]
            }],
   "comment": "# Comment String" 
}

{ "address": "0x0040 0014", "bytes": 8,
   "line":  10, "labels": ["F"],
   "syntax": "list", 
   "statement": [".float", "3.12", "23.3" ],
   "instruction_type": null,
   "encoding" : [ 
            { "statement": [ ".float", "3.12" ],
              "syntax": "bla",
              "format": "float",
              "values": [ "40", "48", "f5", "c3" ]
            },
            { "statement": [ ".float", "23.3" ],
              "syntax": "bla",
              "format": "float",
              "values": [ "40", "48", "f5", "c3" ]
            }],
   "comment": "# Comment String" 
}


// Dynamic Overlays are not part of the initial implementation
// We, however, envision that these overlays could be defined
// For the heap overlay, it could be constructed upon the execution of the "sbrk" instruction
//  Overlay for a heap:  could be created via the "sbrk" instruction
//
// { "segment": "heap",      //
//      "alignment": "off",   //  { "on", "off" }     : Indicates if memory alignment was performed
//      "endianness": "big",  //  { "big", "little" } : Indicates the endianness used for byte ordering
//      "address": null,      //  The starting address of this associated segment
//      "size": null,         //  The number of bytes associated with the segment
//      "comment": null,      //  Maybe some comment determined at runtime
//      "statements": []      //  The single instruction that performed the "sbrk" instruction
// }
// 
// For a stack overlay, it could be via as the "frame" of associated with a subroutine
// A template of such an overall, would need to be placed in the symbol table
// When the subroutine is invoked, the template "frame" would be copied into the overlay structure
// -- for teaching purposes, the overlay should be positioned by the value of the $fp register
// { "segment": "stack",      //  This segment would be of a stack frame
//      "alignment": "off",   //  { "on", "off" }     : Indicates if memory alignment was performed
//      "endianness": "big",  //  { "big", "little" } : Indicates the endianness used for byte ordering
//      "address": null,      //  The starting address of a frame  
//                            //    ? should this correct address of the $fp register when the frame is created
//                            //    but if that is done, how can you show show all previous frames
//                            //    perhaps on a jal to an .entry subroutine, we simplicity store the necessary values
//                            //  The a comparison between the address and $fp can be used to flag an issue
//      "size": null,         //  The number of bytes associated with the frame
//      "comment": null,      //  Maybe some comment determined at runtime
//      "statements": []      //  Effectively, the instructions associated with declaring the elements of the frame
// }
//
// .frame  main            # a static frame for main
//    A: .word
//    B: .word
//    C: .word
// .end_frame
// .entry main
//    .frame main         # a dynamic frame for main
//     A0: .argument      # $a0
//     A1: .argument      # $a1
//     A2: .argument      # $a2
//     A3: .argument      # $a3
//     A4: .argument      # placed on the stack
//     L0: .word          # comment about the local
//     L1: .word          # comment about the local
//     L2: .word          # comment about the local
//     L3: .word          # comment about the local
//    .end_frame
//.end_main

// We could also envision creating static frames for global variables
// This would go hand-and-hand with the reenforcement of book keeping
