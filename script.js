'use strict';

///////////////////////////////////////
// Modal window
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const sections = document.querySelectorAll('.section');
const featureImages = document.querySelectorAll('.features__img');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//------------------------------------------------------------------------------------------

//? Smooth Scroll

btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();

  //? Old School
  // window.scrollTo(s1coords.left + scrollX, s1coords.top + scrollY);

  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//------------------------------------------------------------------------------------------

//? TABS
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  //* Button active remove
  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });
  //* Button active add
  clicked.classList.add('operations__tab--active');

  //* Tab active remove
  tabsContent.forEach(tabContent => {
    tabContent.classList.remove('operations__content--active');
  });

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//------------------------------------------------------------------------------------------

//? NAVIGATION HOVER
const navFunction = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', navFunction.bind(0.5));
nav.addEventListener('mouseout', navFunction.bind(1));

//------------------------------------------------------------------------------------------

//? Sticky Navigation
const { height: navHeight } = nav.getBoundingClientRect();

const obsCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const navObserver = new IntersectionObserver(obsCallback, obsOptions);
navObserver.observe(header);
//------------------------------------------------------------------------------------------

//? Sections Animation
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//------------------------------------------------------------------------------------------
//? Lazy Loading Images

const revealImage = entries => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.setAttribute('src', entry.target.dataset.src);
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  imageObserver.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 1,
});

featureImages.forEach(img => {
  imageObserver.observe(img);
});

//------------------------------------------------------------------------------------------

//? Slider
let currSlide = 0;
let maxSlide = slides.length - 1;

const goToSlide = slide => {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

const createDots = function () {
  for (let i = 0; i < slides.length; i++) {
    const html = `<button class="dots__dot" data-slide=${i}></button>`;
    dotContainer.insertAdjacentHTML('beforeend', html);
  }
};
createDots();

const activeDot = slide => {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const nextSlide = () => {
  if (currSlide === maxSlide) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  activeDot(currSlide);
};

const prevSlide = () => {
  if (currSlide === 0) {
    currSlide = maxSlide;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activeDot(currSlide);
};

goToSlide(0);
activeDot(0);
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

//* With Keys
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();

  if (e.key === 'ArrowLeft') prevSlide();
});

//* With Dots

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;

    goToSlide(slide);
    currSlide = parseInt(slide, 10);
    activeDot(slide);
  }
});

//------------------------------------------------------------------------------------------

//! Lectures

/* 


 const message = document.createElement('div');
 message.classList.add('cookie-message');
 message.innerHTML =
   'We used cookie for improved functionality and analyticks. <button class = "btn btn--close-cookie">Got it</button>';
 header.append(message);
 document.querySelector('.btn--close-cookie').addEventListener('click', e => {
   e.preventDefault();
   message.remove();
 });
 message.style.backgroundColor = '#37383d';
 message.style.height =
   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
 document.documentElement.style.setProperty('--color-primary', 'orangered');



const h1 = document.querySelector('h1');

const h1Alert = e => {
  alert('Hover');
  h1.removeEventListener('mouseenter', h1Alert);
};

h1.addEventListener('mouseenter', h1Alert);

?Propagation

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + 1);

const randomColor = () =>
  `rgb(${randomNumber(0, 255)},${randomNumber(0, 255)},${randomNumber(
    0,
    255
  )})`;

document.querySelectorAll('.nav__link').forEach(el => {
  el.addEventListener('click', function (e) {
    this.style.backgroundColor = randomColor();
    console.log(e.currentTarget === this);
    // e.stopPropagation();
  });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  // e.stopImmediatePropagation();
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});

? Smooth Scroll 

document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView();
  });
});


? DOM Traversing
const h1 = document.querySelector('h1');

* Going downwards: child
 console.log(h1.querySelectorAll('.highlight'));
 console.log(h1.childNodes);
 console.log(h1.children);
 console.log((h1.firstElementChild.style.color = 'fff'));

* Going upwards: parent

 console.log(h1.parentNode);
 console.log(h1.parentElement);
 console.log(h1.closest(''));

* Going sideways: siblings
 console.log(h1.previousElementSibling);
 console.log(h1.nextElementSibling);

 const x = [...h1.parentElement.children].filter((el, i) => i);
 console.log(x);


 ? Intersection

 const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);



? Sticky Navigation Old School
 const initialCoords = section1.getBoundingClientRect();
 window.addEventListener('scroll', function (e) {
   if (window.scrollY >= initialCoords.top) nav.classList.add('sticky');
   else nav.classList.remove('sticky');
 });





















 console.log(slides);

let currSlide = 0;
let maxSlide = slides.length - 1;

const goToSlide = slide => {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};
goToSlide(0);
const nextSlide = () => {
  if (currSlide === maxSlide) {
    currSlide = 0;
  } else {
    currSlide++;
  }

  goToSlide(currSlide);
};

const prevSlide = () => {
  if (currSlide === 0) {
    currSlide = maxSlide;
  } else {
    currSlide--;
  }

  goToSlide(currSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
*/

window.addEventListener('beforeunload', function (e) {
  e.returnValue = 'Message';
});
