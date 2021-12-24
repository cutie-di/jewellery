//'use strict';
// utils

function isEscEvent(evt) {
  return evt.keyCode === 27 || evt.key === 'Escape' || evt.key === 'Esc';
}

function isEnterEvent(evt) {
  return evt.keyCode === 13 || evt.key === 'Enter';
}

function isTabPressed(evt) {
  return evt.keyCode === 9 || evt.key === 'Tab';
}

const pageBody = document.querySelector('.page-body');
pageBody.classList.remove('nojs');

// slider

const shopSlider = document.querySelector('.swiper-container');

const nextEl = document.querySelector('.swiper-button-next');
const prevEl = document.querySelector('.swiper-button-prev');

function initSwiper(slider) {
  /* eslint-disable-next-line */
  return new Swiper(slider, {
    spaceBetween: 30,
    speed: 1500,
    autoplay: {
      delay: 3000,
      stopOnLastSlide: false,
      disableOnInteraction: false,
    },
    watchOverflow: true,

    breakpoints: {
      0: {
        loop: true,
        loopedSlides: 2,
        slidesPerView: 'auto',
        slidesPerGroup: 2,
        allowTouchMove: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'fraction',
          renderFraction: function (currentClass, totalClass) {
            return `<span class="${  currentClass  }"></span>` +
              ' of ' +
              `<span class="${  totalClass  }"></span>`;
          },
        },
      },
      768: {
        loop: true,
        loopedSlides: 2,
        slidesPerView: 'auto',
        slidesPerGroup: 2,
        allowTouchMove: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
          renderBullet: function (index, className) {
            return `<span class="${  className  }">${  index + 1  }</span>`;
          },
        },
        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },
      },
      1024: {
        loop: true,
        loopedSlides: 4,
        slidesPerView: 4,
        slidesPerGroup: 4,
        allowTouchMove: false,
        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
          renderBullet: function (index, className) {
            return `<span class="${  className  }">${  index + 1  }</span>`;
          },
        },
      },
    },
  });
}

initSwiper(shopSlider);

// modal

const modal = document.querySelector('.modal');
const overlay = modal.querySelector('.overlay');
const openButton = document.querySelector('.main-nav__user-item--login a');
const closeButton = modal.querySelector('.login__close button');
const popupEmailInput = modal.querySelector('input[type="email"]');

function closePopup() {
  modal.classList.remove('modal--show');
  overlay.classList.remove('overlay--show');
  document.body.classList.remove('page-no-scroll');

  openButton.focus();
}

function closeOnButton(evt) {
  evt.preventDefault();
  closePopup();
  closeButton.removeEventListener('click', closeOnButton);
}

function closeOnEnter(evt) {
  if (isEnterEvent(evt)) {
    closePopup();
    closeButton.removeEventListener('keydown', closeOnButton);
  }
}

function closeOnOverlay(evt) {
  evt.preventDefault();
  closePopup();
  overlay.removeEventListener('click', closeOnOverlay);
}

function closeOnEsc(evt) {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    closePopup();
    document.removeEventListener('keydown', closeOnEsc);
  }
}

function openPopup() {
  openButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    modal.classList.add('modal--show');
    overlay.classList.add('overlay--show');
    document.body.classList.add('page-no-scroll');
    popupEmailInput.focus();

    closeButton.addEventListener('click', closeOnButton);
    closeButton.addEventListener('keydown', closeOnEnter);
    overlay.addEventListener('click', closeOnOverlay);
    document.addEventListener('keydown', closeOnEsc);
  });
}

openPopup();


// burger-menu

const navMain = document.querySelector('.main-nav');
const navMainMode = navMain.querySelector('.main-nav__mode');
const navToggle = navMainMode.querySelector('.main-nav__toggle');
const navLoginLink = navMain.querySelector('.main-nav__login a');

function hideMenu() {
  navToggle.setAttribute('aria-label', 'Close menu');
  navMainMode.classList.remove('main-nav__mode--opened');
  navMainMode.classList.add('main-nav__mode--closed');
  document.body.classList.remove('page-no-scroll');
}

function onNavLinkClick() {
  navLoginLink.addEventListener('click', (evt) => {
    hideMenu();
    evt.preventDefault();
    modal.classList.add('modal--show');
    overlay.classList.add('overlay--show');
    document.body.classList.add('page-no-scroll');
    popupEmailInput.focus();

    closeButton.addEventListener('click', closeOnButton);
    overlay.addEventListener('click', closeOnOverlay);
  });
}

function showMenu() {
  navToggle.setAttribute('aria-label', 'Open menu');
  navMainMode.classList.remove('main-nav__mode--closed');
  navMainMode.classList.add('main-nav__mode--opened');
  document.body.classList.add('page-no-scroll');
}

function onNavToggleClick() {
  navToggle.addEventListener('click', () => {
    if (navMainMode.classList.contains('main-nav__mode--closed')) {
      showMenu();
    } else {
      hideMenu();
    }
  });
}

onNavToggleClick();
onNavLinkClick();

// localStorage

const loginForm = document.querySelector('[name=login-form]');

function saveFillData(form) {
  const emailInput = form.querySelector('input[type="email"]');
  let storageEmail = '';

  function isStorage() {
    try {
      storageEmail = localStorage.getItem('userEmail');
      return true;
    } catch (err) {
      return false;
    }
  }

  const isStorageSupport = isStorage();

  function saveFormData() {
    if (isStorageSupport) {
      localStorage.setItem('userEmail', emailInput.value);
    }
  }

  function fillForm() {
    isStorage();
    if (storageEmail) {
      emailInput.value = storageEmail;
    }
  }

  fillForm(form);

  form.addEventListener('submit', () => {
    saveFormData();
  });
}

saveFillData(loginForm);

// accordion

const accordionFaqItems = document.querySelectorAll('.faq__accordion-item');
const accordionFilterBlocks = document.querySelectorAll('.filter__block');

function onFaqButtonClick() {
  accordionFaqItems.forEach((item) => {
    item.addEventListener('click', (evt) => {
      const self = evt.currentTarget;

      const currentControl = self.querySelector('.faq__button');
      const currentContent = self.querySelector('.faq__content');

      if (self.classList.contains('faq__accordion-item--active')) {
        self.classList.remove('faq__accordion-item--active');

        currentControl.setAttribute('aria-expanded', 'false');
        currentContent.setAttribute('aria-hidden', 'true');
      } else {
        accordionFaqItems.forEach(((el) => {
          if (el !== self) {
            const previousControl = el.querySelector('.faq__button');
            const previousContent = el.querySelector('.faq__content');
            el.classList.remove('faq__accordion-item--active');
            previousControl.setAttribute('aria-expanded', 'false');
            previousContent.setAttribute('aria-hidden', 'true');
          }
        }));
        self.classList.add('faq__accordion-item--active');
        currentControl.setAttribute('aria-expanded', 'true');
        currentContent.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

function onFilterButtonClick() {
  accordionFilterBlocks.forEach((item) => {
    item.addEventListener('click', (evt) => {
      const self = evt.currentTarget;
      const currentControl = self.querySelector('.filter__button');
      const currentContent = self.querySelector('.filter__list');

      if (self.classList.contains('filter__block--active')) {
        self.classList.remove('filter__block--active');

        currentControl.setAttribute('aria-expanded', 'false');
        currentContent.setAttribute('aria-hidden', 'true');
      } else {
        self.classList.add('filter__block--active');
        currentControl.setAttribute('aria-expanded', 'true');
        currentContent.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

onFaqButtonClick();
onFilterButtonClick();


// focus

function trapFocus(element) {

  const focusableEls = modal.querySelectorAll('input,button');
  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];

  element.addEventListener('keydown', (evt) => {
    if (!isTabPressed) {
      return;
    }

    if (evt.shiftKey && evt.key === 'Tab') {

      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        evt.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        evt.preventDefault();
      }
    }
  });
}

trapFocus(modal);

// filter-modal

function modalFilter() {

  const filter = document.querySelector('.filter');

  if (!filter) {
    return;
  }

  const filterModal = filter.querySelector('.filter__modal');
  const openFilterButton = filter.querySelector('.filter__mobile-button a');
  const closeFilterButton = filterModal.querySelector('.filter__close button');
  const filterOverlay = filterModal.querySelector('.filter__overlay');

  function closeFilterPopup() {
    filterModal.classList.remove('filter__modal--show');
    filterOverlay.classList.remove('filter__overlay--show');
    document.body.classList.remove('page-no-scroll');
  }

  function closeOnFilterButton(evt) {
    evt.preventDefault();
    closeFilterPopup();
    closeFilterButton.removeEventListener('click', closeOnFilterButton);
  }

  function closeOnFilterOverlay(evt) {
    evt.preventDefault();
    closeFilterPopup();
    filterOverlay.removeEventListener('click', closeOnFilterOverlay);
  }

  function openFilterPopup() {
    openFilterButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      filterModal.classList.add('filter__modal--show');
      filterOverlay.classList.add('filter__overlay--show');
      document.body.classList.add('page-no-scroll');

      closeFilterButton.addEventListener('click', closeOnFilterButton);
      filterOverlay.addEventListener('click', closeOnFilterOverlay);
    });
  }

  openFilterPopup();
}

modalFilter();
