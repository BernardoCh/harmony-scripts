//extract link of selected nodes without having to go into groups
//This script is a re-write of the script cableOut by Kenten
//If you have harmony 24 use the feature portal

function extract_link(){
  scene.beginUndoRedoAccum("");
  MessageLog.trace("\n\n******************** EXTRACT LINK *******************************\n");

  var selNode = selection.selectedNodes();

  if (selNode.length<1 ) {
    MessageBox.information("Select a node")
    scene.endUndoRedoAccum();
    return
  }

  var keyModifier = ""
  if( KeyModifiers.IsControlPressed()) { keyModifier= "ctrl"; }
  if( KeyModifiers.IsShiftPressed()) { keyModifier= "shift"; }
  //if( KeyModifiers.IsAlternatePressed()) { keyModifier= "alt"; }
  
  var limit = 50;
  for (var s = 0; s < selNode.length; s++) {
    if(selNode.length>limit){
      MessageBox.information("Attention trop de nodes sélectionnés")
      break
    }
    var nodeCurrent = selection.selectedNode(s);
    var groupLevel = (nodeCurrent.split("/").length - 1)-1;
    var nodeName = nodeCurrent.split("/")[groupLevel+1]
    print("node name : "+ nodeName)

    var parent = node.parentNode(nodeCurrent);	
    var portOut = node.numberOfInputPorts(parent+'/Multi-Port-Out');
    var source = nodeCurrent;
    var portIn = 0;

    //keys modifiers
    if (keyModifier=="") { link_group(source, portIn, parent, portOut) }
    if (keyModifier=="ctrl") { 
      var s =selNode.length;
      link_from_below(nodeCurrent, parent, portOut) }
    if (keyModifier=="shift") { link_from_above(nodeCurrent, parent, portOut) }
 
    if (groupLevel > 1) {
      for (var i = 1; i < groupLevel; i++) {
        var portIn = portOut;
        var source = parent;
        var parent = parent.split("/")
        parent.pop()
        var parent = parent.join("/")
        var portOut = node.numberOfInputPorts(parent+'/Multi-Port-Out');
        link_group( source, portIn, parent, portOut)
      }
    }
    if (s == 0 && keyModifier==""){
      var composite = add_composite(parent,nodeName)
    }
    if (s == 0 && keyModifier=="shift"){
      var composite = add_peg(parent,nodeName)
    }
    link(composite,s,parent,portOut)
  }

  scene.endUndoRedoAccum();
}

function link_group(_source,_portIn, _parent, _portOut) {
  node.link(_source,_portIn,_parent+'/Multi-Port-Out',_portOut); 
}

function link_from_below(_nodeCurrent, _parent, _port) {
  distantNode = node.dstNode(_nodeCurrent,0,0);
  node.link(distantNode,0,_parent+'/Multi-Port-Out',_port); 
}

function link_from_above(_nodeCurrent, _parent, _port) {
  sourceNode = node.srcNode(_nodeCurrent,0,0); 
  node.link(sourceNode,0,_parent+'/Multi-Port-Out',_port); 
}

function add_composite(_parent,_nodeName) {
  var addComposite = node.add("Top",_nodeName+"_C",'COMPOSITE',node.coordX(_parent)-100,node.coordY(_parent)+100,0);
  node.setTextAttr(addComposite,'compositeMode',0,'Pass Through');
  return addComposite;
}

function add_peg(_parent,_nodeName) {
  var addPeg = node.add("Top",_nodeName+"-P",'PEG',node.coordX(_parent)-150,node.coordY(_parent)+100,0);
  return addPeg;
}

function link(_child,_portChild,_parent,_portParent) {
  node.link(_parent,_portParent,_child,_portChild,true,true);
  print ("link parent : "+_parent+"  "+_portParent+" to : "+_child+"  "+_portChild)
}

function print(message) {
  MessageLog.trace(message); 
}