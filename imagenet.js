const tf = require('@tensorflow/tfjs')
const tf = require('@tensorflow/tfjs_node')
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs')
const util = require('util')
const jimp = require('jimp');

const model = ((async() => {
  return await mobilenet.load()
})())

async function imagenet_classify(image_path){
  image = await jimp.read(image_path)
  console.log(image.bitmap.data)
  //predictions = await model.classify(image)
  //return predictions
}

exports.classify = imagenet_classify
