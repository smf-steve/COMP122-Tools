// Filename:    "assembler.js"
// Purpose:     To assemble a MIPS32 program and convert it into a JSON object.
// Description: The MIPS32 parser rules only checks for syntactic correctness.  As part of the 
//
// Scope:    
// Caveats:  
//
// Status:   

var initalization = require("initialization.js");
var instructions  = require("instructions.js");
var registers     = require("registers.js");
var kernel        = require("kernel.js");
var parser        = require("parser.js");



/* Steps
1. initialize system parameters  
1. parse input and generate the overlay segments
1. post processing of overlay
1. generate memory
1. preload kernel segments
1. preload registers
1. initial registers (e.g., sp, gp)
1. write out JSON object
*/ 



var output = parser.parse(".text");

output.core.memory = null;  //


//  preload registers

output.core.system = system_registers;
output.core.CPU    = cpu_registers;
output.core.CO     = co_registers;
output.core.FPU    = fpu_registers;


// Initialize the Registers
{

	// First the System Registers
    initialize_register(output.core.system, "PC",  0x00000);
    initialize_register(output.core.system, "NPC", 0x00000);
    initialize_register(output.core.system, "IR",  0x00000);
    initialize_register(output.core.system, "MAR", 0x00000);
    initialize_register(output.core.system, "MBR", 0x00000);
    
    
    // Second the CPU Registers
    initialize_register(output.core.CPU, "$gp", 0x00000);
    initialize_register(output.core.CPU, "$sp", 0x00000);
    initialize_register(output.core.CPU, "$fp", 0x00000);
    initialize_register(output.core.CPU, "$ra", 0x00000);

    // Third the registers in CoProcessor #0


    // Fourth the FPU registers
    // NONE


}

   

