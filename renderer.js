function dropFile(e){
    e.preventDefault()

    document.getElementById('modal01').style.display='none' 
    
    if (e.dataTransfer.items) {
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === 'file') {
            let filename = e.dataTransfer.items[i].getAsFile().path   
            console.log(filename)
            addimg(filename);
          }
        }
      } else {
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
          let filename = e.dataTransfer.files[i].path  
          console.log(filename)
          addimg(filename);
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
    imageElement.style.paddingTop="10px"
    outer_element.appendChild(imageElement)
    element = document.createElement("table")
    element.classList.add("w3-table")
    outer_element.appendChild(element)
    for(let key in image){
        console.log(key)
        row = document.createElement("tr")
        c1 = document.createElement("td")
        c1.innerHTML = key.replace(/^\w/, (c)=>(c.toUpperCase()))
        c2 = document.createElement("td")
        c2.innerHTML = image[key]
        row.appendChild(c1)
        row.appendChild(c2)
        element.appendChild(row)
        console.log(row.innerHTML)
    }
    
    return outer_element.innerHTML
}

var images_displayed = new Map();

function display_images(image_list){
    let gallery = document.getElementById("gallery")
    gallery.innerHTML = ""
    for(var i = 0; i < image_list.length; i++){
        let image = image_list[i]
        if(images_displayed.has(image.path)) {
          let metaAsHtml = metaHTML(image)
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
              console.log(modalContainer.innerHTML)
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
              console.log(modalContainer.innerHTML)
          }
          gallery.appendChild(imageContainer)
          images_displayed.set(image.path, imageContainer);
        }
    }
}

electron.ipcOn('update-images', (event, images) => {
  console.log(images);
  display_images(images);
});

// display_images([{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"},{"path": "https://hdqwalls.com/wallpapers/best-nature-image.jpg", "goodness": "ok"}])