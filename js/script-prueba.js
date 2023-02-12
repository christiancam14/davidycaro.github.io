const playerTrack = document.getElementById("player-track");
// const bgArtwork = document.getElementById("bg-artwork");
let bgArtworkUrl;
const albumName = document.getElementById("album-name");
const trackName = document.getElementById("track-name");
const albumArt = document.getElementById("album-art");
const sArea = document.getElementById("s-area");
const seekBar = document.getElementById("seek-bar");
const trackTime = document.getElementById("track-time");
const insTime = document.getElementById("ins-time");
const sHover = document.getElementById("s-hover");
const playPauseButton = document.getElementById("play-pause-button");
const i = playPauseButton.querySelector("i");
const tProgress = document.getElementById("current-time");
const tTime = document.getElementById("track-length");
let seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0, buffInterval = null, tFlag = false;
const albums = [
    "Dawn",
    "Me & You",
    "Electro Boy",
    "Home",
    "Proxy (Original Mix)"
];
const trackNames = [
    "Skylike - Dawn",
    "Alex Skrindo - Me & You",
    "Kaaze - Electro Boy",
    "Jordan Schor - Home",
    "Martin Garrix - Proxy"
];
const albumArtworks = ["_1", "_2", "_3", "_4", "_5"];
const trackUrl2 = [
    "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3",
    "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/1.mp3",
    "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/3.mp3",
    "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/4.mp3",
    "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/5.mp3"
];
const trackUrl = [
    "https://github.com/christiancam14/davidycaro.github.io/blob/master/te-voy-a-amar.mp3"
]
// const playPreviousTrackButton = document.getElementById("play-previous");
// const playNextTrackButton = document.getElementById("play-next");
let currIndex = -1;

function playPause() {
    setTimeout(function () {
    if (audio.paused) {
        playerTrack.classList.add("active");
        albumArt.classList.add("active");
        checkBuffering();
        i.setAttribute("class", "fas fa-pause");
        audio.play();
        } else {
        playerTrack.classList.remove("active");
        albumArt.classList.remove("active");
        clearInterval(buffInterval);
        albumArt.classList.remove("buffering");
        i.setAttribute("class", "fas fa-play");
        audio.pause();
        }
    }, 300);
}

function showHover(event) {
    seekBarPos = sArea.getBoundingClientRect();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.offsetWidth);

    sHover.style.width = `${seekT}px`;

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.textContent = "--:--";
    else insTime.textContent = `${ctMinutes}:${ctSeconds}`;

    insTime.style.left = `${seekT}px`;
    insTime.style.marginLeft = "-21px";
    insTime.style.display = "block";
}

function hideHover() {
    sHover.style.width = "0px";
    insTime.textContent = "00:00";
    insTime.style.left = "0px";
    insTime.style.marginLeft = "0px";
    insTime.style.display = "none";
}

function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.style.width = `${seekT}px`;
    hideHover();
}

function updateCurrTime() {
    const nTime = new Date();
    nTime.getTime();
    
    let tFlag = false;
    if (!tFlag) {
        tFlag = true;
        document.querySelector(".track-time").classList.add("active");
    }
    
    const audio = new Audio();
    let curMinutes = Math.floor(audio.currentTime / 60);
    let curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
    
    let durMinutes = Math.floor(audio.duration / 60);
    let durSeconds = Math.floor(audio.duration - durMinutes * 60);
    
    let playProgress = (audio.currentTime / audio.duration) * 100;
    
    if (curMinutes < 10) curMinutes = "0" + curMinutes;
    if (curSeconds < 10) curSeconds = "0" + curSeconds;
    
    if (durMinutes < 10) durMinutes = "0" + durMinutes;
    if (durSeconds < 10) durSeconds = "0" + durSeconds;
    
    if (isNaN(curMinutes) || isNaN(curSeconds)) {
        document.querySelector(".t-progress").textContent = "00:00";
    } else {
        document.querySelector(".t-progress").textContent = curMinutes + ":" + curSeconds;
    }
    
    if (isNaN(durMinutes) || isNaN(durSeconds)) {
        document.querySelector(".t-time").textContent = "00:00";
    } else {
        document.querySelector(".t-time").textContent = durMinutes + ":" + durSeconds;
    }
    
    if (
        isNaN(curMinutes) ||
        isNaN(curSeconds) ||
        isNaN(durMinutes) ||
        isNaN(durSeconds)
    ) {
        document.querySelector(".track-time").classList.remove("active");
    } else {
        document.querySelector(".track-time").classList.add("active");
    }
    
    document.querySelector(".seek-bar").style.width = playProgress + "%";
    
    if (playProgress === 100) {
        document.querySelector(".fa").className = "fa fa-play";
        document.querySelector(".seek-bar").style.width = "0%";
        document.querySelector(".t-progress").textContent = "00:00";
        document.querySelector(".album-art").classList.remove("buffering", "active");
        clearInterval(buffInterval);
    }
}

function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function() {
        let nowTime = new Date();
        nowTime = nowTime.getTime();
        
        if (nTime == 0 || bTime - nowTime > 1000) {
            albumArt.classList.add("buffering");
        } else {
            albumArt.classList.remove("buffering");
        }
        bTime = nowTime;
    }, 100);
}

function selectTrack(flag) {
    if (flag === 0 || flag === 1) currIndex++;
        else currIndex--;
    
        if (currIndex > -1 && currIndex < albumArtworks.length) {
            if (flag === 0) {
                i.classList.remove("fa-pause");
                i.classList.add("fa-play");
            } else {
                albumArt.classList.remove("buffering");
                i.classList.remove("fa-play");
                i.classList.add("fa-pause");
            }
    
            seekBar.style.width = "0%";
            trackTime.classList.remove("active");
            tProgress.textContent = "00:00";
            tTime.textContent = "00:00";
        
            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = albumArtworks[currIndex];
        
            audio.src = trackUrl[currIndex];
        
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();
        
        if (flag !== 0) {
            audio.play();
            playerTrack.classList.add("active");
            albumArt.classList.add("active");

            clearInterval(buffInterval);
            checkBuffering();
        }

        albumName.textContent = currAlbum;
        trackName.textContent = currTrackName;
        Array.from(albumArt.getElementsByTagName("img")).forEach((img) => {
            img.classList.remove("active");
        });
        document.getElementById(currArtwork).classList.add("active");
    
        // bgArtworkUrl = document.getElementById(currArtwork).src;
    
        // bgArtwork.style.backgroundImage = `url("${bgArtworkUrl}")`;
    } else {
        if (flag === 0 || flag === 1) currIndex--;
        else currIndex++;
    }
}
    
function initPlayer() {
    audio = new Audio();

    selectTrack(0);

    audio.loop = false;

    playPauseButton.addEventListener("click", playPause);

    sArea.addEventListener("mousemove", function(event) {
        showHover(event);
    });

    sArea.addEventListener("mouseout", hideHover);

    sArea.addEventListener("click", playFromClickedPos);

    audio.addEventListener("timeupdate", updateCurrTime);

    /*
    playPreviousTrackButton.addEventListener("click", function() {
        selectTrack(-1);
    });
    playNextTrackButton.addEventListener("click", function() {
        selectTrack(1);
    });
    */
}

initPlayer();