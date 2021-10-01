// Filename:    "instructions.js"
// Purpose:     To define all of the instructions and their corresponding encoding for the MIPS32 
// Description: The MIPS32 parser rules only checks for syntactic correctness.  As part of the 
//              reduction actions, the associated instruction is found within the instruction array.
//				If the instruction, with the utilized syntax, is not found, there is a programming error.
//
//              By the addition of new instruction definitions, the ISA can be completed and then extended.
//              For example new "psuedo" instructions can be defined.
//
//              It is also hoped that ARM32 instructions could be added to this table to quickly develop
//              a parser for that ISA. But this is left for latter.
//
// Scope:    MIPS32 based instructions
// Caveats:  Focus is placed on instructions associates with the CPU
//           That is to say little attention is placed on the FPU and CoProc #0
//
// Status:   All instructions need to be reviewed for accuracy
//           Additional pseudo instructions need to be added
//           Additonal coding needs to be performed to insert macros into the system.
//



// General Description of instruction records:
//   * The key elements of the instruction records include
//     - the nemonic for the instruction
//     - the valid syntax for the instruction
//     - the encoding for nemonic x syntax
//
//   * Since this is for educational purposes, each instruction is provideded with the following meta-data
//     - the functional unit in which the instruction is associated
//     - the classification of the instruction, e.g., bitwise operation
//     - the type of instruction, e.g., native or psuedo instruction
//     - the descripton of the instruction
//     - the usage of the instruction 
//     - the three-address code equivalent of the instruction 
//

// Specific Description of instructions records:
//
// Functional Unit: "unit" : { "CPU", "C0", "C1", "FPU", "CACHE"},
//	   	CPU: instructions associates with scalar operations and control flow within the CPU
//		C0:  instructions associated with traps and executions using Co-processor #0
//     	FPU: instructions associated with the floating point unit (FPU) (synomous with C1)
//      CACHE: instructions associated with cache operations
//
// Classification: "classification" : { "arithemtic", "bitwise", "comparision", "control-flow", "data-movement", "load", "special", "store", "trap" }
//      A general classification of the type of instruction
//
// Instruction Names: "nemonic" : { "add", "addi", "j", "abs" and "nop", for example },
//		The short name associated with a instruction
//
// Syntax: The name that describes the syntax associates with the usage of the instruction.
//      Since we are using Parsing Expression Grammars (PEGs), 
//          1. all instructions are associated with a single rule (instruction)
//          2. the instructions are enumerated to ensure all "greedy" rules come first
//
//      If a number is associated with a syntax, it represents the number of operands.
//
//      The resulting order of instructions is as follows:
//
//          label indirect 4:          "op $reg4, label3 + imm2 ($reg1)"  
//          displacement 3:            "op $reg3, label2 + imm1"
//
//          label indirect 3:          "op $reg3, label2 ($reg1)
//  
//          indirect 3:                "op $reg3, imm2 ($reg1)"
//          indirect 2:                "op $reg2, ($reg1)"
//  
//          register 3:                "op $reg3, $reg2, $reg2"
//          label 3:                   "op $reg3, $reg2, label1"
//          immedidate 3:              "op $reg3, $reg2, imm1"
//
//          label 2:                   "op $reg2, label1"
//          register 2:                "op $reg2, $reg1"
//          immediate 2:               "op $reg2, imm1"
//
//          register 1:      	       "op $reg1"
//          immediate 1:               "op imm1"
//          label 1:                   "op label"
//  
//          command:                   "op"
//
//          null:                      null
//
//
// Instruction Type: "type" : { null, "native", "idiom", "pseudo", "macro"}
//      null:   a blank line that provides no instruction.
//      native: an instruction that is associated with the ISA directly
//      idiom:  an instruction that is semantically equivalent to native instruction, and is encoded as that native instruction
//              (for example:  nop is the assembly idiom to perfrom no operation, and it is encoded as "sll $0, $0, 0")
//              or a convenient representation of a native instruction.  
//              (for example:  "add $t1, $t2, 5" is an idiom of the native instruction:  "addi $t1, $t2, 5"
//      pseudo: a system-defined instruction that is replaced by one or more native instructions
//      macro:  a user-defined instruciton that is replaced by one or more native instructions
//
//
// Encoding: A structure "encoding" that provides the encoding based upon the format value.
//      Instructions Format Types:  "format" : { "R", "I", "J", "S"},
//          	Register (R) Instructions:  Instructions that perform operations using only registe$rs.
//          	Immediate (I) Instructions: Instructions that include a 16-bit immediate value
//          	Jump (J) Instructions: 		Instructions that include a 26-bit address
//          	Special (S) Instructions: 	Just the "nop" instruction which is classified as a Psuedo Instruction
//				Register Immediates (RI):   Instructions that perform typical a branch or trap instruction: op:6, rs:5, func:5, offset:16
//
//      Commands:  If the instruction type is either pseduo or macro, then "commands" is an array of "{ command, encoding }"
//          where the command is an array of operands associated with the native instruction to be executed (akin to the argv structure)
//          and   the encoding is the associated encoding for that command as defined via this "encoding" structure
//         
//      Operation Code: "opcode" : integer
//      	    A hexidecimal number that encodes operation associated with the nemonic
//
//      Code Field: "code" : integer
//		        A hexidecimal number represent the code field for the special operations: nop, syscall, and break
//
//      Registers:  "rs" : { integer | string }, "rt" : { integer | string }, "rd" : { integer | string },
//              Each field may contain one of two values
//               	- an hexidecimal value associated the field, e.g., rs: 0x00
//                   - a string of the form "$N", which indicates which postional parameter of the use$rs instruction is encoded into the associated field.
//			    e.g., given:  "add  $t5, $t6, $t7",	the associated fields are: rs: "%2", rt: "%3", rd: "%1"
//                   e.g., given:  "addi $t5, $t6, 5",	the associated fields are: rs: "%2", rt: "%1"
//                   e.g., given:  "lui  $t5, 5",		the associated fields are: rs: 0,    rt: "%1"
//			    e.g., given:  "lb   $t5 5($t6),		the associated fields are: rs: "%3", rt: "%1", immediate
//
//      Shift Amount:  "sh": integer
//		       A number that represents the number of positions to shift
//		
//      Immediate Value: "imm" : { integer | string},
//             A hexidecimal number representing a 16-bit 2's complement number, or 
//             A string of the form "%N", which indicates which postional parameter of the use$rs instruction is encoded into the associated field.
//
//      Address Value: "address" : integer
//      	   A 26-bit value associated with a J-type instruction
//     
//      Function: "func": integer
//	     	   A hexidecimal number that encodes the opeeration associated with the ALU
//
// Usage: "usage" : string
//      A sample usage of the command using the appropriate syntax
//
// Three address Code: "tac": string
//      The equivalent instruction shown as three address code.
//
// Description:  "description": string
//		A string that describes the instructions
//


function instruction_lookup(mnemonic, syntax) {
	return instruction_table.find(element => element.mnemonic == mnemonic && element.syntax == syntax);
}

function instruction_lookup_error(mnemonic) {
    error("Line: " + line() + "; Undefined mnemonic \"" + mnemonic + "\" encountered");
    return undefined;
}

// The instruction_table contains the relevant instructions that included within the MIPS architecture 
const instruction_table = [

	// Specical Instructions
	// Nop classified as a Psuedo but its encodig matchs "sll $zero, $zero, 0" which is invalid... -- hence making "S"pecial
	{ unit: "CPU",   classification: "special",       mnemonic: "nop",     syntax: "command", type: "native", encoding: { format: "S", code: 0x000000, func: 0x00 }, usage: "nop",       tac: "nop",                 description: "No Operation (Nop)" },
	{ unit: "CPU",   classification: "special",       mnemonic: "syscall", syntax: "command", type: "native", encoding: { format: "S", code: 0x000000, func: 0x0c }, usage: "syscall",   tac: "$v0 = code; syscall", description: "System Call: $v0 used to define operaton" },
	{ unit: "CPU",   classification: "special",       mnemonic: "break",   syntax: "command", type: "native", encoding: { format: "S", code:     "%1", func: 0x0d }, usage: "break",     tac: "break",               description: "Causes exception code to be executed" },

	// R instructions
	{ unit: "CPU",   classification: "bitwise",       mnemonic: "sll",     syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: 0x00, rt: "%2", rd: "%1", sh: "%3", func: 0x00 }, usage: "sll $rd, $rt, sh",   tac: "$rd = $rt << sh",          description: "Shift Left Logical", },
	{ unit: "CPU",   classification: "bitwise",       mnemonic: "srl",     syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: 0x00, rt: "%2", rd: "%1", sh: "%3", func: 0x02 }, usage: "srl $rd, $rt, sh",   tac: "$rd = $rt >> sh",          description: "Shift Right Logical" },
	{ unit: "CPU",   classification: "bitwise",       mnemonic: "sra",     syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: 0x00, rt: "%2", rd: "%1", sh: "%3", func: 0x03 }, usage: "sra $rd, $rt, sh",   tac: "$rd = $rt ->> sh",         description: "Shift Right Arithemtic" },
	{ unit: "CPU",   classification: "bitwise",       mnemonic: "sllv",    syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%3", rt: "%2", rd: "%1", sh: "%3", func: 0x04 }, usage: "sllv $rd, $rt, $rs", tac: "$rd = $rt << $rs",         description: "Shift Left Logical with Variable" },
	{ unit: "CPU",   classification: "bitwise",       mnemonic: "srlv",    syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%3", rt: "%2", rd: "%1", sh: "%3", func: 0x06 }, usage: "srlv $rd, $rt, $rs", tac: "$rd = $rt >> $rs",         description: "Shift Right Logical with Variable" },
	{ unit: "CPU",   classification: "bitwise",       mnemonic: "srav",    syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%3", rt: "%2", rd: "%1", sh: "%3", func: 0x07 }, usage: "srav $rd, $rt, $rs", tac: "$rd = $rt ->> $rs",        description: "Shift Right Arithmetic with Variable" },
	{ unit: "CPU",   classification: "control-flow",  mnemonic: "jr",      syntax: "register 1", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: 0x00, rd: 0x00, sh: "%3", func: 0x08 }, usage: "jr $rs",             tac: "goto $rs",                 description: "Jump via a Register value" },
	{ unit: "CPU",   classification: "control-flow",  mnemonic: "jalr",    syntax: "register 1", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: 0x00, rd: 0x31, sh: 0x00, func: 0x09 }, usage: "jalr $rs",           tac: "call $rs, return=$ra",     description: "Jump and Link via a Register value" },
	{ unit: "CPU",   classification: "control-flow",  mnemonic: "jalr",    syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: 0x00, rd: "%2", sh: 0x00, func: 0x09 }, usage: "jalr $rs, $rd",      tac: "call $rs, return=$rd",     description: "Jump and Link via a Register value, default rd=$ra" },
	{ unit: "CPU",   classification: "data-movement", mnemonic: "movz",    syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: 0x00, rt: "%3", rd: "%2", sh: "%1", func: 0x0a }, usage: "movz $rd, $rs, $rt", tac: "if (rt == 0) rd = $rs",    description: "Move if zero condition" },
	{ unit: "CPU",   classification: "data-movement", mnemonic: "movn",    syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: 0x00, rt: "%3", rd: "%2", sh: "%1", func: 0x0b }, usage: "movn $rd, $rs, $rt", tac: "if (rt != 0) rd = $rs",    description: "Move if non-zero condition" },
	{ unit: "CPU",   classification: "data-movement", mnemonic: "mfhi",    syntax: "register 1", type: "native", encoding: { format: "R", opcode: 0x00, rs: 0x00, rt: 0x00, rd: "%1", sh: 0x00, func: 0x10 }, usage: "mfhi $rd",           tac: "$rd = HI",                 description: "Move From HI register" },
	{ unit: "CPU",   classification: "data-movement", mnemonic: "mthi",    syntax: "register 1", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: 0x00, rd: 0x00, sh: 0x00, func: 0x11 }, usage: "mthi $rs",           tac: "HI = $rs",                 description: "Move To HI register" },
	{ unit: "CPU",   classification: "data-movement", mnemonic: "mflo",    syntax: "register 1", type: "native", encoding: { format: "R", opcode: 0x00, rs: 0x00, rt: 0x00, rd: "%1", sh: 0x00, func: 0x12 }, usage: "mflo $rd",           tac: "$rd = LO",                 description: "Move From TO register" },
	{ unit: "CPU",   classification: "data-movement", mnemonic: "mtlo",    syntax: "register 1", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: 0x00, rd: 0x00, sh: 0x00, func: 0x13 }, usage: "mtlo $rs",           tac: "LO = $rs",                 description: "Move To TO register" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "mult",    syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: 0x00, sh: 0x00, func: 0x18 }, usage: "mult $rs, $rt",      tac: "(HI,LO) = $rs * rt",       description: "MULTiply with 64-bit result" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "multu",   syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: 0x00, sh: 0x00, func: 0x18 }, usage: "multu $rs, $rt",     tac: "(HI,LO) = $rs * rt",       description: "MULTiply: Unsigned with 64-bit result" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "div",     syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: 0x00, sh: 0x00, func: 0x18 }, usage: "div $rs, $rt",       tac: "HI = s/rt; LO = $rs%rt",   description: "integer DIVision with modulo" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "divu",    syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: 0x00, sh: 0x00, func: 0x18 }, usage: "divu $rs, $rt",      tac: "HI = s/rt; LO = $rs%rt",   description: "integer DIVision: Unsigned with modulo" },

	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "add",     syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x20 }, usage: "add $rd, $rs, $rt",  tac: "$rd = $rs + $rt",          description: "ADDition" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "add",     syntax: "register 2", type: "idiom",  encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: "%1", sh: 0x00, func: 0x20 }, usage: "add $rd, $rt",       tac: "$rd = $rd + $rt",          description: "Idiom for ADDition" },

	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "addu",    syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x21 }, usage: "addu $rd, $rs, $rt", tac: "$rd = $rs + rt",           description: "ADDition Unsigned" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "sub",     syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x22 }, usage: "sub $rd, $rs, $rt",  tac: "$rd = $rs - rt",           description: "SUBtraction" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "subu",    syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x23 }, usage: "subu $rd, $rs, $rt", tac: "$rd = $rs - rt",           description: "SUBtraction: Unsigned" },
	{ unit: "CPU",   classification: "logical",       mnemonic: "and",     syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x24 }, usage: "and $rd, $rs, $rt",  tac: "$rd = $rs & rt",           description: "bitwise AND" },
	{ unit: "CPU",   classification: "logical",       mnemonic: "or",      syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x25 }, usage: "or $rd, $rs, $rt",   tac: "$rd = $rs | rt",           description: "bitwise OR" },
	{ unit: "CPU",   classification: "logical",       mnemonic: "xor",     syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x26 }, usage: "xor $rd, $rs, $rt",  tac: "$rd = $rs ^ rt",           description: "bitwise eXclusive OR" },
	{ unit: "CPU",   classification: "logical",       mnemonic: "nor",     syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x27 }, usage: "nor $rd, $rs, $rt",  tac: "$rd = ~($rs | rt)",        description: "bitwise Not OR" },
	{ unit: "CPU",   classification: "comparison",    mnemonic: "slt",     syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x2A }, usage: "slt $rd, $rs, $rt",  tac: "$rd = ($rs < rt )? 1 : 0", description: "Set if Less Than" },
	{ unit: "CPU",   classification: "comparison",    mnemonic: "sltu",    syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x2B }, usage: "sltu $rd, $rs, $rt", tac: "$rd = ($rs < rt )? 1 : 0", description: "Set if Less Than: Unsigned" },
	{ unit: "C0",    classification: "trap",          mnemonic: "tge",     syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: 0x00, sh: 0x00, func: 0x30 }, usage: "tge $rs, $rt",       tac: "if ($rs >=rt) trap",       description: "Trap if Greater Equal" },
	{ unit: "C0",    classification: "trap",          mnemonic: "tgeu",    syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: 0x00, sh: 0x00, func: 0x31 }, usage: "tgeu $rs, $rt",      tac: "if ($rs >=rt) trap",       description: "Trap if Greater Equal: Unsigned" },
	{ unit: "C0",    classification: "trap",          mnemonic: "tlt",     syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: 0x00, sh: 0x00, func: 0x32 }, usage: "tlt $rs, $rt",       tac: "if ($rs < rt) trap",       description: "Trap if Less Than" },
	{ unit: "C0",    classification: "trap",          mnemonic: "tltu",    syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: 0x00, sh: 0x00, func: 0x33 }, usage: "tltu $rs, $rt",      tac: "if ($rs < rt) trap",       description: "Trap if Less Than: Unsigned" },
	{ unit: "C0",    classification: "trap",          mnemonic: "teq",     syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: 0x00, sh: 0x00, func: 0x34 }, usage: "teq $rs, $rt",       tac: "if ($rs = $rt) trap",      description: "Trap if Equal" },
	{ unit: "C0",    classification: "trap",          mnemonic: "tne",     syntax: "register 2", type: "native", encoding: { format: "R", opcode: 0x00, rs: "%1", rt: "%2", rd: 0x00, sh: 0x00, func: 0x35 }, usage: "tne $rs, $rt",       tac: "if ($rs != $rt) trap",     description: "Trap if Not Equal" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "mul",     syntax: "register 3", type: "native", encoding: { format: "R", opcode: 0x2c, rs: "%2", rt: "%3", rd: "%1", sh: 0x00, func: 0x10 }, usage: "mult $rd, $rs, $rt", tac: "$rd = $rs * rt",           description: "Multiply with 32-bit result" },


	// I instructions
	{ unit: "CPU",   classification: "control-flow",  mnemonic: "beq",     syntax: "label 3",            type: "native", encoding: { format: "I", opcode: 0x04, rs: "%2", rt: "%1",    imm: "%3" }, usage: "beq $rt, $rs, label", tac: "if ($rs == $rt) goto label",          description: "Branch if EQual" },
	{ unit: "CPU",   classification: "control-flow",  mnemonic: "bne",     syntax: "label 3",            type: "native", encoding: { format: "I", opcode: 0x05, rs: "%2", rt: "%1",    imm: "%3" }, usage: "bne $rt, $rs, label", tac: "if ($rs != $rt) goto label",          description: "Branch if Not Equal" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "addi",    syntax: "immediate 3",        type: "native", encoding: { format: "I", opcode: 0x08, rs: "%2", rt: "%1",    imm: "%3" }, usage: "addi $rt, $rs, imm",  tac: "$rt = $rs + imm",                     description: "Addition with an Immediate value" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "addiu",   syntax: "immediate 3",        type: "native", encoding: { format: "I", opcode: 0x09, rs: "%2", rt: "%1",    imm: "%3" }, usage: "addiu $rt, $rs, imm", tac: "$rt = $rs + imm",                     description: "Addition with an Unsigned Immediate value" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "slti",    syntax: "immediate 3",        type: "native", encoding: { format: "I", opcode: 0x0a, rs: "%2", rt: "%1",    imm: "%3" }, usage: "slti $rt, $rs, imm",  tac: "$rt = ($rs < imm )? 1 : 0",           description: "Set if Less Than an Immediate value" },
	{ unit: "CPU",   classification: "arithmetic",    mnemonic: "sltiu",   syntax: "immediate 3",        type: "native", encoding: { format: "I", opcode: 0x0b, rs: "%2", rt: "%1",    imm: "%3" }, usage: "sltiu $rt, $rs, imm", tac: "$rt = ($rs < imm )? 1 : 0",           description: "Set if Less Than an Unsigned Immediate value" },
	{ unit: "CPU",   classification: "logical",       mnemonic: "andi",    syntax: "immediate 3",        type: "native", encoding: { format: "I", opcode: 0x0c, rs: "%2", rt: "%1",    imm: "%3" }, usage: "andi $rt, $rs, imm",  tac: "$rt = $rs & imm",                     description: "Bitwise And with an Immediate value" },
	{ unit: "CPU",   classification: "logical",       mnemonic: "ori",     syntax: "immediate 3",        type: "native", encoding: { format: "I", opcode: 0x0d, rs: "%2", rt: "%1",    imm: "%3" }, usage: "ori $rt, $rs, imm",   tac: "$rt = $rs | imm",                     description: "Bitwise Or with an Immediate value" },
	{ unit: "CPU",   classification: "logical",       mnemonic: "xori",    syntax: "immediate 3",        type: "native", encoding: { format: "I", opcode: 0x0e, rs: "%2", rt: "%1",    imm: "%3" }, usage: "xori $rt, $rs, imm",  tac: "$rt = $rs ^ imm",                     description: "Bitwise eXclusive Or with an Immediate value" },
	{ unit: "CPU",   classification: "data-movement", mnemonic: "lui",     syntax: "immediate 2",        type: "native", encoding: { format: "I", opcode: 0x0f, rs: 0x00, rt: "%1",    imm: "%2" }, usage: "lui $rt, imm",        tac: "$rt = imm << 16",                     description: "Load 16-bit Immediate Value in Upper significant bits" },

 	{ unit: "CPU",   classification: "load",          mnemonic: "lb",      syntax: "indirect 3",         type: "native", encoding: { format: "I", opcode: 0x20, rs: "%3", rt: "%1",    imm: "%2" }, usage: "lb $rt, imm($rs)",    tac: "$rt = MEM[ $rs + imm ]:1",            description: "Load Byte with sign extention" },
 	{ unit: "CPU",   classification: "load",          mnemonic: "lb",      syntax: "immediate 2",        type: "idiom",  encoding: { format: "I", opcode: 0x20, rs: "%3", rt: "$zero", imm: "%2" }, usage: "lb $rt, imm",         tac: "$rt = MEM[ imm ]:1",                  description: "Idiom for Load Byte" },
	{ unit: "CPU",   classification: "load",          mnemonic: "lb",      syntax: "indirect 2",         type: "idiom",  encoding: { format: "I", opcode: 0x20, rs: "%3", rt: "%1",    imm: 0x00 }, usage: "lb $rt, ($rs)",       tac: "$rt = MEM[ $rs ]:1",                  description: "Idiom for Load Byte" },

	{ unit: "CPU",   classification: "load",          mnemonic: "lh",      syntax: "indirect 3",         type: "native", encoding: { format: "I", opcode: 0x21, rs: "%3", rt: "%1",    imm: "%2" }, usage: "lh $rt, imm($rs)",    tac: "$rt = imm($rs)",                      description: "Load Half with sign extention" },
	{ unit: "CPU",   classification: "load",          mnemonic: "lw",      syntax: "indirect 3",         type: "native", encoding: { format: "I", opcode: 0x23, rs: "%3", rt: "%1",    imm: "%2" }, usage: "lw $rt, imm($rs)",    tac: "$rt = imm($rs)",                      description: "Load Word" },
	{ unit: "CPU",   classification: "load",          mnemonic: "lbu",     syntax: "indirect 3",         type: "native", encoding: { format: "I", opcode: 0x24, rs: "%3", rt: "%1",    imm: "%2" }, usage: "lbu $rt, imm($rs)",   tac: "$rt = imm($rs)",                      description: "Load Byte Unsigned" },
	{ unit: "CPU",   classification: "load",          mnemonic: "lhu",     syntax: "indirect 3",         type: "native", encoding: { format: "I", opcode: 0x25, rs: "%3", rt: "%1",    imm: "%2" }, usage: "lhu $rt, imm($rs)",   tac: "$rt = imm($rs)",                      description: "Load Half Unsigned" },
	{ unit: "CPU",   classification: "store",         mnemonic: "sb",      syntax: "indirect 3",         type: "native", encoding: { format: "I", opcode: 0x28, rs: "%3", rt: "%1",    imm: "%2" }, usage: "sb $rt, imm($rs)",    tac: "imm($rs) = $rt",                      description: "Store Byte" },
	{ unit: "CPU",   classification: "store",         mnemonic: "sh",      syntax: "indirect 3",         type: "native", encoding: { format: "I", opcode: 0x29, rs: "%3", rt: "%1",    imm: "%2" }, usage: "sh $rt, imm($rs)",    tac: "imm($rs) = $rt",                      description: "Store Half Word" },
	{ unit: "CPU",   classification: "store",         mnemonic: "sw",      syntax: "indirect 3",         type: "native", encoding: { format: "I", opcode: 0x2b, rs: "%3", rt: "%1",    imm: "%2" }, usage: "sw $rt, imm($rs)",    tac: "imm($rs) = $rt",                      description: "Store Word" },
	{ unit: "CPU",   classification: "load",          mnemonic: "ll",      syntax: "indirect 3",         type: "native", encoding: { format: "I", opcode: 0x30, rs: "%3", rt: "%1",    imm: "%2" }, usage: "ll $rt, imm($rs)",    tac: "$rt = imm($rs)",                      description: "Load Linked" },
	{ unit: "CPU",   classification: "store",         mnemonic: "sc",      syntax: "indirect 3",         type: "native", encoding: { format: "I", opcode: 0x38, rs: "%3", rt: "%1",    imm: "%2" }, usage: "sc $rt, imm($rs)",    tac: "imm($rs) = $rt; $rt = atomic? 1 : 0", description: "Store Conditional" },   
   Instructions       
	{ unit: "CPU",   classification: "control-flow",  mnemonic: "j",       syntax: "label 1", type: "native", encoding: { format: "J", opcode: 0x02, address: "%1" }, usage: "j label",   tac: "goto label",               description: "Jump to address within the current 256 MB-aligned region"},
	{ unit: "CPU",   classification: "control-flow",  mnemonic: "jal",     syntax: "label 1", type: "native", encoding: { format: "J", opcode: 0x03, address: "%1" }, usage: "jal label", tac: "call label, return=$ra",   description: "Jump and Link to address" },



	// Psuedo Instructions
	{ unit: "CPU",   classification: "load",          mnemonic: "lb",      syntax: "memory direct 3",   
            usage: "lb $rt, label + offset",  tac: "$rt = label", description: "Load Byte Direct",
            type: "pseudo", 
	        encoding: [ { command: [ "lui", "$1", "%2" ],        encoding: {} },
                        { command: [ "lw",  "%1", 0x00, "$1" ],  encoding: {} }] },
   
	{ unit: "CPU",   classification: "load",          mnemonic: "lb",      syntax: "memory direct",    
            usage: "lb $rt, label",  tac: "$rt = label",        description: "Idiom for Load Byte Direct",
            type: "pseudo",
	        encoding: [ { command: ["lui", "$at", "upper(%2)"],        encoding: {} },
                        { command: ["lw",  "%1", "lower(%2)", "$at" ], encoding: {} } ] }, 



	{ unit: "CPU",   classification: "load", 		  mnemonic: "lb",      syntax: "memory register offset",  
            usage: "lb $rt, label($rs)",  tac: "$rt = label",        description: "Load Word via Register Offset",
	        type: "pseudo", 
	        encoding: [ { command: [ "lui",  "$at", "upper(%2)" ],         encoding: { format: "I", opcode: 0x0f, rs: 0x00,  rt: "%1", imm: "upper(%2)" }},
                        { command: [ "addu", "$at", "$at", "%3" ],         encoding: { format: "R", opcode: 0x00, rs: "%3",  rt: "$at", rd: "$at", sh: 0x00, func: 0x21 }},
                        { command: [ "lw",   "%1", "lower($2)", "($at)" ], encoding: { format: "I", opcode: 0x20, rs: "$at", rt: "%1", imm: "%2" }} ] },




//.macro la (%reg, %label)
//   lui $at, upper(%label)
//   ori %reg, $at, lower(%label)
//.end_macro

	{ unit: "CPU", classification: "data-movement", mnemonic: "la",   syntax: "memory direct 3", type: "pseudo", 
	       encoding: [ { command: [ "lui",  "$at", "upper(%2)" ],   encoding: { }},
	                   { command: [ "ori",  "%1", "lower(%2)" ],    encoding: { }} ],
	       usage: "la rx, label", tac: "", description: "Load Address" },


	{ unit: "CPU", classification: "arithmetic",   mnemonic: "abs",  syntax: "register 2", type: "pseudo", 
	      encoding: [ { command: [ "sra", "$at",  "%2", "0x1F" ], encoding: { }},
                      { command: [ "xor",  "%1", "$at",   "%2" ], encoding: { }},
                      { command: [ "subu", "%1",  "%1",  "$at" ], encoding: { }} ], 
          usage: "abs $rd, $rs", tac: "", description: "Absolute value" },
    
// li $i, 0xFF FF FF FF  -> addiu $i, 0xFF FF FF FF   (but this is a 32bit encoding?)

	{ unit: "CPU", classification: "data-movement", mnemonic: "li",   syntax: "register 2", type: "idiom",
	        encoding: [ { command: [ "lui", "$at", "upper(%2)" ], encoding: { }},
	                    { command: [ "ori", "%1", "$at", "lower(%2)" ], encoding: { }}], 
	        usage: "li rx, imm", tac: "", description: "Load Immediate Value" },




///



	{ unit: "CPU", classification: "control-flow", mnemonic: "b",     syntax: "command", type: "idiom",
	        encoding: [ { command: [ "begz", "$at", "%2" ], encoding: {} } ],
	        usage: "b label", tac: "goto label", description: "" },



	{ unit: "CPU", classification: "control-flow",  mnemonic: "bge",  syntax: "branch 1", type: "psuedo",
	        encoding: [ { command: [ "slti", "%1", "%2" ], encoding: { }}, 
                        { command: [ "beq", "$at", "$zero", "%3"], encoding: { }} ],
	        usage: "bge $rs, imm, label", tac: "if ($rs >= imm) goto address", description: "Branch: if Greater Than or Equal (>= )" },

	{ unit: "CPU", classification: "control-flow",  mnemonic: "bge",  syntax: "branch 2", type: "psuedo",
	        encoding: [ { command: [ "slt", "%1", "%2" ], encoding: { }}, 
                        { command: [ "beq", "$at", "$zero", "%3"], encoding: { }} ],
	        usage: "bge $rs, $rt, label", tac: "if ($rs >= $rt) goto address", description: "Branch: if Greater Than or Equal (>=)" },
 

	{ unit: "CPU", classification: "control-flow",  mnemonic: "bgt",  syntax: "branch 1", type: "pseudo",
	         encoding: [ { command: [ "addi", "$at", "$zero", "%2" ], encoding: { }}, 
	                     { command: [ "slt", "%1", "%2" ], encoding: { }}, 
                         { command: [ "bneq", "$at", "$zero", "%3"], encoding: { }} ],
	        usage: "bgt $rs, imm, label", tac: "if ($rs > imm) goto address", description: "Branch: if Greater Than (>)" },

	{ unit: "CPU", classification: "control-flow",  mnemonic: "bgt",  syntax: "branch 2", type: "pseudo",
	         encoding: [ { command: [ "slti", "%1", "%2" ], encoding: { }}, 
                         { command: [ "bneq", "$at", "$zero", "%3"], encoding: { }} ],
	        usage: "bgt $rs, $rt, label", tac: "if ($rs > rt) goto address", description: "Branch: if Greater Than (>)" },




	{ unit: "CPU", classification: "control-flow",  mnemonic: "ble",  syntax: "branch 1", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "ble $rs, imm", tac: "if ($rs > rt) goto address", description: "Branch: if Less Than or Equal (<=)" },

	{ unit: "CPU", classification: "control-flow",  mnemonic: "ble",  syntax: "branch 2", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "ble $rs, $rt", tac: "if ($rs > rt) goto address", description: "Branch: if Less Than or Equal (<=)" },



	{ unit: "CPU", classification: "control-flow",  mnemonic: "blt",  syntax: "branch 1", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "blt $rs, imm", tac: "if ($rs > imm) goto address", description: "Branch: if Less Than (<)" },

	{ unit: "CPU", classification: "control-flow",  mnemonic: "blt",  syntax: "branch 2", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "blt $rs, $rt", tac: "if ($rs > rt) goto address", description: "Branch: if Less Than (<)" },



	{ unit: "CPU", classification: "control-flow",  mnemonic: "bgeu", syntax: "branch 1", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "bgeu $rs, imm", tac: "if ($rs > imm) goto address", description: "Branch: if Greater Than or Equal (>=)" },

	{ unit: "CPU", classification: "control-flow",  mnemonic: "bgeu", syntax: "branch 2", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "bgeu $rs, $rt", tac: "if ($rs > rt) goto address", description: "Branch: if Greater Than or Equal (>=)" },




	{ unit: "CPU", classification: "control-flow",  mnemonic: "bgtu", syntax: "branch 1", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "bgtu $rs, imm, address", tac: "if ($rs > imm) goto address", description: "Branch: if Greater Than (>)" },

	{ unit: "CPU", classification: "control-flow",  mnemonic: "bgtu", syntax: "branch 2", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "bgtu $rs, $rt, address", tac: "if ($rs > rt) goto address", description: "Branch: if Greater Than (>)" },





	{ unit: "CPU", classification: "control-flow",  mnemonic: "bleu", syntax: "branch 1", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "bleu $rs, imm, label", tac: "if (st <= imm) goto label", description: "Branch: if Less Than or Equal (<=)" },

	{ unit: "CPU", classification: "control-flow",  mnemonic: "bleu", syntax: "branch 2", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "bleu $rs, $rt, label", tac: "if (st <= $rt) goto label", description: "Branch: if Less Than or Equal (<=)" },



	{ unit: "CPU", classification: "control-flow",  mnemonic: "bltu", syntax: "branch 1", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "bltu $rs, $rt, label", tac: "if (st < rt) goto label", description: "Branch: if Less Than (<)" },

	{ unit: "CPU", classification: "control-flow",  mnemonic: "bltu", syntax: "branch 2", type: "pseudo",
	        encoding: [ { command:  [  "", "", "", "" ], encoding: {} } ],
	        usage: "bltu $rs, $rt, label", tac: "if (st < rt) goto label", description: "Branch: if Less Than (<)" },



	{ unit: "CPU", classification: "data-movement", mnemonic: "move", syntax: "register 2", type: "idiom",
	        encoding: [ { command:  [  "addu", "%1", "$zero", "%2" ], encoding: {} } ], 
	        usage: "move $rd, $rs", tac: "$rd = $rs", description: "Move from/to register" },



    
]

/*
Other instructions to pu$rsue:  CLO $rd, $rs
BAL  : Branch and Link  -->  Instruction Type Register Immediate
  Count Leading Ones

OTHER PSUEDO Instructions to be fleshed out

mul rdest, $rsrc1, src2   rd = $rs * rt
div rdest, $rsrc1, src2   rd = $rs / rt
divu rdest, $rsrc1, src2  rd = $rs / rt

mulo rdest, $rsrc1, src2   rd = $rs * rt   # with overflow
mulou rdest, $rsrc1, src2  rd = $rs * rt

neg rdest, $rsrc    rd = - $rs   ????
negu rdest, $rsrc   rd = - $rs

not rdest, $rsrc   rd = ~ $rs
rem rdest, $rsrc1, $rsrc2 
remu rdest, $rsrc1, $rsrc2

rol rdest, $rsrc1, $rsrc2  
ror rdest, $rsrc1, $rsrc2 

seq rdest, $rsrc1, $rsrc2    rdest = ( r == t ) ? 1 : 0
sge rdest, $rsrc1, $rsrc2    rdest = ( r >= t ) ? 1 : 0
sgeu rdest, $rsrc1, $rsrc2

sgt rdest, $rsrc1, $rsrc2    rdest = ( r > t ) ? 1 : 0
sgtu rdest, $rsrc1, $rsrc2

sle rdest, $rsrc1, $rsrc2    rdest = ( r < t ) ? 1 : 0
sleu rdest, $rsrc1, $rsrc2

sne rdest, $rsrc1, $rsrc2    rdest = ( r != t ) ? 1 : 0

beqz $rsrc, label    if ( r == 0 ) goto label
bnez $rsrc, label    if ( r != 0 ) goto label


Load doubleword
ld rdest, address pseudoinstruction
Load the 64-bit quantity at address into registe$rs rdest and rdest + 1.


Store doubleword
sd $rsrc, address pseudoinstruction


*/

/*
	{ unit: "C2",    classification: "load",          mnemonic: "lwc1",    syntax: "memory indirect 3", type: "native", encoding: { format: "I", opcode: 0x31, rs: "%3", rt: "%1", imm: "%2" }, usage: "lwc1 $rt, imm($rs)",  tac: "",                         description: "Load Word to C1" },
	{ unit: "C2",    classification: "load",          mnemonic: "lwc2",    syntax: "memory indirect 3", type: "native", encoding: { format: "I", opcode: 0x32, rs: "%3", rt: "%1", imm: "%2" }, usage: "lwc2 $rt, imm($rs)",  tac: "",                         description: "Load Word to C2" },
	{ unit: "C2",    classification: "load",          mnemonic: "lwc1",    syntax: "memory indirect 3", type: "native", encoding: { format: "I", opcode: 0x31, rs: "%3", rt: "%1", imm: "%2" }, usage: "lwc1 $rt, imm($rs)",  tac: "",                         description: "Load Word to C1" },
	{ unit: "C2",    classification: "load",          mnemonic: "lwc2",    syntax: "memory indirect 3", type: "native", encoding: { format: "I", opcode: 0x32, rs: "%3", rt: "%1", imm: "%2" }, usage: "lwc2 $rt, imm($rs)",  tac: "",                         description: "Load Word to C2" },
                
*/



/* Here are the special mappings for LOAD/STORE commands:

lw $22, int($23) # sytnax: "memory indirect 3"
    lw $t22, int($23)

lw $22, int    # syntax : "memory absolute <> register 2"  # idiom for lw $t22, 0($23)
    lw $t22, 0($23)

lw $22, ($23)    # syntax : "memory indirect 2"  # idiom for lw $t22, 0($23)
    lw $t22, 0($23)


lw $22, B + integer  # syntax: "memory direct 3"
     lui $at, upper(B)+upper(integer)
     lw  lower(B)+lower(integer),$at

lw $22, A       # syntax: "memory direct 2"         #idiom for lw reg, A + 0
	lui $at, upper(A)
	lw  $22, lower(A)($at)

lw $22, B ($reg)   # syntax: "memory reg offset"
    lui  $at, upper(B)
    addu $at, $at, $reg
    lw   $t22, lower(B)($at)

*/