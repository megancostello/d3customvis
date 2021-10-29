const margin = {top:20, left:50, right:20, bottom:20};

const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

d3.csv('driving.csv', d3.autoType).then(data=>{
    console.log('driving data ', data);
    const drivingData = data;

    const svg = d3.select('.chart').append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let milesRange = d3.extent(drivingData, d=>d.miles);
    let gasRange = d3.extent(drivingData, d=>d.gas);

    if (milesRange === undefined) milesRange = d3.nice(...d3.extent(d3.map(drivingData, d=>d.miles)), width/80);
    if (gasRange === undefined) gasRange = d3.nice(...d3.extent(d3.map(drivingData, d=>d.gas)), height/50);


    const xScale = d3.scaleLinear()
        .domain([milesRange[0],milesRange[1]])
        .range([0,width]);

    const yScale = d3.scaleLinear()
        .domain([gasRange[0]-0.2,gasRange[1]+0.2])
        .range([height,0]);

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(width/80, ",.1r");;
    
    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(height/50, "$.2f");

    const line = d3
        .line()
        .x(d=> xScale(d.miles))
        .y(d=> yScale(d.gas));

    svg.append("path")
        .datum(drivingData)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", line); 
    

    svg.selectAll("circle")
        .data(drivingData)
        .enter()
        .append("circle")
        .attr("cy", (d,i)=>{
            return yScale(d.gas);
          })
        .attr("cx", (d,i)=>{
          return xScale(d.miles);
        })
        .attr("r", 2)
        .attr("fill", "steelblue")
        .attr("stroke", "black");


    function position(d) {
        const t = d3.select(this);
        switch (d.side) {
            case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
            case "right":
            t.attr("dx", "0.5em")
                .attr("dy", "0.32em")
                .attr("text-anchor", "start");
            break;
            case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
            case "left":
            t.attr("dx", "-0.5em")
                .attr("dy", "0.32em")
                .attr("text-anchor", "end");
            break;
        }
    }

    function halo(text) {
        text
          .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round");
      }
    
    svg.selectAll("text")
        .data(drivingData)
        .enter()
        .append("text")
        .text(function (d, i){
        return d.year;
        })
        .each(position)
        
        .attr("dx", function (d, i){
            return xScale(d.miles);
        })
        .attr("dy", function (d, i){
            return yScale(d.gas)+10;
        })
        .attr("font-size", 7)
        .call(halo);
        
        

    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
        
    svg.append("text")
		.attr('x', 435)
		.attr('y', 450)
		.text("Miles per Person per Year")
        .attr("font-size", 12);
        // add attrs such as alignment-baseline and text-anchor as necessary

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .attr("transform", `translate(0,0)`);

    svg.append("text")
		.attr('x', 10)
		.attr('y', 15)
		.text("Gas Cost per Gallon")
        .attr("font-size", 12)
        .attr("transform", `translate(0,0)`);

    const axisGroup = svg.selectAll(".axis");

    axisGroup.select(".domain").remove();

    axisGroup.selectAll(".tick line")
    .clone()
    .attr("x2", width)
    .attr("stroke-opacity", 0.1) // make it transparent 

    

    
    })

   
    