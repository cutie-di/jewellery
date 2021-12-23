'use strict';

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

var pageBody = document.querySelector('.page-body');
pageBody.classList.remove('nojs');


// filter-modal

function modalFilter() {

  var filter = document.querySelector('.filter');

  if (!filter) {
    return;
  }

  var filterModal = filter.querySelector('.filter__modal');
  var openFilterButton = filter.querySelector('.filter__mobile-button a');
  var closeFilterButton = filterModal.querySelector('.filter__close button');
  var filterOverlay = filterModal.querySelector('.filter__overlay');

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
    openFilterButton.addEventListener('click', function (evt) {
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


// slider

var shopSlider = document.querySelector('.swiper-container');

var nextEl = document.querySelector('.swiper-button-next');
var prevEl = document.querySelector('.swiper-button-prev');

function initSwiper(slider) {
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
          type: `fraction`,
          renderFraction: function (currentClass, totalClass) {
            return '<span class="' + currentClass + '"></span>' +
              ' of ' +
              '<span class="' + totalClass + '"></span>';
          }
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
          type: `bullets`,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
          }
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
        loopedSlides: 4,
        allowTouchMove: false,
        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: `bullets`,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
          }
        },
      },
    },
  });
}

initSwiper(shopSlider);


// burger-menu

var navMain = document.querySelector('.main-nav');
var navMainMode = document.querySelector('.main-nav__mode');
var navToggle = navMainMode.querySelector('.main-nav__toggle');
var navLoginLink = document.querySelector('.main-nav__login a');

function hideMenu() {
  navToggle.setAttribute('aria-label', 'Close menu');
  navMainMode.classList.remove('main-nav__mode--opened');
  navMainMode.classList.add('main-nav__mode--closed');
  document.body.classList.remove('page-no-scroll');
}

function onNavLinkClick() {
  navLoginLink.addEventListener('click', function (evt) {
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
  navToggle.addEventListener('click', function () {
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

var loginForm = document.querySelector('[name=login-form]');

function saveFillData(form) {
  var emailInput = form.querySelector('input[type="email"]');
  var storageEmail = '';

  function isStorage() {
    try {
      storageEmail = localStorage.getItem('userEmail');
      return true;
    } catch (err) {
      return false;
    }
  }

  var isStorageSupport = isStorage();

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

  form.addEventListener('submit', function () {
    saveFormData();
  });
}

saveFillData(loginForm);

// accordion

var accordionFaqItems = document.querySelectorAll('.faq__accordion-item');
var accordionFilterBlocks = document.querySelectorAll('.filter__block');

function onFaqButtonClick() {
  accordionFaqItems.forEach(function (item) {
    item.addEventListener('click', function (evt) {
      var self = evt.currentTarget;

      var currentControl = self.querySelector('.faq__button');
      var currentContent = self.querySelector('.faq__content');

      if (self.classList.contains('faq__accordion-item--active')) {
        self.classList.remove('faq__accordion-item--active');

        currentControl.setAttribute('aria-expanded', 'false');
        currentContent.setAttribute('aria-hidden', 'true');
      } else {
        accordionFaqItems.forEach((function (el) {
          if (el !== self) {
            var previousControl = el.querySelector('.faq__button');
            var previousContent = el.querySelector('.faq__content');
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
  accordionFilterBlocks.forEach(function (item) {
    item.addEventListener('click', function (evt) {
      var self = evt.currentTarget;
      var currentControl = self.querySelector('.filter__button');
      var currentContent = self.querySelector('.filter__list');

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
  })
}

onFaqButtonClick();
onFilterButtonClick();

// modal

var modal = document.querySelector('.modal');
var overlay = modal.querySelector('.overlay');
var openButton = document.querySelector('.main-nav__user-item--login a');
var closeButton = modal.querySelector('.login__close button');
var popupEmailInput = modal.querySelector('input[type="email"]');

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
  openButton.addEventListener('click', function (evt) {
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

// focus

function trapFocus(element) {

  var focusableEls = modal.querySelectorAll('input,button');
  var firstFocusableEl = focusableEls[0];
  var lastFocusableEl = focusableEls[focusableEls.length - 1];

  element.addEventListener('keydown', function (evt) {
    if (!isTabPressed) {
      return;
    }

    if (evt.shiftKey && evt.key === 'Tab') {
      console.log(evt);

      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        evt.preventDefault();
      }
    } else {
      console.log(evt);
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        evt.preventDefault();
      }
    }
  });
}

trapFocus(modal);
