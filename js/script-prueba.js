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
    "Andrés Cepeda",
    "Andrés Cepeda",
    "Andrés Cepeda",
    "Andrés Cepeda",
    "Andrés Cepeda"
];
const trackNames = [
    "Te voy a amar",
    "Te voy a amar",
    "Te voy a amar",
    "Te voy a amar",
    "Te voy a amar"
];
const albumArtworks = ["_1", "_2", "_3", "_4", "_5"];
const trackUrl = [
    "https://github.com/christiancam14/davidycaro.github.io/raw/master/te-voy-a-amar.mp3",
    "https://github.com/christiancam14/davidycaro.github.io/raw/master/te-voy-a-amar.mp3",
    "https://github.com/christiancam14/davidycaro.github.io/raw/master/te-voy-a-amar.mp3",
    "https://github.com/christiancam14/davidycaro.github.io/raw/master/te-voy-a-amar.mp3",
    "https://github.com/christiancam14/davidycaro.github.io/raw/master/te-voy-a-amar.mp3"
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
        trackTime.classList.add("active");
    }
    
    // const audio = new Audio("https://github.com/christiancam14/davidycaro.github.io/raw/master/te-voy-a-amar.mp3");
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
        tProgress.textContent = "00:00";
    } else {
        tProgress.textContent = curMinutes + ":" + curSeconds;
    }
    
    if (isNaN(durMinutes) || isNaN(durSeconds)) {
        tTime.textContent = "00:00";
    } else {
        tTime.textContent = durMinutes + ":" + durSeconds;
    }
    
    if (
        isNaN(curMinutes) ||
        isNaN(curSeconds) ||
        isNaN(durMinutes) ||
        isNaN(durSeconds)
    ) {
        trackTime.classList.remove("active");
    } else {
        trackTime.classList.add("active");
    }
    
    document.querySelector("#seek-bar").style.width = playProgress + "%";
    
    if (playProgress === 100) {
        document.querySelector(".fa").className = "fa fa-play";
        document.querySelector("#seek-bar").style.width = "0%";
        tProgress.textContent = "00:00";
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
            // trackTime.classList.remove("active");
            tProgress.textContent = "00:00";
            tTime.textContent = "00:00";
        
            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = "https://lh3.googleusercontent.com/fife/AMPSeme7qFoXS5x4SURAypbe8OECTyun17Yjdf9a1WBKgWMlKPYSKIENw81Z0DbkCG5IuH0DU8gUQDOALyTkbuTvO1A0CMb0D0zS_nhw0YG3j8-PmDxbu5SlJwernz3_r_Muk-CvjKODe7DAx_aQ1m0nmfukL0J_2es_JXzfS3dQanqBmCWOs3gnCWwt98HQOmjrXavqAxYWRRTIDg-7omH90WUYFXx9eGgvvm00k0Gj0e8euFmGw_-7u80eSigPdU4-ZnCnHc06kF6cohkdOgGu18rpRAMhoLlj1eEjG3w3xtCSP7CF-JDTuCr4lU04-dpdpGtGiM00RHnpUhQ4CJbegiGh5FjMrFY39S1iO5nfpYYHlxNeg0Rto1XobRmTgh3AgCn6XKe2PSeYnubAJ4kB8tlfJVoT9HhTRwHN4QMZ6vsBlCE_NuwWLsC7BDMLamSqdEyTRUQn_RfhpFWGNTpvyFQpJiP8bU8MXlXNZD665cVY5JEuKUGnHGcMOi644shE_-AUJJlI1DCS_renQMRzPZ3Wjo5aUzHeZP4DGGRMqPuUZ2YMO5o3k9kT_zaZI5oodByKu3oEKgWZzODyfEL5O7xo9nZ3XfqNVEpS-qWvVBVokjqEjVT0omLYy9YfsPyAcx9m6wa1SEJnZ47v7zFPCa5db52O4qnbJv4FG-CHVqIobIFIShJGtQ8pqljzy51Ddv3BYYTvGmCv4UHis7J8ZXsbbJJZ9yGDi88YGuQyRFHIJdxxtgkFCDV4B8TCGLFSV11kX86JdxDIJsjxfoPAQqtR1T6QCtmMHeX3GLNAO6XWC0z6bin0FxHcQa0kxFsJIqUOmE7v07o9fYhAwWiWHOXVCpFQoH--hEjHYmd-VIVUdjJA1pg0Ls1iVnUPjDmiRxla9t5PKWvIoT53YZJ7HSodG5NFudth2vboT4vK1RRfudog8YJdXoTT-hbRuwqUUdZcWV52uHymZNh5SbZ6JtIGF_0CmOl1YniiAK42jO7DTKqGzKWzrwl1U3O9fViJCcrEi8Ayde5PpXlC3JxTQsqHmuRWowqD9b8Yy_u0kUFnbJnlNS7SoQGZZCvhQ8KEImtnqrILXlBENquZIGy2L6Ni189z7SO6NE5sAVhMuTafFLGtVv7UWjWWVR9o53-XnyEzFOrA6icRmV7CNMZOLRcySZ23VtH4tEpdMNBGBm3hgumYm_lge14eTlqRM7lfV9r2Ds1NvRJk5ujggF_TRt2U_iV48iARNFPVOWkfgqXiHUnvhVo32jAFZmU_IgPe89sxKpMCGQVZjRwV8nfj4v0XJo0tUfRWhIoyTN4WVNdiFrwVlM8aALJfEnfQHPovl5gukF3pYrdM1b2Y1y5ICYu257nDLS29q3vzgG0oB4TuVfhyxSLpzeNs4Pz8-o_h40tPpFfZ5u5nW0BVK2succVOppSIpIayPvdirheHcv7BGPYE2IFS5ef4zQ61TUg-mMQdxl_ZDsjzawM5Mgdjp2v_zjuTaZGMn5Sz71-9hnCJFKoZLXYyi6-28X7Yncx6SDbb7iCXomOsBbnfPM3Owia0iCZUVeTmZpg0DdRe6zgmtYC7yWPtLwvkkK22Xpqquw=w1136-h951";
        
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
    } else {
        if (flag === 0 || flag === 1) currIndex--;
        else currIndex++;
    }
}
    
function initPlayer() {
    audio = new Audio("https://github.com/christiancam14/davidycaro.github.io/raw/master/te-voy-a-amar.mp3");

    selectTrack(0);

    audio.loop = false;

    playPauseButton.addEventListener("click", playPause);

    sArea.addEventListener("mousemove", function(event) {
        showHover(event);
    });

    sArea.addEventListener("mouseout", hideHover);

    sArea.addEventListener("click", playFromClickedPos);

    audio.addEventListener("timeupdate", updateCurrTime);

}

initPlayer();