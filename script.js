'use strict';

const modalAdd = document.querySelector('.modal__add'),
	  addAd = document.querySelector('.add__ad'),
	  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
	  modalSubmit = document.querySelector('.modal__submit'),
	  catalog = document.querySelector('.catalog'),
	  modalItem = document.querySelector('.modal__item');

//- Функция на закрытие модального окна
const closeModal = event => {
	const target = event.target;

	if (target.classList.contains('modal__close') || // Закрытие по крестику
		target === modalAdd ||
		target === modalItem) { // Закрытие за пределами модального окна
		modalAdd.classList.add('hide');
		modalSubmit.reset(); // Очищает форму после отправки и закрытии.
		modalItem.classList.add('hide');
	}
};

//- Открытие модального окна.
addAd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	modalBtnSubmit.disabled = true; // Блокируем кнопку на отправку формы.
});

//- Закрытие модального окна на крестик или за пределами.
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

//- Открытие модального окна (карточки)
catalog.addEventListener('click', () => {
	const target = event.target;

	if (target.closest('.card')) {
		modalItem.classList.remove('hide');
	}
});

//- Закрытие модального окна по нажатию на esc
document.addEventListener('keydown', event => { // Нажатие на кнопку.
	
});