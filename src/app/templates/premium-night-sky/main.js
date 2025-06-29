
function initNightSky() {

  //estrelas

  var style = ["style1", "style2", "style3", "style4"];
  var tam = ["tam1", "tam1", "tam1", "tam2", "tam3"];
  var opacity = ["opacity1", "opacity1", "opacity1", "opacity2", "opacity2", "opacity3"];

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var estrela = "";
  var qtdeEstrelas = 300;
  var noite = document.querySelector(".constelacao");
  var widthWindow = window.innerWidth;
  var heightWindow = window.innerHeight;

  for (var i = 0; i < qtdeEstrelas; i++) {
    estrela += "<span class='estrela " + style[getRandomArbitrary(0, 4)] + " " + opacity[getRandomArbitrary(0, 6)] + " "
    + tam[getRandomArbitrary(0, 5)] + "' style='animation-delay: ." +getRandomArbitrary(0, 9)+ "s; left: "
    + getRandomArbitrary(0, widthWindow) + "px; top: " + getRandomArbitrary(0, heightWindow) + "px;'></span>";
  }

  noite.innerHTML = estrela;

  //meteoros

  var numeroAleatorio = 5000;

  setTimeout(function(){
    carregarMeteoro();
  }, numeroAleatorio);

  function carregarMeteoro(){
    setTimeout(carregarMeteoro, numeroAleatorio);
    numeroAleatorio = getRandomArbitrary(5000, 10000);
    var meteoro = "<div class='meteoro "+ style[getRandomArbitrary(0, 4)] +"'></div>";
    document.getElementsByClassName('chuvaMeteoro')[0].innerHTML = meteoro;
    setTimeout(function(){
      document.getElementsByClassName('chuvaMeteoro')[0].innerHTML = "";
    }, 1000);
  }
}

// Audio detection configuration
const SAMPLE_POLLING_MSECS = 50;
const MAX_INTERSPEECH_SILENCE_MSECS = 600;
const POST_SPEECH_MSECS = MAX_INTERSPEECH_SILENCE_MSECS;
const PRERECORDSTART_MSECS = 600;
const MIN_SIGNAL_DURATION = 400;
const VOLUME_SIGNAL = 0.02;
const VOLUME_SILENCE = 0.001;
const VOLUME_MUTE = 0.0001;
const MIN_AVERAGE_SIGNAL_VOLUME = 0.04;

const DEFAULT_PARAMETERS_CONFIGURATION = {
    timeoutMsecs: SAMPLE_POLLING_MSECS,
    prespeechstartMsecs: PRERECORDSTART_MSECS,
    speakingMinVolume: VOLUME_SIGNAL,
    silenceVolume: VOLUME_SILENCE,
    muteVolume: VOLUME_MUTE,
    recordingEnabled: true
};

// Audio detection functionality
let volumeState = 'mute';
let speechStarted = false;
let silenceItems = 0;
let signalItems = 0;
let speechstartTime;
let prerecordingItems = 0;
let speechVolumesList = [];

const average = (array) => array.reduce((a, b) => a + b) / array.length;
const averageSignal = () => average(speechVolumesList).toFixed(4);
const maxSilenceItems = Math.round(MAX_INTERSPEECH_SILENCE_MSECS / SAMPLE_POLLING_MSECS);
const dispatchEvent = (eventName, eventData) => document.dispatchEvent(new CustomEvent(eventName, eventData));

// Volume meter functionality
let meter = null;
let mediaStreamSource = null;
let audioStream = null;

function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
    const processor = audioContext.createScriptProcessor(512);
    processor.onaudioprocess = volumeAudioProcess;
    processor.clipping = false;
    processor.lastClip = 0;
    processor.volume = 0;
    processor.clipLevel = clipLevel || 0.98;
    processor.averaging = averaging || 0.95;
    processor.clipLag = clipLag || 750;

    processor.connect(audioContext.destination);

    processor.checkClipping = function() {
        if (!this.clipping) return false;
        if ((this.lastClip + this.clipLag) < window.performance.now())
            this.clipping = false;
        return this.clipping;
    };

    processor.shutdown = function() {
        this.disconnect();
        this.onaudioprocess = null;
    };

    return processor;
}

function volumeAudioProcess(event) {
    const buf = event.inputBuffer.getChannelData(0);
    const bufLength = buf.length;
    let sum = 0;
    let x;

    for (let i = 0; i < bufLength; i++) {
        x = buf[i];
        if (Math.abs(x) >= this.clipLevel) {
            this.clipping = true;
            this.lastClip = window.performance.now();
        }
        sum += x * x;
    }

    const rms = Math.sqrt(sum / bufLength);
    this.volume = Math.max(rms, this.volume * this.averaging);
}

function mute(timestamp, duration) {
    const eventData = {
        detail: {
            event: 'mute',
            volume: meter.volume,
            timestamp,
            duration
        }
    };
    
    dispatchEvent('mute', eventData);
    
    if (volumeState !== 'mute') {
        dispatchEvent('mutedmic', eventData);
        volumeState = 'mute';
    }
}

function signal(timestamp, duration) {
    silenceItems = 0;
    
    const eventData = {
        detail: {
            event: 'signal',
            volume: meter.volume,
            timestamp,
            duration,
            items: ++signalItems
        }
    };
   
    if (!speechStarted) {
        dispatchEvent('speechstart', eventData);
        speechstartTime = timestamp;
        speechStarted = true;
        speechVolumesList = [];
    }

    speechVolumesList.push(meter.volume);
    dispatchEvent('signal', eventData);

    if (volumeState === 'mute') {
        dispatchEvent('unmutedmic', eventData);
        volumeState = 'signal';
    }
}

function silence(timestamp, duration) {
    signalItems = 0;

    const eventData = {
        detail: {
            event: 'silence',
            volume: meter.volume,
            timestamp,
            duration,
            items: ++silenceItems
        }
    };
   
    dispatchEvent('silence', eventData);

    if (volumeState === 'mute') {
        dispatchEvent('unmutedmic', eventData);
        volumeState = 'silence';
    }

    if (speechStarted && (silenceItems === maxSilenceItems)) {
        const signalDuration = duration - MAX_INTERSPEECH_SILENCE_MSECS;
        const averageSignalValue = averageSignal();

        if (signalDuration < MIN_SIGNAL_DURATION) {
            eventData.detail.abort = `signal duration (${signalDuration}) < MIN_SIGNAL_DURATION (${MIN_SIGNAL_DURATION})`;
            dispatchEvent('speechabort', eventData);
        } else if (averageSignalValue < MIN_AVERAGE_SIGNAL_VOLUME) {
            eventData.detail.abort = `signal average volume (${averageSignalValue}) < MIN_AVERAGE_SIGNAL_VOLUME (${MIN_AVERAGE_SIGNAL_VOLUME})`;
            dispatchEvent('speechabort', eventData);
        } else {
            dispatchEvent('speechstop', eventData);
        }

        speechStarted = false;
    }
}

function sampleThresholdsDecision(muteVolume, speakingMinVolume) {
    const timestamp = Date.now();
    const duration = timestamp - speechstartTime;

    if (meter.volume < muteVolume) {
        mute(timestamp, duration);
    } else if (meter.volume > speakingMinVolume) {
        signal(timestamp, duration);
    } else {
        silence(timestamp, duration);
    }
}

function prerecording(prespeechstartMsecs, timeoutMsecs) {
    ++prerecordingItems;

    const eventData = {
        detail: {
            volume: meter.volume,
            timestamp: Date.now(),
            items: prerecordingItems
        }
    };

    if ((prerecordingItems * timeoutMsecs) >= prespeechstartMsecs) {
        if (!speechStarted)
            dispatchEvent('prespeechstart', eventData);

        prerecordingItems = 0;
    }
}

function audioDetection(config) {
    setTimeout(() => {
        prerecording(config.prespeechstartMsecs, config.timeoutMsecs);

        if (config.recordingEnabled) {
            sampleThresholdsDecision(config.muteVolume, config.speakingMinVolume);
        }

        audioDetection(config);
    }, config.timeoutMsecs);
}

// Candle and balloon functionality
const CANDLE_COUNT = 20;
let candlesLit = CANDLE_COUNT;
let autoBlowTimeout;

function createCandles() {
    const cakeElement = document.querySelector('.cake');
    const colors = ['#FF5733', '#FFC300', '#DAF7A6', '#FF3366', '#36D7B7', '#5DADE2', '#AF7AC5', '#F1948A', '#58D68D', '#F39C12'];
    
    for (let i = 0; i < CANDLE_COUNT; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        candle.style.left = `${10 + (i % 5) * 20}%`;
        candle.style.top = `${+10 - Math.floor(i / 5) * 15}px`;
        candle.style.height = `${20 + Math.random() * 20}px`; // Random height for realism
        candle.style.backgroundColor = colors[i % colors.length];
        
        const flame = document.createElement('div');
        flame.className = 'flame';
        candle.appendChild(flame);
        
        cakeElement.appendChild(candle);
    }

    // Set a timeout to automatically blow out candles after 15 seconds
    autoBlowTimeout = setTimeout(() => {
        blowOutCandles();
    }, 15000);
}

function blowOutCandles() {
    clearTimeout(autoBlowTimeout); // Clear the auto-blow timeout

    const flames = document.querySelectorAll('.flame');
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.style.opacity = '0';
            candlesLit--;
            if (candlesLit === 0) {
                setTimeout(() => {
                    // Show the popup after 10 seconds
                    document.getElementById('popup').classList.add('show');

                    // Stop the microphone
                    if (mediaStreamSource) {
                        mediaStreamSource.disconnect();
                        meter.shutdown();
                    }
                    if (audioStream) {
                        audioStream.getTracks().forEach(track => track.stop());
                    }

                    // Hide the cake and instructions
                     document.getElementById('cake-holder').style.display = 'none';
                     document.getElementById('instructions').style.display = 'none';


                     // Show firecrackers
                     showFirecrackers();
                     showBalloons();
                 }, 10000); // 10 seconds delay
            }
        }, index * 100);
    });
}

function showFirecrackers() {
    const firecrackerContainer = document.createElement('div');
    firecrackerContainer.className = 'firecracker-container';
    document.body.appendChild(firecrackerContainer);

    const firecrackerCount = 50;
    for (let i = 0; i < firecrackerCount; i++) {
        const firecracker = document.createElement('div');
        firecracker.className = 'firecracker';
        firecracker.style.left = `${Math.random() * 100}%`;
        firecracker.style.top = `${Math.random() * 100}%`;
        firecracker.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        firecracker.style.animationDelay = `${Math.random() * 2}s`;
        firecrackerContainer.appendChild(firecracker);
    }

    // The longest animation is 2s delay + 2s duration = 4s.
    // Remove the container after 4.5s to be safe.
    setTimeout(() => {
        if (firecrackerContainer) {
            firecrackerContainer.remove();
        }
    }, 4500);
}

function showBalloons() {
    const balloonContainer = document.createElement('div');
    balloonContainer.className = 'balloon-container';
    document.body.appendChild(balloonContainer);
    
    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.animationDelay = `${Math.random() * 2}s`;
        balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%, 0.7)`;
        balloonContainer.appendChild(balloon);
    }
}

// Fireworks functionality
let w, h, ctx;
const opts = {
    strings: ['HAPPY', 'BIRTHDAY', window.birthdayData.toName.toUpperCase()],
    charSize: 30,
    charSpacing: 35,
    lineHeight: 40,
    
    cx: 0,
    cy: 0,
    
    fireworkPrevPoints: 10,
    fireworkBaseLineWidth: 5,
    fireworkAddedLineWidth: 8,
    fireworkSpawnTime: 200,
    fireworkBaseReachTime: 30,
    fireworkAddedReachTime: 30,
    fireworkCircleBaseSize: 20,
    fireworkCircleAddedSize: 10,
    fireworkCircleBaseTime: 30,
    fireworkCircleAddedTime: 30,
    fireworkCircleFadeBaseTime: 10,
    fireworkCircleFadeAddedTime: 5,
    fireworkBaseShards: 5,
    fireworkAddedShards: 5,
    fireworkShardPrevPoints: 3,
    fireworkShardBaseVel: 4,
    fireworkShardAddedVel: 2,
    fireworkShardBaseSize: 3,
    fireworkShardAddedSize: 3,
    gravity: .1,
    upFlow: -.1,
    letterContemplatingWaitTime: 360,
    balloonSpawnTime: 20,
    balloonBaseInflateTime: 10,
    balloonAddedInflateTime: 10,
    balloonBaseSize: 20,
    balloonAddedSize: 20,
    balloonBaseVel: .4,
    balloonAddedVel: .4,
    balloonBaseRadian: -(Math.PI / 2 - .5),
    balloonAddedRadian: -1,
};

const calc = {
    totalWidth: opts.charSpacing * Math.max(opts.strings[0].length, opts.strings[1].length)
};

const Tau = Math.PI * 2;
const TauQuarter = Tau / 4;

const letters = [];

class Letter {
    constructor(char, x, y) {
        this.char = char;
        this.x = x;
        this.y = y;
        
        this.dx = -ctx.measureText(char).width / 2;
        this.dy = +opts.charSize / 2;
        
        this.fireworkDy = this.y - h / 2;
        
        this.color = `hsl(${x / calc.totalWidth * 360}, 80%, 50%)`;
        this.lightAlphaColor = `hsla(${x / calc.totalWidth * 360}, 80%, light%, alp)`;
        this.lightColor = `hsl(${x / calc.totalWidth * 360}, 80%, light%)`;
        this.alphaColor = `hsla(${x / calc.totalWidth * 360}, 80%, 50%, alp)`;
        
        this.reset();
    }
    
    reset() {
        this.phase = 'firework';
        this.tick = 0;
        this.spawned = false;
        this.spawningTime = opts.fireworkSpawnTime * Math.random() | 0;
        this.reachTime = opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random() | 0;
        this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
        this.prevPoints = [[0, h, 0]];
    }
    
    step() {
        if (this.phase === 'firework') {
            if (!this.spawned) {
                ++this.tick;
                if (this.tick >= this.spawningTime) {
                    this.tick = 0;
                    this.spawned = true;
                }
            } else {
                ++this.tick;
                
                let linearProportion = this.tick / this.reachTime,
                    armonicProportion = Math.sin(linearProportion * TauQuarter),
                    
                    x = linearProportion * this.x,
                    y = h + armonicProportion * this.fireworkDy;
                
                if (this.prevPoints.length > opts.fireworkPrevPoints)
                    this.prevPoints.shift();
                
                this.prevPoints.push([x, y, linearProportion * this.lineWidth]);
                
                let lineWidthProportion = 1 / (this.prevPoints.length - 1);
                
                for (let i = 1; i < this.prevPoints.length; ++i) {
                    let point = this.prevPoints[i],
                        point2 = this.prevPoints[i - 1];
                        
                    ctx.strokeStyle = this.alphaColor.replace('alp', i / this.prevPoints.length);
                    ctx.lineWidth = point[2] * lineWidthProportion * i;
                    ctx.beginPath();
                    ctx.moveTo(point[0], point[1]);
                    ctx.lineTo(point2[0], point2[1]);
                    ctx.stroke();
                }
                
                if (this.tick >= this.reachTime) {
                    this.phase = 'contemplate';
                    
                    this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
                    this.circleCompleteTime = opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random() | 0;
                    this.circleCreating = true;
                    this.circleFading = false;
                    
                    this.circleFadeTime = opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random() | 0;
                    this.tick = 0;
                    this.tick2 = 0;
                    
                    this.shards = [];
                    
                    let shardCount = opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random() | 0,
                        angle = Tau / shardCount,
                        cos = Math.cos(angle),
                        sin = Math.sin(angle),
                        
                        x = 1,
                        y = 0;
                    
                    for (let i = 0; i < shardCount; ++i) {
                        let x1 = x;
                        x = x * cos - y * sin;
                        y = y * cos + x1 * sin;
                        
                        this.shards.push(new Shard(this.x, this.y, x, y, this.alphaColor));
                    }
                }
                
            }
        } else if (this.phase === 'contemplate') {
            ++this.tick;
            
            if (this.circleCreating) {
                ++this.tick2;
                let proportion = this.tick2 / this.circleCompleteTime,
                    armonic = -Math.cos(proportion * Math.PI) / 2 + .5;
                
                ctx.beginPath();
                ctx.fillStyle = this.lightAlphaColor.replace('light', 50 + 50 * proportion).replace('alp', proportion);
                ctx.beginPath();
                ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
                ctx.fill();
                
                if (this.tick2 > this.circleCompleteTime) {
                    this.tick2 = 0;
                    this.circleCreating = false;
                    this.circleFading = true;
                }
            } else if (this.circleFading) {
                ctx.fillStyle = this.lightColor.replace('light', 70);
                ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
                
                ++this.tick2;
                let proportion = this.tick2 / this.circleFadeTime,
                    armonic = -Math.cos(proportion * Math.PI) / 2 + .5;
                
                ctx.beginPath();
                ctx.fillStyle = this.lightAlphaColor.replace('light', 100).replace('alp', 1 - armonic);
                ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
                ctx.fill();
                
                if (this.tick2 >= this.circleFadeTime)
                    this.circleFading = false;
                
            } else {
                ctx.fillStyle = this.lightColor.replace('light', 70);
                ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
            }
            
            for (let i = 0; i < this.shards.length; ++i) {
                this.shards[i].step();
                
                if (!this.shards[i].alive) {
                    this.shards.splice(i, 1);
                    --i;
                }
            }
            
            if (this.tick > opts.letterContemplatingWaitTime) {
                this.phase = 'balloon';
                
                this.tick = 0;
                this.spawning = true;
                this.spawnTime = opts.balloonSpawnTime * Math.random() | 0;
                this.inflating = false;
                this.inflateTime = opts.balloonBaseInflateTime + opts.balloonAddedInflateTime * Math.random() | 0;
                this.size = opts.balloonBaseSize + opts.balloonAddedSize * Math.random() | 0;
                
                let rad = opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
                    vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();
                
                this.vx = Math.cos(rad) * vel;
                this.vy = Math.sin(rad) * vel;
            }
        } else if (this.phase === 'balloon') {
            ctx.strokeStyle = this.lightColor.replace('light', 80);
            
            if (this.spawning) {
                ++this.tick;
                ctx.fillStyle = this.lightColor.replace('light', 70);
                ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
                
                if (this.tick >= this.spawnTime) {
                    this.tick = 0;
                    this.spawning = false;
                    this.inflating = true;    
                }
            } else if (this.inflating) {
                ++this.tick;
                
                let proportion = this.tick / this.inflateTime,
                    x = this.cx = this.x,
                    y = this.cy = this.y - this.size * proportion;
                
                ctx.fillStyle = this.alphaColor.replace('alp', proportion);
                ctx.beginPath();
                generateBalloonPath(x, y, this.size * proportion);
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, this.y);
                ctx.stroke();
                
                ctx.fillStyle = this.lightColor.replace('light', 70);
                ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
                
                if (this.tick >= this.inflateTime) {
                    this.tick = 0;
                    this.inflating = false;
                }
                
            } else {
                this.cx += this.vx;
                this.cy += this.vy += opts.upFlow;
                
                ctx.fillStyle = this.color;
                ctx.beginPath();
                generateBalloonPath(this.cx, this.cy, this.size);
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(this.cx, this.cy);
                ctx.lineTo(this.cx, this.cy + this.size);
                ctx.stroke();
                
                ctx.fillStyle = this.lightColor.replace('light', 70);
                ctx.fillText(this.char, this.cx + this.dx, this.cy + this.dy + this.size);
                
                if (this.cy + this.size < -opts.height || this.cx < -opts.width || this.cy > opts.width)
                    this.phase = 'done';
            }
        }
    }
}

class Shard {
    constructor(x, y, vx, vy, color) {
        let vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
        this.vx = vx * vel;
        this.vy = vy * vel;
        this.x = x;
        this.y = y;
        this.prevPoints = [[x, y]];
        this.color = color;
        this.alive = true;
        this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
    }
    
    step() {
        this.x += this.vx;
        this.y += this.vy += opts.gravity;
        
        if (this.prevPoints.length > opts.fireworkShardPrevPoints)
            this.prevPoints.shift();
        
        this.prevPoints.push([this.x, this.y]);
        
        let lineWidthProportion = this.size / this.prevPoints.length;
        
        for (let k = 0; k < this.prevPoints.length - 1; ++k) {
            let point = this.prevPoints[k],
                point2 = this.prevPoints[k + 1];
            
            ctx.strokeStyle = this.color.replace('alp', (k + 1) / this.prevPoints.length);
            ctx.lineWidth = k * lineWidthProportion;
            ctx.beginPath();
            ctx.moveTo(point[0], point[1]);
            ctx.lineTo(point2[0], point2[1]);
            ctx.stroke();
        }
        
        if (this.prevPoints[0][1] > h)
            this.alive = false;
    }
}

function generateBalloonPath(x, y, size) {
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size / 2, y - size / 2,
                      x - size / 4, y - size,
                      x, y - size);
    ctx.bezierCurveTo(x + size / 4, y - size,
                      x + size / 2, y - size / 2,
                      x, y);
}

function anim() {
    window.requestAnimationFrame(anim);
    
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);
    
    ctx.translate(opts.cx, opts.cy);
    
    let done = true;
    for (let l = 0; l < letters.length; ++l) {
        letters[l].step();
        if (letters[l].phase !== 'done')
            done = false;
    }
    
    ctx.translate(-opts.cx, -opts.cy);
    
    if (done)
        for (let l = 0; l < letters.length; ++l)
            letters[l].reset();
}

function initFireworks() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    opts.cx = w / 2;
    opts.cy = h / 2;

    for (let i = 0; i < opts.strings.length; ++i) {
        for (let j = 0; j < opts.strings[i].length; ++j) {
            letters.push(new Letter(opts.strings[i][j], 
                                    j * opts.charSpacing + opts.charSpacing / 2 - opts.strings[i].length * opts.charSize / 2,
                                    i * opts.lineHeight + opts.lineHeight / 2 - opts.strings.length * opts.lineHeight / 2));
        }
    }

    ctx.font = opts.charSize + 'px Verdana';

    anim();
}

// Main initialization
let audioContext = null;
let debuglog = false;
let showCakePopupTimeout; // Variable to store the timeout ID


window.onload = function() {
    initNightSky();

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    document.querySelector('#start').addEventListener('click', function() {
        document.querySelector('#start').style.display = 'none'; // Hide start button

       // Show greetings screen
        document.getElementById('greetings-screen').classList.add('show');

        // Initialize and display fireworks
        initFireworks();
        // Start playing the audio
          const audio = document.getElementById('birthday-audio');
          audio.play().then(() => {
              console.log('Audio playback started successfully');
          }).catch(error => {
              console.error('Audio playback failed:', error);
          });

          // Show cake popup after 10 seconds
          showCakePopupTimeout = setTimeout(() => {
               document.getElementById('greetings-screen').classList.remove('show');
             document.getElementById('cake-popup').classList.add('show');
          }, 10000);
          

        audioContext.resume().then(() => {
             console.log('User interacted with the page. Playback resumed successfully');
        });
    });

      // Handle cake pop-up cancel button click
       document.getElementById('cake-cancel-button').addEventListener('click', function(){
            clearTimeout(showCakePopupTimeout);
            document.getElementById('cake-popup').classList.remove('show');
             document.querySelector('#cake-holder').style.opacity = 1; // Show cake
            document.querySelector('#instructions').style.opacity = 1; // Show instructions
            createCandles(); // Create candles

        });
         // Handle cake pop-up OK button click
        document.getElementById('cake-ok-button').addEventListener('click', function() {
             clearTimeout(showCakePopupTimeout);
             document.getElementById('cake-popup').classList.remove('show');
             document.querySelector('#cake-holder').style.opacity = 1; // Show cake
             document.querySelector('#instructions').style.opacity = 1; // Show instructions
             createCandles(); // Create candles
         });



    document.querySelector('#startconsoledebug').addEventListener('click', function() {
        debuglog = true;
    });

    document.querySelector('#stopconsoledebug').addEventListener('click', () => {
        debuglog = false;
    });

    try {
        navigator.mediaDevices.getUserMedia({
            'audio': {
                'mandatory': {
                    'googEchoCancellation': 'false',
                    'googAutoGainControl': 'false',
                    'googNoiseSuppression': 'false',
                    'googHighpassFilter': 'false'
                },
                'optional': []
            },
        }).then(stream => {
            audioStream = stream;
            mediaStreamSource = audioContext.createMediaStreamSource(stream);
            meter = createAudioMeter(audioContext);
            mediaStreamSource.connect(meter);
            audioDetection(DEFAULT_PARAMETERS_CONFIGURATION);
        })
        .catch(didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
};

function didntGetStream() {
    alert('Stream generation failed.');
}

// Event listeners
document.addEventListener('signal', event => {
    const volume = event.detail.volume.toFixed(9);
    const timestamp = event.detail.timestamp;
    const items = event.detail.items.toString().padEnd(3);
    const dBV = -Math.round(20 * Math.log10(1 / event.detail.volume));

    if (dBV >= -17) {
        console.log('Happy Birthday');
        blowOutCandles();
    }
    if (debuglog)
        console.log(`signal  ${timestamp} ${items} ${volume} ${dBV}`);
});

document.addEventListener('silence', event => {
    if (debuglog) {
        const volume = event.detail.volume.toFixed(9);
        const timestamp = event.detail.timestamp;
        const items = event.detail.items.toString().padEnd(3);
        const dBV = -Math.round(20 * Math.log10(1 / event.detail.volume));
        console.log(`silence ${timestamp} ${items} ${volume} ${dBV}`);
    }
});

document.addEventListener('mute', event => {
    if (debuglog) {
        const volume = event.detail.volume.toFixed(9);
        const timestamp = event.detail.timestamp;
        const dBV = -Math.round(20 * Math.log10(1 / event.detail.volume));
            console.log(`mute    ${timestamp} ${volume} ${dBV}`);
    }
});

document.addEventListener('prespeechstart', event => {
    if (debuglog) {
        const timestamp = event.detail.timestamp;
        console.log(`%cPRE SPEECH START   ${timestamp}`, 'color:blue');
    }
});

document.addEventListener('speechstart', event => {
    if (debuglog) {
        console.log('%cSPEECH START', 'color:greenyellow');
    }
});

document.addEventListener('speechstop', event => {
    if (debuglog) {
        const duration = event.detail.duration;
        const averageSignalLevel = averageSignal();
        console.log('%cSPEECH STOP', 'color:lime');
        console.log(`Total Duration in msecs  : ${duration}`);
        console.log(`Signal Duration in msecs : ${duration - MAX_INTERSPEECH_SILENCE_MSECS}`);
        console.log(`Average Signal level     : ${averageSignalLevel}`);
        console.log(`Average Signal dB        : ${-Math.round(20 * Math.log10(1 / averageSignalLevel))}`);
        console.log(' ');
    }
});

document.addEventListener('speechabort', event => {
    if (debuglog) {
        const abort = event.detail.abort;
                const duration = event.detail.duration;
        const averageSignalLevel = averageSignal();
        console.log('%cSPEECH ABORT', 'color:red');
        console.log(`Abort reason             : ${abort}`);
        console.log(`Total Duration in msecs  : ${duration}`);
        console.log(`Signal Duration in msecs : ${duration - MAX_INTERSPEECH_SILENCE_MSECS}`);
        console.log(`Average Signal level     : ${averageSignalLevel}`);
        console.log(`Average Signal dB        : ${-Math.round(20 * Math.log10(1 / averageSignalLevel))}`);
        console.log(' ');
    }
});

document.addEventListener('mutedmic', event => {
    console.log('%cMICROPHONE MUTED', 'color:red');
    console.log(' ');
});

document.addEventListener('unmutedmic', event => {
    console.log('%cMICROPHONE UNMUTED', 'color:green');
    console.log(' ');
});

window.addEventListener('resize', function() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    
    opts.cx = w / 2;
    opts.cy = h / 2;
    
    ctx.font = opts.charSize + 'px Verdana';
});

const canvas = document.getElementById('c');
ctx = canvas.getContext('2d');

// Popup and messages functionality
document.getElementById('ok-button').addEventListener('click', function() {
    // Hide the popup
    document.getElementById('popup').classList.remove('show');
     
     // Start playing the audio
    const audio = document.getElementById('birthday-audio');
    audio.play().then(() => {
        console.log('Audio playback started successfully');
    }).catch(error => {
        console.error('Audio playback failed:', error);
    });
    // Show the messages
     showMessages();
});

document.getElementById('cancel-button').addEventListener('click', function() {
    // Hide the popup
    document.getElementById('popup').classList.remove('show');

    // Start playing the audio
    const audio = document.getElementById('birthday-audio');
    audio.play().then(() => {
        console.log('Audio playback started successfully');
    }).catch(error => {
        console.error('Audio playback failed:', error);
    });
    // Show the messages
     showMessages();
});


function showMessages() {
    const baseMessages = [
       `Once again Happy Birthday ${window.birthdayData.toName} 🎂`,
        window.birthdayData.message
    ];

    const userClosingMessages = window.birthdayData.closingMessages
        ? window.birthdayData.closingMessages.split('\n').filter(line => line.trim() !== '')
        : [
            "Wishing you all the best!",
            "May all your dreams come true!",
            "May your whole life be healthy and peaceful"
          ];

    const concludingMessages = [
        "Did you Liked it?🤔",
        "If Yes then click on 'Liked it' at last,",
        "else rewatch it 😅",
        "Sorry, because it wasn't perfectly build",
        "as it is still in developing stage",
        "The End",
        `💖 A special wish from ${window.birthdayData.fromName} 💖`
    ];

    const messages = [...baseMessages, ...userClosingMessages, ...concludingMessages];


    const messagesElement = document.getElementById('messages');
    messagesElement.style.display = 'block';

    let index = 0;
    function showNextMessage() {
        if (index < messages.length) {
            messagesElement.innerHTML = `<p>${messages[index]}</p>`;
            index++;
            setTimeout(showNextMessage, 3000); // Show each message for 3 seconds
        } else {
             messagesElement.style.display = 'none';
              document.getElementById('final-popup').classList.add('show');
        }
    }

    showNextMessage();
}

// Final pop-up functionality
document.getElementById('rewatch-button').addEventListener('click', function() {
    location.reload(); // Reload the page for rewatch
});

document.getElementById('liked-button').addEventListener('click', function() {
    document.getElementById('final-popup').classList.remove('show');
    
    const secretMessageContainer = document.getElementById('secret-message');
    if (window.birthdayData.secretMessage && window.birthdayData.secretMessage.trim().length > 0 && secretMessageContainer) {
        secretMessageContainer.classList.add('show');
    
        setTimeout(() => {
            secretMessageContainer.classList.remove('show');
        }, 5000); //Hide after 5 seconds
    }
});
