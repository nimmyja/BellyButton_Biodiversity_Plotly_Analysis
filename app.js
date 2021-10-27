let url = "data/samples.json"
function start(){
let url = "data/samples.json"

d3.json(url).then((data)=> {
    console.log(data)

    data.names.forEach(function(name) {
        d3.select("#selDataset").append("option").text(name).property("value");
    });
});

}

start()

 function optionChanged(valueselected){
    d3.json(url).then(sampleData=>{
        console.log(sampleData);
        let dataunfiltered = sampleData;
        let dataraw = dataunfiltered.samples.filter((val) => val.id == valueselected);
        var data = dataraw[0];
        let ids = data.otu_ids;
        let samplevalues = data.sample_values;
        let labels = data.otu_labels;
        console.log(`labels : `,labels);
        console.log(`ids : `,ids);
        console.log(`samplevalues : `,samplevalues);
        let otu_ids=ids.map(d => "OTU " + d);
        console.log(`otu_ids : `,otu_ids);
  

    
    
    
        let formatted = {
            idstr: otu_ids,
            ids: ids,
            samplevalues : samplevalues,
            labels:labels
        };
        tracebar(formatted)
        tracebubble(formatted)
        getDemoData(valueselected)
        gaugeChart(valueselected) 
    })

 }

 function tracebar(formatted)
 {
    var trace = {
        x: formatted.samplevalues.slice(0,10).reverse(),
        y: formatted.idstr.slice(0,10).reverse(),
        text: formatted.labels.slice(0,10).reverse(),
        marker: {
        color: 'blue'},
        type:"bar",
        orientation: "h",
    };
     // create data variable
     var data = [trace];
             // create layout variable to set plots layout
     var layout = {
                title: "Top 10 OTU",
                yaxis:{
                    tickmode:"linear",
                },
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 30
                }
            };
    Plotly.newPlot("bar", data, layout);

 }

 function tracebubble(formatted)
 {
    var trace = {
        x: formatted.ids,
        y: formatted.samplevalues,
        text: formatted.labels.slice(0,10).reverse(),
        mode: "markers",
        text: formatted.labels,
        marker: {
          size: formatted.samplevalues,
          color: formatted.ids,
        },
      };
    
     // create data variable
     var data = [trace];
             // create layout variable to set plots layout
             var layout = {
                title: "OTU ID vs Sample Value",
                showlegend: false,
                height: 600,
                width: 1200,
              };
            
              var config = {
                responsive: true,
              };
              Plotly.newPlot("bubble", data, layout, config);
            }


function getDemoData(valueselected) {

        d3.json(url).then((data)=> {
            var metaData = data.metadata;
    
            console.log(metaData)
           var result = metaData.filter(y => y.id.toString() === valueselected)[0];
           var demographicInfo = d3.select("#sample-metadata");
           demographicInfo.html("");
            Object.entries(result).forEach((key) =>    {
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
            }); 
      
        });
    }
    function gaugeChart(valueselected) {

        d3.json(url).then((data)=> {
            var metaData = data.metadata;
    
           
           var wref =  Object.values(metaData.filter(y => y.id.toString() === valueselected)[0])[6];
           console.log("hello")
           console.log( wref)
           function gaugePointer(value){
	
            var degrees = 180 - value,
             radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        
        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
             pathX = String(x),
             space = ' ',
             pathY = String(y),
             pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
            
            return path;
        
        }
        
           var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wref,
              title: { text: "Weekly Washing Frequency" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "#000082" },
                steps: [
                  { range: [0, 1], color: "#fff4ed" },
                  { range: [1, 2], color: "#ffddc6" },
                  { range: [2, 3], color: "#ffc59f" },
                  { range: [3, 4], color: "#ffae78" },
                  { range: [4, 5], color: "#ff9650" },
                  { range: [5, 6], color: "#ff7e29" },
                  { range: [6, 7], color: "#ff6702" },
                  { range: [7, 8], color: "#ed5f00" },
                  { range: [8, 9], color: "#c64800" },
                ],
                threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: 450,
                },
              },
            },
          ];
        
          var layout = {
            shapes:[{
                type: 'path',
                path: gaugePointer(90),
                fillcolor: '850000',
                line: {
                  color: '850000'
                }
              }],
            //title: '<b>Gauge</b> <br> Speed 0-100',
              autosize:true,
            //height: 1000,
            //width: 1000,
            xaxis: {zeroline:false, showticklabels:false,
                       showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                       showgrid: false, range: [-1, 1]}
          };
          Plotly.newPlot("gauge", data, layout);
      
        });


        
      }