var mic; //p5 Mic Instance
var fft; //p5 FFT Instance
var w; //Width of each bar in the display
var spectrum; //FFT results
var allowed = false; //to store if userMedia is allowed to analyzing capturing audio data
var constraints = {audio: true};
var bins = 512; //FFT Bins
var rect_color
var by = 0
var ampVol;
var ampHistory = [];
var style = false; //to chose between waveform or bars as a way to display FFT


function preload(){
  bg = loadImage("assets/bg_Final.jpg")
}

function setup(){

    navigator.mediaDevices.getUserMedia(constraints);
    createCanvas(1050,400);
    colorMode(RGB);
    userStartAudio().then(function() {
        ampVol = new p5.Amplitude();
        mic = new p5.AudioIn();
        mic.start();
        fft = new p5.FFT(0.88,bins);
        fft.setInput(mic);
        allowed=true;
        ampVol.setInput(mic);
      });
      w = width/256;

  }

  function draw(){

    colorMode(RGB);
    var white = color(255,255,255);
    var yellow = color(218, 165, 32);
    background(0);
     if(allowed){
      button = createButton('Change Style');
      button.position(55, 100);
      button.mousePressed(greet);
      var inAmp = ampVol.getLevel();
      ampHistory.push(inAmp);
        image(bg,-800,0);
        spectrum= fft.analyze();
        beginShape();
        stroke(200);
        noFill();
        for(var i=1;i<spectrum.length/2;i++){
            var amp = spectrum[i];
            var y = map(amp,0,300,height,100);
            var iMapto = map(i,0,spectrum.length/2,10,width-10);
            var DrwLine = true;
            if(!style){ //FFT in Lines Style
           noStroke();
           textSize(13);
           if(i==20){
            fill(255,255,255);
            text("1 K",iMapto,390);
           }
           if(i==65){
            fill(255,255,255);
            text("3 K",iMapto,390);
           }
           if(i==112){
            fill(255,255,255);
            text("5 K",iMapto,390);
           }

           if(i>0 && i<=78) //0>2900 Hz
           {
            by = map(i,0,78,0,1);
            rect_color = lerpColor(white, yellow, by);

           }
           else if(i>78 && i<=116 ) //2900>5000 Hz
           {
            rect_color = yellow
           }
           else{
            by = map(i,114,512,0,1);
            rect_color = lerpColor(yellow, white, by);
           }

           fill(rect_color);

           rect(iMapto,y-30,w,height-y);
          }

          if(style){ //FFT in WaveForm Style
           vertex(iMapto,y);
        }
      }
        endShape();
        noFill();
        beginShape();
        //Waveform Display
        for(var i=0;i<ampHistory.length;i++)
        {
          var iMap = map(i,0,ampHistory.length,width-200,width-20)
          var yAMP = map(ampHistory[i],0,1,100,50);
          stroke(255);
          vertex(iMap,yAMP);
        }
        endShape();
        noStroke();
        if(ampHistory.length>200)
        {
          ampHistory.splice(0,1);
        }

        fill(255,255,255);
        rect(10,y,1,1);
      }
    }

    function greet(){
      style = !style;
    }
