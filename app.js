/**
 * 1. Render song
 * 2. Scroll top
 * 3. Play/ pause/ seek
 * 4/ CD rotate
 * 5 Next/ prev
 * 6 random
 * 7 NExt/ Repeat when ended
 * 8 Active song
 * 9 Scroll active song into view
 * 10 play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//constant key name of storage
const PLAYER_STORAGE_KEY = 'PLAYER'

//lấy ra thẻ div show ra cái hình cd
const cd = $('.cd');

//lấy ra chiều cao của thẻ div (do chiều cao bằng với chiều rộng)
const cdWidth = cd.offsetWidth;

const heading = $('header h2');//thẻ show ra cái tên bài hát
const cdThumb = $('.cd-thumb'); //thẻ show ra cái hình trên cd
const audio = $('#audio');//thẻ audio

const playBtn = $('.btn-toggle-play');//button play hoặc pause
const player = $('.player');// hiển thị play hoặc pause

const progress = $('#progress');

const btnNext = $('.btn-next');//button next song
const btnPrev = $('.btn-prev');//button prev song

const randomBtn = $('.btn-random'); //button random

const repeatBtn = $('.btn-repeat');//button repeat

const playlist = $('.playlist')// element playlist of songs

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},//lấy từ localStorage ra các giá trị đã lưu, nếu không có thì là {}
    randomSongs: [],
    songs: [
        {
            name: 'Nắng Đêm',
            singer: 'T.R.I',
            path: './asset/music/Nang_Dem.mp3',
            image: './asset/img/nang_dem.jpg',
        },
        {
            name: 'Yêu 4',
            singer: 'Rymastic',
            path: './asset/music/Yeu_4.mp3',
            image: './asset/img/yeu_4.jpg',
        },
        {
            name: 'Yêu 5',
            singer: 'Rymastic',
            path: './asset/music/Yeu_5.mp3',
            image: './asset/img/yeu_5.jpg',
        },
        {
            name: 'Yêu 5 Copy1',
            singer: 'Rymastic',
            path: './asset/music/Yeu_5.mp3',
            image: './asset/img/yeu_5.jpg',
        },
        {
            name: 'Yêu 5 Copy2',
            singer: 'Rymastic',
            path: './asset/music/Yeu_5.mp3',
            image: './asset/img/yeu_5.jpg',
        },
        {
            name: 'Yêu 5 Copy1',
            singer: 'Rymastic',
            path: './asset/music/Yeu_5.mp3',
            image: './asset/img/yeu_5.jpg',
        },
        {
            name: 'Yêu 5 Copy2',
            singer: 'Rymastic',
            path: './asset/music/Yeu_5.mp3',
            image: './asset/img/yeu_5.jpg',
        },
        {
            name: 'Yêu 5 Copy1',
            singer: 'Rymastic',
            path: './asset/music/Yeu_5.mp3',
            image: './asset/img/yeu_5.jpg',
        },
        {
            name: 'Yêu 5 Copy2',
            singer: 'Rymastic',
            path: './asset/music/Yeu_5.mp3',
            image: './asset/img/yeu_5.jpg',
        },
    ],
    /**
     * tạo ra 1 thằng thuộc tính mới 
     */
    defineProperties: function () {

        //tạo ra thuộc tính currentSong với value là function get()
        Object.defineProperty(this, 'currentSong', {
            //function get này sẽ trả về bài hát hiện tại đang phát, mặc định là bài đầu
            get: function () {
                //gán localStorage vị trí index của bài hát hiện tại (trong trường hợp nếu random thì vị trí của bài hát 
                // hiện tại luôn luôn nằm tại index đúng với currentIndex của mảng randomSongs do đã sử lý từ các tính năng trước)
                app.setConfig('currentIndex', this.currentIndex)
                if (this.isRandom) {
                    return this.songs[this.randomSongs[this.currentIndex]];
                }
                return this.songs[this.currentIndex];
            }
        })
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div id="song_${index}" class="song ${index === this.currentIndex ? 'active' : ''}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
        </div>`;
        });

        playlist.innerHTML = htmls.join('');
    },
    activeElementSong: function (index) {
        $('.song.active').classList.remove('active');
        $(`#song_${index}`).classList.add('active');
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }, 100);
    },
    displayCd: function () {
        //lấy vị trí của thẻ div chứa các bài hát khi mà người dùng scroll
        //một số trình duyệt không hỗ trợ window.scrollY
        //check coi 1 trong 2 cái nào có thì dùng
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        const newCdWidth = cdWidth - scrollTop;
        /**
         * vì khi scroll nhanh sẽ khiến scrollTop lớn, làm giá trị px bị âm
         * px âm không hợp lệ nên style.width sẽ lấy giá trị  trước khi bị âm
         * nên đôi lúc cd không biến mất
         */
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;

        //opacity chạy từ 0 đến 1, và mờ dần theo tỉ lệ kích thước
        cd.style.opacity = (newCdWidth / cdWidth);
    },
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))//lưu vào localstorage 
    },
    loadConfig: function () {
        //kiểm tra các giá trị trong localstorage, nếu có thì gán lại cho các giá trị trong app
        if (this.config.currentIndex && this.songs[this.config.currentIndex] ) {
            this.currentIndex = this.config.currentIndex
        }

        if (this.config.isRandom) {

            const randomSongs = []
            //lặp qua mảng random songs trong localStorage
            this.config.randomSongs.forEach((index) => {

                //nếu index trong mảng này không khớp với bài hát nào trong danh sách bài hát thì bỏ cái index đó đi
                if(this.songs[index]){
                    console.log(index)
                    randomSongs.push(index)
                }
            })
            this.isRandom = this.config.isRandom
            this.randomSongs = randomSongs
        }
        
        if (this.config.isRepeat) {
            this.isRepeat = this.config.isRepeat
        }
        //kích hoạt các button nếu ở lần sử dụng trước đó có bật mà không tắt
        randomBtn.classList.toggle('active', app.isRandom);
        repeatBtn.classList.toggle('active', app.isRepeat);
    },
    handleEvents: function () {
        //xử lý xoay hình cdThumb

        // cdThumbAnimate đối tượng animate API
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 8000,
            iterations: Infinity
        });

        cdThumbAnimate.pause(); //mặc định khi vừa vào sẽ không phát nhạc nên không xoay cdThumb

        const playOrPause = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //khi đang có sự kiện play
        const playAudio = function () {
            player.classList.add('playing');
            app.isPlaying = true;
            cdThumbAnimate.play();//xoay cd thumb
        }

        //khi đang có sự kiện pause
        const pauseAudio = function () {
            player.classList.remove('playing');
            app.isPlaying = false;
            cdThumbAnimate.pause();//dừng xoay cd thumb
        }

        const autoNextSong = function () {
            if (!app.isRepeat) {
                app.nextSong();
                audio.play();
            }
        }

        const displayProgressSong = function () {
            audio.ontimeupdate = function () {
                if (audio.currentTime) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }
        }


        const seekSong = function () {
            const seekTime = progress.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        //xử lý hành động click nút random
        const random = function () {
            //gán giá trị lại cho  isRandom
            app.isRandom = !app.isRandom;
            //nếu isRandom = true thì add class active, ngược lại thì remove class active
            randomBtn.classList.toggle('active', app.isRandom);
        }

        //xử lý hành động bấm nút repeat
        const repeat = function () {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        //khi click chuột để chọn bài hát
        const clickMucsic = function (e) {
            //nếu không phải click vào bài hát thì không làm gì
            if (!e.target.closest('.song')) {
                return;
            }

            //nếu chọn nút option thì xử lý option
            if (e.target.closest('.option')) {
                console.log('option')
            } else {

                //nếu chọn vào bài hát đang được phát nhưng bị pause thì tiếp tục phát
                if (e.target.closest('.song.active') && !app.isPlaying) {
                    playOrPause()
                    displayProgressSong()
                }

                // nếu chọn vào bài hát khác với bài hát đang phát
                if (e.target.closest('.song:not(.active)')) {
                    //lấy ra id của bài hát đang chọn (do id có chứa index bài hát nằm trong app.songs)
                    const elementId = e.target.closest('.song').getAttribute('id');

                    //xử lý id của bài hát đang chọn để lấy ra index
                    let indexOfSong = elementId.slice(elementId.indexOf('_') + 1);
                    indexOfSong = parseInt(indexOfSong)//gán lại thành số (vì gán lại nên mới đặt biến là let)

                    app.currentIndex = indexOfSong; //gán cho currentIndex bằng với index của bài hát
                    if (app.isRandom) {
                        //nếu đang random thì phải tìm xem indexOfSong là nằm vị trí bao nhiêu của randomSongs để
                        // gán lại cho currentIndex (để đúng với logic của chức năng random đã làm ở trên)
                        app.currentIndex = app.randomSongs.indexOf(indexOfSong)
                    }
                    //load lại bài hát được chọn
                    app.loadCurrentSong();
                    app.activeElementSong(indexOfSong) //highlight bài hát được chọn lên
                    app.scrollToActiveSong()
                    audio.play()
                }
            }
        }

        //xử lý sự kiện phóng to thu nhỏ hình cd
        document.addEventListener('scroll', app.displayCd);

        //xử lý sự kiện click play hoặc pause 
        {
            playBtn.addEventListener('click', playOrPause);
            playBtn.addEventListener('click', displayProgressSong);
        }
        //xử lý sự kiện tua bài hát        
        progress.addEventListener('input', seekSong);

        //xử lý sự kiện next  song
        {
            btnNext.addEventListener('click', () => {
                app.nextSong();
                app.scrollToActiveSong()
            });
            btnNext.addEventListener('click', () => { audio.play() });
        }

        //xử lý sự kiện prev  song
        {
            btnPrev.addEventListener('click', () => {
                app.prevSong();
                app.scrollToActiveSong()
            });

            btnPrev.addEventListener('click', () => { audio.play() });
        }

        //xử lý sự kiện click nút random
        {
            randomBtn.addEventListener('click', random);

            //nếu người dùng bật random thì làm mới lại danh sách random
            randomBtn.addEventListener('click', () => {
                if (app.isRandom) {
                    //gán lại mảng randomSongs khi người dùng click random để tạo 1 list random mới
                    app.setPlayListRanDom();
                    app.setConfig('randomSongs', app.randomSongs) //lưu vào localStorage mảng randomSongs mới random được
                } else {
                    //khi tắt random thì gán lại currentIndex bằng với giá trị index thực của bài hát đang hát bên trong app.songs
                    app.currentIndex = app.randomSongs[app.currentIndex];
                }
                app.setConfig('isRandom', app.isRandom);//gán lại cho localStorage isRandom
            });
        }

        //xử lý audio
        {
            //khi mới vào người dùng không bấm nút play nhạc mà bấm next/prev thì thanh progress cũng phải thay đổi
            audio.addEventListener('playing', displayProgressSong)

            audio.addEventListener('play', playAudio)
            audio.addEventListener('pause', pauseAudio)
            audio.addEventListener('ended', () => {
                app.scrollToActiveSong()
                autoNextSong()
            })

        }

        //xử lý sự kiện click repeat
        {
            //xét active vào nút repeat và gán lại giá trị cho isRepeat
            repeatBtn.addEventListener('click', repeat)

            //nếu repeat thì cho loop, không thì thôi
            repeatBtn.addEventListener('click', () => {
                if (app.isRepeat) {
                    audio.loop = true;
                } else {
                    audio.loop = false;
                }
                app.setConfig('isRepeat', app.isRepeat); //gán lại cho isRepeat trong localStorage
            })
        }

        //xử lý sự kiện click vào bài hát
        {
            playlist.addEventListener('click', clickMucsic)
        }
    },

    nextSong: function () {
        app.currentIndex++;
        if (app.currentIndex >= app.songs.length) {
            app.currentIndex = 0;
        }

        if (app.isRandom) {
            app.activeElementSong(app.randomSongs[app.currentIndex])
        } else {
            app.activeElementSong(app.currentIndex);
        }

        app.loadCurrentSong();
    },

    prevSong: function () {
        app.currentIndex--;
        if (app.currentIndex < 0) {
            app.currentIndex = (app.songs.length - 1);
        }

        if (app.isRandom) {
            app.activeElementSong(app.randomSongs[app.currentIndex])
        } else {
            app.activeElementSong(app.currentIndex);
        }
        app.loadCurrentSong();
    },

    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;;
        audio.src = this.currentSong.path;

    },
    setPlayListRanDom: function () {

        //lấy ra 1 mảng chứa index bài hát nằm trong app.songs nhưng bỏ đi phần tử đang phát
        app.randomSongs = app.songs.map((song, index) => {
            if (index !== app.currentIndex) {
                return index;
            }
        })

        // random các index 1 cách ngẫu nhiên
        app.randomSongs.sort((a, b) => (0.5 - Math.random()));

        //trong mảng randomSongs có 1 phần tử undifine là phần tử có index = currentIndex
        //sau khi sắp xếp random thì phần tử đó nằm cuối cùng nên phải bỏ phần tử đó đi
        app.randomSongs.pop();

        //thêm vào mảng randomSongs index đã bỏ qua khi map đúng bằng với vị trí là currentIndex 
        //do khi tăng hay giảm currentIndex để load nhạc thì nó sẽ không có hiện tượng trùng lặp bài hát, các bài hát chỉ phát đúng 1 lần
        app.randomSongs.splice(app.currentIndex, 0, app.currentIndex);

        // console.log(app.randomSongs, app.currentIndex);

    },
    start: function () {
        //load localStorage trước bất kì các tính năng nào để gán giá trị cho các thuộc tính nếu có trong localStorage
        this.loadConfig()

        //định nghĩa các thuộc tính cho object
        this.defineProperties();

        //lắng nghe vào xử lý sự kiện (dom events)
        this.handleEvents();

        //load thông tin bài hát vào UI khi chạy
        this.loadCurrentSong();

        //render playlist
        this.render();
    },
}

app.start()