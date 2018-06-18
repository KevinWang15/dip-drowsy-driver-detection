const fs = require("fs");
const json5 = require("json5");
let dataset = fs.readFileSync("./dataset.csv", { encoding: "UTF8" }).split("\n");

const LabelEnum = {
  normal: 0,
  yawn: 1,
  fatigue: 2,
};

// 读取datasetMap
/**
 * @type {{[userId] : {[userVideoId] : number}}}
 */
const mapUserIdAndUserVideoIdToVideoId = {};
let datasetMap = fs.readFileSync("./datasetmap.dat", { encoding: "UTF8" });
let datasetMapRegexp = /U(\d+)V(\d+)\s+(\d+)/img;
let datasetMapMatch = datasetMapRegexp.exec(datasetMap);
while (datasetMapMatch != null) {
  let data = {
    video_id: datasetMapMatch[3],
    user_id: datasetMapMatch[1],
    user_video_id: datasetMapMatch[2],
  };
  if (!mapUserIdAndUserVideoIdToVideoId[data.user_id]) {
    mapUserIdAndUserVideoIdToVideoId[data.user_id] = {};
  }
  mapUserIdAndUserVideoIdToVideoId[data.user_id][data.user_video_id] = data.video_id;
  datasetMapMatch = datasetMapRegexp.exec(datasetMap);
}

const mapVideoIdToLabel = {};
dataset.forEach(line => {
  let lineRegex = /^(\d+),.+?(normal|yawn|fatigue)/im;
  let match = lineRegex.exec(line);
  if (match != null) {
    switch (match[2]) {
      case "normal":
        mapVideoIdToLabel[match[1]] = LabelEnum.normal;
        break;
      case "yawn":
        mapVideoIdToLabel[match[1]] = LabelEnum.yawn;
        break;
      case "fatigue":
        mapVideoIdToLabel[match[1]] = LabelEnum.fatigue;
        break;
      default:
    }
  }
});

let files = fs.readdirSync(".").filter(_ => _.endsWith(".txt"));
let records = [];
let mapVideoIdToData = {};

files.forEach(file => {
  let lines = fs.readFileSync(file, { encoding: "UTF8" }).split('\n');
  lines.forEach(line => {
    if (line.endsWith(",")) {
      line = line.substr(0, line.length - 1);
      let parsed = json5.parse(line);
      if (parsed.filename) {
        let filenameRegexp = /dataset_picture\/U(\d+)\/V(\d+)/im;
        let fileNameMatch = filenameRegexp.exec(parsed.filename);
        if (fileNameMatch != null) {
          let userId = fileNameMatch[1];
          let userVideoId = fileNameMatch[2];
          let videoId = mapUserIdAndUserVideoIdToVideoId[userId][userVideoId];
          if (!mapVideoIdToData[videoId]) {
            mapVideoIdToData[videoId] = {
              videoId,
              label: mapVideoIdToLabel[videoId],
              sequences: [],
            };
          }
          mapVideoIdToData[videoId].sequences.push(parsed);
        }
      }
    }
  });
});

// 生成最终的csv数据
let csvLines = [];
Object.keys(mapVideoIdToData).forEach(videoId => {
  let video = mapVideoIdToData[videoId];
  let vectors = [];
  vectors.push(video.label);

  video.sequences.forEach(item => {
    let timeFrame = [];
    timeFrame = timeFrame.concat([item.yaw, item.pitch, item.roll, item.x, item.y, item.z]);
    item.features.forEach(feature => {
      //TODO: 如何更好地使用feature，如：计算相邻两坐标的差值等
      timeFrame = timeFrame.concat(feature[0], feature[1]);
    });
    vectors.push(timeFrame.join("|"));
  });

  csvLines.push(vectors.join(","));
});

fs.writeFileSync("DATA.csv", csvLines.join("\n"), { encoding: "UTF8" });
