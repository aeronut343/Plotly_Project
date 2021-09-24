// Read in samples
d3.json("./static/resources/samples.json").then((data) => {
    firstPerson = data.metadata[0];
    Object.entries(firstPerson).forEach(([key, value]) =>
      {console.log(key + ': ' + value);});
});