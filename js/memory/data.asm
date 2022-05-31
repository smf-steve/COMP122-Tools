/* 
Title:    data.asm
Purpose:  to provide a sample set of MIPS declaration for testing
Contents: 
   - sample MIPS data declaration
   - corresponding Processed Source File
   - corresponding Memory Overlay
*/

/* sample MIPS data declaration */

           .data

           .byte  0                       # comments
       W:  .word  0xDE AD BE AF           # comments
           .byte  1                       # comments
       H:  .half  0xFA CE
           .byte  2
       F:  .float   1.1, 2.1, 3.1

           .byte 3
           .double  1.2, 2.2
       DD:
       D:  .double 3.2
           .byte 4
       B:  .byte  '1', '2', '3', '4', '5'
           .byte 5
       S:  .space 6
           .byte 6
       C:  .ascii "Hello"              # Note no whitespace at the end
           .byte  7
           .asciiz "World"             # Note no newline
           .byte 8
       E:  .word 0x00DEFACE


I don't think I have to retain comments in the processe source...
    This information can be obtaind from raw source file.



/* 
  The following is the corresonding JSON  object
  Note in JSON, individual characters, e.g. 'a', are represented as a string of length 1, i.e., "a"

// - corresponding Processed Source File

{ program: "data.asm", "instructions": [
  { segment: ".data", "declarations": [
    { "line": 12, "label": "",   "op": ".data",   "values": [],                                 "comment": "# Comment String" },
    { "line": 13, "label": "",   "op": "",        "values": [],                                 "comment": "# A blank line" },
    { "line": 14, "label": "",   "op": ".byte",   "values": [ { value: 0, count: 1} ],          "comment": "# Comment String" },
    { "line": 15, "label": "W",  "op": ".word",   "values": [ { value: 0xDEADBEAF, count: 1} ], "comment": "# Comment String" },
    { "line": 16, "label": "",   "op": ".byte",   "values": [ { value: 1, count: 1} ],          "comment": "# Comment String" },
    { "line": 17, "label": "H",  "op": ".half",   "values": [ { value: 0xFACE , count: 1] } ],  "comment": "# Comment String" },
    { "line": 18, "label": "",   "op": ".byte",   "values": [ { value: 2 , count: 1} ],         "comment": "# Comment String" },
    { "line": 19, "label": "F",  "op": ".float",  "values": [ { value: 1.1, count: 1}, 
                                                { value: 2.1, count: 1},
                                                { value: 3.1, count: 1} ],                      "comment": "# Comment String" },
    { "line": 20, "label": "",   "op": "",        "values": [],                                 "comment": "# A blank line" },
    { "line": 21, "label": "",   "op": ".byte",   "values": [ { value: 3, count: 1} ],          "comment": "# Comment String" },
    { "line": 22, "label": "",   "op": ".double", "values": [ { value: 1.2, count: 1}, 
                                                { value: 2.2, count: 1}],                       "comment": "# Comment String" },


    { "line": 23, "label": "DD", "op": "", "values": [],                                        "comment": "# Comment String" },
    { "line": 24, "label": "D",  "op": ".double", "values": [ { value: 3.2, count: 1}           "comment": "# Comment String" },

    { "line": 25, "label": "",   "op": ".byte",   "values": [ { value: 4,   count: 1} ],        "comment": "# Comment String" },
    { "line": 26, "label": "B",  "op": ".byte",   "values": [ { value: "1", count: 1} , 
                                                { value: "2", count: 1}, 
                                                { value: "3", count: 1}, 
                                                { value: "4", count: 1}],                       "comment": "# Comment String" },
    { "line": 27, "label": "",   "op": ".byte",   "values": [ { value: 5, count: 1} ],          "comment": "# Comment String" },
    { "line": 28, "label": "S",  "op": ".space",  "values": [ { value: 6, count: 1} ],          "comment": "# Comment String" },
    { "line": 29, "label": "",   "op": ".byte",   "values": [ { value: 6, count: 1} ],          "comment": "# Comment String" },
    { "line": 30, "label": "C",  "op": ".ascii",  "values": [ { value: "Hello", count: 1} ],    "comment": "# Note no whitespace at the end" },
    { "line": 31, "label": "",   "op": ".byte",   "values": [ { value: 7, count: 1} ],          "comment": "# Comment String" },
    { "line": 32, "label": "",   "op": ".asciiz", "values": [ { value: "World", count: 1} ],    "comment": "# Note no newline" },
    { "line": 33, "label": "",   "op": ".byte",   "values": [ { value: 8, count: 1} ],          "comment": "# Comment String" },
    { "line": 34, "label": "E",  "op": ".word",   "values": [ { value: 0x00DEFACE, count: 1}],  "comment": "# Comment String" },
   ]
 }


data_overlay ->  { "segment": ".data", "alignment": "on", "wordsize": 4, "endianness": "big", start": 0x01001000, "size": N, "values": [

    //           .byte  0                       # comments
    { "line": 14, "labels": "",  "op": ".byte",  "size": 1, "byte": 0, "address": TBD },

    // Alignment Slots
    { "line": 0, "labels": "",   "op": "#slot",  "size": 3, "byte": 0, "address": TBD },
    { "line": 0, "labels": "",   "op": "#slot",  "size": 3, "byte": 1, "address": TBD },
    { "line": 0, "labels": "",   "op": "#slot",  "size": 3, "byte": 2, "address": TBD },


    //      W:  .word  0xDE AD BE AF           # comments
    { "line": 15, "labels": "W",  "op": ".word", "size": 4, "byte": 0, "address": TBD },
    { "line": 15, "labels": "W",  "op": ".word", "size": 4, "byte": 1, "address": TBD },
    { "line": 15, "labels": "W",  "op": ".word", "size": 4, "byte": 2, "address": TBD },
    { "line": 15, "labels": "W",  "op": ".word", "size": 4, "byte": 3, "address": TBD },

    //        .byte  1                       # comments
    { "line": 16, "labels": "",   "op": ".byte", "size": 1, "byte": 0, "address": TBD },

    // Alignment Slots
    { "line": 0, "labels": "",    "op": "#slot", "size": 1, "byte": 0, "address": TBD },

    //      H:  .half  0xFA CE
    { "line": 17, "labels": "H",  "op": ".half", "size": 2, "byte": 0, "address": TBD },
    { "line": 17, "labels": "H",  "op": ".half", "size": 2, "byte": 1, "address": TBD },

    //            .byte  2
    { "line": 18, "labels": "",   "op": ".byte", "size": 1, "byte": 1, "address": TBD },

    // Alignment Slots

    // example of an explicit alignment, not a valid line number should be provided
    //    .align 2   # ensure the next value is aligned on word boundaries 
    //    .float
    //{ "line": 0, "labels": "",  "op": ".align", "size": 3, "byte": 0, "address": TBD },
    //{ "line": 0, "labels": "",  "op": ".align", "size": 3, "byte": 1, "address": TBD },
    //{ "line": 0, "labels": "",  "op": ".align", "size": 3, "byte": 2, "address": TBD },

    // Example of an implicit alignment
    { "line": 0, "labels": "",    "op": "#slot", "size": 3, "byte": 0, "address": TBD },
    { "line": 0, "labels": "",    "op": "#slot", "size": 3, "byte": 1, "address": TBD },
    { "line": 0, "labels": "",    "op": "#slot", "size": 3, "byte": 2, "address": TBD },

    //      F:  .float   1.1, 2.1, 3.1
    { "line": 19, "labels": "F",  "op": ".float", "size": 4, "byte": 0, "address": TBD },
    { "line": 19, "labels": "F",  "op": ".float", "size": 4, "byte": 1,"address": TBD },
    { "line": 19, "labels": "F",  "op": ".float", "size": 4, "byte": 2,"address": TBD },
    { "line": 19, "labels": "F",  "op": ".float", "size": 4, "byte": 3,"address": TBD },

    { "line": 19, "labels": "",   "op": ".float", "size": 4, "byte": 0,"address": TBD },
    { "line": 19, "labels": "",   "op": ".float", "size": 4, "byte": 1,"address": TBD },
    { "line": 19, "labels": "",   "op": ".float", "size": 4, "byte": 2,"address": TBD },
    { "line": 19, "labels": "",   "op": ".float", "size": 4, "byte": 3,"address": TBD },

    { "line": 19, "labels": "",   "op": ".float", "size": 4, "byte": 0,"address": TBD },
    { "line": 19, "labels": "",   "op": ".float", "size": 4, "byte": 1,"address": TBD },
    { "line": 19, "labels": "",   "op": ".float", "size": 4, "byte": 2,"address": TBD },
    { "line": 19, "labels": "",   "op": ".float", "size": 4, "byte": 3,"address": TBD },

    //       .byte 3
    { "line": 21, "labels": "",   "op": ".byte",  "size": 1, "byte": 0, "address": TBD },
  

    // Alignment Slots
    { "line": 0, "labels": "",    "op": "#slot", "size": 3, "byte": 0, "address": TBD },
    { "line": 0, "labels": "",    "op": "#slot", "size": 3, "byte": 1, "address": TBD },
    { "line": 0, "labels": "",    "op": "#slot", "size": 3, "byte": 2, "address": TBD },

    //       .double  1.2, 2.2
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 0, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 1, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 2, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 3, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 4, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 5, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 6, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 7, "address": TBD },

    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 0, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 1, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 2, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 3, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 4, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 5, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 6, "address": TBD },
    { "line": 22, "labels": "",   "op": ".double", "size": 8, "byte": 7, "address": TBD },


    //   DD:
    //   D:  .double 3.2
    { "line": 24, "labels": ["DD", "D" ], "op": ".double",  "size": 8, "byte": 0, "address": TBD },
    { "line": 24, "labels": ["DD", "D" ], "op": ".double",  "size": 8, "byte": 1, "address": TBD },
    { "line": 24, "labels": ["DD", "D" ], "op": ".double",  "size": 8, "byte": 2, "address": TBD },
    { "line": 24, "labels": ["DD", "D" ], "op": ".double",  "size": 8, "byte": 3, "address": TBD },
    { "line": 24, "labels": ["DD", "D" ], "op": ".double",  "size": 8, "byte": 4, "address": TBD },
    { "line": 24, "labels": ["DD", "D" ], "op": ".double",  "size": 8, "byte": 5, "address": TBD },
    { "line": 24, "labels": ["DD", "D" ], "op": ".double",  "size": 8, "byte": 6, "address": TBD },
    { "line": 24, "labels": ["DD", "D" ], "op": ".double",  "size": 8, "byte": 7, "address": TBD },

    //       .byte 4
    { "line": 25, "labels": "",    "op": ".byte", "size": 1, "byte": 0, "address": TBD },

    //   B:  .byte  '1', '2', '3', '4', '5'
    { "line": 26, "labels": ["B"], "op": ".byte", "size": 1, "byte": 0, "address": TBD },
    { "line": 26, "labels": [],    "op": ".byte", "size": 1, "byte": 0, "address": TBD },
    { "line": 26, "labels": [],    "op": ".byte", "size": 1, "byte": 0, "address": TBD },
    { "line": 26, "labels": [],    "op": ".byte", "size": 1, "byte": 0, "address": TBD },
    { "line": 26, "labels": [],    "op": ".byte", "size": 1, "byte": 0, "address": TBD },

    //       .byte 5
    { "line": 27, "labels": [],    "op": ".byte", "size": 1, "byte": 0, "address": TBD },

    //   S:  .space 6
    { "line": 28, "labels": ["S"], "op": ".space",  "size": 6, "byte": 0, "address": TBD },
    { "line": 28, "labels": ["S"], "op": ".space",  "size": 6, "byte": 1, "address": TBD },
    { "line": 28, "labels": ["S"], "op": ".space",  "size": 6, "byte": 2, "address": TBD },
    { "line": 28, "labels": ["S"], "op": ".space",  "size": 6, "byte": 3, "address": TBD },
    { "line": 28, "labels": ["S"], "op": ".space",  "size": 6, "byte": 4, "address": TBD },
    { "line": 28, "labels": ["S"], "op": ".space",  "size": 6, "byte": 5, "address": TBD },

    //       .byte 6
    { "line": 29, "labels": "",    "op": ".byte",   "size": 1, "byte": 0, "address": TBD },

    //   C:  .ascii "Hello"              # Note no whitespace at the end
    { "line": 30, "labels": "C",   "op": ".ascii",  "size": 5, "byte": 0, "address": TBD },
    { "line": 30, "labels": "C",   "op": ".ascii",  "size": 5, "byte": 1, "address": TBD },
    { "line": 30, "labels": "C",   "op": ".ascii",  "size": 5, "byte": 2, "address": TBD },
    { "line": 30, "labels": "C",   "op": ".ascii",  "size": 5, "byte": 3, "address": TBD },
    { "line": 30, "labels": "C",   "op": ".ascii",  "size": 5, "byte": 4, "address": TBD },
 
    //       .byte  7
    { "line": 31, "labels": "",  "op": ".byte",   "size": 1, "byte": 0, "address": TBD },

    //       .asciiz "World"             # Note no newline
    { "line": 32, "labels": "",  "op": ".asciiz", "size": 6, "byte": 0, "address": TBD },
    { "line": 32, "labels": "",  "op": ".asciiz", "size": 6, "byte": 1, "address": TBD },   
    { "line": 32, "labels": "",  "op": ".asciiz", "size": 6, "byte": 2, "address": TBD },   
    { "line": 32, "labels": "",  "op": ".asciiz", "size": 6, "byte": 3, "address": TBD },   
    { "line": 32, "labels": "",  "op": ".asciiz", "size": 6, "byte": 4, "address": TBD },   
    { "line": 32, "labels": "",  "op": ".asciiz", "size": 6, "byte": 5, "address": TBD },   
    { "line": 32, "labels": "",  "op": ".asciiz", "size": 6, "byte": 6, "address": TBD },

    //       .byte 8
    { "line": 33, "labels": "",  "op": ".byte",   "size": 1, "byte": 0, "address": TBD },

     // Alignment Slots
    { "line": 0, "labels": "",   "op": "#slot",  "size": 2, "byte": 0, "address": TBD },
    { "line": 0, "labels": "",   "op": "#slot",  "size": 2, "byte": 1, "address": TBD },


    //   E:  .word 0x00DEFACE
    { "line": 34, "labels": "E", "op": ".word",   "size": 4, "byte": 0, "address": TBD },
    { "line": 34, "labels": "E", "op": ".word",   "size": 4, "byte": 1, "address": TBD },
    { "line": 34, "labels": "E", "op": ".word",   "size": 4, "byte": 2, "address": TBD },
    { "line": 34, "labels": "E", "op": ".word",   "size": 4, "byte": 3, "address": TBD },

]
}

*/