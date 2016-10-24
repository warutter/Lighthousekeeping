//This is javascript for the lighthousekeeping page.

//We need to unpack the information into useful arrays

//get a set of dates and pages, labelled by ident number:
//dp= [ident,page,date]

var dp = []; //create dp array for population by script

//get a set of characters and plot points, labelled by ident, page, date:
//co = {character 1:[[ident 1, [page 1,...], date], [ident 2,...]], character 2:...}

var co = {}; //create co object for population by script

//get a set of places and plot points, labelled by lonlat, ident, page, date:
//po = {place 1: [lonlat, [plot points]}, where plot points is an array of arrays of the form [ident, [page 1, page 2,...], date]

var po = {}; //create po object for population by script


for(i=0; i < lhk.length; i++) { //for every object in the lhk array

	for(l=0;l < lhk[i].page.length;l++) { //for every page in selected obj.
		dp.push([lhk[i].ident,lhk[i].page[l], lhk[i].date]) //add array entry
	}; //close for loop--dp

	for(l=0;l < lhk[i].characters.length;l++) { //for every character in sel. obj.
		if (lhk[i].characters[l] in co) { //check if the character is already in co

			//console.log(lhk[i].characters[l] + " is in co"); //for debugging

			co[lhk[i].characters[l]].push([lhk[i].ident, lhk[i].page, lhk[i].date]); //added new plot point to character array.

			//console.log("added plot point for "+lhk[i].characters[l]);//for debug

		} else {//if the character isn't in co

			//console.log(lhk[i].characters[l] + " is not in co") //for debug

			co[lhk[i].characters[l]]=[[lhk[i].ident, lhk[i].page, lhk[i].date]];

			//console.log(lhk[i].characters[l] + "added to co w plot point") //for debug

		}; //created character array with new plot point
	}; //close for loop--co

	//Now for po, which doesn't need a second for loop:

	if (lhk[i].place in po) { //is the place in po?

		//console.log(lhk[i].place+" is in po") //for debug

		po[lhk[i].place][1].push([lhk[i].ident, lhk[i].page, lhk[i].date]); //add plot point to place in po.

		//console.log()

	} else { //place isn't in po

		//console.log(lhk[i].place+" isn't in po") //for debug

		po[lhk[i].place] = [lhk[i].lonlat,[[lhk[i].ident, lhk[i].page, lhk[i].date]]]; //add place to po object with lonlat and plot point

		//console.log("added "+lhk[i].place+" to po")

	}; //close else logic.

}; //close for loop


//console.log(dp); //debugging tool
//console.log(co); //debugging tool
//console.log(po); //debugging tool

//declare important drawing vars:

var pad = 20;

var w = 700; // slopeSvg width var

var h = 500 + 2 * pad; // slopeSvg height var

var dAxPlace = w/8; //this sets where the date axis will be in the slopeSvg

var pAxPlace =  7*w/8; //this sets where the age axis will be in the slopeSvg

var dateScale = d3.scaleLinear() //set scale for referencing dates
						.domain([1750, 2000]) //1750-2000 seems safe from book context
						.range([(h - 2 * pad),0]); //switched because d3 counts pixels from the top

var pageScale = d3.scaleLinear() //set scale for referencing pages
						.domain([1, 232]) //book has 232 pages
						.range([(h - 2 * pad),0]); //switched because d3 counts pixels from the top

//create svg in which we'll draw!

var slopeSvg = d3.select("body") //create svg for drawing our connections in body
					.append("svg")
					.attr("width", w)
					.attr("height", h);


//make lines with d3

var conns = slopeSvg.selectAll("line") //create our connections
					.data(dp)
					.enter()
					.append("line");

conns.attr("x1", dAxPlace) //tell lines where to start and end
	.attr("x2", pAxPlace)
	.attr("y1", function(d){ //y1 is the date
		return pad + dateScale(d[2]);
	})
	.attr("y2", function(d){ //y2 is the page
		return pad + pageScale(d[1]);
	})
	.attr("stroke","black") //black line
	.attr("stroke-width",.5); //width of line

//make axis for date:

var dateAxis = d3.axisLeft(dateScale)
					.tickFormat(d3.format("d"));

slopeSvg.append("g") //date axis in a new group
	.attr("class","axis") //give this group an axis class
	.attr("transform","translate(" + dAxPlace + "," + pad + ")") //place the axis
	.call(dateAxis);

//make axis for page:

var pageAxis = d3.axisRight(pageScale);

slopeSvg.append("g") //page axis in a new group
	.attr("class", "axis") //give this group an axis class
	.attr("transform","translate(" + pAxPlace + "," + pad + ")") //place the axis
	.call(pageAxis);

//label date axis

slopeSvg.append("text")
		.text("Date")
		.attr("x",dAxPlace - 22)
		.attr("y",10)
		.attr("font-size", "11px")
		.attr("font-family", "Playfair Display");

//label page axis

slopeSvg.append("text")
		.text("Page")
		.attr("x",pAxPlace)
		.attr("y",10)
		.attr("font-size", "11px")
		.attr("font-family", "Playfair Display");





