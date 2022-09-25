import React, { Component } from 'react';
var JSZip = require("jszip");

class Font extends Component {
  render() {
    return (
      <p>{this.props.fontname}</p>
    )
  }
}

class App extends Component {

  constructor(props) {
    super(props);
  }

  showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader();
    reader.onload = async (e1) => {
      const zip = new JSZip();
      let t = await zip.loadAsync(e1.target.result)
        .then((e) => e.files["ppt/slides/slide1.xml"].async("string").then((g) => g));
      new Promise((res) => {
        document.querySelector("#font").innerHTML = "";
        res();
      }).then(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(t, "application/xml");
          let data = dom.childNodes[0].childNodes[0].childNodes[0];
          data = data.getElementsByTagNameNS("http://schemas.openxmlformats.org/presentationml/2006/main", "sp");
          for (let d of data) {
            d = d.getElementsByTagNameNS("http://schemas.openxmlformats.org/presentationml/2006/main", "txBody")[0];
            d = d.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "p")[0];
            d = d.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "r")[0];
            if (!d) {
              continue
            }
            d = d.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "rPr")[0];
            d = d.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "latin")[0];
            if (!d) {
              d = "default";
            } else {
              d = d.getAttribute("typeface");
            }
            console.log(d);
            let elem = document.createElement("p");
            elem.textContent = d;
            document.querySelector("#font").appendChild(elem);
          }
        }
      )
    };
    reader.readAsBinaryString(e.target.files[0]);
  }

  render = () => {
    return (
      <div>
        <input type="file" onChange={(e) => this.showFile(e)} />
        <div id="font">

        </div>
      </div>
    )
  }
}

export default App;
