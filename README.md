## Inspiration
Our families have several thousand images in our photo library. Unfortunately, sorting through all of these images to bring back a specific memory is a nightmare - it takes so long to go through hundreds of old folders to find the ones we want. Although apps such as Google Photos improve this situation by producing an easily- searchable tagged archive in the cloud, these apps come with their own problems, namely the increased cost of cloud storage and the privacy problems associated with uploading our photos to a cloud-based application.

## What it does
Our app, Pholder, uses highly-optimized Machine Learning models to automatically identify objects in images based on the content of the image itself. It then combines this with other information about the image, such as the location the image was taken and the type of camera, in order to efficiently create an easily searchable archive of images, searchable using Natural Language Processing technologies. In fact, we managed to recreate a large portion of Google Photos’ search functionality - creating an archive of images that can be searched by the date and the name or address of the location the image was taken, not to mention being able to search for objects in the image itself!

## How we built it
Pholder is built on the Electron desktop app platform, is programmed mainly in Node.js and uses the Tensorflow.js toolkit for machine learning. It consists of two interconnected parts: a frontend and a backend. 

Our frontend uses HTML, CSS and JavaScript to show images to the user. It allows adding images through a simple and intuitive drag-and-drop interface. When new images are added or images are searched for, the frontend notifies the backend (which is programmed in Node.js) through inter-process communication in order to tell it to display the new images. Once the new images are processed, the backend notifies the frontend with the images, allowing the frontend to display the images. This model of event-driven programming allows us to quickly and efficiently process large numbers of images without slowing down the computer.

## Challenges we ran into
One main problem we had when writing our app were incompatible formats we had to translate between when reading images. For example, the EXIF standard used to store metadata in images is not equally supported by all manufacturers. Therefore, we found images using nonstandard formats to store metadata or not storing metadata at all. In order to combat this issue, we adapted our code to parse multiple formats of metadata and utilized more standard sources - for example, file creation and modification dates.

Another problem we had to deal with was a lack of generalizability in our machine learning model - specifically, our model was unable to deal with images that had multiple objects in them. In order to fix this problem, we switched from an image classification model to an object localization model capable of identifying all the objects present in an image rather than just one.


## Accomplishments that we're proud of
We are proud of creating Pholder and learning about various topics through creating it. This was the first time most of us used Electron, so we are thrilled that we got Electron working. Additionally, we were successfully able to train a high-quality machine learning model in Tensorflow.js and run this model on many computers - including computers that didn’t have much processing power!

## What we learned
We learned how to use the Electron cross-platform app and TensorFlow in JavaScript. 

## What's next for Pholder
The next logical step for this app would be to improve our app’s ability to search for images by evaluating more search metadata We will also improve the efficiency and intelligence of the machine learning model. Additionally, we want to use pagination to decrease the memory requirements of the app.

### Libraries Used
- Node.js - https://github.com/nodejs/node
- electron - https://github.com/electron/electron
- exif - https://github.com/gomfunkel/node-exif
- Tensorflow.js - https://github.com/tensorflow/tfjs
- Tensorflow.js Models - https://github.com/tensorflow/tfjs-models
- natural - https://github.com/NaturalNode/natural
- node-geocoder - https://github.com/nchaulet/node-geocoder
