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

const app = {
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
        //lấy ra thẻ div show ra cái hình cd
        const cd = $('.cd');
        //lấy ra chiều cao của thẻ div (do chiều cao bằng với chiều rộng)
        const cdWidth = cd.offsetWidth;

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
    },
    start: function () {
        this.handleEvents();
        this.render();
    },
}

app.start()