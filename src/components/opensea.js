// import React from "react";

// class OpenSea extends React.Component {
//   componentDidMount() {
//     //   const apiUrl =
//     //     "https://api.opensea.io/api/v1/events?account_address=0x1fa2e96809465732c49f00661d94ad08d38e68df&event_type=created&only_opensea=false&offset=0&limit=20";
//     //   fetch(apiUrl)
//     //     .then((response) => response.json())
//     //     .then((data) => console.log("OpenSea NFT's", data));
//     const fetch = require("node-fetch");

//     const url =
//       "https://api.opensea.io/api/v1/events?account_address=0x1fa2e96809465732c49f00661d94ad08d38e68df&event_type=created&only_opensea=false&offset=0&limit=20";
//     const options = { method: "GET" };

//     fetch(url, options)
//       .then((res) => res.json())
//       .then((json) => console.log(json))
//       .catch((err) => console.error("error:" + err));
//   }

//   render() {
//     return <div>

//     </div>;
//   }
// }
// export default OpenSea;

// import React, { Component } from 'react'
// import axios from 'axios'

import React, { Component } from "react";
import axios from "axios";
import "../App.scss";
// import $ from "jquery"

export default class OpenSea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: "",
    };
  } 

  getData() { 
    axios
      .get(
        "https://api.opensea.io/api/v1/events?account_address=0x1fa2e96809465732c49f00661d94ad08d38e68df&event_type=created&only_opensea=false&offset=0&limit=20"
      )
      .then((res) => {
        console.log(res.data);
        var data = res.data.asset_events;
        var loopData = "";
        var i;
        for (i = 0; i < data.length; i++) {
          loopData += `<form action="http://localhost:8080/upload" key="file" method="post" enctype="multipart/form-data">
          <div>
          <input type="file" name="file">
          <img id="file" key="file" name="file" src=${data[i].asset.image_preview_url} alt="file" />
          <p>${data[i].asset.name}</p>
          <input name="file" id="darkblock" type="checkbox" /><label for="darkblock">select to make darkblock</label>
          <a target="_blank" href=${data[i].asset.permalink}>Link to Opensea</a>
          </div>
          <input type="submit" value="submit" />
          </form>`;
        }
        // <input type="image" src=${data[i].asset.image_preview_url} alt="name" name="file"></input>
        // <form action="http://localhost:8080/upload" key="file" method="post" enctype="multipart/form-data"></form>
        console.log(loopData);
        this.setState({ images: loopData });
      });
  }
  componentDidMount() {
    this.getData();
  //   function readURL(input) {
  //     if (input.files && input.files[0]) {
  //       var reader = new FileReader();

  //       reader.onload = function (e) {
  //         $("#blah").attr("src", e.target.result);
  //       };

  //       reader.readAsDataURL(input.files[0]);
  //     }
  //   }

  //   $("#artfile").change(function () {
  //     readURL(this);
  //   });
  //   var $fileInput = $(".file-input");
  //   var $droparea = $(".file-drop-area");

  //   // highlight drag area
  //   $fileInput.on("dragenter focus click", function () {
  //     $droparea.addClass("is-active");
  //   });

  //   // back to normal state
  //   $fileInput.on("dragleave blur drop", function () {
  //     $droparea.removeClass("is-active");
  //   });

  //   // change inner text
  //   $fileInput.on("change", function () {
  //     var filesCount = $(this)[0].files.length;
  //     var $textContainer = $(this).prev();

  //     if (filesCount === 1) {
  //       // if single file is selected, show file name
  //       var fileName = $(this).val().split("\\").pop();
  //       $textContainer.text(fileName);
  //     } else {
  //       // otherwise show number of files
  //       $textContainer.text(filesCount + " files selected");
  //     }
  //   });
  // }
  // state = {
  //   selectedFile: null,
  //   imagePreviewUrl: null,
  // };

  // fileChangedHandler = (event) => {
  //   this.setState({
  //     selectedFile: event.target.files[0],
  //   });

  //   let reader = new FileReader();

  //   reader.onloadend = () => {
  //     this.setState({
  //       imagePreviewUrl: reader.result,
  //     });
  //   };

  //   reader.readAsDataURL(event.target.files[0]);
  }
  render() {
    //     let $imagePreview = <div className="previewText image-container"></div>;
    // if (this.state.imagePreviewUrl) {
    //   $imagePreview = (
    //     <div className="image-container">
    //       <img className="preview-image" src={this.state.imagePreviewUrl} alt="icon" />{" "}
    //     </div>
    //   );
    // }
    // const { images } = this.state;
    console.log();
    return (
      <>
      {/* <div>{$imagePreview}</div> */}
        <div
          className="nft-grid"
          dangerouslySetInnerHTML={{ __html: this.state.images }}
        ></div>
      </>
    );
  }
}
