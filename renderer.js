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

function addimg(filename) {
    electron.addPhoto(filename)
}
