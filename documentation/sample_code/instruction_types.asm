# Title:    instruction_types.asm
# Purpose:  to provide a sample set of MIPS instructions that illustrate the 
#          complete set of instruction syntax

       .data
D:     .word 42

# Instruction that contain a label

       .text
A:     j A                         # "label 1" syntax  (zero registers + label)
       beq $t2, A                  # "label 2" syntax  (one registers  + label)
       beq $t3, $2, A              # "label 3" syntax  (two registers  + label)
       
       
# Memory related instructions
       .text

       lw $t2, 0b01010              # "immediate 2"
       lw $t2, A                    # "label 2" 
       lw $t3, A+1                  # "displacement 3"
       
       lw $t2, ($t1)                # "indirect 2"
       lw $t3, 2($t1)               # "indirect 3"
       
       lw $t3, A ($t1)              # "label indirect 3"
       lw $t4, A+2 ($t1)            # "label indirect 4"



# Register operations with and with out imme                                     
       .text
       syscall                      # "command"

       #op 2                        # "immediate 1"  // no examples in the MIPS32 ISA
       mfhi $t1                     # "register 1"       

       li $t2, 2                    # "immediate 2"
       mult $t2, $t1                # "register 2"

       addi $t3, $2, 4              # "immediate 3"   
       add  $t3, $2, $1             # "register 3"



