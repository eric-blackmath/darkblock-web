import React from "react";
import "../styles/detail.scss";
import { useEffect } from "react";
import "../styles/preview.scss";
import goldblock from "../images/goldblock.png";

export default function FileChooser({ fileSelectionHandlerLevelTwo }) {
  var levelTwoFileSelectionHandler = fileSelectionHandlerLevelTwo;

  useEffect(() => {
    function ekUploadtwo() {
      function Init() {
        var fileSelect = document.getElementById("file-uploadtwo"),
          fileDrag = document.getElementById("file-dragtwo");

        fileSelect.addEventListener("change", fileSelectHandler, false);

        // Is XHR2 available?
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
          // File Drop
          fileDrag.addEventListener("dragover", fileDragHover, false);
          fileDrag.addEventListener("dragleave", fileDragHover, false);
          fileDrag.addEventListener("drop", fileSelectHandler, false);
        }
      }

      function fileDragHover(e) {
        var fileDrag = document.getElementById("file-dragtwo");

        e.stopPropagation();
        e.preventDefault();

        fileDrag.className =
          e.type === "dragover" ? "hover" : "modal-body file-uploadtwo";
      }

      function fileSelectHandler(e) {
        // Fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // Cancel event and hover styling
        fileDragHover(e);

        levelTwoFileSelectionHandler(files); //send the files back to details

        // Process all File objects
        for (var i = 0, f; (f = files[i]); i++) {
          parseFile(f);
        }
      }

      // Output
      function output(msg) {
        // Response
        var m = document.getElementById("messagestwo");
        m.innerHTML = msg;
      }

      function parseFile(file) {
        console.log(file.name);
        output("<strong>" + encodeURI(file.name) + "</strong>");

        // var fileType = file.type;
        // console.log(fileType);
        var imageName = file.name;

        var isGood = /\.(?=gif|jpg|png|jpeg)/gi.test(imageName);
        if (isGood) {
          document.getElementById("starttwo").classList.add("hidden");
          document.getElementById("responsetwo").classList.remove("hidden");
          document.getElementById("notimagetwo").classList.add("hidden");
          // Thumbnail Preview
          document.getElementById("file-imagetwo").classList.remove("hidden");
          document.getElementById("file-imagetwo").src =
            URL.createObjectURL(file);
        } else {
          document.getElementById("file-imagetwo").classList.add("hidden");
          document.getElementById("notimagetwo").classList.remove("hidden");
          document.getElementById("starttwo").classList.remove("hidden");
          document.getElementById("responsetwo").classList.add("hidden");
          // document.getElementById("file-upload-form").reset();
        }
      }

      // Check for the various File API support.
      if (window.File && window.FileList && window.FileReader) {
        Init();
      } else {
        document.getElementById("file-dragtwo").style.display = "none";
      }
    }
    ekUploadtwo();
  }, []);

  return (
    <div>
      <div>
        <div id="file-upload-formtwo" className="uploadertwo">
          <input
            id="file-uploadtwo" //maybe not change this one
            type="file"
            name="fileUpload"
            accept="image/*"
          />
          <img className="goldblock" src={goldblock} alt="silverblock" />
          <label htmlFor="file-uploadtwo" id="file-dragtwo">
            <div className="select-file">
              <span className="yellow-text">Upload file</span> or drop here
            </div>
            <img id="file-imagetwo" src="#" alt="Preview" className="hidden" />
            <div id="starttwo">
              <div id="notimagetwo" className="hidden">
                Please select an image
              </div>
              {/* <span id="file-upload-btn" className="btn btn-primary">Select a file</span> */}
            </div>
            <div id="responsetwo" className="hidden">
              <div id="messagestwo"></div>
              <progress className="progress" id="file-progresstwo" value="0">
                <span>0</span>%
              </progress>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
