// Read in samples
d3.json("./static/resources/samples.json").then((data) => {
    firstPerson = data.metadata[0];
    Object.entries(firstPerson).forEach(([key, value]) =>
      {console.log(key + ': ' + value);});
});

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
})}

init();