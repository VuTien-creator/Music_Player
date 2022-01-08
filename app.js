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
    start: function () {
        this.render();
    },
}

app.start()