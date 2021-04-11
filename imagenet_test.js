imagenet = require("./imagenet.js")

imagenet.classify("./panda.jpg").then((e)=>{
  console.log(e)
})
