#  Session Memory

## Description
Each of the webapps associated with this project are associated with a single program.  This program is represented in three ways:
	1. as a raw source file:
	1. as a processed source file 
	1. as a memory data structure 

Session Memory also holds a copy of the following data structures:
	1. the symbol table contain all variables, their source line, and associated addreess/encoding
	1. a text_overlay and a data_overlay that provides additional information about the raw values stored in the memory data structure


Upon the load of a program, the raw source is stored within a JSON object that includes metadata and then each individual line of the program in ASCII. A parser is then invoked to generate a internal reprentation of the file.  For a valid program, a version of memory is constructed, which represents the initial state of memory upon progrom execution.

Additional data can be stored within the session data to represent the current state of program. For example the register set and system registers (PC, NPC, MAR, MBR, etc) can be retained.  With this information, you can dump core into a file and then reload the core file back into the machine.

The other webapps associated with this project can then use these representations to render specific information. For example, the process source file can be used to create a pretty-print version of int input file. Whereas, the memory data structure can be used to enumerate all of the labels, with their corresponding values, within the data-segment.

## JSON Represention
Each of the representations of the source file is stored within a data element within session data. Each of these data elements is specified via JSON.  The following subsections provide the JSON structure for each of the three presentations

###  Raw Source File
program   -> { "program": "data.asm", "url": "file://blah/blah/data.asm", lines": [] };
lines     -> { "linenumber": 2, "line": "A copy of the actual source line\n" }


### Processed Source File
The JSON format represents a valid MIPS assemble language program.  The BNF for this format is as follows:

program      -> { "program": "data.asm", "lines": [] };
lines 
    -> { "line": N, "segment": ".data", "declarations": [] }
    -> { "line": N, "segment": ".text", "instructions": [] }

 declaration
    -> { "line": N, "label":[], "op": "", "values": [ { "value": N, "count": N} ], "comment": "" }
 instruction
    -> { "line": N, "label":[], "op": "", "rd": , "rs": , "rt": , "imm":, "comment": "" }


### Memory Data Structure

memory_overlay ->  { "segment": ".data", "alignment": "on", start": 0x01001000, "size": N, "values": [
       {"labels": [ "A", "B" ], "op": ".dword", "size": N, "byte": {0 - N-1}, address: X}
       {"labels": [ ], "op": ".align", "size": N, "byte": {0 - N-1}, address: X}
]
}

memory ->  { "segment": ".data", "start": 0x01001000, "values": [
       {address: X, value: N, formats: { binary: "1101111", …}  ] )

	}


### symbol_table -> 
    // Contains only those things that are references to either register or memory locations
	{ defined: 0, symbol: "$zero", address: 0x0000,  binary: "000"}
	{ defined: 0, symbol: "$0", address: 0x0000,  binary: "000"}
	{ index: line: 15, symbol: "W", address: 0x02345, binary: "0000 0010 0011 0100 0101"}


