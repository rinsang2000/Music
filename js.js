var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
var player = $('.player');
var cd = $('.cd');
var heading = $('header h2');
var cdThumb = $('.cd-thumb');
var audio = $('#audio');
var playBtn = $('.btn-toggle-play');
var progress = $('.progress');
var progress2 = $('.progress2');
var next = $('.btn-next');
var prev = $('.btn-prev');
var ramdom = $('.btn-random');
var repaet = $('.btn-repaet');
var playlist = $(".playlist");
var currentTime =$('.currentTime')
var totalTime = $('.totalTime')
var app = {
    currentIndex:0,
    isPlaying: false,
    isRandom: false,
    isRepaet: false,
    songVolume:0,
    songs:[

        {
          name: "Nevada",
          singer: "Vicetone",
          path: "/music/song1.mp3",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "The Ocean",
          singer: "Mike Perry,Shy Martin",
          path:
            "/music/song7.mp3",
          image: "https://avatar-nct.nixcdn.com/song/2018/03/11/6/7/d/9/1520777444235.jpg"
        },
        {
          name: "Summertime",
          singer: "Cinnamons,Evening Cinema",
          path:
            "/music/song2.mp3",
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Royalty",
          singer: "Ilira",
          path: "/music/song3.mp3",
          image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
          name: "Monsters",
          singer: "Nightcore,Katie Sky",
          path: "/music/song4.mp3",
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
          name: "Unstoppable",
          singer: "Sia",
          path: "/music/song5.mp3",
          image:
            "https://avatar-nct.nixcdn.com/singer/avatar/2017/02/21/1/e/4/2/1487651633819.jpg"
        },
        {
          name: "Million Days",
          singer: "Sabai,HOANG,Claire Ridgely",
          path: "/music/song6.mp3",
          image:
            "https://avatar-nct.nixcdn.com/song/2020/11/13/6/e/f/d/1605278310575.jpg"
        },
      ],
      render: function(){
          var html = this.songs.map(function(song, index){
              return `
              <div class="song ${index === app.currentIndex ? 'active': ''}" data-index=${index}>
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}r</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
              `
          })
          $('.playlist').innerHTML = html.join('');
      },
      defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
          get: function(){
            return this.songs[this.currentIndex]
          }
        })
      },
      handleEvents: function(){
        var volume = $("#volume");
        var percent = $('.percent');
        var cdWidth = cd.offsetWidth
          // Xử lý phóng to thu nhỏ CD 
          document.onscroll = function(){
              var scrollTop = window.scrollY || document.documentElement.scrollTop;
              var newCdWidth = cdWidth - scrollTop;
              cd.style.width = newCdWidth >0 ? newCdWidth + 'px': 0
              cd.style.opacity = newCdWidth / cdWidth;
          }
          // Xử lý cd quay 
          var cdThumbAnimate = cdThumb.animate([
            {
              transform: 'rotate(360deg)' 
            }
          ],{
            duration: 10000, //1 giây
            iterations: Infinity,
          })
          cdThumbAnimate.pause();
          // Xử lý dừng / phát nhạc
          playBtn.onclick = function(){
            if(app.isPlaying){
              audio.pause();
            }else{
              audio.play();
            }
          }
          // Khi song play
          audio.onplay = function(){
            app.isPlaying = true;
            player.classList.add('playing');  
            cdThumbAnimate.play();
          }
          // Khi song pause 
          audio.onpause = function(){
            app.isPlaying = false;
            player.classList.remove('playing');  
            cdThumbAnimate.pause();
          }      
          // Khi song chạy thay đổi thanh input
          // audio.currentTime: số giây khi bài hát chạy
          // audio.duration: Tổng số giây bài hát 
          audio.ontimeupdate = function(){
            if(audio.duration){
              var progressPercent = Math.floor(audio.currentTime / audio.duration *100);
              progress.value =progressPercent;
              app.formatTime( audio.currentTime)
            }
          }	
          // Tua bài hát 
          progress.onchange = function(e){
            var seekTime = audio.duration /100 * e.target.value;
            audio.currentTime = seekTime;
          }
          // Next song
          next.onclick = function(){
            if(app.isRandom == true){
              app.ramdomSong();
            }else{
              app.nextSong();  
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
          }
          // Prev song
          prev.onclick = function(){
            if(app.isRandom == true){
              app.ramdomSong();
            }else{
              app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
          }
          // Khi ramdom song
          ramdom.onclick = function(){
            app.isRandom = !app.isRandom;
            ramdom.classList.toggle('active', app.isRandom);
          }
          // Xử lý phát 1 bài 
          repaet.onclick = function(){
             app.isRepaet = !app.isRepaet;
             repaet.classList.toggle('active', app.isRepaet);
          }
           // Xử lý khi hết bài 
          audio.onended =function(){
            if(app.isRepaet){
              audio.play();
            }else{
              next.click();
            }
          }
          // Chọn bài 
          playlist.onclick = function (e){
           var songNode =e.target.closest('.song:not(.active)');
           if(songNode|| e.target.closest('.option')){
            if(songNode){
              app.currentIndex = Number(songNode.getAttribute('data-index'));
              app.loadCurrentSong();
              audio.play();
              app.render();
            }
           }
          }
          // Âm lượng 
          volume.oninput = function (e){
            var chaneVolume = e.target.value / 100
            audio.volume = chaneVolume;
            percent.innerText = e.target.value + '%'
          }

      },
      scrollToActiveSong: function(){
        setTimeout(function(){
          $('.song.active').scrollIntoView(
            {
              behavior: "smooth",
              block: "center"
            },
          )
        },200)
      },
      loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
      },
      nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
          this.currentIndex = 0;
        }
        this.loadCurrentSong();
      },
      prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
          this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
      },
      ramdomSong: function(){
        var newIndex;
        do{
          newIndex = Math.floor(Math.random()* this.songs.length)
        }while (newIndex === this.currentIndex) 
          this.currentIndex = newIndex;
          this.loadCurrentSong();
      },
      formatTime: function(sec_num){
        var b = 0
        var seconds = Math.floor(sec_num);
        if(seconds >= 60){
          b++;
          seconds = 0;
          
        }

      },

      start: function(){
          // Định nghĩa các thuộc tính cho object
          this.defineProperties();

          // Lắng nghe / xử lý xự kiện (DOM event)
          this.handleEvents();

          // Tải thông tin bài hát đầu tiên UI khi chạy ứng dụng
          this.loadCurrentSong();

        this.formatTime();
          // Render ra list nhạc 
          this.render();
      }
}
app.start();





