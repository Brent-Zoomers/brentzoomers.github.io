
$(document).ready(function() {
    var editor = CodeMirror.fromTextArea(document.getElementById("bibtex"), {
        lineNumbers: false,
        lineWrapping: true,
        readOnly:true
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    

// var frameNumber = 0, // start video at frame 0
//     // lower numbers = faster playback
//     playbackConst = 500, 
//     // get page height from video duration
//     setHeight = document.getElementById("main"), 
//     // select video element         
//     vid = document.getElementById('v0'); 
//     // var vid = $('#v0')[0]; // jquery option

    
    

// // Use requestAnimationFrame for smooth playback
// function scrollPlay(){  
//   var frameNumber  = window.pageYOffset/playbackConst;
//   vid.currentTime  = frameNumber;
//   window.requestAnimationFrame(scrollPlay);
// console.log('scroll');
// }
    
// // dynamically set the page height according to video length
// vid.addEventListener('loadedmetadata', function() {
//   setHeight.style.height = Math.floor(vid.duration) * playbackConst + "px";
// });
    
    
//     window.requestAnimationFrame(scrollPlay);
});


$(document).ready(function() {
    const slider = document.getElementById('sliderRange');
    const clipper = document.getElementById('videoClipper');
    const videoLeft = document.getElementById('videoLeft');
    const videoRight = document.getElementById('videoRight');
    const container = document.getElementById('comparisonContainer');

    // 1. Handle the Slider Drag
    slider.addEventListener('input', function() {
        const percentage = this.value;
        
        // Move the clipper div
        clipper.style.width = percentage + '%';
        
        // Move the 'handle' icon (the ::after element)
        // Note: We can't move a pseudo-element directly with JS, 
        // so we usually update a CSS variable or move a real element.
        // A simple workaround for the icon is updating the container's left position 
        // style property if we made the icon a real <div>.
        // For the CSS above, the icon stays center relative to the clipper line 
        // if we change the CSS slightly, but for simplicity, let's just update the line:
        
        // Fix for the overlay video width:
        // The video inside the clipper needs to stay at the exact width of the container
        // regardless of the clipper's width.
        videoLeft.style.width = container.offsetWidth + 'px';
    });

    // Handle Resize
    window.addEventListener('resize', function() {
         videoLeft.style.width = container.offsetWidth + 'px';
    });
    // Trigger once on load
    videoLeft.style.width = container.offsetWidth + 'px';


    // 2. Synchronize Playback (Crucial for video comparison)
    
    function syncVideos(source, target) {
        // Sync Play
        source.addEventListener('play', function() {
            target.play();
        });
        // Sync Pause
        source.addEventListener('pause', function() {
            target.pause();
        });
        // Sync Seeking
        source.addEventListener('seeking', function() {
            target.currentTime = source.currentTime;
        });
    }

    // Sync both ways
    syncVideos(videoLeft, videoRight);
    syncVideos(videoRight, videoLeft);
    
    // Move the custom handle icon (If you want the circle to follow the line)
    // We need to update the CSS rule for ::after or use a real element.
    // Here is a dynamic CSS variable approach:
    slider.addEventListener('input', function() {
         container.style.setProperty('--position', this.value + '%');
    });
});
