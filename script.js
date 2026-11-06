'use strict';

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');
const desktopMedia = window.matchMedia('(min-width: 761px)');

const ICON_MENU = '<svg class="icon" aria-hidden="true"><use href="#i-menu"></use></svg>';
const ICON_CLOSE = '<svg class="icon" aria-hidden="true"><use href="#i-close"></use></svg>';

function setMenu(open, { restoreFocus = false } = {}) {
    if (!menuButton || !nav) return;

    const isOpen = Boolean(open);

    nav.classList.toggle('open', isOpen);
    header?.classList.toggle('menu-active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);

    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute(
        'aria-label',
        isOpen ? 'Закрыть меню' : 'Открыть меню'
    );
    menuButton.innerHTML = isOpen ? ICON_CLOSE : ICON_MENU;

    if (!isOpen && restoreFocus) {
        menuButton.focus({ preventScroll: true });
    }
}

menuButton?.addEventListener('click', () => {
    const isOpen = nav?.classList.contains('open') ?? false;
    setMenu(!isOpen);
});

nav?.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');

    if (link) {
        setMenu(false);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
        setMenu(false, { restoreFocus: true });
    }
});

// Закрываем мобильное меню при переходе на десктопную ширину.
desktopMedia.addEventListener?.('change', (event) => {
    if (event.matches) {
        setMenu(false);
    }
});

const yearElement = document.querySelector('#year');

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

const photoMap = {
    students: './assets/ensemble/ensemble_all.jpg',

    teacher1: './assets/teachers/davud.PNG',
    teacher2: './assets/teachers/ali.PNG',
    teacher3: './assets/teachers/kseniya.png',

    teacher1Detail: './assets/teachers/davud2.JPG',
    teacher2Detail: './assets/teachers/ali2.JPG',
    teacher3Detail: './assets/teachers/ksenia2.jpg',

    ensemble: './assets/ensemble/duo.png',

    show1: './assets/show/gr1.JPG',
    show2: './assets/show/gr2.JPG',

    gallery1: './assets/gallery/ph1.JPG',
    gallery2: './assets/gallery/ph2.PNG',
    gallery3: './assets/gallery/ph3.JPG',
    gallery4: './assets/gallery/ph4.JPG'
};

function applyPhoto(element, photoKey) {
    const imagePath = photoMap[photoKey];

    if (!element || !imagePath) return;

    element.style.backgroundImage =
        `linear-gradient(0deg, rgba(0, 0, 0, .18), rgba(0, 0, 0, .05)), url("${imagePath}")`;

    element.classList.add('has-image');
}

document.querySelectorAll('[data-photo]').forEach((element) => {
    applyPhoto(element, element.dataset.photo);
});


const revealTargets = document.querySelectorAll(
    '.section-index, .about-copy, .teacher-card, .group-card, ' +
    '.schedule-card, .ensemble-bottom > div, .show-grid, ' +
    '.gallery-photo, .faq-list details, .social-list a'
);

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealTargets.forEach((element) => {
        observer.observe(element);
    });
} else {
    revealTargets.forEach((element) => {
        element.classList.add('in-view');
    });
}

const aboutReader = document.querySelector('[data-about-reader]');

if (aboutReader) {
    const aboutPages = Array.from(
        aboutReader.querySelectorAll('[data-about-page]')
    );
    const aboutControls = aboutReader.querySelector('[data-about-controls]');
    const aboutProgress = aboutReader.querySelector('[data-about-progress]');
    const aboutPrev = aboutReader.querySelector('[data-about-prev]');
    const aboutNext = aboutReader.querySelector('[data-about-next]');
    const aboutExpand = aboutReader.querySelector('[data-about-expand]');
    const aboutDesktopMedia = window.matchMedia('(min-width: 761px)');

    let activeAboutPage = 0;
    let aboutExpanded = false;

    function renderAboutReader() {
        const isDesktop = aboutDesktopMedia.matches;
        const lastPage = aboutPages.length - 1;

        aboutPages.forEach((page, index) => {
            const isVisible = isDesktop
                ? index === activeAboutPage
                : index === 0 || aboutExpanded;

            page.hidden = !isVisible;
        });

        if (aboutProgress) {
            const current = String(activeAboutPage + 1).padStart(2, '0');
            const total = String(aboutPages.length).padStart(2, '0');

            aboutProgress.textContent = isDesktop
                ? `${current} / ${total}`
                : aboutExpanded ? 'ПОЛНЫЙ ТЕКСТ' : '01 / 05';
        }

        if (aboutPrev) {
            aboutPrev.hidden = !isDesktop || activeAboutPage === 0;
        }

        if (aboutNext) {
            aboutNext.hidden = !isDesktop || activeAboutPage === lastPage;
        }

        if (aboutExpand) {
            aboutExpand.hidden = isDesktop;
            aboutExpand.textContent = aboutExpanded ? 'Свернуть' : 'Читать далее';
            aboutExpand.setAttribute('aria-expanded', String(aboutExpanded));
        }
    }

    function moveAboutPage(direction) {
        const nextPage = activeAboutPage + direction;

        if (nextPage < 0 || nextPage >= aboutPages.length) return;

        activeAboutPage = nextPage;
        renderAboutReader();
    }

    aboutNext?.addEventListener('click', () => moveAboutPage(1));
    aboutPrev?.addEventListener('click', () => moveAboutPage(-1));

    aboutExpand?.addEventListener('click', () => {
        aboutExpanded = !aboutExpanded;
        renderAboutReader();
    });

    aboutControls.hidden = false;
    aboutReader.classList.add('is-enhanced');
    renderAboutReader();

    aboutDesktopMedia.addEventListener?.('change', () => {
        activeAboutPage = 0;
        aboutExpanded = false;
        renderAboutReader();
    });
}

const teachers = {
    'teacher-1': {
        name: 'Давуд Закирзаде',
        bio: 'Главный хореограф студии KAVKAZ. Здесь можно разместить историю, танцевальный опыт, направления и личный подход преподавателя.',
        photo: 'teacher1Detail'
    },

    'teacher-2': {
        name: 'Али Картоев',
        bio: 'Кавказский танец для мужчины — это не просто движения. Это характер. Умение держать спину, чувствовать ритм и выглядеть так, чтобы это запомнили. На занятиях мы поставим осанку, отработаем технику рук и ног и научимся двигаться так, чтобы в каждом жесте читалась сила и уверенность. Приходи — и ты почувствуешь, что значит танцевать по-мужски.',
        photo: 'teacher2Detail'
    },

    'teacher-3': {
        name: 'Ксения Клименкова',
        bio: 'Женская партия в кавказском танце — это история о невероятной грации, гордости и женской силе, это эталон благородства и эстетики, где каждая деталь раскрывает твою внутреннюю женственность. Мы начнем с самых азов: поставим осанку, проработаем пластику рук и научимся чувствовать этот мощный ритм. Приходи, и я научу тебя двигаться так, будто ты не касаешься земли!',
        photo: 'teacher3Detail'
    }
};

const dialog = document.querySelector('#teacherDialog');
const dialogName = document.querySelector('#dialogName');
const dialogBio = document.querySelector('#dialogBio');
const dialogPhoto = document.querySelector('#dialogPhoto');
const dialogClose = document.querySelector('.dialog-close');
const dialogCta = document.querySelector('#dialogCta');

let lastFocusedTeacher = null;

function openTeacherDialog(card) {
    if (!dialog || !dialogName || !dialogBio || !dialogPhoto) return;
    if (dialog.open) return;

    const teacherId = card.dataset.modal;
    const teacher = teachers[teacherId];

    if (!teacher) return;

    lastFocusedTeacher = card;

    dialogName.textContent = teacher.name;
    dialogBio.textContent = teacher.bio;

    const label = dialogPhoto.querySelector('span');

    if (label) {
        label.textContent = teacher.name.toUpperCase();
    }

    dialogPhoto.style.backgroundImage = '';
    dialogPhoto.classList.remove('has-image');
    dialogPhoto.dataset.photo = teacher.photo;

    applyPhoto(dialogPhoto, teacher.photo);

    dialog.showModal();
}

document.querySelectorAll('[data-modal]').forEach((card) => {
    card.addEventListener('click', () => {
        openTeacherDialog(card);
    });
});

function closeTeacherDialog() {
    if (dialog?.open) {
        dialog.close();
    }
}

dialogClose?.addEventListener('click', closeTeacherDialog);

// Закрытие по нажатию на затемнённую область вокруг окна.
dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) {
        closeTeacherDialog();
    }
});

// Возвращаем фокус на карточку, с которой открыли окно.
dialog?.addEventListener('close', () => {
    if (lastFocusedTeacher?.isConnected) {
        lastFocusedTeacher.focus({ preventScroll: true });
    }

    lastFocusedTeacher = null;
});

// Закрываем окно при переходе к контактам.
dialogCta?.addEventListener('click', () => {
    closeTeacherDialog();
});


const quotes = [
    '«Профессионализм, энергия и эмоции, которые остаются с тобой»',
    '«Команда, в которой поддерживают и помогают расти»',
    '«Выступление, которое превращает обычный вечер в событие»'
];

let quoteIndex = 0;

const quoteElement = document.querySelector('#quote');
const quoteCountElement = document.querySelector('#quoteCount');

function renderQuote() {
    if (!quotes.length) return;

    if (quoteElement) {
        quoteElement.textContent = quotes[quoteIndex];
    }

    if (quoteCountElement) {
        const current = String(quoteIndex + 1).padStart(2, '0');
        const total = String(quotes.length).padStart(2, '0');

        quoteCountElement.textContent = `${current} / ${total}`;
    }
}

document.querySelector('#prevQuote')?.addEventListener('click', () => {
    quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length;
    renderQuote();
});

document.querySelector('#nextQuote')?.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    renderQuote();
});

renderQuote();


/* ФИЛЬТР ГАЛЕРЕИ */

const galleryTabs = document.querySelector('.gallery-tabs');
const galleryButtons =
    galleryTabs?.querySelectorAll('button[data-filter]') ?? [];
const galleryPhotos = document.querySelectorAll('.gallery-photo');

function setGalleryFilter(activeButton) {
    const filter = activeButton.dataset.filter;

    galleryButtons.forEach((button) => {
        const isActive = button === activeButton;

        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    galleryPhotos.forEach((photo) => {
        const isVisible =
            filter === 'all' || photo.dataset.category === filter;

        photo.hidden = !isVisible;

        photo.style.display = isVisible ? '' : 'none';
    });
}

galleryButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setGalleryFilter(button);
    });
});

// Синхронизируем начальное состояние фильтра и карточек галереи.
const initialGalleryButton = galleryTabs?.querySelector(
    'button[data-filter].active'
);

if (initialGalleryButton) {
    setGalleryFilter(initialGalleryButton);
}
