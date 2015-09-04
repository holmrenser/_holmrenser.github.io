---
---
//var tooltip = Tooltip("vis-tooltip", 230); //tooltip.js

var showstats = function(){

};


var activate = function(group, link) {
	d3.selectAll("#" + group + " a").classed("not_use",false);
  	d3.selectAll("#" + group + " a").classed("active", false);
  	return d3.select("#" + group + " #" + link).classed("active", true);
};

var deactivate = function(group) {
	d3.selectAll('#' + group + " a").classed("not_use",true);
};

$(document).ready(function(){
        $("#metatable").tablesorter();
});


$(window).load(function() {
	var zoom = true;
	var force = true;
	var attraction = true;
	var col = true;
	var mcl = true;
	var myVis;
	var dataFile = "{{ site.baseurl }}/json/{{ site.data.index[0].file }}"; //"{{ site.baseurl }}/json/test.json";
	myVis = Network();
    $("#stats .stats-icon").click(function(){
        $("#scatter").toggleClass("hide");
        $("#numbers").toggleClass("hide");
        return false
    });
	$("#legend .stats-icon").click(function(){
        $("#legend_data").toggleClass("hide");
        //$(".numbers").toggleClass("inactive")
        return false
    });
    $("#controlselect .stats-icon").click(function(){
        $("#buttons").toggleClass("hide");
        $("#sliders").toggleClass("hide");
        return false
    });

    $(".treezoom").click(function(){
        var zoomEvent = $(this).data("value");
        return myVis.zoom(zoomEvent);
    });

	$("#gene_select").on("change",function(d){
		dataFile = $(this).val();
		console.log(dataFile);
		return d3.json(dataFile, function(error,json) {
			if (error) return console.warn(error);
			return myVis.updateData(json);
		});
	});
	$("#vis_select").on("change",function(d){
		var newVis;
		newVis = $(this).val();
		d3.selectAll("#vis svg").remove();
		d3.selectAll("#tooltip").remove();
		if (newVis === "network"){
			zoom = true;
			force = true;
			attraction = true;
			col = true;
			mcl = true;
			myVis = Network();
		} else if (newVis === "arc"){
			zoom = false;
			force = false;
			attraction = false;
			col = true;
            mcl = true;
			myVis = Arc();
		} else if (newVis === "tree"){
			zoom = false;
			force = false;
			attraction = false;
			col = true;
            mcl = true;
			myVis = Tree();
		} else {
			console.log("Switching failed")
		}
		return d3.json(dataFile,function(error,json){
			if (error) return console.warn(error);
			return myVis("#vis",json)
		});
	});
	if (zoom) {
		d3.selectAll("#zoom_select a").on("click",function(d){
			var newZoom;
			newZoom = d3.select(this).attr("id");
			//activate("zoom_select",newZoom);
            $("#zoom_select a").toggleClass("active");
			return myVis.toggleZoom(newZoom);

		});
	} else {
		//deactivate("zoom_select")
	}

	if (col) {
		d3.selectAll("#color_select a").on("click",function(d){
			var newColor;
			newColor = d3.select(this).attr("id");
			activate("color_select",newColor);
			return myVis.toggleColor(newColor);
		});
	} else {
		deactivate("color_select")
	}

	if (force) {
		d3.selectAll("#force_select a").on("click",function(d){
			var newForce;
			newForce = d3.select(this).attr("id");
			activate("force_select",newForce);
			return myVis.toggleForce(newForce);
		});
	} else {
		deactivate("force_select")
	}

	if (attraction) {
		d3.selectAll("#attraction_select input").on("change",function(d){
			var newAttract;
			newAttract = document.getElementById("attraction_select_id").value;
			//document.getElementById("attraction_value").set("value",newAttract);
			//d3.selectAll("#" + group + " input").classed("not_use",false);
			return myVis.toggleAttraction(newAttract);
		});
	} else {
		d3.selectAll("#" + group + " input").classed("not_use",true);
	}
	d3.selectAll("#mcl_select input").on("change",function(d){
		var newMCL;
		newMCL = document.getElementById("mcl_select_id").value;
		return myVis.toggleMCL(newMCL);
	});

	return d3.json(dataFile, function(error,json) {
		if (error) return console.warn(error);
		return myVis("#vis",json);
	});
});
