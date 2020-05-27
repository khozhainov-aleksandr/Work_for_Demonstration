// Комментарии написаны на Русском в учебных целях для личного использования !

// - 1ый день

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/';
const API_KEY ='624e6ae26e572199a15bbde6c428ca8c';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');


class DBService {
	getData = async (url) => {
		const res = await fetch(url);
		if (res.ok) {
			return res.json();
		} else {
			throw new Error(`Не удалось получить данные по адресу ${url}`)
		}
	}

	getTestDate = () => {
		return this.getData('test.json')
	}
}

const renderCard = response => {
	response.results.forEach(item => {

		const {
			backdrop_path: backdrop,
			name: title,
			poster_path: poster,
			vote_average: vote
		} = item;

		const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
		const backdropIMG = ''; // ДЗ если нет backdrop то не добавляем не чего
		const voteElem = ''; // Если нет voteElem то не выводим span tv-card__vote

		const card = document.createElement('li');
		card.className = 'tv-shows__item';
		card.innerHTML = `
			<a href='#' class='tv-card'>
			<span class="tv-card__vote">${vote}</span>
			<img class="tv-card__img"
				src="${posterIMG}"
				data-backdrop="${IMG_URL + backdrop}"
				alt="${title}">
			<h4 class="tv-card__head">${title}</h4>
			</a>
		`;

		tvShowsList.append(card);
	});
}

new DBService().getTestDate().then((response) => {

});
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
		document.body.style.overflow = 'hiden'; // вызываем overflow: hiden; что бы скрыть скрол с права
		modal.classList.remove('hide');
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
		img.dataset.max = '123';
	}
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);
// Конец


// - 3ий день


