function dropFile(e){
    e.preventDefault()

    document.getElementById('modal01').style.display='none' 
    
    if (e.dataTransfer.items) {
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === 'file') {
            let filename = e.dataTransfer.items[i].getAsFile().path
                addimg(filename)
          }
        }
      } else {
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
          let filename = e.dataTransfer.files[i].path 
              addimg(filename)
        }
      }
}

var clearDragTimeout = null
function dragOverFile(e){
    e.preventDefault()

    document.getElementById('modal01').style.display='block'
    if(clearDragTimeout != null){
        clearTimeout(clearDragTimeout)
    }
    clearDragTimeout = setTimeout(()=>{
        document.getElementById('modal01').style.display='none'
    }, 1000)
}

function addimg(filename) {
    electron.addPhoto(filename);
}

function metaHTML(image){
    outer_element = document.createElement("div")
    imageElement = document.createElement("img")
    imageElement.src = image.path
    imageElement.style.width="100%"
    imageElement.style.paddingTop="40px"
    outer_element.appendChild(imageElement)
    element = document.createElement("table")
    element.classList.add("w3-table")
    outer_element.appendChild(element)
    for(let key in image){
        row = document.createElement("tr")
        c1 = document.createElement("td")
        c1.innerHTML = key.replace(/^\w/, (c)=>(c.toUpperCase()))
        if(key == "imagenet") {
            c1.innerHTML = "Keywords"
        }
        c1.innerHTML = "<strong>" + c1.innerHTML + "</strong>"
        c1.width = "25%"
        c2 = document.createElement("td")
        c2.innerHTML = ""
        console.log(image[key])
        if(key == "imagenet"){
            let val = image[key]
            // if(val == null){
            //     c2.innerHTML = "<i>loading</i>"
            //     console.log("a")
            // } else{
            //     c2.innerHTML = image[key]
            //     console.log("b")
            // }
            c2.innerHTML = val
            console.log("aaa")
        }
        if(key == "metadata") {
            let val = image[key]
            if(val != null) {
                // metadata categories are: image, thumbnail, exif, gps, interoperability, makernote
                var image_meta = val["image"]
                if("ImageWidth" in image_meta && "ImageHeight" in image_meta) {
                    c2.innerHTML += "Dimensions: " + image_meta["ImageWidth"] + "x" + image_meta["ImageHeight"]
                }
                if("Make" in image_meta && "Model" in image_meta) {
                    if(c2.innerHTML != "") {
                        c2.innerHTML += "<br>"
                    }
                    c2.innerHTML += "Camera Model: " + image_meta["Make"] + " " + image_meta["Model"]
                }
                // var exif_meta = val["exif"]
                // if("DateTimeOriginal" in exif_meta) {
                //     if(c2.innerHTML != "") {
                //         c2.innerHTML += "<br>"
                //     }
                //     c2.innerHTML += "Date & Time Created: " + exif_meta["DateTimeOriginal"]
                // }
            }
            // if metadata is null or all checked categories are empty
            if(c2.innerHTML == "") {
                c2.innerHTML = "metadata unavailable :("
            }
        }
        if(key == "location") {
          let val = image[key];
          if(val !== null) {
            console.log(val);
            c2.innerHTML += val.formattedAddress;
          }
        }
        else {
            c2.innerHTML = image[key]
        }
        c2.width = "100%"
        row.appendChild(c1)
        row.appendChild(c2)
        element.appendChild(row)
    }
    
    return outer_element.innerHTML
}

var images_displayed = new Map();

function reset_images(){
  images_displayed.clear()
  document.getElementById("gallery").innerHTML = ""
}

function display_images(image_list){
    let gallery = document.getElementById("gallery")
    for(var i = 0; i < image_list.length; i++){
        let image = image_list[i]
        if(images_displayed.has(image.path)) {
          let metaAsHTML = metaHTML(image)
          images_displayed.get(image.path).onclick = (e) => {
              let modalContainer = document.getElementById("detail-modal")
              let modal = document.getElementById("detail-modal-inside")
              modal.innerHTML = ""
              let modalHeader = document.createElement("div")
              modalHeader.classList.add("w3-container")
              modalHeader.innerHTML = "<span onclick=\"document.getElementById('detail-modal').style.display='none'\" class=\"w3-button w3-display-topright\">&times;</span>";
              let modalBody = document.createElement("div")
              modalBody.classList.add("w3-container")
              modalBody.innerHTML = metaAsHTML
              modal.appendChild(modalHeader)
              modal.appendChild(modalBody)
              modalContainer.style.display = "block"
          }
        }
        else {
          let imageContainer = document.createElement("div")
          imageContainer.classList.add("w3-col", "w3-quarter", "w3-padding", "w3-hover-pale-blue")
          let imageElement = document.createElement("img")
          imageElement.src = image.path
          imageElement.style = "width: 100%"
          imageContainer.appendChild(imageElement)
          let metaAsHTML = metaHTML(image)
          imageContainer.onclick = (e) => {
              let modalContainer = document.getElementById("detail-modal")
              let modal = document.getElementById("detail-modal-inside")
              modal.innerHTML = ""
              let modalHeader = document.createElement("div")
              modalHeader.classList.add("w3-container")
              modalHeader.innerHTML = "<span onclick=\"document.getElementById('detail-modal').style.display='none'\" class=\"w3-button w3-display-topright\">&times;</span>";
              let modalBody = document.createElement("div")
              modalBody.classList.add("w3-container")
              modalBody.innerHTML = metaAsHTML
              modal.appendChild(modalHeader)
              modal.appendChild(modalBody)
              modalContainer.style.display = "block"
          }
          gallery.appendChild(imageContainer)
          images_displayed.set(image.path, imageContainer);
        }
    }
}

electron.ipcOn('update-images', (event, images) => {
  if(document.getElementById("searchbar").value.length == 0){
    display_images(images);
  }
});

electron.ipcOn('replace-images', (event, images) => {
  reset_images();
  display_images(images);
});

document.getElementById("searchbar").addEventListener("keydown", (event) => {
  setTimeout(()=>{
    if(document.getElementById("searchbar").value.length == 0){
      electron.ipcSend("search", "")
    }
  }, 100)
  if(event.key == "Enter") {
    electron.ipcSend("search", document.getElementById("searchbar").value)
  }
})

// display_images([{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"}])