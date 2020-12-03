const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const ctx = canvas.getContext('2d');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error(`OH NO!!`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0,0,width,height);
    // pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);
    ctx.globalAlpha = 0.1;
    ctx.putImageData(pixels,0,0);
  }, 16);
}

function takePhoto() { // button 클릭 시 takaePhoto() 실행
  //촬영음 추가
  snap.currentTime = 0;
  snap.play();

  // data를 가져와서 canvas에 삽입
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a'); //a 태그 생성
  link.href = data;                         //주소는 data
  link.setAttribute('download', 'sexy');    //속성 부여, 다운로드, 파일명
  link.innerHTML = `<img src="${data}" alt="sex man"/>` //a링크에 들어갈 img 태그
  strip.insertBefore(link, strip.firstChild);           //strip의 자식노드인 삽입 하려는 자식노드 link를 strip.firstChild 기준에 맞춰 삽입
}

// 빨간 필터 효과
function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] + 100;
    pixels.data[i + 1] = pixels.data[i + 1] - 50;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }
  return pixels
}

// RGB 화면 번짐 효과
function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 350] = pixels.data[i] + 100;
    pixels.data[i + 120] = pixels.data[i + 1] - 50;
    pixels.data[i - 150] = pixels.data[i + 2] * 0.5;
  }
  return pixels
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
