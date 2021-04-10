const tf = require('@tensorflow/tfjs')
const tf_node = require('@tensorflow/tfjs-node')
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs')
const util = require('util')

const model = ((async() => {
  return await mobilenet.load()
})())

async function imagenet_classify(image_path){
  imageBuffer = await util.promisify(fs.readFile)(image_path)
  const image = tf_node.node.decode_image(imageBuffer)
  predictions = await model.classify(image)
  return predictions
}

exports.classify = imagenet_classify
