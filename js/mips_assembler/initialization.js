
// Filename:    "initialization.js"
// Purpose:     To define various system wide values
// Description: The MIPS32 parser rules only checks for syntactic correctness.  As part of the 
//
// Scope:    
// Caveats:  
//
// Status:   File created as a stub as a place holder

//


// memory sentials:
var base_address_user_space ;
var limit_address_user_space ;

var base_address_text   = 0x00400000;
var limit_address_text  = 0x10010000;

var base_address_data   = 0x10010000;
var limit_address_data  = 0x10040000;

var base_address_heap   = 0x10040000;
var limit_address_heap  = 0x7ffffffc;   // should be a function related to the stack location

var base_address_stack  = 0x7ffffffc;
var limit_address_stack = 0x10040000;   // should be a function related to the heap location

var init_sp_address     = 0x7fffeffc;
var init_gp_address     = 0x10008000;

