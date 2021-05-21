import React, { Component } from "react";
import "../App.scss";
import $ from "jquery";


class ImagePreview extends Component {
  componentDidMount() {
    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          $("#blah").attr("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
      }
    }

    $("#artfile").change(function () {
      readURL(this);
    });
    var $fileInput = $(".file-input");
    var $droparea = $(".file-drop-area");

    // highlight drag area
    $fileInput.on("dragenter focus click", function () {
      $droparea.addClass("is-active");
    });

    // back to normal state
    $fileInput.on("dragleave blur drop", function () {
      $droparea.removeClass("is-active");
    });

    // change inner text
    $fileInput.on("change", function () {
      var filesCount = $(this)[0].files.length;
      var $textContainer = $(this).prev();

      if (filesCount === 1) {
        // if single file is selected, show file name
        var fileName = $(this).val().split("\\").pop();
        $textContainer.text(fileName);
      } else {
        // otherwise show number of files
        $textContainer.text(filesCount + " files selected");
      }
    });
  }
  state = {
    selectedFile: null,
    imagePreviewUrl: null,
  };

  fileChangedHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });

    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(event.target.files[0]);
  };

  render() {
    let $imagePreview = <div className="previewText image-container"></div>;
    if (this.state.imagePreviewUrl) {
      $imagePreview = (
        <div className="image-container">
          <img className="preview-image" src={this.state.imagePreviewUrl} alt="icon" />{" "}
        </div>
      );
    }

    return (
      <div className="App">
        {/* <input className="imagePreview" type="file" name="imagePreview" onChange={this.fileChangedHandler} /> */}
        <form action="http://localhost:8080/upload" key="file" method="post" encType="multipart/form-data">
        <div className="box">
          <div className="file-drop-area">
            <span className="fake-btn">Choose files</span>
            <span>Click or drop your files here</span>
            <span className="file-msg">No file chosen</span>
            <input
              onChange={this.fileChangedHandler}
              className="file-input"
              id="file"
              key="file"
              type="file"
              name="file"
              multiple
            />
          </div>
        </div>
        {$imagePreview}
        <input type="submit" value="Submit" />
        </form>

        {/* <button type="button" onClick={this.submit} > Upload </button> */}
        
      </div>
    );
  }
}

export default ImagePreview;
