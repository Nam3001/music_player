const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdThumb = $('.cd .cd-thumb');
const audio = $('#audio')
const cd = $('.cd');
const player = $('.player')
const playBtn = $('.btn-toggle-play');
const progress = $('.progress');
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist')


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  defineProperties() {
    Object.defineProperty(this, 'currentSong', {
      get() {
        return this.songs[this.currentIndex];
      }
    })
  },
  songs: [
    {
      name: '3107-2',
      singer: 'DuongG x NAU x WN',
      path: './assets/music/song1.mp3',
      image: './assets/img/song1.PNG',
    },
    {
      name: 'Bạc phận',
      singer: 'KICM ft Jack',
      path: './assets/music/song2.mp3',
      image: './assets/img/song2.PNG',
    },
    {
      name: 'Đừng hỏi em',
      singer: 'KICM Remix',
      path: './assets/music/song3.mp3',
      image: './assets/img/song3.PNG',
    },
    {
      name: 'Kiếp duyên không thành',
      singer: 'Htrol Remix',
      path: './assets/music/song4.mp3',
      image: './assets/img/song4.PNG',
    },
    {
      name: 'Thiên hạ hữu tình nhân',
      singer: 'JUKY SAN',
      path: './assets/music/song5.mp3',
      image: './assets/img/song5.PNG',
    },
    {
      name: 'thuyền hoa',
      singer: 'Hoài Lâm',
      path: './assets/music/song6.mp3',
      image: './assets/img/song6.PNG',
    },
    {
      name: 'Em gì ơi',
      singer: 'Jack ft KICM',
      path: './assets/music/song7.mp3',
      image: './assets/img/song7.PNG',
    },
    {
      name: 'Họ yêu ai mất rồi',
      singer: 'Doãn Hiếu',
      path: './assets/music/song8.mp3',
      image: './assets/img/song8.PNG',
    },
    {
      name: 'Phận duyên lỡ làng',
      singer: 'PHÁT HUY T4 X TRUZG  KAINE X HHD REMIX',
      path: './assets/music/song9.mp3',
      image: './assets/img/song9.PNG',
    },
    {
      name: 'Thê lương',
      singer: 'PHÚC CHINH  KIÊN DINO REMIX ',
      path: './assets/music/song10.mp3',
      image: './assets/img/song10.PNG',
    },
  ],
  // render bai hat
  renderSongs() {
    let htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : ''} song-item-${index}" data-id="${index}">
          <div class="thumb" style="background-image: url(${song.image})">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
    })
    $('.playlist').innerHTML = htmls.join('');
  },
  handleEvent() {
    let cdWidth = cd.offsetWidth;
    let _this = this;
    // cd quay/ dung
    let cdThumbAnimation = cdThumb.animate([
      {transform: 'rotate(0)'},
      {transform: 'rotate(360deg)'}
    ], {
      duration: 10000, //10 seconds
      iterations: 'Infinity'
    })
    cdThumbAnimation.pause();

    
    // phong to thu nho CD
    document.onscroll = function() {
      let scrollTop = document.documentElement.scrollTop || window.scrollY || window.pageYOffset;
      let newCdWidth = cdWidth - scrollTop;
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth;
    
    }

    // xu ly khi click play
    playBtn.addEventListener('click', function() {
      // khi chua play
      if(_this.isPlaying) {
        audio.pause();
        cdThumbAnimation.pause(); // cd dừng
      } else {
        audio.play();
        cdThumbAnimation.play(); //cd quay
      }
    })
    
    // khi play
    audio.onplay = function() {
      _this.isPlaying = true;
      player.classList.add('playing');
    }

    // khi pause
    audio.onpause = function() {
      _this.isPlaying = false;
      player.classList.remove('playing');
    }

    // khi tien do bai hat thay doi
    audio.ontimeupdate = () => {
      if(audio.duration) {
        let progressTime = (audio.currentTime / audio.duration * 100);
        progress.value = progressTime
      }
    }

    // seek song
    progress.addEventListener('input', (e) => {
      let seekTime = audio.duration / 100 * e.target.value;
      audio.currentTime = seekTime;
    })

    // when click nextBtn
    nextBtn.addEventListener('click', function() {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.nextSong();
      }
      if (_this.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
      _this.renderCurrentSong();
      if (_this.currentIndex === 0) {
        setTimeout(() => {
          $('.song.active').scrollIntoViewIfNeeded(true);
        }, 200); 
        console.log();
      } else {
        setTimeout(() => {
          $('.song.active').scrollIntoViewIfNeeded(false);
        }, 200);
        console.log();
      }
    })

    // when click prevBtn
      prevBtn.addEventListener('click', function() {
        if(_this.isRandom) {
          _this.playRandomSong();
        } else {
          _this.previousSong();
        }
        if (_this.isPlaying) {
          audio.play();
        } else {
          audio.pause();
        }
        _this.renderCurrentSong();
      })

        // solve turn on/off random mode
      randomBtn.onclick = function() {
        _this.isRandom = !_this.isRandom;
        randomBtn.classList.toggle('active', _this.isRandom)
      }

      // solve next song when audio ended
      audio.onended = function() {
        if (_this.isRepeat) {
          audio.play();
        } else {
          nextBtn.click();
          audio.play();
        }
      }

      // solve repeat song
      repeatBtn.onclick = function() {
        _this.isRepeat = !_this.isRepeat;
        repeatBtn.classList.toggle('active', _this.isRepeat);
      }

      // when click song item
      playlist.onclick = function(e) {
        if (e.target.closest('.song:not(.active)') && !e.target.closest('.option')) {
          _this.currentIndex = e.target.closest('.song:not(.active)').dataset.id;
          console.log(_this.currentIndex);
          _this.renderCurrentSong();
          _this.loadCurrentSong();
          audio.play();
        }
      }
  
  },

  // load the current song function
  loadCurrentSong() {

    heading.textContent = this.currentSong.name;
    cdThumb.style.background = `url(\'${this.currentSong.image}\')`;
    audio.src = this.currentSong.path;
  },
  // solve function next song
  nextSong() {
    this.currentIndex++;
      if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
      this.loadCurrentSong();
  },
  // solve previous song
  previousSong() {
    this.currentIndex--
    if(this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  // random song function
  playRandomSong() {
    let newCurrentIndex;
    do {
      newCurrentIndex = Math.floor(Math.random() * this.songs.length);
    } while (newCurrentIndex === this.currentIndex);
    this.currentIndex = newCurrentIndex;
    this.loadCurrentSong();
  },
  // render the current song
  renderCurrentSong() {
    $('.song.active').classList.remove('active');
    const currentItemSong = $(`.song.song-item-${this.currentIndex}`); // item cua bai hat hien tai
    currentItemSong.classList.add('active')
  },
  // Start app
  start() {
    this.defineProperties();
    this.handleEvent();
    this.loadCurrentSong();
    this.renderSongs();
  }
}
app.start();
