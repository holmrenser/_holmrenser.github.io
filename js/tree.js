---
---
var Tree = function() {
	//colors from http://colorbrewer2.org/
    var nodeColours = {		"al":{"color":"#084594","altcolor":"#636363","name":"Arabidopsis lyrata"}, //Brassicaceae, Brassicales, blue
							"at":{"color":"#2171b5","altcolor":"#636363","name":"Arabidopsis thaliana"}, //Brassicaceae, Brassicales, blue
							"ar":{"color":"#252525","altcolor":"#636363","name":"Amborella trichopoda"}, //Amborellaceae, Magnoliales, black
							"br":{"color":"#4292c6","altcolor":"#636363","name":"Brassica rapa"}, //Brassicaceae, Brassicales, blue
							"cp":{"color":"#6baed6","altcolor":"#636363","name":"Carica papaya"}, //Caricaceae, Brassicales, blue
							"fv":{"color":"#fcbba1","altcolor":"#e6550d","name":"Fragaria vesca"}, //Rosaceae, Rosales, red
							"gm":{"color":"#cb181d","altcolor":"#e6550d","name":"Glycine max"}, //Fabaceae, Fabales, red
							"gr":{"color":"#9ecae1","altcolor":"#636363","name":"Gossipium raimondii"}, //Malvaceae, Malvales, blue
							"mt":{"color":"#67000d","altcolor":"#e6550d","name":"Medicago truncatula"}, //Fabaceae, Fabales, red
							"pt":{"color":"#fc9272","altcolor":"#e6550d","name":"Populus trichocarpa"}, //Salicaceae, Malpighiales, red
							"sl":{"color":"#ffffb2","altcolor":"#636363","name":"Solanum lycopersicum"}, //Solanaceae, Solanales, yellow
							"st":{"color":"#fed976","altcolor":"#636363","name":"Solanum tuberosum"}, //Solanaceae, Solanales, yellow
							"ta":{"color":"#c6dbef","altcolor":"#636363","name":"Theobroma cacao"}, //Malvaceae, Malvales, blue
							"vv":{"color":"#4a1486","altcolor":"#636363","name":"Vitis vinifera"}, //Vitaceae, Vitales, purple
							"os":{"color":"#bae4b3","altcolor":"#636363","name":"Oryza sativa"}, //Poaceae, Poales, green
							"lj":{"color":"#a50f15","altcolor":"#e6550d","name":"Lotus japonicum"}, //Fabaceae, Fabales, red
							"rc":{"color":"#fb6a4a","altcolor":"#e6550d","name":"Ricinus communis"}, //Euphorbiaceae, Malpighiales, red
							"zm":{"color":"#238b45","altcolor":"#636363","name":"Zea mays"}, //Poaceae, Poales, green
							"ph":{"color":"#ef3b2c","altcolor":"#e6550d","name":"Phaseolus vulgaris"},//Fabaceae, Fabales, red
							"md":{"color":"#fee0d2","altcolor":"#e6550d","name":"Malus domestica"},// Rosaceae, Rosales, red
							"cr":{"color":"#ffffff","altcolor":"#636363","name":"Chlamydomonas reinhardtii"} 	};
	var mapTree;
    var mapNodes;
	//var w = 200;					 // width of svg image
	var h;// set based on number of nodes = 1000;					 // height of svg image
	var margin = {top:20,right:20,bottom:30,left:60};		// amount of margin around plot area
	var ww = document.getElementById("vis").clientWidth;
    var w = ww - margin.left - margin.right;
    var allData = [];
	var nodesG; // tree nodes group
	var branchG; //tree links group
    var arcsG; //arcs group
	var showDetails;
	var hideDetails;
	var tooltip = Tooltip("vis-tooltip", 230); //tooltip.js
	var svg;
	var setColor; //function
	var color = "color";
    var MCL = "1.2";
    var curNodesData;
    var curBranchData;
    var curArcsData;
    var filterNodes;
    var updateNodes;
    var filterBranches;
    var updateBranches;
    var filterArcs;
    var updateArcs;
    var statistics;
    var tree = d3.layout.cluster();
    var vis;
    var branch;
    var node;
    //var leafnode;
    var arc;
    var curTreeData;
    var rightAngleDiagonal;
    var setupData;
    var updateTree;
    var setMCL;
    var treeplot;
    var col = "color";
    var stats;
    var legend;
    var zoom = d3.behavior.zoom();
    var factor = 1;

	treeplot = function(selection,data){
		//var svg;

		//stats(data);
        console.log(data);
        allData = setupData(data);
        var nodesMap = mapNodes(allData.nodes);
		h = allData.nodes.length * 8 / factor;
        /*
        var nodesMap = mapNodes(data.nodes);
        data.links.forEach(function(l){
            l.source = nodesMap.get(l.source);
	        l.target = nodesMap.get(l.target);
        });
        */
        vis = d3.select(selection).append("svg")
			.attr("width", w)
			.attr("height", h + 30)
            .append("g")
			.attr("transform", "translate(30, 20)");


        nodesG = vis.append("g").attr("id","nodes");
        branchG = vis.append("g").attr("id","links");
        arcsG = vis.append("g").attr("id","arcs");

        return updateTree();
	};

	treeplot.updateData = function(newData){
        allData = setupData(newData);
        branch.remove();
        node.remove();
        arc.remove();
        return updateTree();
		//return treeplot("vis",newData)
	};
    treeplot.toggleMCL = function(newMCL){
        setMCL(newMCL);
		updateTree();
    };
    treeplot.toggleColor = function(newColor){
        node.remove();
        setColor(newColor);
        updateTree()
    };
    treeplot.zoom = function(zoomEvent){

        console.log(zoomEvent);
        var x = d3.scale.linear()
            .domain([0, w])
            .range([0, w]);

        var y = d3.scale.linear()
            .domain([0, h])
            .range([0, h]);

        zoom.on("zoom",zoomed);



        function zoomed(){
            var temp = zoom.translate();
            console.log("translate",temp);
            console.log(y(temp[1]));
            vis.attr("transform","translate("+zoom.translate()+")");// scale("+zoom.scale()+")");
            //branchG.selectAll(".branch").attr("transform","translate("+zoom.translate()+")");
            //nodesG.selectAll(".node").attr("transform","translate("+zoom.translate()+")");
            //arcsG.selectAll(".arc").attr("transform","translate("+zoom.translate()+")");

        }

        function zoomByFactor(factor) {
            var scale = zoom.scale();
            var extent = zoom.scaleExtent();
            var newScale = scale * factor;
            console.log(scale,newScale);
            if (extent[0] <= newScale && newScale <= extent[1]) {
                var t = zoom.translate();
                var c = [w / 2, h / 2];
                console.log(c[1] + (t[1] - c[1]));

                zoom
                    .scale(newScale)
                    .translate(
                   //    [c[0] + (t[0] - c[0]) / scale * newScale,
                    [30,
                        c[1] + (t[1] - c[1]) / scale * newScale  ])
                    .event(vis.transition().duration(450));
            }
        }

        function zoomIn() { zoomByFactor(1.2); }
        function zoomOut() { zoomByFactor(0.8); }

        if (zoomEvent === "target"){
            //zoom to target
        } else if (zoomEvent === "+1"){
            factor /= 1.5;

            //h = h*1.2;
            //vis.call(zoomIn);
            updateTree();

        } else {
            factor *= 1.5;

            //h = h*0.8;
            //vis.call(zoomOut);
            updateTree()

        }
        console.log(factor);
        updateTree();
    };
    updateTree = function(){
        var newick;
        var treeMap;
        //tree.size([w,h]);
        curNodesData = allData.nodes;
        curArcsData = filterArcs(allData.links,curNodesData);
        h = allData.nodes.length * 10 / factor;
        tree.size([h, w/2])
            //.sort(function(node) { console.log(node);return node.children ? node.children.length : -1; })
            .sort(function(a,b){ return d3.ascending(a.name, b.name); })
            .separation(function separation(a, b) {
              return a.parent == b.parent ? 1 : 1;
            })
            .children(function(node) {
                return node.branchset
            });
        d3.select("#vis").select("svg").attr("height",h+30).attr("width",3*w);
        statistics = stats(allData);
        legend(allData);
        newick = Newick.parse(allData.tree); //must include Newick.js!

        curTreeData = tree(newick);
        //scaleBranchLengths(curTreeData);
        $.each(curTreeData,function(i,n){
            console.log(n);
            n.x /= factor;
        });
        console.log(curTreeData);

        curBranchData = tree.links(curTreeData);

        updateBranches(curBranchData);

        updateNodes(curTreeData,curNodesData);

        updateArcs(curArcsData,curTreeData);
        return false;
    };

    setupData = function(data){
        var nodesMap = mapNodes(data.nodes);
        $.each(data.links,function(i,l){
            l.source = nodesMap.get(l.source);
            l.target = nodesMap.get(l.target);
        });
        return data
    };

    setMCL = function(newMCL){
		if (newMCL === "2"){
			newMCL = "2.0"
		} else if (newMCL === "4"){
			newMCL = "4.0"
		} else if (newMCL === "6") {
			newMCL = "6.0"
		} else if (newMCL === "8"){
			newMCL = "8.0"
		}
        arc.remove();
		//node.remove();
		MCL = newMCL
	};

    setColor = function(newColor){
      col = newColor;
    };

    filterArcs = function(links,nodes){
        var filteredLinks;
        var nodesMap = mapNodes(nodes);
		filteredLinks =  links.filter(function(l) {
			if ("block_score" in l) {
				var source_cluster = l.source['clusters'][MCL];
				var target_cluster = l.target['clusters'][MCL];
				if (source_cluster > 0 && target_cluster > 0 && source_cluster === target_cluster) {
					return nodesMap.get(l.source.id) && nodesMap.get(l.target.id);
				} else {
					return false
				}
			} else {
				return false
			}
		});
        return filteredLinks;
    };

    mapNodes = function (nodes) {
        var nodesMap;
        nodesMap = d3.map();
        $.each(nodes,function(i,n) {
            nodesMap.set(n.id, n);
        });
        return nodesMap;
    };

    mapTree = function (newick) {
        var treeMap;
        treeMap = d3.map();
        $.each(newick, function (i,n) {
            return treeMap.set(n.name, n);
        });
        return treeMap;
    };

	rightAngleDiagonal = function() {
		var projection = function(d) { return [d.y, d.x]; };
		var path = function(pathData) {
			return "M" + pathData[0] + ' ' + pathData[1] + " " + pathData[2];
		};
		function diagonal(diagonalPath, i) {
			var source = diagonalPath.source,
				target = diagonalPath.target,
				midpointX = (source.x + target.x) / 2,
				midpointY = (source.y + target.y) / 2,
				pathData = [source, {x: target.x , y: source.y }, target];
			pathData = pathData.map(projection);
			return path(pathData)
		}
		diagonal.projection = function(x) {
			if (!arguments.length) return projection;
			projection = x;
			return diagonal;
		};
		diagonal.path = function(x) {
			if (!arguments.length) return path;
			path = x;
			return diagonal;
		};
		return diagonal;
	};

	function scaleBranchLengths(nodes, w) {
		// Visit all nodes and adjust y pos width distance metric
		var visitPreOrder = function(root, callback) {
			callback(root);
			if (root.children) {
				for (var i = root.children.length - 1; i >= 0; i--){
					visitPreOrder(root.children[i], callback)
				}
			}
		};
		visitPreOrder(nodes[0], function(node) {
				node.rootDist = (node.parent ? node.parent.rootDist : 0) + (node.length || 0)
		});
		var rootDists = nodes.map(function(n) { return n.rootDist; });
		var yscale = d3.scale.linear()
			.domain([0, d3.max(rootDists)])
			.range([0, w]);
		visitPreOrder(nodes[0], function(node) {
				node.y = yscale(node.rootDist)
		});
		return yscale
	}

    updateArcs = function(arcData,curTreeData) {
        var minblock = 99999999;
        var maxblock = 0;

        $.each(allData.links,function(i,l){
            minblock = Math.min([minblock, l.block_score]);
            maxblock = Math.max([maxblock, l.block_score]);
        });

        var treeMap = mapTree(curTreeData);
        $.each(allData.nodes,function(i,n){
            n.y = treeMap.get(n.id).x;
            n.x = treeMap.get(n.id).y;
        });
	    // scale to generate radians (just for lower-half of circle)
	    var radians = d3.scale.linear()
	        .range([0,Math.PI]);

	    // path generator for arcs (uses polar coordinates)
	    var arcDraw = d3.svg.line.radial()
	        .interpolate("basis")
	        .tension(0)
	        .angle(function(d) { return radians(d); });

	    // add links
	    arc = arcsG.selectAll(".arc").data(arcData);
        //arc = vis.selectAll(".arc").data(arcData);
        arc.enter()
	        .append("path")
	        .attr("class", "arc")
	        .attr("transform", function(d, i) {
	            // arc will always be drawn around (0, 0)
	            // shift so (0, 0) will be between source and target
	            var xshift = (w / 2) + 5;
	            var yshift = d.source.y + (d.target.y - d.source.y) / 2;
	            return "translate(" + xshift  + ", " + yshift + ")";
	        })
	        .attr("d", function(d, i) {
	            // get y distance between source and target
	            var ydist = Math.abs(d.source.y - d.target.y);

	            // set arc radius based on y distance
	            arcDraw.radius(ydist / 2);

	            // want to generate 1/3 as many points per pixel in y direction
	            var points = d3.range(0, Math.ceil(ydist / 3));

	            // set radian scale domain
	            radians.domain([0, points.length - 1]);

	            // return path for arc
	            return arcDraw(points);
	        })
            .attr("stroke","black")
            .attr("stroke-width",1);
        return arc.exit().remove()
	};

    updateNodes = function(treeNodes,networkNodes){
        var nodesMap = mapNodes(networkNodes);
        node = nodesG.selectAll("g.node").data(treeNodes);
        //node = vis.selectAll(".node").data(treeNodes);
        node
			.enter().append("svg:g")
			.attr("class", function(n) {
				if (n.children) {
				if (n.depth == 0) {
					return "root node"
				} else {
					return "inner node"
				}
				} else {
				return "leaf node"
				}
			})
			.attr("transform", function(d) { return "translate(" + w / 2 + "," + d.x + ")"; });

        var leafnode = nodesG.selectAll('g.leaf.node')
            .append("path")
            .attr("d",d3.svg.symbol().type(function(n){
                if (!("anchor" in nodesMap.get(n.name))){
                    return "circle"
                }
                if (nodesMap.get(n.name)["anchor"] === 0){
                    return "circle"
                } else {
                    return "cross"
                }
            }))
            .style("fill",function(n){
                var sp = nodesMap.get(n.name).species;
				return nodeColours[sp][col]
            });
            leafnode.on("mouseover",showDetails).on("mouseout",hideDetails);
        return node.exit().remove()
    };

    updateBranches = function(branchData){
        var diagonal = rightAngleDiagonal();
        branch = branchG.selectAll("path.link").data(branchData);
        //branch = vis.selectAll(".link").data(branchData);
        branch
            .enter()
			.append("svg:path")
			.attr("class", "link")
			.attr("d", diagonal)
			.attr("fill", "#111")
			.attr("stroke", "#111")
			.attr("stroke-width", "2px");
        return branch.exit().remove()
    };

	showDetails = function(d,i) {
        var nodesMap = mapNodes(allData.nodes);
        var node = nodesMap.get(d.name);
		var content;
		content = '<p class="main">' + node["id"] + '</p>';
		content += '<hr class="tooltip-hr">';
		content += '<p class="main">' + nodeColours[node["species"]]["name"] + '</p>';
		tooltip.showTooltip(content, d3.event);
	};

	hideDetails = function(d,i) {
		tooltip.hideTooltip();
	};

    stats = function(data){
      var content;
      var margin = {top:20,right:20,bottom:30,left:60};
      var statsw = 500 - margin.left - margin.right;
      var statsh = 300 - margin.top - margin.bottom;
      var numNodes = 0;
      var numLinks = 0;
      var numClusters = 0;
      var nodesInClusters = 0;
      var clusterMap = {};
      var biggestCluster = 0;
      var statistics = {};
      var xvals = [];
      var yvals = [];
      var pairs = [];
      var scatter; //ski skapadap scatterplot
      var trendline;//the trendline
      var xscale = d3.scale.sqrt().range([0,statsw]);
      var xmap = function(d){ return xscale(d[0]);};
      var xaxis = d3.svg.axis().scale(xscale).orient("botom").ticks(5);
      var yscale = d3.scale.sqrt().range([statsh,0]);
      var ymap = function(d){ return yscale(d[1]);};
      var yaxis = d3.svg.axis().scale(yscale).orient("left").ticks(6);

      function leastSquares(xSeries, ySeries) { //from http://bl.ocks.org/benvandyke/8459843
          var reduceSumFunc = function(prev, cur) { return prev + cur; };
          var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
          var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;
          var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
              .reduce(reduceSumFunc);
          var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
              .reduce(reduceSumFunc);
          var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
              .reduce(reduceSumFunc);

          var slope = ssXY / ssXX;
          var intercept = yBar - (xBar * slope);
          var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

          return [slope, intercept, rSquare];
      }

      data.links.forEach(function(l){
          if ("block_score" in l){
              var source_cluster = l.source['clusters'][MCL];
              var target_cluster = l.target['clusters'][MCL];
              if (source_cluster > 0 && target_cluster > 0 && source_cluster === target_cluster){
                  numLinks += 1;
                  yvals.push(parseInt(l.block_score));
                  xvals.push(l.distance);
                  //pairs.push([l.block_score, l.distance])
                  pairs.push([l.distance, parseInt(l.block_score)])
              }
          }
	  });
      //xscale.domain([d3.min(xvals)-1,d3.max(xvals)+1]);
      xscale.domain([0,d3.max(xvals)+1]);
      yscale.domain([d3.min(yvals)-1,d3.max(yvals)+1]);
      //console.log([d3.min(yvals),yscale(d3.min(yvals))]);
	  data.nodes.forEach(function(n){
          numNodes += 1;
          numClusters = Math.max(numClusters,n['clusters'][MCL]);
		  if (n['clusters'][MCL] > 0){
              nodesInClusters += 1;
              if (!(n['clusters'][MCL] in clusterMap)){
			       clusterMap[n['clusters'][MCL]] = 0
              }
			  clusterMap[n['clusters'][MCL]] += 1
          }
      });
      for (var key in clusterMap){
		  biggestCluster = Math.max(clusterMap[key],biggestCluster)
      }
      content = "<p># Nodes: "+numNodes+" ";
      content += "<p># Edges: "+numLinks+"</p>";
      content += "<p># Clusters: "+numClusters+"</p>";
      content += "<p># Nodes in clusters: "+nodesInClusters+"</p>";
      content += "<p>Biggest cluster: "+biggestCluster+"</p>";
      $("#numbers").html(content);
      //initialize plot
      d3.selectAll("#scatter svg").remove();
      scatter = d3.select("#scatter")
          .append("svg")
          .attr("width",statsw + margin.left + margin.right)
          .attr("height",statsh + margin.top + margin.bottom)
          .append("g")
          .attr("transform","translate("+ margin.left + "," + margin.top + ")");
      //prepare x
      scatter.append("g")
          .attr("class","axis")
          .attr("transform","translate(0,"+statsh+")")
          .call(xaxis)
          .append("text")
          .attr("class","label")
          .attr("x",statsw)
          .attr("y",-6)
          .style("text-anchor","end")
          .text("Distance");
      //prepare y
      scatter.append("g")
          .attr("class","axis")
          .call(yaxis)
          .append("text")
          .attr("class","label")
          .attr("transform","rotate(-90)")
          .attr("y",6)
          .attr("dy",".71em")
          .style("text-anchor","end")
          .text("block size");
      //start plotting dots
      scatter.selectAll(".dot")
          .data(pairs)
          .enter().append("circle")
          .attr("class","dot")
          .attr("r",3)
          .attr("cx",xmap)
          .attr("cy",ymap)
          .style("fill","red");

      //get regression data
      coeff = leastSquares(xvals,yvals);

      var x1 = d3.min(xvals);
      var x2 = d3.max(xvals);
      var y1 = x1 * coeff[0] + coeff[1];
      var y2 = x2 * coeff[0] + coeff[1];
      var trendData = [[x1,y1,x2,y2]];

      trendline = scatter.selectAll(".trendline")
          .data(trendData);
      trendline.enter()
			.append("line")
			.attr("class", "trendline")
			.attr("x1", function(d) { return xscale(d[0]); })
			.attr("y1", function(d) { return yscale(d[1]); })
			.attr("x2", function(d) { return xscale(d[2]); })
			.attr("y2", function(d) { return yscale(d[3]); })
			.attr("stroke", "black")
			.attr("stroke-width", 1);
      //display equation and r-square
      scatter.append("text")
          .text("eq: "+coeff[0]+"x + "+coeff[1])
          .attr("class","text-label")
          .attr("x",function(d){return xscale(x2) - 30})
          .attr("y",function(d){return yscale(d3.max(yvals)) - 30 });

      statistics['numNodes'] = numNodes;
      statistics['numLinks'] = numLinks;
      statistics['numCLusters'] = numClusters;
      statistics['nodesInClusters'] = nodesInClusters;
      statistics['biggestCluster'] = biggestCluster;
      return statistics
	};

    legend = function(data){
        var xpos = 0;
        var ypos = 15;
        var plotdata = [];
        $.each(nodeColours,function(i,d){
            //console.log(d)
            xpos += 25;
            d["x"] = xpos;
            d["count"] = 0;
        });

        $.each(data.nodes,function(i,d){
            nodeColours[d.species]["count"] += 1;
        });
        $.each(nodeColours,function(i,d){
            d.species = i;
            plotdata.push(d)
        });

        d3.selectAll("#legend_data svg").remove();
        var l = d3.selectAll("#legend_data").append("svg")
            .attr("width",3*w)
            .attr("height",50);

        var legendplot = l.append("g").selectAll(".node")
            .data(plotdata)
            .enter()
            .append("circle")
            .attr("class","node")
            .attr("cx", function(d) { return d.x; })
			.attr("cy", ypos)
			.attr("r",10)
            .style("fill",function(d){return d[col]})
            .style("stroke-width",1)
            .style("stroke","black");
        var text = l.append("g").selectAll("text")
            .data(plotdata)
            .enter().append("text")
            .attr("x",function(d){return d.x-5})
            .attr("y",ypos + 5)
            .text(function(d){return d.count})
    };

	return treeplot;
};
/*
var activate = function(group, link) {
	d3.selectAll("#" + group + " a").classed("active", false);
	return d3.select("#" + group + " #" + link).classed("active", true);
};
$(function(){
	myTree = Tree()
	$("#gene_select").on("change",function(d){
		var geneFile;
		geneFile = $(this).val();
		console.log(geneFile)
		return d3.json(geneFile, function(error,json) {
			if (error) return console.warn(error);
			return myArc.updateData(json);
		});
	});
	d3.selectAll("#color_select a").on("click",function(d){
		var newColor;
		newColor = d3.select(this).attr("id");
		console.log(newColor)
		activate("color_select",newColor);
		return myTree.toggleColor(newColor);
	});
	d3.json("{{ site.baseurl }}/json/Lj_NENA.network.json",function(error,json){
		if (error) return console.warn(error);
		return myTree("#vis",json);
	});
});
*/