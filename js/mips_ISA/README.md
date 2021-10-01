
# Architecture pieces
## Memory
### Data values
   * Text Operations
      * PC, NPC
      * IR
   * Data Operations:
      * MAR
      * MBR
      * Read/Write Op
   * Alignment
   * Endianness
   * Word Size (32 bits, 64 bits)
   * Segments
      * Read/Only
      * Name
      * Start
      * End
# Components: 
### MAR: Memory Address Register
### MDR: Memory Data Register
### DataSegement:
Provides a view of the data Segment.
Component values:
  * Data_Start: The first address that can be displayed
      **  assume:  Data_start % View_Width == 0
  * Data_End: The address that can be displayed
      ** assume:  Data_end % View_width == View_width - 1
  * View_Direction 
  * View_Height
  * View_Width
  * Default_Format: bit, octal, ascii, decimal, single, double


  Operationally steps:
    * assume memory has values stored within an array
        * load memory via a json object
    * build a table with a View_width x View_Height
      * for each row = (bottom .. top) | (top .. bottom)
        *     display_label_block
        *     display_address
        *     for each display_block
        *        display_block
    * build a table with a 1 x View_width
      * for each row = X .. active_element ..  X +
        * display lable_block
        * display display_block
        * display_address 


        datablock
        by click on a defualt, the active status is turned on
        by click on "reset", the active status is turned off
        <div class=memory_element class=hidden> 
             this is the information for an activated element
        </div>
        <div class=displayed>
        	this is the information for the defualt block
           <div class=block_element></div>
           <div class=block_element></div>
           <div class=block_element></div>
           <div class=block_element></div>
         </div>


 location counter... used to determine where alignment occurs
  memory data structure:
      address;
      labels[];
      data_directive: byte, dbyte, half, word, float, double, space, pad
      byte_number:
      byte_value:
      text_values{
          binary,
          hex:
          float"
          double:
  }
  

  Test Input:

 
           
