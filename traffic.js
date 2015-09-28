/* Author: Luxi Zou
   Date: 2015-09-28
*/

/*
  based on observation, right side road regions are labeled as 1-4,
  left side road regions are labeled as 5-8.
  To simplify the rules, I construct a graph using object. Each graphnode is a
  self-define class called trafficGraph.
*/

//data structure for the traffic graph
function trafficGraph(){
  this.right = -1;
  this.straight = -1;
  this.left = -1;
  this.uTurn = -1;
  
  this.setValues = function (r,s,l,u){
    this.right = r;
    this.straight = s;
    this.left = l;
    this.uTurn = u;
  }
}
var curGraph = new Object();

/* initialize the traffic graph */
function initGraph(){
  var node1 = new trafficGraph();
  node1.setValues(6,7,8,5);
  var node2 = new trafficGraph();
  node2.setValues(7,8,5,6);
  var node3 = new trafficGraph();
  node3.setValues(8,5,6,7);
  var node4 = new trafficGraph();
  node4.setValues(5,6,7,8);
  var node5 = new trafficGraph();
  var node6 = new trafficGraph();
  var node7 = new trafficGraph();
  var node8 = new trafficGraph();
  curGraph[1] = node1;
  curGraph[2] = node2;
  curGraph[3] = node3;
  curGraph[4] = node4;
  curGraph[5] = node5;
  curGraph[6] = node6;
  curGraph[7] = node7;
  curGraph[8] = node8; 
}

/* use the initialized graph to pair the vehicle actions */
function trafficPair(r1, r2){
  var departRegion = Math.min(r1, r2);
  var arriveRegion = Math.max(r1, r2);
  if(curGraph[departRegion].right == arriveRegion)
    return 0;
  else if(curGraph[departRegion].straight == arriveRegion)
    return 1;
  else if(curGraph[departRegion].left == arriveRegion)
    return 2;
  else if(curGraph[departRegion].uTurn == arriveRegion)
    return 3;
  
  return -1;
}

function dataAnalyze(dataFile){
  //result index 0: right, 1: straight, 2: left, 3: u-turn
  var result = [0,0,0,0];
  //get the dataSet and save to a variable
  var dataSet  = require(dataFile);
  //create a hashtable for temporary storage
  var dataHash = new Object();

  //refine the dataSet to a hash, the key is vehicle id, and value is an array of data points.
  for(var i = 0; i < dataSet.length; i++){
    var item = dataSet[i];
    var curVehicle = item.vehicle;
    if(dataHash[curVehicle] == undefined){
      dataHash[curVehicle] = new Array();
    }
    delete item['vehicle'];
    dataHash[curVehicle].push(item);
  }
  /* One vehicle may appear several times in the same intersection, to
     correctly pair an action, we need to consider the time. Sort all records
     for the same vehicle by time could easily make pairs. 
  */
  for(var vehicleID in dataHash){
    dataHash[vehicleID].sort(function(a, b) {
      return parseFloat(a.time) - parseFloat(b.time);
    });
    while(dataHash[vehicleID].length >= 2){
      var region1 = dataHash[vehicleID].pop().region;
      var region2 = dataHash[vehicleID].pop().region;
      var action = trafficPair(region1, region2);
      result[action]++;
    }
  }  
  var resultString = result[0].toString() + result[1].toString() + result[2].toString() + result[3].toString();
  return resultString;
}

initGraph();
//accept command line arguement, passing in the path of the data set
var dataSetPath = process.argv[2];
var res = dataAnalyze(dataSetPath);
console.log(res);
