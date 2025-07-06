const slider = document.getElementById('slider-container');
const bg = document.querySelector('.background-pattern');
const buttons = document.querySelectorAll('.nav-btn');

// state variables for page selection
let currentPage = 0;
let targetPage = 0;

// state variables for background animation
let wiggleAngle = 0; // keeps track of incrementing angle to let the background appear to "breathe"
let lastScrollY = 0;

// coordinates of background
let bgX = 0;          // current bg horizontal offset
let bgY = 0;

// target coordinates to lerp
let targetBgX = 0;    
let targetBgY = 0;

// lerp speed for smooth bg movement
const bgSpeed = 0.01;  


function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Changes page and starts animation
function goToPage(page) {
  targetPage = page;
  slider.style.transform = `translateX(${-page * 100}vw)`;

  targetBgX = -page * window.innerWidth * 0.1;
  
  smoothScrollReset();
    
  // update active button styling
  buttons.forEach(btn => btn.classList.remove('active'));
  buttons[page].classList.add('active');
}

// Used to reset the scroll position smoothly to the top
function smoothScrollReset(duration = 1000) {
  const scrollContainer = document.querySelector('.scroll-container');
  const start = scrollContainer.scrollTop;
  const end = 0;
  let startTime = null;

  function animateScroll(time) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    
    // determine t for lerping and use ease out function
    const t = Math.min(elapsed / duration, 1); 
    const easeT = 1 - (1 - t) * (1 - t);

    scrollContainer.scrollTop = lerp(start, end, easeT);

    if (t < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

// Animate background position smoothly
function animate() {
    
  // get scroll for outer scroll contrainer
  const scrollContainer = document.querySelector('.scroll-container');
  const scrollY = scrollContainer.scrollTop;

  // page's vertical pos relative to scroll container
  const currentPage = document.querySelectorAll('.page')[targetPage];
  const pageOffsetTop = currentPage.offsetTop;

  // determine total scroll amount
  const pageScroll = Math.max(0, scrollY - pageOffsetTop);
  targetBgY = pageScroll * 0.1;

  bgX = lerp(bgX, targetBgX, bgSpeed);
  bgY = lerp(bgY, targetBgY, bgSpeed);

  wiggleAngle += 0.01;
  const wiggleX = Math.sin(wiggleAngle) * 1.5;
  const wiggleY = Math.cos(wiggleAngle * 0.75) * 5;

  bg.style.backgroundPosition = `${bgX + wiggleX}px ${bgY + wiggleY}px`;

  requestAnimationFrame(animate);
}

// click handlers
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const pageNum = Number(btn.dataset.page);
    goToPage(pageNum);
  });
});

// Init bruv
goToPage(0);
animate();