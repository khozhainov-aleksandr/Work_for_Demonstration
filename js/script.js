// Комментарии написаны на Русском в учебных целях для личного использования !

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/';
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY ='624e6ae26e572199a15bbde6c428ca8c';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');

const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');

const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');


// Прилоудер на странице
const loading = document.createElement('div');
loading.className = 'loading';

// Запрос на сервер
class DBService {
	getData = async (url) => {
		const res = await fetch(url);
		if (res.ok) {
			return res.json();
		} else {
			throw new Error(`Не удалось получить данные по адресу ${url}`);
		}
	}

	getTestDate = () => {
		return this.getData('test.json'); // Запрос
	}

	getTestCard = () => {
		return this.getData('card.json'); // Запрос
	}

	getSearchResult = (query) => {
		return this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);
	}

	getTvShow = id => this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`); // Другой стиль написания
}


const renderCard = response => {
	tvShowsList.textContent = '';

	response.results.forEach(item => {

		const {
			backdrop_path: backdrop,
			name: title,
			poster_path: poster,
			vote_average: vote,
			id
		} = item;

		const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
		const backdropIMG = backdrop ? IMG_URL + backdrop : '';
		const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : ''; // Если нет voteElem то не выводим span tv-card__vote

		const card = document.createElement('li');
		card.idTV = id;
		card.className = 'tv-shows__item';
		card.innerHTML = `
			<a href="#" id="${id}" class="tv-card">
			${voteElem}
			<img class="tv-card__img"
				src="${posterIMG}"
				data-backdrop="${backdropIMG}"
				alt="${title}">
			<h4 class="tv-card__head">${title}</h4>
			</a>
		`;

		loading.remove(); // Закрываем прилоудер
		tvShowsList.append(card);
	});
};

searchForm.addEventListener('submit', event => {
	event.preventDefault();
	const value = searchFormInput.value.trim();
	searchFormInput.value = ''; // очистка запроса
	if (value) {
		tvShows.append(loading);
		new DBService().getSearchResult(value).then(renderCard);
	}
})

// Конец


// > Меню


// Открытие меню по нажатию на Гамбургер
hamburger.addEventListener('click', () => { // addEventListener - (вызов функции) отслеживает события: клик, наведение, нажатия клавиши
	leftMenu.classList.toggle('openMenu'); // classList - обращаемся к методу он работает только с классами и точку ставить не нужно в скобках
	hamburger.classList.toggle('open'); // toggle - добавляет если есть класс и убирает если его нету // эта строчка меняет значок гамбургера на красный крестик
});
// Конец


// Закрытия меню когда мы щелкаем за ее пределами
document.addEventListener('click', event => {
	const target = event.target; // target назначаем event.target для того что бы не писать ниже event.target (хорошая практика)
	if (!target.closest('.left-menu')) { // стоит ! знак отрицания что бы поменять true на false. А когда стоит !! это двойное отрицание что бы посмотреть буливое значение элемента
		leftMenu.classList.remove('openMenu'); // Метод remove позволяет закрыть окно (убрать классы openMenu и open)
		hamburger.classList.remove('open');
	}
});
// Конец


// Drop Down Menu делает выпадающие списки по нажатию в левом окне - меню (раскрывает список ul "dropdown-list")
leftMenu.addEventListener('click', event => { // event без скобок () так как когда 1 элемент то скобки не обязательны
	event.preventDefault();
	const target = event.target;
	const dropdown = target.closest ('.dropdown'); // closest - это метод который постепенно подымается по элементам пока не найдет указанный селектор. Если не найдет то возвращает "null"
	if (dropdown) {
		dropdown.classList.toggle('active');
		leftMenu.classList.add('openMenu'); // 29 и 30 строчки добавляется классы для того что бы меню открывалось по нажатию на иконки (не обязательно нажимать на гамбургер что бы открыть меню)
		hamburger.classList.add('open');
	}
});
// Конец


// Открытие модального окна
tvShowsList.addEventListener('click', event => {

	event.preventDefault(); // Эта строчка блокирует скачек страницы к верху после нажатия на карточку так как на карточках стоит #

	const target = event.target;
	const card = target.closest('.tv-card');

	if (card) {

		new DBService().getTvShow(card.id)
		.then(data => {
			tvCardImg.src = IMG_URL + data.poster_path;
			tvCardImg.alt = data.name;
			modalTitle.textContent = data.name;
			genresList.textContent = '';
			for (const item of data.genres) { // fore быстрее чем foreEach лучше использовать fore
				genresList.innerHTML += `<li>${item.name}</li>`;
			};
			rating.textContent = data.vote_average;
			description.textContent = data.overview;
			modalLink.href = data.homepage;
		}) // then метод который обрабатывает промисы
		.then(() => {
			document.body.style.overflow = 'hidden'; // вызываем overflow: hiden; что бы скрыть скрол с права
			modal.classList.remove('hide');
		})
		
	}
});
// Конец


// закрытие модального окна
modal.addEventListener('click', event => {
	const crossClose = event.target.closest('.cross'); // Закрываем по нажатию на красный крестик
	const modalClose = event.target.classList.contains('modal'); // Закрываем по нажатию на фон (за пределами модального окна)

	if (crossClose || modalClose) {
		document.body.overflow = '';
		modal.classList.add('hide'); // Прячет модальное окно
	}
});
// Конец


// Смена карточек (замена местами)
const changeImage = event => {
	const card = event.target.closest('.tv-shows__item');

	if (card) {
		const img = card.querySelector('.tv-card__img');
		if (img.dataset.backdrop) {
			[img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
		}
	}
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);
// Конец