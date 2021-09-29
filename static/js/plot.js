// Read in samples
// d3.json("./static/resources/samples.json").then((data) => {
//     firstPerson = data.metadata[0];
//     Object.entries(firstPerson).forEach(([key, value]) =>
//       {console.log(key + ': ' + value);});
// });

// Initialize selections
function init() {
  let selector = d3.select("#selDataset");

  d3.json("./static/resources/samples.json").then((data) => {
    console.log(data);
    let sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  })
}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("./static/resources/samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("./static/resources/samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    let metadata = data.metadata;

    // Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = metadata.filter(sampleObj => { sampleObj.id === sample });

    // Create a variable that holds the first sample in the array.
    let result = resultArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = data.samples.filter(row => row.id === sample)[0].otu_ids;
    let otu_labels = data.samples.filter(row => row.id === sample)[0].otu_labels;
    let sample_values = data.samples.filter(row => row.id === sample)[0].sample_values;
    let wash_freq = parseFloat(metadata.filter(row => row.id.toString() === sample)[0].wfreq);

    // Create the yticks for the bar chart.
    let yticks = sample_values
      .slice(0, 10)
      .map((tick, index) => "OTU " + otu_ids[index])
      .reverse()
    // console.log(otu_ids.slice(0,10).reverse().map(id => id.toString()))
    // console.log(yticks);
    // 8. Create the trace for the bar chart. 
    let barData = [
      {
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        type: "bar",
        orientation: 'h'
      }
    ];
    // 9. Create the layout for the bar chart. 
    console.log();
    let barLayout = {
      font: {
        color:"#ffffff"
      },
      title: "Top 10 Bacteria Cultures Found",
      paper_bgcolor: "#333333",
      plot_bgcolor: "#111111"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          color: otu_ids,
          size: sample_values
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      paper_bgcolor: "#333333",
      plot_bgcolor: "#111111",
      font: {
        color:"#ffffff"
      },
      xaxis: {
        title: "OTU ID"
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    let gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_freq,
        title: {text: "Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0,10]},
          bar: {color: "black"},
          steps: [
            { range: [0,2], color: "red"},
            { range: [2,4], color: "orange"},
            { range: [4,6], color: "yellow"},
            { range: [6,8], color: "limegreen"},
            { range: [8,10], color: "green"}
          ]
        }
      }
    ];

    // 5. Create the layout for the gauge chart.
    let gaugeLayout = {
      paper_bgcolor: "#333333",
      plot_bgcolor: "#111111",
      font: {
        color:"#ffffff"
      },
      title: "Belly Button Washing Frequency"
    };

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}