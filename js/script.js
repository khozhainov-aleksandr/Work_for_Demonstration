// Комментарии написаны на Русском в учебных целях для личного использования !

// - Меню
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');

// Открытие меню по нажатию на Гамбургер
hamburger.addEventListener('click', () => { // addEventListener - (вызов функции) отслеживает события: клик, наведение, нажатия клавиши
	leftMenu.classList.toggle('openMenu'); // classList - обращаемся к методу он работает только с классами и точку ставить не нужно в скобках
	hamburger.classList.toggle('open'); // toggle - добавляет если есть класс и убирает если его нету // эта строчка меняет значок гамбургера на красный крестик
});

// Закрытия меню когда мы щелкаем за ее пределами
document.addEventListener('click', event => {
	const target = event.target;
	if (!target.closest('.left-menu')) { // стоит ! знак отрицания что бы поменять true на false. А когда стоит !! это двойное отрицание что бы посмотреть буливое значение элемента
		leftMenu.classList.remove('openMenu'); // Метод remove позволяет закрыть окно (убрать классы openMenu и open)
		hamburger.classList.remove('open');
	}
});

leftMenu.addEventListener('click', event => {
	const target = event.target;
	const dropdown = target.closest ('.dropdown'); // closest - это метод который постепенно подымается по элементам пока не найдет указанный селектор. Если не найдет то возвращает "null"
	if (dropdown) {
		dropdown.classList.toggle('active');
		leftMenu.classList.add('openMenu');
		hamburger.classList.add('open');
	}
});

// - 2 день
