/*------------------------------------------------------------------------------------------------------------------------------------------------------------
ToonBoom Harmony script 

This script ungroup a group node in the good place.
This script fix the ungroup harmony function who move the nodes faraway.

Thibault Chollet
---------------------------------------------------------------------------------------------------------------------------------------------------------------*/  // ungroup in place

  function ungroup_in_place(){
    scene.beginUndoRedoAccum("");
    MessageLog.trace("\n\n***************************************************\n");
  
    var selNode = selection.selectedNodes();
    if (selNode.length<1 || node.type(selNode) != "GROUP") {
      MessageBox.information("Select a group node")
      return
    }
    var xGroup = node.coordX(selNode);
    var yGroup = node.coordY(selNode);
    var subNodes = node.subNodes(selNode)
    var xSubNode = node.coordX(subNodes[0]);
    var ySubNode = node.coordY(subNodes[0]);

    var goodCoordinatesX = math_differential_coordinate(xGroup,xSubNode)
    var goodCoordinatesY = math_differential_coordinate(yGroup,ySubNode)

    for (i = 0; i < subNodes.length; i++) {
      var coordX =node.coordX(subNodes[i])+goodCoordinatesX
      var coordY =node.coordY(subNodes[i])+goodCoordinatesY
      node.setCoord	(subNodes[i],coordX,coordY)
    }
    //ungroup
    Action.perform("onActionSelMergeInto()","Node View")

    scene.endUndoRedoAccum();
  }

  function math_differential_coordinate(_x,_xA){
    if(_x< 0 && _xA >0 ) {
      _xA = Math.abs(_xA)
    }
  differential = _x-_xA;
  return differential;
  }