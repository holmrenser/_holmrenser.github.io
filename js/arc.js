var arcDiagram = function() {
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
	var width  = 960;           // width of svg image
	var height = 400;           // height of svg image
	var margin = 20;            // amount of margin around plot area
	var pad = margin / 2;       // actual padding amount
	var radius = 4;             // fixed node radius
	var yfixed = pad + radius;  // y position for all nodes
	var arcplot; //function
	var allData = [];

	arcplot = function(selection,data){
		var svg;
		var plot; 
		allData = setupData(data); // setupData maps node objects to links source/target
		svg = d3.select(selection)
					.append("svg")
					.attr("id","arc")
					.attr("width",width)
					.attr("height",height);
		plot = svg.append("g")
					.attr("id","plot")
					.attr("transform", "translate(" + pad + ", " + pad + ")");

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
		//nodesMap = mapNodes(data.nodes);
		//console.log(data)
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
	    //nodes.sort(function(a, b) {
	    //    return a.group - b.group;
	    //})

	    // used to scale node index to x position
	    var xscale = d3.scale.linear()
	        .domain([0, nodes.length - 1])
	        .range([radius, width - margin - radius]);

	    // calculate pixel location for each node
	    nodes.forEach(function(d, i) {
	        d.x = xscale(i);
	        d.y = yfixed;
	    });    
	}
	// Draws nodes on plot
	function drawNodes(nodes) {
	    // used to assign nodes color by group
	    //var color = d3.scale.category20();

	    d3.select("#plot").selectAll(".node")
	        .data(nodes)
	        .enter()
	        .append("circle")
	        .attr("class", "node")
	        .attr("id", function(d, i) { return d.name; })
	        .attr("cx", function(d, i) { return d.x; })
	        .attr("cy", function(d, i) { return d.y; })
	        .attr("r",  function(d, i) { return radius; })
	        .style("fill",   function(d, i) { return nodeColours[d.species]['color']; })
	        //.on("mouseover", function(d, i) { addTooltip(d3.select(this)); })
	        //.on("mouseout",  function(d, i) { d3.select("#tooltip").remove(); });
	}

	// Draws nice arcs for each link on plot
	function drawLinks(links) {
	    // scale to generate radians (just for lower-half of circle)
	    var radians = d3.scale.linear()
	        .range([Math.PI / 2, 3 * Math.PI / 2]);

	    // path generator for arcs (uses polar coordinates)
	    var arc = d3.svg.line.radial()
	        .interpolate("basis")
	        .tension(0)
	        .angle(function(d) { return radians(d); });

	    // add links
	    d3.select("#plot").selectAll(".link")
	        .data(links)
	        .enter()
	        .append("path")
	        .attr("class", "link")
	        .attr("transform", function(d, i) {
	            // arc will always be drawn around (0, 0)
	            // shift so (0, 0) will be between source and target
	            var xshift = d.source.x + (d.target.x - d.source.x) / 2;
	            var yshift = yfixed;
	            return "translate(" + xshift + ", " + yshift + ")";
	        })
	        .attr("d", function(d, i) {
	            // get x distance between source and target
	            var xdist = Math.abs(d.source.x - d.target.x);

	            // set arc radius based on x distance
	            arc.radius(xdist / 2);

	            // want to generate 1/3 as many points per pixel in x direction
	            var points = d3.range(0, Math.ceil(xdist / 3));

	            // set radian scale domain
	            radians.domain([0, points.length - 1]);

	            // return path for arc
	            return arc(points);
	        });
	}
	return arcplot;
};
$(function(){
	myArc = arcDiagram()
	d3.json("test.json",function(error,json){
		if (error) return console.warn(error);
		return myArc("#vis",json);
	});
});