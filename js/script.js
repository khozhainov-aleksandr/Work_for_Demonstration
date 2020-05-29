// + Комментарии написаны на Русском в учебных целях для личного использования !

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows'); // Используется для прилоудера

// ! Эта секция используется для заполнения pop-up окна при нажатии на карточку
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');

// ! Срабатывает поиск по нажатию на Enter
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');

const preloader = document.querySelector('.preloader'); 
const dropdown = document.querySelectorAll('.dropdown');
const tvShowsHead = document.querySelector('.tv-shows__head');
const posterWrapper = document.querySelector('.poster__wrapper');
const modalContent = document.querySelector('.modal__content');
const pagination = document.querySelector('.pagination');


// ! Прилоудер на всю страницу ---
const loading = document.createElement('div'); // Создали элемент
loading.className = 'loading'; // Добавили класс для прилоудера


// ! Делаем запрос на сервер ---
class DBService {

	constructor(){
		this.SERVER = 'https://api.themoviedb.org/3';
		this.API_KEY ='624e6ae26e572199a15bbde6c428ca8c';
	}

	getData = async (url) => {
		tvShows.append(loading);
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

	getSearchResult = query => {
		this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
		return this.getData(this.temp);
	}

	getNextPage = page => {
		return this.getData(this.temp + '&page=' + page);
	}

	getTvShow = id => this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`); // Другой стиль написания

	getTopRated = () => this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);

	getPopular = () => this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);

	getToday = () => this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);

	getWeek = () => this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
}

const dbService = new DBService();

// ! Рендерятся картинки с сервера ---
const renderCard = (response, target) => {
	tvShowsList.textContent = '';

	if (!response.total_results) {
		loading.remove();
		tvShowsHead.textContent = 'К сожалению по вашему запросу не чего не найдено ...';
		tvShowsHead.style.cssText = 'color: red; font-size: 30px;';
		return;
	}

	tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
	tvShowsHead.style.cssText = 'color: green;';

	response.results.forEach(item => {
		const {
			backdrop_path: backdrop,
			name: title,
			poster_path: poster,
			vote_average: vote,
			id
		} = item;

		const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
		const backdropIMG = backdrop ? IMG_URL + backdrop : ''; // с помощью тернарного вопроса ? задаем вопрос // в конце добавляем '' пустую строку что бы не добавлялся постер No Poster
		const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : ''; // Если нет voteElem то не выводим span tv-card__vote // там где рейтинг 0 мы убираем логотип с рейтингом

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

		loading.remove(); // Закрываем (удаляем) прилоудер
		tvShowsList.append(card); // Загружаются новые карточки с сервера
	});

	pagination.textContent = '';

	// ! Выводим список страниц в конце страницы
	if (! target && response.total_pages > 1) {
		for (let i = 1; i <= response.total_pages; i++) {
			pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`
		}
	}

};


// ! Работа с поисковой строкой
searchForm.addEventListener('submit', event => { // Submit это событие которое происходит при нажатии на кнопку Submit или при нажатии на Enter
	event.preventDefault();
	const value = searchFormInput.value.trim();
	searchFormInput.value = ''; // очистка запроса
	if (value) {
		dbService.getSearchResult(value).then(renderCard);
	}
	searchFormInput.value = '';
});


const closeDropdown = () => {
	dropdown.forEach(item => {
		item.classList.remove('active'); // закрываем все выпадающие меню при нажатии на пустое пространство за пределами окна
	})
}

// ! Открытие меню по нажатию на Гамбургер ---
hamburger.addEventListener('click', () => { // addEventListener - (вызов функции) отслеживает события: клик, наведение, нажатия клавиши
	leftMenu.classList.toggle('openMenu'); // classList - обращаемся к методу он работает только с классами и точку ставить не нужно в скобках
	hamburger.classList.toggle('open'); // toggle - добавляет если есть класс и убирает если его нету // эта строчка меняет значок гамбургера на красный крестик
});


// ! Закрытия меню когда мы щелкаем за ее пределами ---
document.addEventListener('click', event => {
	const target = event.target; // target назначаем event.target для того что бы не писать ниже event.target (хорошая практика)
	if (!target.closest('.left-menu')) { // стоит ! знак отрицания что бы поменять true на false. А когда стоит !! это двойное отрицание что бы посмотреть буливое значение элемента
		leftMenu.classList.remove('openMenu'); // Метод remove позволяет закрыть окно (убрать классы openMenu и open)
		hamburger.classList.remove('open');
		closeDropdown();
	}
});


// ! Drop Down Menu делает выпадающие списки по нажатию в левом окне - меню (раскрывает список ul "dropdown-list") ---
leftMenu.addEventListener('click', event => { // event без скобок () так как когда 1 элемент то скобки не обязательны
	event.preventDefault();
	const target = event.target;
	const dropdown = target.closest ('.dropdown'); // closest - это метод который постепенно подымается по элементам пока не найдет указанный селектор. Если не найдет то возвращает "null"
	if (dropdown) {
		dropdown.classList.toggle('active');
		leftMenu.classList.add('openMenu'); // 29 и 30 строчки добавляется классы для того что бы меню открывалось по нажатию на иконки (не обязательно нажимать на гамбургер что бы открыть меню)
		hamburger.classList.add('open');
	}

	if (target.closest('#top-rated')) {
		dbService.getTopRated().then((response) => renderCard(response, target));
	}

	if (target.closest('#popular')) {
		dbService.getPopular().then((response) => renderCard(response, target));
	}

	if (target.closest('#week')) {
		dbService.getWeek().then((response) => renderCard(response, target));
	}

	if (target.closest('#today')) {
		dbService.getToday().then((response) => renderCard(response, target));
	}
	if (target.closest('#search')) {
		tvShowsList.textContent = '';
		tvShowsHead.textContent = '';
	}
});


// ! Открытие модального окна ---
tvShowsList.addEventListener('click', event => {

	event.preventDefault(); // Эта строчка блокирует скачек страницы к верху после нажатия на карточку так как на карточках стоит #

	const target = event.target;
	const card = target.closest('.tv-card');

	if (card) {

		preloader.style.display = 'block';

		// ! Подставляются данные в карточку ---
		dbService.getTvShow(card.id)
		.then(({ // then метод который обрабатывает промисы
			poster_path: posterPath,
			name: title,
			genres,
			vote_average: voteAverage,
			overview,
			homepage }) => {
				if (posterPath) {
					tvCardImg.src = IMG_URL + posterPath; // Подставляем картинки
					tvCardImg.alt = title;
					posterWrapper.style.display = '';
					modalContent.style.paddingLeft = '';
				} else {
					posterWrapper.style.display = 'none';
					modalContent.style.paddingLeft = '25px';
				}
				
				modalTitle.textContent = title; // Подставляем заголовки
				genresList.textContent = '';
				genres.forEach(item => {
					genresList.innerHTML += `<li>${item.name}</li>`;
				});
				rating.textContent = voteAverage;
				description.textContent = overview;
				modalLink.href = homepage;
			})
		.then(() => {
			document.body.style.overflow = 'hidden'; // вызываем overflow: hiden; что бы скрыть скрол с права
			modal.classList.remove('hide');
		})
		.finally(() => {
			preloader.style.display = ''; // Закрытие прилоудера для модального окна
		});
	}
});


// ! Закрытие модального окна ---
modal.addEventListener('click', event => {
	const crossClose = event.target.closest('.cross'); // Закрываем по нажатию на красный крестик
	const modalClose = event.target.classList.contains('modal'); // Закрываем по нажатию на фон (за пределами модального окна)

	if (crossClose || modalClose) {
		document.body.style.overflow = '';
		modal.classList.add('hide'); // Прячет модальное окно
		loading.remove(); // Убираем прилоудер после закрытия модального окна
	}
});


// ! Смена карточек (замена местами) ---
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

pagination.addEventListener('click', event => {
	event.preventDefault();
	const target = event.target;

	if (target.classList.contains('pages')) {
		tvShows.append(loading);
		dbService.getNextPage(target.textContent).then(renderCard);
	}
});