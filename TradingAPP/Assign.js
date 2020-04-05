window.onload = function () {
    console.log('before')
    
    // Setup Canvas
    var svgCanvas = d3.select("svg")
        .style("background-color", "black")
        .attr("width", 1500)
        .attr("height", 580)
        .attr("class", "svgCanvas");
    
    //Separating Nodes and links data 
     d3.json("data.json", function(d){
        console.log(d);
        nodes = console.log(d.nodes);  
        links = console.log(d.links); 

    //Calculation of total trading data
   for( i = 0; i < d.nodes.length; i ++)
      {
          var amount = 0;
          var count = 0;
   for( j = 0; j < d.links.length; j ++) 
      {
     if(d.nodes[i].id == d.links[j].node01 || d.nodes[i].id == d.links[j].node02) 
                { 
                   amount += d.links[j].amount;
                   count += 1;
                }    
                   d.nodes[i].amount = amount;
                   d.nodes[i].count = count;
        }
      }      
    for ( i = 0; i < d.nodes.length; i ++)
      {   
    for (j = 0; j < d.links.length; j++)
         {
            if(d.nodes[i].id == d.links[j].node01)
              {
                d.links[j].sr = i;
              }
            if(d.nodes[i].id == d.links[j].node02)
              {
                d.links[j].des = i;  
              }
         }
      }
        
    var links = svgCanvas.selectAll("link")
        .data(d.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", function(l) {
    var sourceNode = d.nodes.filter(function(d, i) 
        {
       return i == l.sr})[0];
       d3.select(this).attr("y1", sourceNode.y);
       return sourceNode.x
        })
       .attr("x2", function(l) {
    var targetNode = d.nodes.filter(function(d, i) {
       return i == l.des})[0];
       d3.select(this).attr("y2", targetNode.y);
       return targetNode.x
       })
       .attr("fill", "none")
       .attr("stroke", "#999")
       .attr("stroke-width", function (d) {return d.amount/100;   
       });            

    var div = d3.select("body").append("div")	
       .attr("class", "tooltip")				
       .style("opacity", 0);
         
    svgCanvas.selectAll("circle")
      .data(d.nodes)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })
      .attr("r", function (d) { return d.amount/90; })
      .on("mouseover", function(d)
          {
          svgCanvas.selectAll("circle")
                    .attr("opacity", 0.2); // grey out all circles
                    d3.select(this) 
                    .attr("opacity", 1);
                    div.transition(this)		
                    .duration(200)		
                    .style("opacity", .9);
                    div.html("Site ID: " + d.id + "<br/>" + "Total Trading Amount: " + d.amount + "<br/>" + "No. of sites: " + d.count)
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px")
                    d3.select(this) 
                    .attr("opacity", 1);
                    links
                    .style("stroke", function(l) 
                           {
                        return l.node01 === d.id || l.node02 === d.id ? "red": "#999";})
                    .style("opacity", function(l) 
                           {
                        return l.node01 === d.id || l.node02 === d.id ? 1: 0.2 ;})
            })
            .on("mouseout", function(thisElement, index){ // restore all circles to normal mode
                svgCanvas.selectAll("circle")
                    .attr("opacity", 1);
                 links
                .style("stroke", "#999")
                .style("opacity", 1)
                   div.transition(this)		
                    .duration(200)		
                    .style("opacity", 0);
          }
         )
      .attr("stroke", "blue")
      .attr("stroke-width", 4)  
      .attr("fill", "black");    
    });   
}