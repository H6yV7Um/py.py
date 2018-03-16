/**
 * @file Template业务逻辑对象
 * @author liguangyi@baidu.com
 */
/* globals oojs */
/* eslint-disable */
oojs.define({
    name: 'page',
    namespace: '',
    deps: {},
    $page: function () {
        var a0 = document.getElementById('a0');
        var trackingInfo = a0 && this.getAttr(a0, 'trackingInfo');
        var container = document.querySelector('.container');
        container.addEventListener('dragstart', function (event) {
            event.preventDefault();
        });

        container.addEventListener('dragover', function (event) {
            event.preventDefault();
        });

        container.addEventListener('drop', function (event) {
            event.preventDefault();
        });

        function isClickable(element, className) {
            var conti = true;
            var clickable = false;
            while (conti) {
                if (element.className.indexOf(className) > -1) {
                    clickable = true;
                    conti = false;
                } else if (element.tagName.toLowerCase() === 'body') {
                    clickable = false;
                    conti = false;
                } else {
                    element = element.parentNode || element.parentElement;              
                }
            }
            return clickable;
        }

        document.querySelector('#a0').onclick = function (event) {
            var clickable = isClickable(event.target, 'clickable');
            if (clickable) {
                event.preventDefault();
            }
        }

        function computeTime(seconds) {
            var minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds - minutes * 60);
            return {
                minutes: minutes,
                seconds: seconds < 10 ? ('0' + seconds) : seconds 
            }
        }

        var video = document.querySelector('video');
        var durationOnPoster = document.querySelector('.duration-on-poster');

        var progressBar = document.querySelector('.progress-bar');
        var progressBarFill = document.querySelector('.progress-bar-fill');

        var controlBar = document.querySelector('.control');

        var currentTime = document.querySelector('.show-time-current');
        var totalTime = document.querySelector('.show-time-total');

        var playButton = document.querySelector('.icon-play');
        var pauseButton = document.querySelector('.icon-pause');

        var mask = document.querySelector('.mask');

        var enableControl = true;
        var startPlay = false;
        var controlIsShow = false;
        var autoPlay = video.autoplay;

        var roundBegin = false;
        var roundEnd = false;

        function showButton() {
            if (video.paused) {
                playButton.style.display = 'block';
                pauseButton.style.display = 'none';
            } else {
                playButton.style.display = 'none';
                pauseButton.style.display = 'block';            
            }
        }

        function showControl() {
            controlIsShow = true;
            
            mask.style.display = 'block';
            controlBar.style.visibility = 'visible';
            progressBar.style.display = 'none';
            showButton();
        }

        function hideControl() {
            controlIsShow = false;

            mask.style.display = 'none';
            controlBar.style.visibility = 'hidden';
            progressBar.style.display = 'block';
            
            playButton.style.display = 'none';
            pauseButton.style.display = 'none';
        }



        container.addEventListener('mouseover', function () {
            if (!startPlay) {
                return;
            }
            showControl();
        });

        container.addEventListener('mouseout', function () {
            if (!startPlay) {
                return;
            }
            hideControl();
        }); 

        pauseButton.addEventListener('click', function () {
            video.pause();
            showButton();
        });

        playButton.addEventListener('click', function () {
            video.play();
            showButton();
        })

        function showDuration() {
            var duration = computeTime(video.duration);
            totalTime.innerHTML = duration.minutes + ':' + duration.seconds;
            durationOnPoster.innerHTML = duration.minutes + ':' + duration.seconds;
        }

        function showCurrentTime() {
            var time = computeTime(video.currentTime);
            currentTime.innerHTML = time.minutes + ':' + time.seconds;
        }

        // 注意，当循环播放时，每一轮开始时都会触发canplay事件
        video.addEventListener('canplay', function () {
            // 如果是手动播放
            if (!autoPlay && !startPlay) {
                playButton.style.display = 'block';
                durationOnPoster.style.display = 'block';
            }
        });

        video.addEventListener('durationchange', function () {
            showDuration();
        });

        video.addEventListener('loadedmetadata', function () {
            showDuration();
        });

        video.addEventListener('playing', function () {
            if (!startPlay) {
                startPlay = true;
                if (!autoPlay) {
                    showControl();
                    durationOnPoster.style.display = 'none';
                } else {
                    progressBar.style.display = 'block';
                }
            }
            var imageTrack = new Image();
            imageTrack.src = 'http://track.bes.baidu.com/track.php?c=' + trackingInfo + '&event=0&progress=' + video.currentTime * 1000;
            imageTrack.onload = imageTrack.onerror = function () {};
            if (controlIsShow) {
                showButton();
            }
        });

        video.addEventListener('pause', function () {
            if (controlIsShow) {
                showButton();
            }
        });

        var slider = Slider.init({
            el: document.querySelector('.control-time'),
            min: 1,
            max: 100,
            style: {
                trackHeight: 2,
                trackColor: 'rgba(255, 255, 255, 0.5)',
                filledColor: 'white',
                thumbWidth: 12,
                thumbColor: 'white'
            },      
            onStart: function (value, progress) {
                video.pause();
            },
            onStop: function (value, progress) {
                video.play();
            },
            onChange: function (value, progress) {
                // 等于1的时候会出bug，我也不知道为什么
                if (progress !== 1) {
                    video.currentTime = video.duration * progress;
                }
            }
        });

        video.addEventListener('timeupdate', function () {
            if (Math.floor(video.currentTime) === 0 && !roundBegin) {
                roundBegin = true;
                roundEnd = false;
            }

            // 为什么不使用ended事件来监听视频播放结束
            // 因为在循环播放的情况下，视频会无限播放，从来没有ended事件
            if (Math.floor(video.currentTime) === Math.floor(video.duration) && !roundEnd) {
                roundEnd = true;
                roundBegin = false;
            }

            showCurrentTime();
            var progress = video.currentTime / video.duration;
            if (slider) {
                slider.setValue(progress * 100);
                progressBarFill.style.width = progress * 100 + '%';
            }
        });    	
    },
    getAttr: function (element, key) {
        if (element && element.getAttribute) {
            return element.getAttribute(key);
        }
        else {
            return element[key];
        }
    },
});
