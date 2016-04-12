"use strict";

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}
document.body.addEventListener('click', function() {
  toggleFullScreen();
});

function init() {
  var orderedImages = [];
  var imageDimensions = [];

  var promiseArr = [];
  var index = 0;

  images.forEach(function(image) {
    promiseArr.push(new Promise(function (resolve, reject) {
      var im = new Image();
      im.src = image;
      im.onload = function () {
        document.querySelector('h1').innerHTML = 'Loading... ' + index + '/' + images.length;

        imageDimensions[index] = {
          width: this.width,
          height: this.height
        };
        orderedImages[index] = image;
        index++;
        resolve();
      };
    }));
  });

  Promise.all(promiseArr)
    .then(function() {
      var config = {
        "fullWidthBreakoutRowCadence": 3,
        "containerWidth":  window.innerWidth || document.body.clientWidth,
        "boxSpacing": 5,
        "showWidows": false
      };

      var geometry = require('justified-layout')(imageDimensions, config);

      var i = 0;
      var boxes = geometry.boxes.map(function (box) {
              return '<div class="box" style="width: ' + box.width + 'px; height: ' + box.height + 'px; top: ' + box.top + 'px; left: ' + box.left + 'px"><img style="width:100%;height:100%" src="' + orderedImages[i++] + '" /></div>';
      }).join('');

      document.querySelector('.justified').innerHTML = boxes;
      document.querySelector('.justified').style.height = geometry.containerHeight + "px";

      document.body.removeChild(document.querySelector('h1'));

      makeItScroll()
    });
}

function makeItScroll() {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '@-webkit-keyframes scroll {from {  margin-top: 0;}to {  margin-top:-' + (document.querySelector('.justified').clientHeight - window.innerHeight) + 'px;}}';
  document.getElementsByTagName('head')[0].appendChild(style);
}

init();