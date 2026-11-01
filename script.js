const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');

function setMenu(open) {
  nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute(
    'aria-label',
    open ? 'Закрыть меню' : 'Открыть меню'
  );
  menuButton.textContent = open ? '×' : '☰';
  header?.classList.toggle('menu-active', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav?.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => setMenu(false))
);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav?.classList.contains('open')) setMenu(false);
});

document.querySelector('#year').textContent = new Date().getFullYear();

// Scroll reveal for below-the-fold elements
const revealTargets = document.querySelectorAll(
  '.section-index,.about-copy,.teacher-card,.group-card,.schedule-card,.ensemble-bottom>div,.show-grid,.gallery-photo,.faq-list details,.social-list a'
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => observer.observe(el));
}

const bios = {
  'teacher-1': {
    name: 'Давуд Закирзаде',
    bio: 'Главный хореограф студии KAVKAZ. Здесь можно разместить историю, танцевальный опыт, направления и личный подход преподавателя.',
  },
  'teacher-2': {
    name: 'Али Картоев',
    bio: 'Хореограф ансамбля. Добавьте информацию о направлениях, опыте, достижениях и том, как преподаватель поддерживает учеников.',
  },
  'teacher-3': {
    name: 'Ксения Клименкова',
    bio: 'Хореограф ансамбля. Добавьте биографию, специализацию и несколько фактов, которые помогут ученикам познакомиться с преподавателем.',
  },
};

const dialog = document.querySelector('#teacherDialog');
const teacherDetailPhotos = {
  'teacher-1': 'teacher1Detail',
  'teacher-2': 'teacher2Detail',
  'teacher-3': 'teacher3Detail',
};

document.querySelectorAll('[data-modal]').forEach((card) =>
  card.addEventListener('click', () => {
    const data = bios[card.dataset.modal];
    if (!data) return;

    document.querySelector('#dialogName').textContent = data.name;
    document.querySelector('#dialogBio').textContent = data.bio;

    const photo = document.querySelector('#dialogPhoto');
    const photoKey = teacherDetailPhotos[card.dataset.modal] || 'teacher1Detail';

    photo.dataset.photo = photoKey;
    photo.style.backgroundImage = '';
    photo.classList.remove('has-image');

    const label = photo.querySelector('span');
    if (label) label.textContent = data.name.toUpperCase();

    const imagePath = photoMap[photoKey];
    if (imagePath) {
      photo.style.backgroundImage = `linear-gradient(0deg,rgba(0,0,0,.18),rgba(0,0,0,.05)),url("${imagePath}")`;
      photo.classList.add('has-image');
    }

    dialog.showModal();
  })
);

document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());

dialog?.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

document.querySelector('#dialogCta')?.addEventListener('click', () => dialog.close());

const quotes = [
  '«Профессионализм, энергия и эмоции, которые остаются с тобой»',
  '«Команда, в которой поддерживают и помогают расти»',
  '«Выступление, которое превращает обычный вечер в событие»',
];
let quoteIndex = 0;

function renderQuote() {
  document.querySelector('#quote').textContent = quotes[quoteIndex];
  document.querySelector('#quoteCount').textContent =
    `0${quoteIndex + 1} / 0${quotes.length}`;
}

document.querySelector('#prevQuote')?.addEventListener('click', () => {
  quoteIndex = (quoteIndex + quotes.length - 1) % quotes.length;
  renderQuote();
});

document.querySelector('#nextQuote')?.addEventListener('click', () => {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  renderQuote();
});

document.querySelectorAll('.gallery-tabs button').forEach((btn) =>
  btn.addEventListener('click', () => {
    document
      .querySelectorAll('.gallery-tabs button')
      .forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-photo').forEach((photo) => {
      photo.hidden = filter !== 'all' && photo.dataset.category !== filter;
    });
  })
);

// Photo replacement helper: put images into assets/ and add their relative path to this map.
const photoMap = {
  // Основные фотографии на странице:
//   hero:'./assets/ensemble/ensemble_all2.jpg', 
  students:'./assets/ensemble/ensemble_all.jpg',
  teacher1:'./assets/teachers/davud.PNG', teacher2:'./assets/teachers/ali.JPG', teacher3:'./assets/teachers/kseniya.png',
  // Отдельные фотографии, которые показываются только при открытии карточки преподавателя:
  teacher1Detail: './assets/teachers/davud2.png',
  teacher2Detail: 'assets/teacher-2-detail.jpg',
  teacher3Detail: './assets/teachers/ksenia2.jpg',
  ensemble:'./assets/ensemble/duo.jpg', show1:'./assets/show/gr1.JPG', show2:'./assets/show/gr2.JPG',
  gallery1:'./assets/gallery/ph1.JPG', gallery2:'./assets/gallery/ph2.PNG', gallery3:'./assets/gallery/ph3.JPG', gallery4:'./assets/gallery/ph4.JPG'
};

document.querySelectorAll('[data-photo]').forEach((el) => {
  const key = el.dataset.photo;
  if (photoMap[key]) {
    el.style.backgroundImage = `linear-gradient(0deg,rgba(0,0,0,.18),rgba(0,0,0,.05)),url("${photoMap[key]}")`;
    el.classList.add('has-image');
  }
});