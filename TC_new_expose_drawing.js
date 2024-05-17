/*------------------------------------------------------------------------------------------------------------------------------------------------------------
ToonBoom Harmony script 

Create a drawing node with good expose.
---------------------------------------------------------------------------------------------------------------------------------------------------------------*/

function new_expose_drawing(){  
  scene.beginUndoRedoAccum("Create Drawing Nodes"); 
  var selectedNodes = selection.numberOfNodesSelected(); 
  var numFrame = frame.numberOf()
  var startSelFrame = frame.current();

  MessageLog.trace("Generate Matte \nnum frames :"+numFrame)

  if(selectedNodes >= 1){ 
    for(var n = 0; n < selectedNodes; n++){ 
      var currentNode = selection.selectedNode(n);
      var posX = node.coordX(currentNode); 
      var posY = node.coordY(currentNode);
      var myNodeName = "MATTE";
      var newNode =  node.add(node.parentNode(currentNode), myNodeName, "READ", posX + (-200), posY + -200, 0);
      var myColumnName = myNodeName+Math.random();
      var myColumn = column.add(myColumnName, "DRAWING", "BOTTOM");
      var myElement = element.add (myNodeName, "COLOR", 12, "SCAN", "TVG");
      var columnName = node.linkedColumn(newNode, "DRAWING.ELEMENT")

      column.setElementIdOfDrawing(myColumnName, myElement);
      node.linkAttr (newNode, "DRAWING.ELEMENT", myColumnName);
      Drawing.create (myElement, "1", false, false);

        for(var i = 0; i < numFrame+1; i++){ 
            column.setEntry (myColumnName, 1, i, "matte");
        }
      frame.setCurrent(startSelFrame);
      node.link(newNode, 0, currentNode, 0);
    }

  }else{
     MessageBox.information("You must select one node.");
  } 
  scene.endUndoRedoAccum();
}