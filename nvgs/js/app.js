// 1. SCENE SWITCHING LOGIC
window.switchScene = function(sceneId, btn) {
    // Hide TABBED scenes only
    document.querySelectorAll('.tab-scene').forEach(div => {
        div.style.display = 'none';
        div.querySelectorAll('video').forEach(v => v.pause());
    });

    // Show selected scene
    const activeDiv = document.getElementById(sceneId);
    activeDiv.style.display = 'block';

    // RECALCULATE WIDTHS (Critical fix for "invisible" videos)
    const container = activeDiv;
    const overlayVideo = container.querySelector('.video-overlay');
    const baseVideo = container.querySelector('.video-base');
    
    if (overlayVideo && baseVideo) {
        // Force the overlay to match the base video's current width
        overlayVideo.style.width = baseVideo.offsetWidth + 'px';
    }

    // Restart playback
    activeDiv.querySelectorAll('video').forEach(v => {
        v.currentTime = 0;
        v.play();
    });

    // Button Styling
    if(btn) {
        const parent = btn.parentElement; 
        parent.querySelectorAll('.btn').forEach(b => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-default');
        });
        btn.classList.remove('btn-default');
        btn.classList.add('btn-primary');
    }
}

// 2. MAIN INITIALIZATION
$(document).ready(function() {
    
    // Select all containers (Tabs + Grid)
    const containers = document.querySelectorAll('.video-compare-container');

    containers.forEach(container => {
        const slider     = container.querySelector('.slider');
        const clipper    = container.querySelector('.video-clipper');
        const videoLeft  = container.querySelector('.video-overlay'); // Overlay
        const videoRight = container.querySelector('.video-base');    // Base

        if(!slider || !videoLeft || !videoRight) return; 

        // --- RESIZE LOGIC ---
        function updateWidth() {
            if(videoRight.offsetWidth > 0) {
                videoLeft.style.width = videoRight.offsetWidth + 'px';
            }
        }

        // 1. Set width immediately (in case it's already loaded)
        updateWidth();

        // 2. Set width again when metadata loads (Fixes "Invisible on load" bug)
        videoRight.addEventListener('loadedmetadata', updateWidth);
        
        // 3. Update on Window Resize
        window.addEventListener('resize', updateWidth);

        // --- SLIDER LOGIC ---
        slider.addEventListener('input', function() {
            clipper.style.width = this.value + '%';
            // Ensure overlay width matches container width
            videoLeft.style.width = container.offsetWidth + 'px';
            container.style.setProperty('--position', this.value + '%');
        });

        // --- SYNC LOGIC ---
        // Sync Play/Pause/Seek
        videoRight.addEventListener('play', () => videoLeft.play());
        videoRight.addEventListener('pause', () => videoLeft.pause());
        videoRight.addEventListener('seeking', () => {
             videoLeft.currentTime = videoRight.currentTime;
        });

        // Force Loop
        videoRight.addEventListener('ended', () => {
            videoRight.currentTime = 0;
            videoLeft.currentTime = 0;
            videoRight.play();
            videoLeft.play();
        });

        // Anti-Drift
        setInterval(() => {
            if (Math.abs(videoRight.currentTime - videoLeft.currentTime) > 0.1) {
                videoLeft.currentTime = videoRight.currentTime;
            }
        }, 1000);
    });

    // Tooltips/Bibtex
    $('[data-toggle="tooltip"]').tooltip();
    if(document.getElementById("bibtex")) {
        CodeMirror.fromTextArea(document.getElementById("bibtex"), {
            lineNumbers: false, lineWrapping: true, readOnly:true
        });
    }
});

// --- CAROUSEL LOGIC (SLIDING) ---
let currentIndex = 0;
const itemsPerPage = 2; 

function moveCarousel(direction) {
    const track = document.getElementById('track');
    const items = document.querySelectorAll('.grid-item');
    const totalItems = items.length;
    
    // Calculate max pages (e.g., 8 items / 3 = 3 pages: 0, 1, 2)
    const maxIndex = Math.ceil(totalItems / itemsPerPage) - 1;

    // Update Index
    currentIndex += direction;

    // Boundary Checks
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    // SLIDE ANIMATION
    // We move by 100% of the VIEWPORT width
    const translateValue = -(currentIndex * 100);
    track.style.transform = `translateX(${translateValue}%)`;

    // Update Button States
    const btnLeft = document.querySelector('.btn-left');
    const btnRight = document.querySelector('.btn-right');
    if(btnLeft) btnLeft.disabled = (currentIndex === 0);
    if(btnRight) btnRight.disabled = (currentIndex === maxIndex);
}

// FIX: Ensure videos resize correctly after the slide animation ends
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('track');
    
    // Recalculate sizes whenever the transition finishes
    track.addEventListener('transitionend', function() {
        // Select only the currently visible items
        // (Logic: Just update ALL of them to be safe)
        const containers = document.querySelectorAll('.video-compare-container');
        containers.forEach(container => {
            const overlay = container.querySelector('.video-overlay');
            const base = container.querySelector('.video-base');
            if(overlay && base) {
                overlay.style.width = container.offsetWidth + 'px';
            }
        });
    });

    // Initial Button State
    const btnLeft = document.querySelector('.btn-left');
    if(btnLeft) btnLeft.disabled = true;
});