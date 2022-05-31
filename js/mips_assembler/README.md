# Assembler for MIPS II (R2000 & R3000): An Instruction Set Architecture (ISA)

This repository contains an assembler for the MIPS II ISA.  The output of the assembler is a JSON object.  
This JSON object has been designed as an intermediate representation of a user's program.  It is envisioned that
this intermediate representation will be used by other educational tools in the area of Computer Architecture and 
Assemble Languages.

# Project Goals:
1. to provide a Javascript implementation of a MIPS II assembler
1. to utilize [parsing expressing grammars (PEG)](https://en.wikipedia.org/wiki/Parsing_expression_grammar) and the [pegjs.org](https://pegjs.org/) implementation
1. to provided a JSON output to facilitate the development of other tools
1. to provided a JSON output rich with metadata to facilitate learning objectives
1. to allow users to access theses tools via a web interface


## Input: MIPS II (R2000 & R3000)
  * Not all Support instructions are defined via the 'instruction.js' file


### MIPS Assemble Restrictions
  * At most one instruction per line 
  * Arguments to commands are limited to registers, labels, or integers. (i.e., expressions are not support)
  * Only the .text and .data segments are supported
  * No floating point operations
  * No co-processor operations 
  * No likely instructions
  * System Calls are modeled to confirm to MARS and SPIM


## Output: A JSON object:

The JSON object is contains a number of main data structures.  These data structures include:
   1. text "source":    which provides a copy of the original source with accompanying line numbers.  
   1. labels:           which provides a copy of the symbol table of the MIPS programs
   1. memory "overlay": which provides the assembled code with additional information related to encoding, etc.
   1. "core" file:      which provides the contents of main memory after the program has been loaded to the microarchitecture

The generalize format of this JSON object is as follows:

```
{ program:  "sample.asm",
    source:   [], # an array of text representing the original source program
    labels:   [], # an array of all labels defined with the user's program  
    user_overlays: [   # an array of segments defined by the user's program, with each segment providing an array of declarations or instructions
       { segment: ".data", address: null, comment: null, declarations: [] },
       { segment: ".text", address: null, comment: null, instructions: []}
    ]
    kernel_overlays: [ # an array of segments defined by kernel, with each segment providing an array of declarations or instructions
       { segment: ".data", address: null, comment: null, declarations: [] },
       { segment: ".text", address: null, comment: null, instructions: []}
    ]
    core: { 
        memory:   [   # an array of named segments within main memory
            {segment: ".data", values: [ {address: 0xFFFF,  value: 0xFFFF } ]},
            {segment: ".text", values: [ {address: 0xFFFF,  value: 0xFFFF } ]}
            // additional memory segments can be provided
        ],
        CPU: [ ],  # a register array with current values
        CO:  [ ],  # a register array with current values
        FPU: [ ],  # a register array with current values
        cp0: [ ]   # a register array with current values
    }
}

```

## Files
This repository contains the assembler to parse and generate the associated JSON outputfile for a limited MIPS assemble program. 
These files include:
  * assembler.js:     The main program used to read in a MIPS program and output the associated JSON object
  * parser.peg.js:    The syntax and associated parsing routines using PEG (Parsing Expression Grammars)
  * instructions.js:  A list of all of the instructions provided by the MIPS ISA
  * kernel.js:        A list of predefined memory segments that are included in the state.memory array.
  * registers.js:     The list of all registers associated with the MIPS II microarchitecute

## Current Limitations
  * Many... system is current under active development
  * All operations associated with Co-processors is left to later





