/**
  draw_features.js
  仅供娱乐和测试，在浏览器中画出一张脸
  在about:blank中打开控制台，把代码复制进去执行
**/

var features=[[323,175],[323,185],[324,195],[325,205],[327,214],[332,223],[340,229],[350,234],[361,236],[373,235],[384,231],[392,226],[398,218],[402,208],[404,199],[406,189],[407,180],[332,159],[337,153],[345,152],[353,153],[361,157],[375,158],[383,156],[390,156],[398,158],[402,165],[367,166],[367,171],[366,176],[366,181],[356,190],[361,191],[365,192],[370,192],[374,191],[340,168],[345,166],[350,166],[355,169],[350,169],[345,169],[379,171],[384,169],[390,169],[394,173],[389,172],[384,172],[349,205],[355,199],[361,196],[365,198],[369,197],[374,202],[379,208],[373,211],[368,212],[363,212],[359,211],[354,209],[352,204],[360,203],[364,203],[368,204],[376,207],[368,205],[364,205],[360,205],]


c=document.createElement("canvas")
c.width="1000";
c.height="1000";

document.body.appendChild(c)

var ctx = c.getContext('2d');
ctx.fillStyle = '#f00';

ctx.beginPath();
ctx.moveTo(features[0][0], features[0][1]);
for( item=1 ; item < features.length ; item++ ){ctx.lineTo( features[item][0] , features[item][1] )}



ctx.strokeStyle = "#33AA00";
ctx.lineWidth = 1;
ctx.stroke();