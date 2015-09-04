---
---

var Arc = function() {
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
							"lj":{"color":"#a50f15","altcolor":"#636363","name":"Lotus japonicum"}, //Fabaceae, Fabales, red
							"rc":{"color":"#fb6a4a","altcolor":"#e6550d","name":"Ricinus communis"}, //Euphorbiaceae, Malpighiales, red
							"zm":{"color":"#238b45","altcolor":"#636363","name":"Zea mays"}, //Poaceae, Poales, green
							"ph":{"color":"#ef3b2c","altcolor":"#e6550d","name":"Phaseolus vulgaris"},//Fabaceae, Fabales, red
							"md":{"color":"#fee0d2","altcolor":"#e6550d","name":"Malus domestica"},// Rosaceae, Rosales, red
							"cr":{"color":"#ffffff","altcolor":"#636363","name":"Chlamydomonas reinhardtii"} 	};
	var width  = 500;           // width of svg image
	var height;// set based on number of nodes = 1000;           // height of svg image
	var margin = 20;            // amount of margin around plot area
	var pad = margin / 2;       // actual padding amount
	var radius = 4;             // fixed node radius
	var xfixed = pad + radius;  // y position for all nodes
	var arcplot; //function
	var allData = [];
	var nodesG; // nodesgroup
	var linksG; //linksgroup
	var showdetails;
	var hidedetails;
	var tooltip = Tooltip("vis-tooltip", 230); //tooltip.js
	var svg;
	var setColor; //function
	var color = "color";
    var MCL = "1.2";

	arcplot = function(selection,data){
		//var svg;
		var plot; 
		allData = setupData(data); // setupData maps node objects to links source/target
		stats(allData);
		height = allData.nodes.length * 10
		width = allData.nodes.length * 10
		svg = d3.select(selection)
					.append("svg")
					.attr("id","arc")
					.attr("width",width)
					.attr("height",height)
		plot = svg.append("g")
					.attr("id","plot")
					.attr("transform", "translate(" + pad + ", " + pad + ")");
		linksG = plot.append("g").attr("id", "links");
    	nodesG = plot.append("g").attr("id", "nodes");
		return update();
	};
	arcplot.updateData = function(newData){
		allData = setupData(newData);
		stats(allData);
		height = allData.nodes.length * 10
		width = allData.nodes.length * 10
		svg.attr("height",height)
			.attr("width",width)
		link.remove();
		node.remove();
		return update();
	};
	arcplot.toggleColor = function(newColor){
		link.remove();
		node.remove();
		setColor(newColor);
		update();
	};
	function update(){
		console.log('update')
		// must be done AFTER links are fixed
	    linearLayout(allData.nodes);

	    // draw links first, so nodes appear on top
	    drawLinks(allData.links);

	    // draw nodes last
	    drawNodes(allData.nodes);
	};
	setupData = function(data) {
		var nodesMap;
		nodesMap = mapNodes(data.nodes);
		//data.nodes.forEach(function(n){
		//	var randomnumber;
		//	n.x = randomnumber = Math.floor(Math.random() * width);
      	//	n.y = randomnumber = Math.floor(Math.random() * height);
      	//	//return n.radius = 5;
		//})
	    data.links.forEach(function(l) {
	      l.source = nodesMap.get(l.source);
	      l.target = nodesMap.get(l.target);
	      //return linkedByIndex["" + l.source.id + "," + l.target.id] = 1;
    	});
		return data;
	};

	setColor = function(newColor){
		color = newColor;
		//return update()
	};
	mapNodes = function(nodes) {
		var nodesMap;
		nodesMap = d3.map();
		nodes.forEach(function(n) {
			return nodesMap.set(n.id, n);
		});
		return nodesMap;
	};
	// Layout nodes linearly, sorted by group
	function linearLayout(nodes) {
	    // sort nodes by group
	    ///*
	    nodes.sort(function(a,b) {
	    	//return Math.floor((Math.random() * 100) + 1);
	    	return a.cluster - b.cluster;
	    })
		//*/

	    // used to scale node index to x position
	    var yscale = d3.scale.linear()
	        .domain([0, nodes.length - 1])
	        .range([radius, height - margin - radius]);

	    // calculate pixel location for each node
	    nodes.forEach(function(d, i) {
	        d.x = xfixed;
	        d.y = yscale(i);
	    });    
	}
	// Draws nodes on plot
	function drawNodes(nodes) {
		node = nodesG.selectAll("circle.node").data(allData.nodes, function(d) {
			return d.id;
		});
	    node.enter()
	        .append("circle")
	        .attr("class", "node")
	        .attr("id", function(d, i) { return d.name; })
	        .attr("cx", function(d, i) { return d.x; })
	        .attr("cy", function(d, i) { return d.y; })
	        .attr("r",  function(d, i) { return radius; })
	        .style("fill",   function(d, i) { return nodeColours[d.species][color]; })
	        .on("mouseover", showDetails)
	        .on("mouseout", hideDetails);
	    return node.exit().remove()
	}

	// Draws nice arcs for each link on plot
	function drawLinks(links) {
		link = linksG.selectAll("line.link").data(allData.links, function(d) {
			if ("block_score" in d) {
				return "" + d.source.id + "_" + d.target.id;
			};
		});
	    // scale to generate radians (just for lower-half of circle)
	    var radians = d3.scale.linear()
	        //.range([Math.PI / 2, 3 * Math.PI / 2]);
	        .range([0,Math.PI])
	    // path generator for arcs (uses polar coordinates)
	    var arc = d3.svg.line.radial()
	        .interpolate("basis")
	        .tension(0)
	        .angle(function(d) { return radians(d); });

	    // add links
	    link.enter()
	        .append("path")
	        .attr("class", "link")
	        .attr("transform", function(d, i) {
	            // arc will always be drawn around (0, 0)
	            // shift so (0, 0) will be between source and target
	            var xshift = xfixed;
	            var yshift = d.source.y + (d.target.y - d.source.y) / 2;
	            return "translate(" + xshift + ", " + yshift + ")";
	        })
	        .attr("d", function(d, i) {
	            // get x distance between source and target
	            var ydist = Math.abs(d.source.y - d.target.y);
	            // set arc radius based on y distance
	            arc.radius(ydist / 2);
	            // want to generate 1/3 as many points per pixel in y direction
	            var points = d3.range(0,Math.ceil(ydist / 3));
	            // set radian scale domain
	            radians.domain([0, points.length - 1]);
	            // return path for arc
	            return arc(points);
	        });
	};// end drawlinks

	showDetails = function(d,i) {
		var content;
		content = '<p class="main">' + d.id + '</p>';
		content += '<hr class="tooltip-hr">';
		content += '<p class="main">' + nodeColours[d.species]['name'] + '</p>';
		//content += '<hr class="tooltip-hr">';
		//content += '<p class="main">Cluster '+d.cluster+'</p>'
		tooltip.showTooltip(content, d3.event);
	};// end showdetails

	hideDetails = function(d,i) {
		tooltip.hideTooltip();
	};//end hidedetails

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
      console.log([d3.min(yvals),yscale(d3.min(yvals))]);
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
      console.log(coeff);

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


	return arcplot;
};
/*
var activate = function(group, link) {
  d3.selectAll("#" + group + " a").classed("active", false);
  return d3.select("#" + group + " #" + link).classed("active", true);
};
$(function(){
	myArc = arcDiagram()
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
		return myArc.toggleColor(newColor);
	});
	d3.json("{{ site.baseurl }}/json/test.json",function(error,json){
		if (error) return console.warn(error);
		return myArc("#vis",json);
	});
});
*/