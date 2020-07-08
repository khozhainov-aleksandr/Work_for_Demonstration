'use strict';

const modalAdd = document.querySelector('.modal__add'),
	  addAd = document.querySelector('.add__ad'),
	  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
	  modalSubmit = document.querySelector('.modal__submit'),
	  modalItems = document.querySelector('.modal__item'),
	  modalCatalog = document.querySelector('.catalog');

//- Открытие модального окна.
addAd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	modalBtnSubmit.disabled = true; // Блокируем кнопку на отправку формы.
});

//- Закрытие модального окна на крестик или за пределами.
modalAdd.addEventListener('click', event => {
	const target = event.target;

	if (target.classList.contains('modal__close') || // Закрытие по крестику
		target === modalAdd) { // Закрытие за пределами модального окна
		modalAdd.classList.add('hide');
		modalSubmit.reset(); // Очищает форму после отправки и закрытии.
	}
});


//- Открытие модального окна (Карточки)
modalCatalog.addEventListener('click', () => {
	modalItems.classList.remove('hide');
});

//- Закрытие модального окна (Карточки)
modalItems.addEventListener('click', event => {
	const target = event.target;

	if (target.classList.contains('modal__close') || // Закрытие по крестику
		target === modalItems) {
		modalItems.classList.add('hide');
	}
});
