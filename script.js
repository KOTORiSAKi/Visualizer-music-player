document.addEventListener('DOMContentLoaded', () => {
  // === Grab Elements ===
  const audioElement = document.getElementById('audio-element');
  const canvas = document.getElementById('audio-visualizer');
  const ctx = canvas.getContext('2d');

  // Player controls
  const playPauseBtn = document.querySelector('.play-pause');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const progressBar = document.querySelector('.progress-bar');
  const progress = document.querySelector('.progress');
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');
  const volumeBar = document.querySelector('.volume-bar');
  const repeatBtn = document.querySelector('.repeat');
  const shuffleBtn = document.querySelector('.shuffle');
  const songTitleEl = document.querySelector('.song-title-main');
  const artistEl = document.querySelector('.artist-main');
  const albumArtEl = document.querySelector('.album-art-main');
  const songList = document.querySelector('.song-list');
  const choosingAlbums = document.querySelectorAll('.choosing_album');

  // === Default Variables ===
  let audioCtx;
  let analyser;
  let source;
  let bufferLength;
  let dataArray;

  let currentFolder = 'edm';
  let currentSongIndex = 0;
  let isRepeat = false;
  let isShuffle = false;
  let songs = [];

  // Example: folder => array of songs
  const folderSongs = {
    pop: [
      {
        title: "Chokotto no tokae",
        artist: "Mafumafu",
        audio: "./music/pop/Manunchan.mp3",
        albumArt: "./images/POP_cover.jpg"
      },
      {
        title: "Baka Mitai",
        artist: "Kiryu",
        audio: "./music/pop/Baka Mitai.mp3",
        albumArt: "./images/POP_cover.jpg"
      },
      {
        title: "Plastic Love",
        artist: "ASTROPHYSICS",
        audio: "./music/pop/ASTROPHYSICS - Plastic Love - 01 Plastic Love.mp3",
        albumArt: "./images/POP_cover.jpg"
      },
      {
        title: "BITE!",
        artist: "HOYO-mix",
        audio: "./music/pop/BITE!.mp3",
        albumArt: "./images/POP_cover.jpg"
      },
      {
        title: "ヒステリックナイトガール",
        artist: "PSYQUI",
        audio: "./music/pop/ヒステリックナイトガール.mp3",
        albumArt: "./images/POP_cover.jpg"
      },
      {
        title: "Pretender",
        artist: "Official髭男dism",
        audio: "./music/pop/Official髭男dism - PretenderOfficial Video.mp3",
        albumArt: "./images/POP_cover.jpg"
      },
      {
        title: "AKASAKIBunny Girl",
        artist: "NaturalMusic Video",
        audio: "./music/pop/AKASAKIBunny Girl - NaturalMusic Video.mp3",
        albumArt: "./images/POP_cover.jpg"
      },
      {
        title: "In Jesus Name (Remix)",
        artist: "Unknown",
        audio: "./music/pop/In Jesus Name (Remix) BASS COVER  STX Holiday Youth Convention Luis Pacheco.mp3",
        albumArt: "./images/POP_cover.jpg"
      }
    ],
    rock: [
      {
        title: "KING",
        artist: "Futakuchi Mana",
        audio: "./music/rock/King.mp3",
        albumArt: "images/ROCK_cover.webp"
      },
      {
        title: "Bury the Light",
        artist: "Casey Edwards",
        audio: "./music/rock/Bury the Light.mp3",
        albumArt: "images/ROCK_cover.webp"
      },
      {
        title: "Middle Of The Night",
        artist: "Elley Duhé  Rock Version by Rain Paris",
        audio: "./music/rock/Middle Of The Night - Elley Duhé  Rock Version by Rain Paris.mp3",
        albumArt: "images/ROCK_cover.webp"
      }
    ],
    edm: [
      {
        title: "BABYDOLL (Speed)",
        artist: "Ari Abdul",
        audio: "./music/edm/Ari Abdul - BABYDOLL (Speed) (Official Video).mp3",
        albumArt: "images/EDM_cover.jpeg"
      },
      {
        title: "Violet Veil",
        artist: "Kotori",
        audio: "./music/edm/Kotori - Violet Veil.mp3",
        albumArt: "images/EDM_cover.jpeg"
      },
      {
        title: "Havana (ft. Britt Lari)",
        artist: "Poylow & CPX",
        audio: "./music/edm/Poylow & CPX - Havana (ft. Britt Lari).mp3",
        albumArt: "images/EDM_cover.jpeg"
      },
      {
        title: "2 Phut Hon (KAIZ Remix)",
        artist: "Phao",
        audio: "./music/edm/Phao - 2 Phut Hon (KAIZ Remix)  TikTok Vietnamese Music 2020.mp3",
        albumArt: "images/EDM_cover.jpeg"
      },
      {
        title: "Heart Afire (feat. Strix)",
        artist: "Defqwop",
        audio: "./music/edm/Defqwop - Heart Afire (feat. Strix).mp3",
        albumArt: "images/EDM_cover.jpeg"
      },
      {
        title: "Love Of My Life",
        artist: "Vosai",
        audio: "./music/edm/Vosai - Love Of My Life  Trap  NCS - Copyright Free Music.mp3",
        albumArt: "images/EDM_cover.jpeg"
      }
    ],
    jazz: [
      {
        title: "Love miss",
        artist: "Unknown",
        audio: "./music/jazz/Love miss.mp3",
        albumArt: "images/JAZZ_cover.png"
      },
      {
        title: "Kurumi's Theme",
        artist: "AniZero",
        audio: "./music/jazz/Kurumi's Theme.mp3",
        albumArt: "images/JAZZ_cover.png"
      },
      {
        title: "Just the Two of Us (feat. Bill Withers)",
        artist: "AniZero",
        audio: "./music/jazz/Just the Two of Us (feat. Bill Withers).mp3",
        albumArt: "images/JAZZ_cover.png"
      },
      {
        title: "Cherry Pink and Apple Blossom White",
        artist: "HAUSER",
        audio: "./music/jazz/HAUSER - Cherry Pink and Apple Blossom White.mp3",
        albumArt: "images/JAZZ_cover.png"
      }
    ],
    lofi: [
      {
        title: "Yawns",
        artist: "Nite Crawler",
        audio: "./music/lofi/Yawns.mp3",
        albumArt: "images/LOFI_cover.jpg"
      },
      {
        title: "Tip Toe",
        artist: "HYBS",
        audio: "./music/lofi/HYBS - Tip Toe  Official Audio.mp3",
        albumArt: "images/LOFI_cover.jpg"
      },
      {
        title: "midnitehaze",
        artist: "Cloud VonSmoke",
        audio: "./music/lofi/midnitehaze [4rkBG8HB16I].mp3",
        albumArt: "images/LOFI_cover.jpg"
      }
    ],
    phonk: [
      {
        title: "This Feeling",
        artist: "My!lane",
        audio: "./music/phonk/My!lane  - This Feeling.mp3",
        albumArt: "images/PHONK_cover.jpg"
      },
      {
        title: "SLAY!",
        artist: "Eternxlkz",
        audio: "./music/phonk/Eternxlkz - SLAY! (Official Audio).mp3",
        albumArt: "images/PHONK_cover.jpg"
      },
      {
        title: "LOVELY BASTARDS",
        artist: "YATASHIGANG & ZWE1HVNDXR",
        audio: "./music/phonk/LOVELY BASTARDS (YATASHIGANG, ZWE1HVNDXR).mp3",
        albumArt: "images/PHONK_cover.jpg"
      },
      {
        title: "GigaChad Theme (Phonk Version)",
        artist: "g3oxem",
        audio: "./music/phonk/g3oxem - GigaChad Theme (Phonk House Version).mp3",
        albumArt: "images/PHONK_cover.jpg"
      },
      {
        title: "EMPTY DREAMS (ft. Kingpin Skinny Pimp)",
        artist: "CYPARISS",
        audio: "./music/phonk/CYPARISS - EMPTY DREAMS (ft. Kingpin Skinny Pimp).mp3",
        albumArt: "images/PHONK_cover.jpg"
      }
    ]
  };

  // === Initialize AudioContext after user interaction ===
  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();//API caller
      analyser = audioCtx.createAnalyser();//setup API
      source = audioCtx.createMediaElementSource(audioElement);//set input part for API
      source.connect(analyser);//link the input part to API
      analyser.connect(audioCtx.destination);//Set the output of API to Windows API

      analyser.fftSize = 256;//set the way to process the audio fequency level through Al.
      bufferLength = analyser.frequencyBinCount;//send the fequency audio data to bufferLength
      dataArray = new Uint8Array(bufferLength);//setup the value int array
    }
  }

  // === Visualizer ===
  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);//tell the browser to request the next of this function for each frame
    analyser.getByteFrequencyData(dataArray);

    canvas.width = window.innerWidth;
    canvas.height = 600; // or any height you prefer

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      ctx.fillStyle = '#00ffaa';
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  // === Load a Song into the Audio Element ===
  function loadSong(index) {
    audioElement.src = songs[index].audio;
    songTitleEl.textContent = songs[index].title;
    artistEl.textContent = songs[index].artist;
    albumArtEl.src = songs[index].albumArt;
  }

  // === Play / Pause ===
  function playSong() {
    initAudioContext();
    audioElement.play().catch(err => {
      console.error("Cannot play audio:", err);
      alert("ไม่สามารถเล่นเพลงได้ ตรวจสอบชื่อไฟล์หรือพาธไฟล์");
    });
    document.querySelector('.play-pause .play-icon').style.display = 'none';      // ซ่อนไอคอน Play
    document.querySelector('.play-pause .pause-icon').style.display = 'inline-block'; // แสดงไอคอน Pause
    requestAnimationFrame(drawVisualizer);
  }

  function pauseSong() {
    audioElement.pause();
    document.querySelector('.play-pause .play-icon').style.display = 'inline-block'; // แสดงไอคอน Play
    document.querySelector('.play-pause .pause-icon').style.display = 'none';      // ซ่อนไอคอน Pause
  }

  // === Update Song List Display ===
  function updateSongList() {
    songList.innerHTML = '';
    songs.forEach((song, i) => {
      const songItem = document.createElement('div');
      songItem.classList.add('song-item');
      songItem.innerHTML = `
          <span>${i + 1}</span>
          <span>${song.title}</span>
          <span class="song-duration">--:--</span>
        `;
      // On click, load & play
      songItem.addEventListener('click', () => {
        currentSongIndex = i;
        loadSong(currentSongIndex);
        playSong();
      });

      // Preload each audio to show durations
      const tempAudio = new Audio(song.audio);
      tempAudio.addEventListener('loadedmetadata', () => {
        const min = Math.floor(tempAudio.duration / 60);
        const sec = Math.floor(tempAudio.duration % 60);
        songItem.querySelector('.song-duration').textContent =
          `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      });
      songList.appendChild(songItem);
    });
  }

  // === Player Controls Listeners ===
  playPauseBtn.addEventListener('click', () => {
    if (audioElement.paused) playSong();
    else pauseSong();
  });

  prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playSong();
  });

  nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
  });

  audioElement.addEventListener('timeupdate', () => {
    if (!isNaN(audioElement.duration)) {
      // Update progress
      const pct = (audioElement.currentTime / audioElement.duration) * 100;
      progress.style.width = `${pct}%`;

      // Update current time
      const min = Math.floor(audioElement.currentTime / 60);
      const sec = Math.floor(audioElement.currentTime % 60);
      currentTimeEl.textContent =
        `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
  });

  audioElement.addEventListener('loadedmetadata', () => {
    const totalMin = Math.floor(audioElement.duration / 60);
    const totalSec = Math.floor(audioElement.duration % 60);
    totalTimeEl.textContent =
      `${String(totalMin).padStart(2, '0')}:${String(totalSec).padStart(2, '0')}`;
  });

  progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    audioElement.currentTime = (clickX / width) * audioElement.duration;
  });

  volumeBar.addEventListener('input', () => {
    audioElement.volume = volumeBar.value;
  });

  repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? '#00ffaa' : '#eee';
  });

  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? '#00ffaa' : '#eee';
  });

  audioElement.addEventListener('ended', () => {
    let theLastSong = currentSongIndex;
    if (isRepeat) {
      playSong();
    } else if (isShuffle) {
      while(1){
        currentSongIndex = Math.floor(Math.random() * songs.length);
        if(currentSongIndex != theLastSong){break;}
      }
      loadSong(currentSongIndex);
      playSong();
    } else {
      // Normal next
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      loadSong(currentSongIndex);
      playSong();
    }
  });

  // === Switching Albums (e.g., "POP", "ROCK") ===
  choosingAlbums.forEach(btn => {
    btn.addEventListener('click', () => {
      // If using data-folder
      const folder = btn.dataset.folder;
      currentFolder = folder;

      songs = folderSongs[currentFolder] || [];
      if (!songs.length) {
        alert(`ไม่มีเพลงในโฟลเดอร์ ${currentFolder}`);
        return;
      }
      currentSongIndex = 0;
      updateSongList();
    });
  });

  // === Initial Load ===
  songs = folderSongs[currentFolder];
  if (songs && songs.length) {
    updateSongList();
    loadSong(currentSongIndex);
  } else {
    alert("ไม่มีเพลงในโฟลเดอร์เริ่มต้น (edm)");
  }



  progressBar.addEventListener('mousemove', (e) => {
    const progressBarWidth = progressBar.clientWidth;
    const offsetX = e.offsetX;
    const hoverTimeSeconds = audioElement.duration * (offsetX / progressBarWidth);

    if (!isNaN(hoverTimeSeconds)) {
      const min = Math.floor(hoverTimeSeconds / 60);
      const sec = Math.floor(hoverTimeSeconds % 60);
      const formattedTime = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

      const progressTooltip = progressBar.querySelector('.progress-tooltip');
      if (progressTooltip) {
        progressTooltip.textContent = formattedTime;
        progressTooltip.style.left = `${offsetX}px`;
        progressTooltip.style.display = 'block';
        progressTooltip.style.transform = 'translateX(-50%) translateY(-120%)';
      }
    }
  });

  progressBar.addEventListener('mouseleave', () => {
    const progressTooltip = progressBar.querySelector('.progress-tooltip');
    if (progressTooltip) {
      progressTooltip.style.display = 'none';
    }
  });
});

