# Assemble Language Tools
A set of webapps designed as an instructional aid to learn Computer Architecture and Assemble Languages.

## Summary
This repository contains a tools that are designed to illustrate various aspects of Computer Architecture and Assemble Language programing. Each of these tools manifest themselves as a collection of dynamic webpages. 

The two core applications contained within this repository is a MIPS assembler and a MIPS simulator. The MIPS assembler creates a JSON file that represents a valid MIPS program along with a rich set of metadata. This metadata also includes the internal machine state associated with the MIPS program. Hence, the JSON file can be used by the MIPS simulator as both its input file and output file.

<insdert image>




The primary audience of these web pages are freshman computer science students, who are learning the basics of a ISA (instruction set architecture).  Whenever possible, the material is presented in an architecture neutral way, but note that the MIPS architecture has been used as a the primary assembly language.

## Project Goals:
   * to develop a web-based application that simulates a generalized RISC assembly language
   * to provide a 100% in-browers simulator for the use of *teaching* assembly language programming to CS freshman
   * ~~to provide a robust simulator for the execution of an assembly language program~~
   * to provide a set of tools to illustrate and to reinforce the following topics:
     * formats: instructions, binary numbers (signed & unsigned), chars, floats
     * number representation: binary, octal, decimail, and hexadecimal 
     * memory organization: segments, endianess, activiation records (frame), etc                         
     * CPU components at a high level of abstraction
     * mechanics of the ALU, i.e., what each instruction performs
     * the interaction between memory, the ALU and registers
    



## Architetural pieces
Within the application, the following pieces of the micro-architecture are modeled:

   * Main Memory with various segment definitions
   * Memory Registers: Memory Address and Memory Buffer/Data
   * Text Registers: PC, NPC (Next PC), and IR (Instruction Register)
   * CPU Operations: 
   * Register Bank: 32 general purpose registers

## Web Pages:
This application is envisioned to be delived via a suite of web pages. All web pages are driven simulatous by the program loaded into the the archtiecture and the interactivity of the user. The web pages that are envisioned to be part of this suite of web pages include:
   * Data Segment: Representation of the data segement with the following characterists
     * Memory View Representation: 1x, 2x, 4x, 16x, etc
     * 32-bits versus 64-bit words
     * Little endian versus Big endian
     * Alignment and non-alignment
   * Activation Record (i.e., Frame):
   * Data Conversions: decimal to binary, real to float-point
   * Symbol-Table with a 'watch' functionality to highlight the current value
   * Basic Blocks of a program
   * Simple gdb window to executec ommands line:  print /t  value | address.



## Vue Components
To drive each of these web pages, a set of Vue components are defined to allow for both the easy of display and rendering of dynamic changes.  It is envisioned that these Vue components will expidate the develop of subsquent web pages.  One such component is "<memory_cell>" that 
   * displays the default value of a memory cell
   * upon hover, displays various othe values associated with memoery cell
   * upon active, displays a set of memory cells as an aggregate value

For more information, review the documentation contained with the js (javascript) subdirectory


