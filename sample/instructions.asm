
/* 
Title:    instruction.asm
Purpose:  to provide a sample set of MIPS declaration for testing
Contents: 
   - sample MIPS text declaration
   - corresponding Processed Source File
   - corresponding Memory Overlay
*/


File is mainly defunct!


 .text

main:   nop # Starting point of the program
        nop

sum:    li $t2, 2
        
        nop                             # Add these values together and placing the sum into $t4
        move $t4, $zero

loop:   
top:    nop                             # The top of the loop            
        bge $t6, $t7, done              # The test of the loop
            sw $s1, 4($a1) 
            lw $t1, array+4
            nop                         # The body of the loop (empty)
            add $t6, $t6, 1             # the next of the loop, just add 1 to the counter
        j top                           # The end of the body & next of the loop
done:   nop                             # We completed the for-loop



// - Corresponding Processed Source File


I don't think I have to retain comments in the processe source...
    This information can be obtaind from raw source file.


//  program:  data
//    { "line": 14, "label": "",   "op": ".byte",   "values": [ { value: 0, count: 1} ],          "comment": "# Comment String" },

{ "program": "instructions.asm", "instructions": [
    { "segment": ".txt", "address": "0x1000", "source": [

        {"line": 13, "label": "main", "op": "nop", "argc": 3, "args": [ "", "", "" ], "comment": "# Comment String" },


        {"line": 13, "label" : "main", "format": "S", "op": "nop",   "bytes": 4, "rd": "",     "rs": "",      "rt": "", "imm": "", "comment": "# Comment String" },},
        {"line": 14, "label" : "",     "format": "S", "op": "nop",   "bytes": 4, "rd": "",     "rs": "",      "rt": "", "imm": "" },

        {"line": 16, "label" : "",     "format": "I", "op": "addiu", "bytes": 4, "rd": "$t2",  "rs": "$0",    "rt": "", "imm": "2" },
        {"line": 17, "label" : "",     "format": "S", "op": "",      "bytes": 4, "rd": "",     "rs": "",      "rt": "", "imm": "" },
        {"line": 18, "label" : "",     "format": "S", "op": "nop",   "bytes": 4, "rd": "",     "rs": "",      "rt": "", "imm": "" },

        {"line": 19, "label" : "",     "format": "R", "op": "addu",   "bytes": 4, "rd": "$t2", "rs": "$zero", "rt": "2", "imm": "" },

        {"line": 20, "label" : "",     "format": "B", "op": "",      "bytes": 4, "rd": "",     "rs": "",      "rt": "", "imm": "" },
        {"line": 21, "label" : "loop", "format": "S", "op": "",      "bytes": 4, "rd": "",     "rs": "",      "rt": "", "imm": "" },
 
        {"line": 22, "label" : "top",  "format": "S", "op": "nop",   "bytes": 4, "rd": "",     "rs": "",      "rt": "", "imm": "" },
 
        {"line": 23, "label" : "",     "format": "R", "op": "slt",   "bytes": 4, "rd": "$1",   "rs": "$t6",   "rt": "$t7", "imm": "" },
        {"line": 23, "label" : "",     "format": "P", "op": "bge",   "bytes": 8, "rd": "$1",   "rs": "$zero", "rt": "", "imm": "done" },


        {"line": 24, "label" : "",     "format": "I", "op": "sw",    "bytes": 4, "rd": "", "rs": "", "rt": "", "imm": "" },
        {"line": 25, "label" : "",     "format": "I", "op": "lw",    "bytes": 4, "rd": "", "rs": "", "rt": "", "imm": "" },
        {"line": 26, "label" : "",     "format": "P", "op": "nop",   "bytes": 4, "rd": "", "rs": "", "rt": "", "imm": "" },
        {"line": 27, "label" : "",     "format": "R", "op": "addi",  "bytes": 4, "rd": "", "rs": "", "rt": "", "imm": "1" },
        {"line": 28, "label" : "",     "format": "J", "op": "j",     "bytes": 4, "rd": "", "rs": "", "rt": "", "imm": "" },
        {"line": 29, "label" : "done", "format": "S", "op": "nop",   "bytes": 4, "rd": "", "rs": "", "rt": "", "imm": "" },
]
}

// The above structure should provide the "parsed" representation of instructions.
//  This structure place the instruction table can be usued to generate the text overlay.
// this structure should match the syntax.
//    -- three address
//    -- two address
//    -- one address, e.g., mtlo $s1
//    -- addressing modes, direction, immediate, indirect

// Should the memory overlay contain the Format of the the instructions
// Then the memory would contain the raw data..

// data overlay
// { "line": 0, "labels": "",   "op": "#slot",  "size": 3, "byte": 0, "address": TBD },


//  The overlay should provide the view of all four words as an aggregate

text_overlay ->  
{ "segment": ".text", "alignment": "on", "wordsize": 4, "endianness": "big", start": 0x0040 000, "size": N, "values": [
    { line: N, "labels": [ "main" ] format: I ,  opcode: "", rs:, rt:, imm: }
    { line: N, "labels": [ "main" ] format: R ,  opcode: "", rs:, rt:, rd: sh: func:
    { line: N, "labels": [ "main" ] format: J ,  opcode: 2,  "address": }



