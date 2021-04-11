imagenet = require("./imagenet.js")

imagenet.classify("./test.jpg").then((e)=>{
  console.log(e)
})
