const svgEl = document.getElementById("chart")
const width = svgEl.getAttribute('width')
const height = svgEl.getAttribute('height')
const hpadding = 98 //orizzontale
const vpadding = 50 //verticale
var svg = d3.select('#chart')
var co2_color = "#990808"
var metri_color = '#123F99'
var co2_color_testo = "#dfe302"
var metri_color_testo = "#11E1FF"
const data = d3.csvParse(dati, d => {
	return {
        Product : d.Product,
        Land: +d.Land,
		Animal_Feed : +d.Animal_Feed,
		Farm : +d.Farm,
        Processing: +d.Processing,
        Transport: +d.Transport,
        Packging : +d.Packging,
        Retail : +d.Retail,
        Total_emissions: +d.Total_emissions,
        Metri_kgco2 : +d.Metri_kgco2
	}
})

function shadeColor(color, percent) {

	var R = parseInt(color.substring(1,3),16);
	var G = parseInt(color.substring(3,5),16);
	var B = parseInt(color.substring(5,7),16);

	R = parseInt(R * (100 + percent) / 100);
	G = parseInt(G * (100 + percent) / 100);
	B = parseInt(B * (100 + percent) / 100);

	R = (R<255)?R:255;  
	G = (G<255)?G:255;  
	B = (B<255)?B:255;  

	var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
	var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
	var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

	return "#"+RR+GG+BB;
}

var parseTime = d3.timeParse("%Y-%m-%d");
function scala( tipo, dominio, posizione ){
    switch (posizione){
        case "v":
            switch (tipo){
                case "nominale": var scala  = d3.scalePoint()
                .domain(dominio)
                .range([height- vpadding, vpadding]);
                break;
                case "lineare": var scala  =  d3.scaleLinear().domain(dominio)
                .range([height- vpadding, vpadding]);
                break;
                case "temporale": var scala  = d3.scaleTime().domain(dominio)
                .range([height- vpadding, vpadding]);
            }
            break;
      

        case "h":
            switch (tipo){
                case "nominale": var scala  = d3.scalePoint()
                .domain(dominio)
                .range([ hpadding, width- hpadding]);
                break;
                case "lineare": var scala  =  d3.scaleLinear().domain(dominio)
                .range([ hpadding, width- hpadding]);
                break;
                case "temporale": var scala  = d3.scaleTime().domain(dominio)
                .range([ hpadding, width- hpadding]);

            }
    }
    return scala
} 
function assi (posizione, scala, freccia, value, titolo, formato, ticks){
switch( posizione){
    //sinistra
    case "left": var asse  = d3.axisLeft(scala)
    .tickFormat(formato)
    .ticks(ticks);
    svg
	.append('g')
	.attr('transform', `translate(${hpadding}, 0)`)
	.call(asse);
    if(freccia)
    svg.append("g")
	.attr("transform", "translate(" + (hpadding - 50) + "," +  ((scala(value)- 10))+ ")")
	.append("path")
	 .attr("d", "M 50,0 55,12 45,12 z")

    svg.append("g")

     .attr("transform", "translate(" + `${hpadding-50}` + "," + ((height/2) +  20)+ ")")
     .append("text")
     .attr("font-size", "14px").html(titolo)
     .attr("transform", "rotate(-90)")
    break;
//destra
    case "right": var asse  = d3.axisRight(scala) 
    .tickFormat(formato)
    .ticks(ticks);

    svg
	.append('g')
	.attr('transform', `translate(${width- hpadding}, 0)`)
	.call(asse);

    if(freccia)
    svg.append("g")
	.attr("transform", "translate(" + (width- hpadding - 50) + "," +  ((scala(value)- 10))+ ")")
	.append("path")
	 .attr("d", "M 50,0 55,12 45,12 z")

    svg.append("g")
	.attr("transform", "translate(" + `${width-30}` + "," + (height/2)+ ")")
	.append("text")
	.attr("font-size", "14px").html(titolo)
	.attr("transform", "rotate(-90)")
    break;
//sopra
    case "top": 
    var asse  = d3.axisTop(scala) 
    .tickFormat(formato)
    .ticks(ticks);

    svg
	.append('g')
	.attr("transform", "translate(" + (0) + "," + (vpadding) + ")")
	.call(asse);

    if(freccia)
    svg.append("g")
	.attr("transform", "translate(" + ((scala(value)- 50)) + "," + (vpadding -5) + ")")
	.append("path")
	 .attr("d", "M 50,0 60,6 50,12 z")

     svg.append("g")
     .attr("transform", "translate(" + `${width/2}` + "," + (vpadding - 30)+ ")")
     .append("text")
     .attr("font-size", "14px").html(titolo)
    break;
//sotto
    case "bottom": var asse  = d3.axisBottom(scala)
    .tickFormat(formato)
    .ticks(ticks)

    svg
	.append('g')
	.attr("transform", "translate(" + (0) + "," + (height- vpadding) + ")")
	.call(asse);

    if(freccia)
    svg.append("g")
	.attr("transform", "translate(" + ((scala(value) - 50)) + "," + (height- vpadding- 5) + ")")
	.append("path")
	 .attr("d", "M 50,0 60,6 50,12 z")
    
     svg.append("g")
     .attr("transform", "translate(" + `${width/2}` + "," + (height-10)+ ")")
     .append("text")
     .attr("font-size", "14px").text(titolo)
}

}

//var scala_nominale_orizzontale = scala("nominale", ["", "c", "i", "a", "o", " "], "h") //scala nominale orizzontale
//var scala_nominale_verticale = scala("nominale", ["", "c", "i", "a", "o", " "], "v") //scala nominale verticale 

//var scala_lineare_orizzontale =  scala("lineare", [0 ,100000], "h")
//var scala_lineare_verticale  = scala("lineare",[0 ,100000], "v")

//var scala_temporale_orizzontale = scala("temporale" , [parseTime("2022-01-01"), parseTime("2024-01-01")], "h")
//var scala_temporale_verticale = scala("temporale" , [parseTime("2022-01-01"), parseTime("2024-01-01")], "v")

var metri_quadri = scala("lineare",[0 ,400], "v")
var co2 = scala("lineare",[0 ,100], "v")
var prodotti = scala("nominale", ["", "Beef (beef herd)", "Lamb & Mutton", "Cheese", "Beef (dairy herd)", "Dark Chocolate", " " ] , "h")

assi("left", co2, true,100, "Co2(kg) emissions per kg") // parametri(posizione, scala, freccia o non freccia sull'asse, valore dove mettere la freccia,  titolo dell'asse)
assi("right", metri_quadri, true, 400, "Land used(m^2) per kg", null,null)//ultimi due parametri formato, numero dei tick dell'asse
assi("bottom", prodotti, false, " ", "Products", null, null)
//assi("top", scala_nominale_orizzontale, false, " ", "sopra" )

//d => `${d3.format(".2s")(d).replace(/0.0/, "0k").replace(/5.0k/, "5k")}`

const tooltip = d3.select("body")
	.append("div")
	.attr("class","d3-tooltip")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.style("padding", "15px")
	.style("background", "rgba(0,0,0,0.8)")
	.style("border-radius", "5px")
	.style("color", "#fff")
	.text("");

const emissioni = svg.selectAll('rect.co')
.data(data).enter()
.append("rect")
.attr('class', 'co')
.attr("fill", co2_color)
.attr("width", 20)
.attr("height", (d,i) => height -vpadding - co2(d.Total_emissions)) 
.attr("x", d=> prodotti(d.Product) -20)
.attr("y", d => co2(d.Total_emissions))
.on("mouseover", function(d, i) {
	tooltip.html(`Product: ${d["target"].__data__["Product"]}<br> 
	<span style="color:${co2_color_testo};">Total emissions : ${(d["target"].__data__["Total_emissions"]).toFixed(1)}kg</span><br>
	Land emissions :<span style="color:${co2_color_testo};"> ${(d["target"].__data__["Land"]).toFixed(1)}kg</span><br>
    Animal feed emissions :<span style="color:${co2_color_testo};"> ${(d["target"].__data__["Animal_Feed"]).toFixed(1)}kg</span><br>
    Farm emissions :<span style="color:${co2_color_testo};"> ${(d["target"].__data__["Farm"]).toFixed(1)}kg</span><br>
    Processing emissions :<span style="color:${co2_color_testo};"> ${(d["target"].__data__["Processing"]).toFixed(1)}kg</span><br>
    Transport emissions :<span style="color:${co2_color_testo};"> ${(d["target"].__data__["Transport"]).toFixed(1)}kg</span><br>
    Packging emissions :<span style="color:${co2_color_testo};"> ${(d["target"].__data__["Packging"]).toFixed(1)}kg</span><br>
    Retail emissions :<span style="color:${co2_color_testo};"> ${(d["target"].__data__["Retail"]).toFixed(1)}kg</span>
	`).style("visibility", "visible")/*+ lista_morti(d["target"].__data__["month"])).style("visibility", "visible")
    */
	   d3.select(this)
            .attr("fill", shadeColor(co2_color, -20));
	//let m = d["target"].__data__["month"]
	//lista_div_mese("morti",paesi_dataset_deaths.filter( d=> d.month ==m ).sort((a, b) => d3.descending(a.deaths, b.deaths)))
	   
  })
 
  .on("mousemove", function(){
	tooltip
	  .style("top", (event.pageY-10)+"px")
	  .style("left",(event.pageX+10)+"px");
	
  })
  .on("mouseout", function() {
	tooltip.html(``).style("visibility", "hidden");
	
	d3.select(this).attr("fill", co2_color);
  });

  const spazio = svg.selectAll('rect.metri')
.data(data).enter()
.append("rect")
.attr('class', 'metri')
.attr("fill", metri_color)
.attr("width", 20)
.attr("height", (d,i) => height -vpadding - metri_quadri(d.Metri_kgco2)) 
.attr("x", d=> prodotti(d.Product))
.attr("y", d => metri_quadri(d.Metri_kgco2))
.on("mouseover", function(d, i) {
	tooltip.html(`Product: ${d["target"].__data__["Product"]}<br> 
	<span style="color:${metri_color_testo};">Land Used : ${(d["target"].__data__["Metri_kgco2"]).toFixed(0)} m<sup>2</sup> </span><br>
	
	`).style("visibility", "visible")/*+ lista_morti(d["target"].__data__["month"])).style("visibility", "visible")
    */
	   d3.select(this)
            .attr("fill", shadeColor(metri_color, -20));
	//let m = d["target"].__data__["month"]
	//lista_div_mese("morti",paesi_dataset_deaths.filter( d=> d.month ==m ).sort((a, b) => d3.descending(a.deaths, b.deaths)))
	   
  })
 
  .on("mousemove", function(){
	tooltip
	  .style("top", (event.pageY-10)+"px")
	  .style("left",(event.pageX+10)+"px");
	
  })
  .on("mouseout", function() {
	tooltip.html(``).style("visibility", "hidden");
	
	d3.select(this).attr("fill", metri_color);
  });

  svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width -65) + "," + ((hpadding/5)-15) + ")")
	.attr("width", "12")
	.attr("height", "12")
	.attr("fill", `${metri_color}`)

svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width -65) + "," + ((hpadding/5)) + ")")

	.attr("width", "12")
	.attr("height", "12")
	.attr("fill", `${co2_color}`)

svg.append("g")
	.attr("transform", "translate(" + (width-50) + "," + ((hpadding/5)+10) + ")")
	.append("text")
	.attr("font-size", "12px").text("Co2")

svg.append("g")
	.attr("transform", "translate(" + (width-50)  + "," + ((hpadding/5)-6) + ")")
	.append("text")
	.attr("font-size", "12px").text("Land")
