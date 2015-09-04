---
---
var Network = function() {
	//colors from http://colorbrewer2.org/
	var nodeColours = {		"al":{"color":"#084594","altcolor":"#636363","name":"Arabidopsis lyrata"}, //Brassicaceae, Brassicales, blue
							"at":{"color":"#2171b5","altcolor":"#636363","name":"Arabidopsis thaliana"}, //Brassicaceae, Brassicales, blue
							"ar":{"color":"#252525","altcolor":"#636363","name":"Amborella trichopoda"}, //Amborellaceae, Magnoliales, black
							"br":{"color":"#4292c6","altcolor":"#636363","name":"Brassica rapa"}, //Brassicaceae, Brassicales, blue
							"cp":{"color":"#6baed6","altcolor":"#636363","name":"Carica papaya"}, //Caricaceae, Brassicales, blue
							"fv":{"color":"#fcbba1","altcolor":"#e6550d","name":"Fragaria vesca"}, //Rosaceae, Rosales, red
							"gm":{"color":"#cb181d","altcolor":"#e6550d","name":"Glycine max"}, //Fabaceae, Fabales, red
							"gr":{"color":"#9ecae1","altcolor":"#e6550d","name":"Gossipium raimondii"}, //Malvaceae, Malvales, blue
							"mt":{"color":"#67000d","altcolor":"#e6550d","name":"Medicago truncatula"}, //Fabaceae, Fabales, red
							"pt":{"color":"#fc9272","altcolor":"#e6550d","name":"Populus trichocarpa"}, //Salicaceae, Malpighiales, red
							"sl":{"color":"#ffffb2","altcolor":"#636363","name":"Solanum lycopersicum"}, //Solanaceae, Solanales, yellow
							"st":{"color":"#fed976","altcolor":"#636363","name":"Solanum tuberosum"}, //Solanaceae, Solanales, yellow
							"ta":{"color":"#c6dbef","altcolor":"#e6550d","name":"Theobroma cacao"}, //Malvaceae, Malvales, blue
							"vv":{"color":"#4a1486","altcolor":"#636363","name":"Vitis vinifera"}, //Vitaceae, Vitales, purple
							"os":{"color":"#bae4b3","altcolor":"#636363","name":"Oryza sativa"}, //Poaceae, Poales, green
							"lj":{"color":"#a50f15","altcolor":"#636363","name":"Lotus japonicum"}, //Fabaceae, Fabales, red
							"rc":{"color":"#fb6a4a","altcolor":"#e6550d","name":"Ricinus communis"}, //Euphorbiaceae, Malpighiales, red
							"zm":{"color":"#238b45","altcolor":"#636363","name":"Zea mays"}, //Poaceae, Poales, green
							"ph":{"color":"#ef3b2c","altcolor":"#e6550d","name":"Phaseolus vulgaris"},//Fabaceae, Fabales, red
							"md":{"color":"#fee0d2","altcolor":"#e6550d","name":"Malus domestica"},// Rosaceae, Rosales, red
							"cr":{"color":"#ffffff","altcolor":"#636363","name":"Chlamydomonas reinhardtii"} 	} 
	var width = 500;
	var height = 500;
	var link = null;
	var node = null;
	var nodesG = null;
	var linksG = null;
	var allData = [];
	var curLinksData = [];
	var curNodesData = [];
	var setupData; //function
	var filterLinks; //function
	var filterNodes; //function
	var force = d3.layout.force(); // force layout
	var network; //function
	var updateNetwork; //function
	var updateNodes; //function
	var updateLinks; //function
	var linkedByIndex = {}; //hash
	var mapNodes; //function
	var showDetails; //function
	var hideDetails; //function
	var tooltip = Tooltip("vis-tooltip", 230); //tooltip.js
	var setZoom; //function
	var zoom = "zoom";
	var col = "color";
	var moving = true;
	var attract = 50;
	var forceTick; //function

	network = function(selection,data) {
		var vis;
		allData = setupData(data);
		stats(allData)
		vis = d3.select(selection)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.call(d3.behavior.zoom().on("zoom",function(){
				if (zoom === "zoom"){
					return redraw();
				} else {
					return null;
				};
			}))
			.append("g");
		linksG = vis.append("g").attr("id", "links");
    	nodesG = vis.append("g").attr("id", "nodes");
		force.size([width, height])
				.linkDistance(function(d) { return 1/d.block_score + attract})
				.charge(function(d){
					if (d.has_link === 1) {
						return -50 - (attract * 3)
					} else {
						return -5 - (attract * 2)
					};
				})
				.friction(0.9);

		function redraw() {
			vis.attr("transform","translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
		};
		return updateNetwork();
	};

	updateNetwork = function() {
		curNodesData = filterNodes(allData.nodes);
		curLinksData = filterLinks(allData.links,curNodesData);
		

		force.nodes(curNodesData);
		updateNodes();

		force.links(curLinksData);
		updateLinks();

		force.on("tick",forceTick);
		if (moving){
			force.start();
		};
	};
	network.updateData = function(newData){
		allData = setupData(newData);
		stats(allData)
		link.remove();
		node.remove();
		moving = true;
		return updateNetwork();
	};
	network.toggleZoom = function(newZoom){
		force.stop();
		setZoom(newZoom);
		if (moving){
			force.start();
		};
	};
	network.toggleColor = function(newColor){
		link.remove();
		node.remove();
		setColor(newColor);
		updateNetwork();
	};
	network.toggleForce = function(newForce){
		if (newForce === "start"){
			force.start();
			moving = true;
		} else {
			force.stop();
			moving = false;
		};
	};
	network.toggleAttraction = function(newAttract){
		force.stop();
		setAttract(newAttract);
		force.charge(function(d){
					if (d.has_link === 1) {
						return -50 - (attract * 3)
					} else {
						return -5 - (attract * 2)
					};
				})
		force.start();
		updateNetwork()
	};
	setZoom = function(newZoom){
		zoom = newZoom;
		if (zoom === "zoom"){
			node.on("click", function(){
				return false
			})
		} else {
			node.call(force.drag)
		};
	};
	setColor = function(newColor){
		col = newColor;
	};
	setAttract = function(newAttract){
		attract = newAttract;
		force.linkDistance(function(d) { return 1/d.block_score + (attract * 2) });
	}
	setupData = function(data) {
		var nodesMap;
		nodesMap = mapNodes(data.nodes);
		data.nodes.forEach(function(n){
			var randomnumber;
			n.x = randomnumber = Math.floor(Math.random() * width);
      		n.y = randomnumber = Math.floor(Math.random() * height);
		})
	    data.links.forEach(function(l) {
	      l.source = nodesMap.get(l.source);
	      l.target = nodesMap.get(l.target);
	      return linkedByIndex["" + l.source.id + "," + l.target.id] = 1;
    	});
		return data;
	};
	mapNodes = function(nodes) {
		var nodesMap;
		nodesMap = d3.map();
		nodes.forEach(function(n) {
			return nodesMap.set(n.id, n);
		});
		return nodesMap;
	};
	filterNodes = function(allNodes) {
		//add filter in the future, this is now redundant
		var filteredNodes;
		filteredNodes = allNodes;
		return filteredNodes;
	};
	filterLinks = function(allLinks,curNodes) {
		//add filter in the future, this is now redundant
		curNodes = mapNodes(curNodes);
		return allLinks.filter(function(l) {
			return curNodes.get(l.source.id) && curNodes.get(l.target.id);
		});
		return allLinks
	};
	updateNodes = function() {
		node = nodesG.selectAll("circle.node").data(curNodesData, function(d) { return d.id });
		node.enter()
			.append("circle")
			.attr("class", "node")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.attr("r",5)
			.style("fill", function(d) { return nodeColours[d.species][col] })
			.style("stroke-width", 1.0);
		node.on("mouseover", showDetails).on("mouseout", hideDetails);
		return node.exit().remove();
	};
	updateLinks = function() {
		link = linksG.selectAll("line.link").data(curLinksData, function(d) {
			return "" + d.source.id + "_" + d.target.id;
		}); 
		link.enter()
			.append("line")
			.attr("class", "link")
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
		return link.exit().remove();
	};

	forceTick = function(e) {
    node.attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    });
    return link.attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });
  };
  var stats = function(data){
		var numNodes = 0;
		var numLinks = 0;
		var numClusters = 0;
		var nodesInClusters = 0;
		var clusterMap = {};
		var biggestCluster = 0;
		//$(".page-content").append("<div class='stats' id='stats'></div>");

		data.links.forEach(function(l){
			numNodes += 1;
		});
		data.nodes.forEach(function(n){
			numLinks += 1;
			numClusters = Math.max(numClusters,n.cluster)
			if (n.has_link === 1){
				nodesInClusters += 1;
			};
			if (n.cluster != 0){
				if (!(n.cluster in clusterMap)){
					clusterMap[n.cluster] = 0
				}
				clusterMap[n.cluster] += 1;
			};
		});
		for (var key in clusterMap){
			biggestCluster = Math.max(clusterMap[key],biggestCluster)
		}

		content = "<h3>Statistics</h3>"
		content += "<p># Nodes: "+numNodes+" "
		content += "<p># Edges: "+numLinks+"</p>"
		content += "<p># Clusters: "+numClusters+"</p>"
		content += "<p># Nodes in clusters: "+nodesInClusters+"</p>"
		content += "<p>Biggest cluster: "+biggestCluster+"</p>"
		$("#stats").html(content)
	};
	showDetails = function(d,i) {
		var content;
		content = '<p class="main"><a href="http://www.google.com/?#q=' + d.id + '" target="_blank">' + d.id + '</span></p>';
		content += '<hr class="tooltip-hr">';
		content += '<p class="main"><a href="http://www.google.com/?#q=' + nodeColours[d.species]['name'] + '" target="_blank">' + nodeColours[d.species]['name'] + '</span></a></p>';
		tooltip.showTooltip(content, d3.event);
	};
	hideDetails = function(d,i) {
		tooltip.hideTooltip();
	};
	return network;
};
/*
var activate = function(group, link) {
	d3.selectAll("#" + group + " a").classed("not_use",false);
  	d3.selectAll("#" + group + " a").classed("active", false);
  	return d3.select("#" + group + " #" + link).classed("active", true);
};

var deactivate = function(group) {
	d3.selectAll('#' + group + " a").classed("not_use",true);
}

$(function() {
	var zoom = true;
	var force = true;
	var attraction = true;
	var col = true;
	var myVis;
	var dataFile = "{{ site.baseurl }}/json/test.json";
	myVis = Network()
	$("#gene_select").on("change",function(d){
		dataFile = $(this).val();
		console.log(dataFile)
		return d3.json(dataFile, function(error,json) {
			if (error) return console.warn(error);
			return myVis.updateData(json);
		});
	});
	$("#vis_select").on("change",function(d){
		var newVis;
		newVis = $(this).val();
		if (newVis === "network"){
			zoom = true;
			force = true;
			attraction = true;
			col = true;
			myVis = Network();
		} else if (newVis === "arc"){
			zoom = false;
			force = false;
			attraction = false;
			col = true;
			myVis = Arc();
		} else {
			zoom = false;
			force = false;
			attraction = false;
			col = true;
			myVis = Tree();
		}
		return d3.json(dataFile,function(error,json){
			if (error) return console.warn(error);
			return myVis.updateData(json)
		});
	});
	if (zoom) {
		d3.selectAll("#zoom_select a").on("click",function(d){
			var newZoom;
			newZoom = d3.select(this).attr("id");
			activate("zoom_select",newZoom);
			return myNetwork.toggleZoom(newZoom);
		});
	} else {
		deactivate("zoom_select")
	};

	if (color) {
		d3.selectAll("#color_select a").on("click",function(d){
			var newColor;
			newColor = d3.select(this).attr("id");
			activate("color_select",newColor);
			return myNetwork.toggleColor(newColor);
		});
	} else {
		deactivate("color_select")
	};

	if (force) {
		d3.selectAll("#force_select a").on("click",function(d){
			var newForce;
			newForce = d3.select(this).attr("id");
			activate("force_select",newForce);
			return myNetwork.toggleForce(newForce);
		});
	} else {
		deactivate("force_select")
	};

	if (attraction) {
		d3.selectAll("#attraction_select input").on("change",function(d){
			var newAttract;
			newAttract = document.getElementById("attraction_select_id").value;
			d3.selectAll("#" + group + " input").classed("not_use",false);
			return myNetwork.toggleAttraction(newAttract);
		});
	} else {
		d3.selectAll("#" + group + " input").classed("not_use",true);
	};

	return d3.json(dataFile, function(error,json) {
		if (error) return console.warn(error);
		return myVis("#vis",json);
	});
});
*/





