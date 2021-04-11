const tf = require('@tensorflow/tfjs')
const tfnode = require('@tensorflow/tfjs-node')
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs')
const util = require('util')

const model = mobilenet.load({
  version: 2,
  alpha: 1.0
})

async function imagenet_classify(image_path){
  imageBuffer = await util.promisify(fs.readFile)(image_path)
  const image = tfnode.node.decodeImage(imageBuffer)
  predictions = await (await model).classify(image)
  return predictions
}

exports.classify = imagenet_classify
