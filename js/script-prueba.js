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
    "https://doc-0s-1c-docs.googleusercontent.com/docs/securesc/3ndgmg30f3fg6pre99j9ria49clrnkg8/ntltr65v4sl7oe2ut350ef47edm3indl/1676175750000/00871116392438482617/00871116392438482617/11es4yyTllcEfpwF01G2ZxE_QbtlEQi3h?e=download&ax=AB85Z1BaQLNyRq9bRnISuYDusEx6amaEkOcsq9CtsVZzvG2rERs6lDPUMg_DYz0esxSFu0eds4Y292Y9fn6XtfWMu7CgIOk6E4V8L5QwQagfcCOcZ0ohzlSGkFUcG7iR3ZWvdlTLBsTXNHtvtYa4_4wlDrQyUzfsS643fXKz5n9s_8XJI_6P8N47lGn_xPJDrV-LQ9hbPZHSBGEju-2k5E6EYW1ptH2gRoPoodC3r0U51Ls-cuTfH2yJ1e3CS5r-HfqZZ9jdTCshdiR_-GJsGOCJC5ofeqAZJUzL61RmhTE3GvAdwkZb36uG91WhvljFCNakKWb0fEB_1ZZ9PsQAMuztObJhQ2h1HiZ_A0YLvD7ee0t5z9VLWFNRz4JSK0mjiUoujnVNoGiFihKYhLSUzijItVoJpWhoTanO2PXeGPBfSMGhZZ7dccueCgLrKid1n1WV0g0S8N9KjxIIkVlXZPpUdnEnE82k4FlmC8iXnZaZipxu7Kyi-gtGJXGI--SHMVxvvvvk26VOhPNki3JIHzX-uwpXvZguTBpoUVdf_n-8gydlGENQH-ob-53H3p9j95AUXVdCdg6azlG60C6BtRRPIO6hA2trPefFpbkPj09O3PngZl67hPr4bdPTFa4X1JKuCv1BkrkPa5iA4vLjGVej6dvAAjxz0WbsNIX6GK7QqZdJHDh02IMT-jmR010TpIKl3S0IKh4NwHGttJ-RqvX_Vj00PYGuJnhiIcy9XMwxPjjigTZXcBH-V_BCE7A9ouuWWPfVu-SAO6Ogbc8bwiuDtzm44mH9QKRCwWJOMXbFTZ1_hVSaH3ZRkD6GGdGSlnCNhajZquKFITORQ0nXhaAuDlZcOM32C_m_xZAzpy8fgG2RRuqfDRRfj_QIyn7HhbV5IJhTzlSmTcbbkKkFfK7HSchbBqxJVSH0Uvf7oDl90hceMOfksjsjX5VDQTWbRXFVXN8Pr4FdsLHm2C6EfuttWlZoLJnWV0J-CAv7vE32d92L&uuid=e9007d7c-b4b8-4523-97a0-b871fe48b492&authuser=0"
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