// Filename:    "registers.js"
// Purpose:     To provide a documented list of all the registers within the MIPS II architecture
// Description: The registers for the MPS II architecture are defined here.  These data structures are included
//              in the final JSON output file.  The will constitue part of the "core" file component of the JSON.
//              It is envisioned that a simulator will access these registers to 
//
// Status:      Only the CPU registers are defined.
//              Steps need to be taken to enumerate all of the fpu registers and the co-processor 0
//
// Caveats:     Need to deterime the best way to reference the single versus double precission registers
//           
// Enhancements?:
//    Consider adding two additional fields to the gp_reisters, "saved", "used"
//    Upon an entry to a subroutine, the "saved" values can be cleared for all S registers.
//    Upon a store to the stack, the "saved" value can be set.
//    Then upon a write to that register, a warning can be provided stating that the register was not saved.
//    The corresponding for the T register, the "used" values can be cleared
//    Upon a write to that register, the "used" value can be set
//    then upon the use of a jal/jalr instructing, a warning can be provided stating that the register was not saved.

function initialize_register(register_set, register, value) {

    register_set.find(register => register.name == register) = value;

}



const cpu_register = [
   { name: "$zero", number:  0, type: "general purpose", value: 0x00000000, description "Hardwired to the value 0x0000 0000" },
   { name: "$at",   number:  1, type: "general purpose", value: 0x00000000, description "Assembler Translation for psuedo instructions (avoid use)" },
   { name: "$v0",   number:  2, type: "general purpose", value: 0x00000000, description "return Value #0 from a subroutine, e.g., $v0 = call()"},
   { name: "$v1",   number:  3, type: "general purpose", value: 0x00000000, description "return Value #1 from a subroutine, e.g.,  ($v0, $v1) = call()" },
   { name: "$a0",   number:  4, type: "general purpose", value: 0x00000000, description "actual Arguement #0 to a subroutine, e.g., call($a0)" },
   { name: "$a1",   number:  5, type: "general purpose", value: 0x00000000, description "actual Arguement #0 to a subroutine, e.g., call($a0, $a1)" },
   { name: "$a2",   number:  6, type: "general purpose", value: 0x00000000, description "actual Arguement #0 to a subroutine, e.g., call($a0, $a1, $a2)" },
   { name: "$a3",   number:  7, type: "general purpose", value: 0x00000000, description "actual Arguement #0 to a subroutine, e.g., call($a0, $a1, $a2, $a3)" },

   { name: "$t0",   number:  8, type: "general purpose", value: 0x00000000, description "Temporary #0, save prior to and restore subsequent to a subroutine call" },
   { name: "$t1",   number:  9, type: "general purpose", value: 0x00000000, description "Temporary #1, save prior to and restore subsequent to a subroutine call" },
   { name: "$t2",   number: 10, type: "general purpose", value: 0x00000000, description "Temporary #2, save prior to and restore subsequent to a subroutine call" },
   { name: "$t3",   number: 11, type: "general purpose", value: 0x00000000, description "Temporary #3, save prior to and restore subsequent to a subroutine call" },
   { name: "$t4",   number: 12, type: "general purpose", value: 0x00000000, description "Temporary #4, save prior to and restore subsequent to a subroutine call" },
   { name: "$t5",   number: 13, type: "general purpose", value: 0x00000000, description "Temporary #5, save prior to and restore subsequent to a subroutine call" },
   { name: "$t6",   number: 14, type: "general purpose", value: 0x00000000, description "Temporary #6, save prior to and restore subsequent to a subroutine call" },
   { name: "$t7",   number: 15, type: "general purpose", value: 0x00000000, description "Temporary #7, save prior to and restore subsequent to a subroutine call" },

   { name: "$s0",   number: 16, type: "general purpose", value: 0x00000000, description "Saved #0: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$s1",   number: 17, type: "general purpose", value: 0x00000000, description "Saved #1: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$s2",   number: 18, type: "general purpose", value: 0x00000000, description "Saved #2: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$s3",   number: 19, type: "general purpose", value: 0x00000000, description "Saved #3: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$s4",   number: 20, type: "general purpose", value: 0x00000000, description "Saved #4: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$s5",   number: 21, type: "general purpose", value: 0x00000000, description "Saved #5: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$s6",   number: 22, type: "general purpose", value: 0x00000000, description "Saved #6: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$s7",   number: 23, type: "general purpose", value: 0x00000000, description "Saved #7: save upon entry to and restore upon exit from a subroutine call" },

   { name: "$t8",   number: 24, type: "general purpose", value: 0x00000000, description "Temporary #8, save before making subroutine call" },
   { name: "$t9",   number: 25, type: "general purpose", value: 0x00000000, description "Temporary #9, save before making subroutine call" },

   { name: "$k1",   number: 26, type: "general purpose", value: 0x00000000, description "reserved for the OS Kernel #0" },
   { name: "$k2",   number: 27, type: "general purpose", value: 0x00000000, description "reserved for the OS Kernel #1" },
   { name: "$gp",   number: 28, type: "general purpose", value: 0x00000000, description "Global Pointer used by compilers" },
   { name: "$sp",   number: 29, type: "general purpose", value: 0x00000000, description "Stack Pointer, which points to the top element of the stack" },
   { name: "$fp",   number: 30, type: "general purpose", value: 0x00000000, description "Frame Pointer, which points to the start of the current activition frame" },
   { name: "$ra",   number: 31, type: "general purpose", value: 0x00000000, description "Return Address, which is the next instruction to execute upon subroutine completion" }

];

const system_registers = [
   { name: "HI",    number: 0,  type: "system",          value: 0x00000000, description "Special register that holds the high-order (63-32) bits of the Mult/Div unit" },
   { name: "LO",    number: 0,  type: "system",          value: 0x00000000, description "Special register that holds the low-order (31-0) bits of the Mult/Div unit" },
   { name: "PC",    number: 0,  type: "system",          value: 0x00000000, description "Program Counter: holds the current address of the instruction being executed" },
   { name: "NPC",   number: 0,  type: "system",          value: 0x00000000, description "Next Program Counter: holds the value of the next PC value" },
   { name: "IR",    number: 0,  type: "system",          value: 0x00000000, description "Instruction Register: holds the contents of the current instruction" },
   { name: "MAR",   number: 0,  type: "system",          value: 0x00000000, description "Memory Address Register: holds the address of the word to be read from or wrote to memory" },
   { name: "MBR",   number: 0,  type: "system",          value: 0x00000000, description "Memory Data Register: holds the data value retrieved from or to be stored to memory" }
];


const fpu_registers = [ ];

   { name: "$f0",    number:  0, type: "single/double precision floating point", value: 0x00000000, description "return Value #0 from a subroutine, e.g., $f0 = call()"},
   { name: "$f1",    number:  1, type: "double precision floating point", value: 0x00000000, description "paired with $f0 to provide double precision value"},
   { name: "$f2",    number:  2, type: "single/double precision floating point", value: 0x00000000, description "return Value #1 from a subroutine, e.g.,  ($f0, $f2) = call()" },
   { name: "$f3",    number:  3, type: "double precision floating point", value: 0x00000000, description "paired with $f2 to provide double precision value"},
   { name: "$f4",    number:  4, type: "single/double precision floating point", value: 0x00000000, description "Temporary #1, save prior to and restore subsequent to a subroutine call" },
   { name: "$f5",    number:  5, type: "double precision floating point", value: 0x00000000, description "paired with $f4 to provide double precision value"},
   { name: "$f6",    number:  6, type: "single/double precision floating point", value: 0x00000000, description "Temporary #2, save prior to and restore subsequent to a subroutine call" },
   { name: "$f7",    number:  7, type: "double precision floating point", value: 0x00000000, description "paired with $f6 to provide double precision value"},
   { name: "$f8",    number:  8, type: "single/double precision floating point", value: 0x00000000, description "Temporary #3, save prior to and restore subsequent to a subroutine call" },
   { name: "$f9",    number:  9, type: "double precision floating point", value: 0x00000000, description "paired with $f8 to provide double precision value"},
   { name: "$f10",   number: 10, type: "single/double precision floating point", value: 0x00000000, description "Temporary #4, save prior to and restore subsequent to a subroutine call" },
   { name: "$f11",   number: 11, type: "double precision floating point", value: 0x00000000, description "paired with $f10 to provide double precision value"},
   { name: "$f12",   number: 12, type: "single/double precision floating point", value: 0x00000000, description "actual Arguement #0 to a subroutine, e.g., call($f12)" },
   { name: "$f13",   number: 13, type: "double precision floating point", value: 0x00000000, description "paired with $f12 to provide double precision value"},
   { name: "$f14",   number: 14, type: "single/double precision floating point", value: 0x00000000, description "actual Arguement #1 to a subroutine, e.g., call($f12, $f14)" },
   { name: "$f15",   number: 15, type: "double precision floating point", value: 0x00000000, description "paired with $f14 to provide double precision value"},
   { name: "$f16",   number: 16, type: "single/double precision floating point", value: 0x00000000, description "temporary #5: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$f17",   number: 17, type: "double precision floating point", value: 0x00000000, description "paired with $f16 to provide double precision value"},
   { name: "$f18",   number: 18, type: "single/double precision floating point", value: 0x00000000, description "temporary #6: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$f19",   number: 19, type: "double precision floating point", value: 0x00000000, description "paired with $f18 to provide double precision value"},
   { name: "$f20",   number: 20, type: "single/double precision floating point", value: 0x00000000, description "Saved #1: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$f21",   number: 21, type: "double precision floating point", value: 0x00000000, description "paired with $f20 to provide double precision value"},
   { name: "$f22",   number: 22, type: "single/double precision floating point", value: 0x00000000, description "Saved #2: save upon entry to and restore upon exit from a subroutine call" },
   { name: "$f23",   number: 23, type: "double precision floating point", value: 0x00000000, description "paired with $f22 to provide double precision value"},
   { name: "$f24",   number: 24, type: "single/double precision floating point", value: 0x00000000, description "Saved #3, save before making subroutine call" },
   { name: "$f25",   number: 25, type: "double precision floating point", value: 0x00000000, description "paired with $f24 to provide double precision value"},
   { name: "$f26",   number: 26, type: "single/double precision floating point", value: 0x00000000, description "Saved #4, save before making subroutine call" },
   { name: "$f27",   number: 27, type: "double precision floating point", value: 0x00000000, description "paired with $f26 to provide double precision value"},
   { name: "$f28",   number: 28, type: "single/double precision floating point", value: 0x00000000, description "Saved #5, save before making subroutine call" },
   { name: "$f29",   number: 29, type: "double precision floating point", value: 0x00000000, description "paired with $f28 to provide double precision value"},
   { name: "$f30",   number: 30, type: "single/double precision floating point", value: 0x00000000, description "Saved #6, save before making subroutine call" },
   { name: "$f31",   number: 31, type: "double precision floating point", value: 0x00000000, description "paired with $f30 to provide double precision value"},



const cp0_registers = [ 
  // .ktext 0x8000_0181   exception handler location....
  
   { name: "BadVAddress", number:  8, type: "", value: 0x00000000, description: ""},
   { name: "Count",       number:  9, type: "", value: 0x00000000, description: "related to the timer"},
   { name: "Compare",     number: 11, type: "", value: 0x00000000, description: "related to the timer"},
   { name: "Staus",       number: 12, type: "", value: 0x0000ff11, description: ""},   // Status is primed to model MARS
   { name: "Cause",       number: 13, type: "", value: 0x00000000, description: ""},
   { name: "EPC",         number: 14, type: "", value: 0x00000000, description: ""},

];

