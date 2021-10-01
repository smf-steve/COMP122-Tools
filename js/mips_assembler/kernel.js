// File:         "kernel.js"
// Purpose:      To define all of the associated code associated with the kernel.
// Description:  It is envisioned that the a kernel for a simulated machine will be provided.
//               This default kernel will then be used by a simulator to execute MIPS II programs.
// 
// Caveats:  Perhaps this file is unnecessary.
// 
// Status:    At present, there is no need to provide said code.
//            It can be argued that the kernel code should not be placed into the 'core' component of the JSON output.
//            This code should be inserted into main memory via the simulator
//
// Notes:     If this code is to be provided, then what should be done is as follows:
//            1. include the assemble level code here
//            2. use the parser to generate the appropriate memory overlay
//            3. convert the overlay into its equivalent memory segment
//            To perform this work, the parser will need to be updated, e.g., to include .kernel directives



// From QtSPIM, the startup code is as follows:
// For QtSPIM, the startup code is provided in user space.
// This code is really part of the 'loader'
// 
// Consider the invocation of a program from the CLI
//      $ prog arg1 arg2 arg3
//
// For QtSPIM, it is assumed that positional arguments are stored within the environment.
// Hence the layout of the environment is as follows:
//
//     envp:  .word $1,
//            $2,
//            $3,
//            ...,
//            $(n-1)
//            # continue with the environment structure
//
//    ==>
//      load program into memory
//      place the aguements of the program onto the stack:  argc, argv, envp
//
//      adjust the things to follow the MIPS calling convention
//        - place argc into a0  # argc is located at 0($sp)
//        - place argv into a1  # argv is located at 4($sp)
//        - place envp into a3  # envp is located at 8(sp4) -- but we define the environment to be NULL.
//      
//      adjust the value of envp to skip over the positional parameers ($1, $2, $3, etc)
//        - envp += 4 * argc (four bytes per arguements)
//      call the main program
//         -- execute main program
//         -- return from the main program
//      call syscall with the exit, assume the program provided the return value in $a0
//
// From SPIM
//      [00400000] 8fa40000  lw $4, 0($29)            ; 183: lw $a0 0($sp) # argc 
//      [00400004] 27a50004  addiu $5, $29, 4         ; 184: addiu $a1 $sp 4 # argv 
//      [00400008] 24a60004  addiu $6, $5, 4          ; 185: addiu $a2 $a1 4 # envp 
//      [0040000c] 00041080  sll $2, $4, 2            ; 186: sll $v0 $a0 2 
//      [00400010] 00c23021  addu $6, $6, $2          ; 187: addu $a2 $a2 $v0 
//      [00400014] 0c100009  jal 0x00400024 [main]    ; 188: jal main 
//      [00400018] 00000000  nop                      ; 189: nop 
//      [0040001c] 3402000a  ori $2, $0, 10           ; 191: li $v0 10 
//      [00400020] 0000000c  syscall                  ; 192: syscall # syscall 10 (exit) 

const kernel_code = "
           .text
_main:     lw $a0 0($sp)    # place arg into $a0
           addiu $a1 $sp 4  # place &argv into $a1, which is  $sp + 4
           addiu $a2 $a1 4  # place &envp into $a2, which is  $a1 + 4 == $sp + 8
           sll $v0 $a0 2    # determine the value of 4 * argc
           addu $a2 $a2 $v0 # adjust the value of envp
           jal main         # call the main program
           nop              ## presume to be a delay slot
           li $v0 10        # halt the program
           syscall # syscall 10 (exit)";










"