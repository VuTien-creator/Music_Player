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

const heading = $('header h2');//thẻ show ra cái tên bài hát
const cdThumb = $('.cd-thumb'); //thẻ show ra cái hình trên cd
const audio = $('#audio');//thẻ audio

const playBtn = $('.btn-toggle-play');//button play hoặc pause
const player = $('.player');// hiển thị play hoặc pause

const progress = $('#progress');


const app = {
    currentIndex: 0,
    isPlaying: false,
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
        //lấy ra chiều cao của thẻ div (do chiều cao bằng với chiều rộng)
        const cdWidth = cd.offsetWidth;

        //xử lý sự kiện phóng to thu nhỏ hình cd
        document.onscroll = function () {

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

        //xử lý sự kiện click play hoặc pause 
        playBtn.onclick = function () {

            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }

            //khi đang có sự kiện play
            audio.onplay = function () {
                player.classList.add('playing');
                app.isPlaying = true;
            }

            //khi đang có sự kiện pause
            audio.onpause = function () {
                player.classList.remove('playing');
                app.isPlaying = false;
            }

            audio.ontimeupdate = function () {
                if (audio.currentTime) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }
        }

    },
    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;;
        audio.src = this.currentSong.path;

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