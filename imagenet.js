const tf = require('@tensorflow/tfjs')
const tfnode = require('@tensorflow/tfjs-node')
const cocossd = require('@tensorflow-models/coco-ssd');
const fs = require('fs')
const util = require('util')

const model = cocossd.load()

async function imagenet_classify(image_path){
  imageBuffer = await util.promisify(fs.readFile)(image_path)
  const image = tfnode.node.decodeImage(imageBuffer)
  predictions = await (await model).detect(image)
  return predictions
}

exports.classify = imagenet_classify
