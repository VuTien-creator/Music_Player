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

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
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
                if (this.isRandom) {
                    return this.songs[this.randomSongs[this.currentIndex]];
                }
                return this.songs[this.currentIndex];
            }
        })
    },
    render: function () {
        const htmls = this.songs.map((song) => {
            return `
            <div class="song">
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

        $('.playlist').innerHTML = htmls.join('');
    },
    handleEvents: function () {

        const displayCd = function () {
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
        }

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
        audio.onplay = function () {
            player.classList.add('playing');
            app.isPlaying = true;
            cdThumbAnimate.play();//xoay cd thumb
        }

        //khi đang có sự kiện pause
        audio.onpause = function () {
            player.classList.remove('playing');
            app.isPlaying = false;
            cdThumbAnimate.pause();//dừng xoay cd thumb
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

        //xử lý sự kiện phóng to thu nhỏ hình cd
        document.addEventListener('scroll', displayCd);

        //xử lý sự kiện click play hoặc pause 
        {
            playBtn.addEventListener('click', playOrPause);
            playBtn.addEventListener('click', displayProgressSong);
        }
        //xử lý sự kiện tua bài hát        
        progress.addEventListener('input', seekSong);

        //xử lý sự kiện next  song
        {
            btnNext.addEventListener('click', app.nextSong);
            btnNext.addEventListener('click', () => { audio.play() });
        }

        //xử lý sự kiện prev  song
        {
            btnPrev.addEventListener('click', app.prevSong);

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
                } else {
                    //khi tắt random thì gán lại currentIndex bằng với giá trị index thực của bài hát đang hát bên trong app.songs
                    app.currentIndex = app.randomSongs[app.currentIndex];
                }
            });
        }
    },

    nextSong: function () {
        app.currentIndex++;
        if (app.currentIndex >= app.songs.length) {
            app.currentIndex = 0;
        }
        app.loadCurrentSong();
    },

    prevSong: function () {
        app.currentIndex--;
        if (app.currentIndex < 0) {
            app.currentIndex = (app.songs.length - 1);
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