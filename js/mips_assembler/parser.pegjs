
// File:     "parser.pegjs" -->  "parser.js"
// Purpose:  To provided the PEG (Phrase Expression Grammar) for the MIPS assemble lanaguage
//
// Description:  This file contents the syntax for the MIPS ISA written as a PEG.
//     PEG: https://en.wikipedia.org/wiki/Parsing_expression_grammar
//     The PEGjs.org tools have been used to parse and to construct the internel data structure.
//
// Scope:    
// Caveats:  Focus is placed on instructions associates with the CPU.
//           That is to say, little attention is placed on the FPU and CoProc #0.
//
// Status:   Need to determine which MIPS version, e.g., MIPS II or MIPS III  
//           
//
// Usage:    npm install pegjs
//           ~/node_modules/pegjs/bin/pegjs -o parser.js parser.pegjs
//           The parser.js is the final Javascript file used

{

function instruction_lookup(mnemonic, syntax) {
    return true;
}

function instruction_lookup_error(mnemonic) {
    error("Line: " + line() + "; Undefined mnemonic \"" + mnemonic + "\" encountered");
    return undefined;
}



var current_text_address = base_address_text;

function incrementent_text_address(units = 1) {
    return current_text_address += ( units << 2 )
}

function text_address () {
    return current_text_address;
}


var labels_table = [];
var segment = ".text";  // Default starting segment

function setSegment(value) {
    segment = value;
    return segment;
}

function getSegment() {
    return segment;

}

  function defineLabel(name) {
      var found = labels_table.find(element => element.name == name);

      //  Three possibilites:
      //  1. the label was previously used:  hence update the line number
      //  2. the label was previously defined:  hence error
      //  3. the label was not previoulsly used/defined:  hence create the record

      if ( found && found.line == null) {
          // The label was previously used, but not defined
          found.line = line();
      }
      if (found && found.line != null) {
         // the label was previously defined
         error("Redefinition of label \"" + name + "\" on line: " + line() );
      }
      if ( ! found ) {
        labels_table.push({ line: line(), segment: getSegment(), name: name, address: null, refs: []});
      } 
      return name;
  }

 function useLabel(name) {
      var found =  labels_table.find(element => element.name == name);

      if ( ! found ) {
         labels_table.push({ line: null, segment: getSegment(), name: name, address: null, refs: []});
      }

      found =  labels_table.find(element => element.name == name);
      found.refs.push( line() );
      return name;
  }



var line = function() { return location().start.line ; }

// Support Routines:
  function align_constraint (value) {
    switch (value) {
      case 1:
      case 2:
      case 4:
      case 8:
         break;
      default:
         error("Expected an alignment value of 1, 2, 4, or 8");   
    }       
    return true;
  }

function charactorCode_constraint (value) {
    if (value > 255) {
        error("Charactor code must be in the range of '\\0' .. '\\255");
    }
    return true;
}



function create_list(head, tail) {
    var result = [head];
    for (var i = 0; i < tail.length; i++) {
      result.push(tail[i]);
    }
    return result;
  }

function make_array(l) {
    if (l) return [ l ];
    else   return null;
}

function syntax(cmd) {
    if (cmd) return cmd.syntax;
    else     return null;
   }
  
function command(cmd) { 
   if (cmd) return cmd.command
   else return null;
   }

function encoding(cmd) { 
   if (cmd) return cmd.encoding
   else return null;
   }

function type(cmd) { 
   if (cmd) return cmd.type
   else return null;
   }
// End of Support Routines

}



program
    = p: preamble s: segment*                                { return  {program: "name",  labels: labels_table, overlay:  create_list(p, s) }; }


preamble
    =  i: instruction_line*                                  { return  { segment: ".text", address: null, comment: "Implicit start of .text segment", instructions: i}; }


segment
    =  _ ( ".data"  {return setSegment(".data");} ) _ a:(scalar / LABEL)?  c: (COMMENT)? EOL d: declaration_line*           { return  { segment: ".data", address: a, comment: c, declarations: d}; }
    /  _ ( ".text"  {return setSegment(".text");} ) _ a:(scalar / LABEL)?  c: (COMMENT)? EOL i: instruction_line*           { return  { segment: ".text", address: a, comment: c, instructions: i}; }



declaration_line
   =  _ l:(l: LABEL _ ':' {return defineLabel(l);})? _ d:(declaration)? c: (COMMENT)? EOL        
                                                             { 
                                                               return {line: line(), labels: make_array(l), directive: d, comment: c};
                                                             }        
   / constant_definition

instruction_line
   =  _ l:(l: LABEL _ ':' {return defineLabel(l);} )? _ cmd:(instruction)? c: (COMMENT)? EOL     
                                                             { 
                                                               return {line: line(), labels: make_array(l), syntax: syntax(cmd), command: command(cmd), type: type(cmd), encoding: encoding(cmd), comment: c};
                                                             } 
   / constant_definition


onstant_definition
   = n:LABEL _ '=' _ v: string    c:(COMMENT)? EOL         { return {line: line(), name: n, value: v, comment: c }; }
   / n:LABEL _ '=' _ v: immediate c:(COMMENT)? EOL         { return {line: line(), name: n, value: v, comment: c }; }



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Syntax Related to the .data segment
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

declaration
    =  d:".align"  __ v: scalar                              { align_constraint(v); return { op: d, values: v }; }
    /  d:".space"  __ v: scalar                              { return { op: d, values: v }; }

    /  d: integer_directive  __ f: integer_count  
             n:( _ ',' _ v: integer_count { return v;})*     { return { op: d, values: create_list( f, n )}; }

    /  d: float_directive  __ f: float_count    
            n:( _ ',' _ v: float_count    { return v;})*     { return { op: d, values: create_list( f, n )}; }

    /  d: string_directive  __ f: string          
             n:( _ ',' _ v: string        { return v;})*     { return { op: d, values: create_list( f, n )}; }


integer_directive 
   = ".byte"                                                 { return text(); }
   / ".dbyte"                                                { return text(); }
   / ".half"                                                 { return text(); }
   / ".word"                                                 { return text(); }
   / ".dword"                                                { return text(); }

float_directive
   = ".float"                                                { return text(); }
   / ".double"                                               { return text(); }
   
string_directive
   = ".asciiz"                                               { return text(); }
   / ".ascii"                                                { return text(); }


integer_count
   =  v: immediate _ ':' _ c:scalar                            { return { value: v, count: c };}
   /  v: immediate                                             { return { value: v, count: 1 };}

float_count
   =  v: float _   ':' _ c: scalar                           { return { value: v, count: c };}
   /  v: float                                               { return { value: v, count: 1 };}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Syntax Related to the .text segment
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Note other syntax forms for instructions exist on the MIPS ISA, but we are not interested in these instructions,

instruction
   =  op: MNEMONIC __ r1: register _ ',' _ l: LABEL _ '+' _ o: scalar _ r2: indirect_register ?
                                                            { 

                                                                var syntax  = (! r2) ? "label indirect 4" // e.g., "lw $t1, A+2 ($t2)"
                                                                                     : "displacement 3";  // e.g., "lw $t1, A+2"

                                                                var command = (! r2) ? [ op, r1, l, o ] : [ op, r1, l, o, r2 ];

                                                                var i = instruction_lookup(op, syntax);
                                                                if (! i) instruction_lookup_error(op);


                                                                useLabel(l);
                                                                return  {command : command, syntax: syntax, type: i.type, encoding: i.encoding };
                                                            }


   /  op: MNEMONIC __ r1: register _ ',' _ l: LABEL _ r2: indirect_register  
                                                             {
                                                                var syntax  = "label indirect 3";   // e.g., "lw $t1, A($t2)"
                                                                var command = [ op, l, r2 ];

                                                                var i = instruction_lookup(op, "memory register offset 3");
                                                                if (! i) instruction_lookup_error(op);

                                                                useLabel(l);
                                                                return  { command : command, syntax: syntax, type: i.type, encoding: i.encoding}; 
                                                             }


   /  op: MNEMONIC __ r1: register _ ',' _ l: LABEL 
                                                            { 
                                                                var syntax = "label 2";   // e.g., "beqz $t1, A", or "lw $t1, A"
                                                                var command = [ op, r1, l ];

                                                                var i = instruction_lookup(op, syntax);
                                                                if (! i) instruction_lookup_error(op);

                                                                useLabel(l);
                                                                return  {  command : command, syntax: syntax, type: i.type, encoding: i.encoding};
                                                            }


 
   /  op: MNEMONIC __ r1: register _ ','  _ imm: immediate  _ r2: indirect_register 
                                                            { 
                                                                var syntax  = "indirect 3";   // e.g., "lw $t1, -3($t2)"
                                                                var command = [ op, r1, imm, r2 ];

                                                                var i = instruction_lookup(op, syntax);
                                                                if (! i) instruction_lookup_error(op);

                                                                return  { command: command, syntax: syntax, type: i.type, encoding: i.encoding }; 
                                                            }
 

   /  op: MNEMONIC __ r1: register _ ','  _  r2: indirect_register  
                                                            { 
                                                                var syntax  = "indirect 2";  // e.g., "lw $t1, ($t2)"
                                                                var command = [ op, r1, r2 ];

                                                                var i = instruction_lookup(op, syntax);
                                                                if (! i) instruction_lookup_error(op);

                                                                return  { command: command, syntax: syntax, type: i.type, encoding: i.encoding }; 
                                                             }




   /  op: MNEMONIC __ r1: register _ ',' _ r2: register _ ',' _ r3: register
                                                            {
                                                                var syntax  = "register 3";  // e.g., "add $t1, $t2, $t3"
                                                                var command = [ op, r1, r2, r3 ];

                                                                var i = instruction_lookup(op, syntax);
                                                                if (! i) instruction_lookup_error(op);

                                                                return  { command : command, syntax: syntax, type: i.type, encoding: i.encoding }; 
                                                            }
   

   / op: MNEMONIC __ r1:register _ ',' _ r2:register _ ',' _ l:LABEL
                                                            { 
                                                                var syntax  = "label 3"; // e.g., "beq $t1, $t2, A"
                                                                var command = [ op, r1, r2, l ];

                                                                var i = instruction_lookup(op, syntax);
                                                                if (! i) instruction_lookup_error(op);

                                                                useLabel(l);
                                                                return  { command : command, syntax: syntax, type: i.type, encoding: i.encoding }; 
                                                            }
  

   /  op: MNEMONIC __ r1: register _ ',' _ r2: register imm: next_immediate?
                                                            { 
                                                                var syntax  = (! imm) ? "register 2"    // e.g., "mult $t1, $t2"
                                                                                      : "immediate 3";  // e.g., "sll $t1, $t2, 3"
                                                                var command = (! imm) ? [ op, r1, r2 ] : [ op, r1, r2, imm ];

                                                                var i = instruction_lookup(op, syntax);
                                                                if (! i) instruction_lookup_error(op);


                                                                return { command : command, syntax: syntax, type: i.type, encoding: i.encoding };  

                                                            } 


    /  op: MNEMONIC __ r1: register imm:next_immediate?     
                                                            { 
                                                                var syntax  = (! imm) ? "register 1"    // e.g., "mfhi $t1"
                                                                                      : "immediate 2";  // e.g., "li $t1, 2" and "lw $t1, 2"
                                                                var command = (! imm) ? [ op, r1 ] : [ op, r1, imm ];

                                                                var i = instruction_lookup(op, syntax);
                                                                if (! i) instruction_lookup_error(op);

                                                                return { command : command, syntax: syntax, type: i.type, encoding: i.encoding };  
                                                            } 


    / op: MNEMONIC __ l: LABEL                              { 
                                                                var syntax  = "label 1";  // e.g., "j A"
                                                                var command = [ op, l ];

                                                                var i = instruction_lookup(op, syntax);
                                                                if (! i) instruction_lookup_error(op);

                                                                useLabel(l);
                                                                return  { command : command, syntax: syntax, type: i.type, encoding: i.encoding };
                                                            }


    /  op: MNEMONIC  imm: first_immediate?
                                                            { 
                                                                var syntax  = (! imm) ? "command"       // e.g., "syscall"
                                                                                      : "immediate 1";  // e.g., "break 5"
                                                                var command = (! imm)? [ op ] : [ op, imm ];

                                                                var i = instruction_lookup(op, syntax);
                                                                if (! i) instruction_lookup_error(op);

                                                                return { command : command, syntax: syntax, type: i.type, encoding: i.encoding };  
                                                            } 





first_immediate
   // where the immediate value is the first in the list of operands
   = __ imm: immediate                                      { return imm; }



next_immediate
    // where the immediate value is NOT the first in the list of operancs (hence preceed by comma)
    =  _ ',' _ imm: immediate                               { return imm; } 

    

indirect_register
    = '(' _ r: register _ ')'                                { return r; }


register
   = '$' num: ([0-9][0-9]?)                                  { if (num > 31) error("Register value of ' + num + ' is outside of range [0 .. 31]!");   ; return text(); }     
   / '$zero'                                                 { return text(); }
   / '$at'                                                   { return text(); }
   / '$v'[0-1]                                               { return text(); }
   / '$a'[0-3]                                               { return text(); }                                            
   / '$t'[0-9]                                               { return text(); }
   / '$s'[0-7]                                               { return text(); }
   / '$k'[01]                                                { return text(); }  
   / '$gp'                                                   { return text(); }
   / '$sp'                                                   { return text(); }
   / '$fp'                                                   { return text(); }
   / '$ra'                                                   { return text(); }

                                             





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Syntax Related to the Basic Types
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  Basic Types
immediate 
    =  s:[+-] v:DECIMAL                                    { // Note the -0 and +0 is not possible
                                                               if ( s == '-' ) { 
                                                                  return -v 
                                                               } else { 
                                                                  return v; 
                                                               }
                                                             }
   /  scalar


scalar                                                       // Note that the order is is important
   = "'" c: char "'"                                         { return c; }
   /  BINARY
   /  HEXIDECIMAL
   /  OCTAL
   /  DECIMAL                                               


BINARY       = "0"[bt] d:[_0-1]+                             { return parseInt( (d.join("")).replace(/_/g, ''), 2); }
HEXIDECIMAL  = "0x"[_0-9A-Faf]+                              { return parseInt( text().replace(/_/g, ''), 16); }
OCTAL        = "0"[_0-7]*                                    { return parseInt( text().replace(/_/g, ''), 8); }
DECIMAL      = [1-9][_0-9]*                                  { return parseInt( text().replace(/_/g, ''), 10); }


float 
   =  DECIMAL '.' [_0-9]+                                    { return parseFloat(text()); }
   /  DECIMAL                                                { error("An integer value is provided where a real number is expected!");}

string 
   =  '"' chars:( char )* '"'                                {return chars.join(""); }

char
   = [^"\\]                                                  { return text(); }
   / '\\' '"'                                                { return text()[1] ; }
   / '\\' v:([0-9][0-9]?[0-9]?)                              { charactorCode_constraint (parseInt(v.join(""), 10)); return " " + v+ " " ; }
   / '\\' [abtnvfr]                                          { return text(); }

       /*  '\a' (bell),  '\b' (backspace),  '\t' (horizontal tab),  '\n' (new line),  '\v' (vertical tab),  '\f' (form feed),  '\r' (carriage ret) */ 





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Syntax Related to the Tokes and Whitespace
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Tokens:
EOL          = _ '\n'  
COMMENT      = _ '#' comment:( [^\n] )*                      { return "#" + comment.join(""); }


LABEL        = ID                                            { return text(); }
MNEMONIC     = ID                                            { return text(); }
ID           = [a-zA-Z][_a-zA-z0-9]*                         { return text(); }


_ "whitespace_option"
  = [ \t\r]*  { return ''; }
 
__ "whitespace_required"
  = [ \t\r]+  { return ''; }








