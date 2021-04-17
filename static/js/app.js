// Building the metadata table 
function buildTable(sample){
    d3.json("data/samples.json").then(data =>{
        var metaData = data.metadata;
        var results = metaData.filter(d => d.id == sample);
        var finalData = results[0];
        var demoData = d3.select("#sample-metadata");
        demoData.html("");
        Object.entries(finalData).forEach(([key, value]) => {
            demoData.append("h6").text(`${key}: ${value}`)
        });
        console.log(finalData);
    })
};

// Initalizing the drop down menu
function init(){
    var dropDown = d3.select("#selDataset");
    d3.json("data/samples.json").then(data =>{
        var names = data.names;
        names.forEach(sample => {
            dropDown.append("option")
            .text(sample)
            .property("value",sample);
        });
        var sampleOne = names[0];
        console.log(sampleOne);
        buildTable(sampleOne);
        buildCharts(sampleOne);
    });
}

function optionChanged(name){
    buildTable(name);
    buildCharts(name);
};

// Building the horizontal bar chart and bubble chart
function buildCharts(sample){
    d3.json("data/samples.json").then(data =>{
        var samples = data.samples;
        var results = samples.filter(d => d.id == sample);
        var finalData = results[0];
        console.log(finalData);

        // Creating graph info variables
        var otuIds = finalData.otu_ids;
        var sampleValues = finalData.sample_values;
        var otuLabels = finalData.otu_labels;

        // Top 10 variables for bar chart using slice function
        var slicedIds = otuIds.slice(0,10);
        var slicedValues = sampleValues.slice(0,10);
        var slicedLabels = otuLabels.slice(0,10);


        // Organizing the data for the bar chart using TRACE1
        var trace1 = {
            x: slicedIds.reverse(),
            y: slicedValues.reverse(),
            text: slicedLabels.reverse(),
            type: "bar",
            orientation: "h",
        };

        var barChart = [trace1];

        var layout = {
            title: "Top 10 OTUs",
            height: 600,
            width: 1000,
        };

        // Bar Chart display
        Plotly.newPlot("bar", barChart, layout);

        // Bubble Chart using TRACE2
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                color: otuIds,
                size: sampleValues
            }
        };
        var bubbleChart = [trace2];
        
        var layout2 = {
            title: "Operational Taxonomic Units",
            margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100,
            }
        };
        // Display bubble chart
        Plotly.newPlot("bubble", bubbleChart, layout2);
    });
};

init();