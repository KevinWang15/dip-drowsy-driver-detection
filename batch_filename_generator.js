const fs = require("fs");
const path = require("path");

const pathPrefix = "";
const batchNums = 4;

const sourceDir = "../drowsy_picture";

let datasetDir = path.join(sourceDir, "dataset_picture");
let userDirs = fs.readdirSync(datasetDir);
let usersPerBatch = Math.ceil(userDirs.length / batchNums);
let usersBatch = [];
for (let i = 0; i < userDirs.length; i++) {
  let batchNumber = Math.floor((i + 1) / usersPerBatch);
  if (!usersBatch[batchNumber]) {
    usersBatch[batchNumber] = [];
  }
  let videoDirs = fs.readdirSync(path.join(datasetDir, userDirs[i]));
  videoDirs.forEach(videoDir => {
    let images = fs.readdirSync(path.join(datasetDir, userDirs[i], videoDir));
    images.forEach(image => {
      if (image.endsWith('.jpg')) {
        usersBatch[batchNumber].push(path.join(datasetDir, userDirs[i], videoDir, image));
      }
    });
  });
}

for (let i = 0; i < usersBatch.length; i++) {
  fs.writeFileSync("batch_" + i + ".txt", usersBatch[i].join('\n').split('\\').join("/"), { encoding: "UTF8" })
}
