function dropFile(e){
    e.preventDefault()

    document.getElementById('modal01').style.display='none' 
    
    if (e.dataTransfer.items) {
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === 'file') {
            let filename = e.dataTransfer.items[i].getAsFile().name    
            console.log(filename)
            addimg(filename);
          }
        }
      } else {
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
          let filename = e.dataTransfer.files[i].name  
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

function addimg() {
    electron.addPhoto(document.getElementById('imagefiles').files[0].path);
}

function add_images(image_list){
    let gallery = document.getElementById("gallery")
    gallery.innerHTML = ""
    for(var i = 0; i < image_list.length; i++){
        let image = image_list[i]
        let imageContainer = document.createElement("div")
        imageContainer.classList.add("w3-col", "w3-quarter", "w3-padding", "w3-hover-pale-blue")
        let imageElement = document.createElement("img")
        imageElement.src = image.path
        imageElement.style = "width: 100%"
        imageContainer.appendChild(imageElement)
        gallery.appendChild(imageContainer)
    }
}

add_images([{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"},{"path": "/Users/omtatva/Desktop/Datuswara.JPEG"}])