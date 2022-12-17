window.addEventListener("DOMContentLoaded", () => {

    // TABS
    const tabs = document.querySelectorAll('.tabheader__item'), // все табы на странице
          tabsContent = document.querySelectorAll('.tabcontent'), // весь контент в табах
          tabsParent = document.querySelector('.tabheader__items'); // родительский эл-т всех табов

    function hideTabContent() { // скрытие контента в табах
        tabsContent.forEach(item => {
        item.style.display = 'none';
        });

        tabs.forEach(tab => {  //убираем класс активности на табе
            tab.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) { //показывает контент на одном табе
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => { // Активируем нужный таб по клику. Делигируем событие на tabsParent, тк кол-во табов может меняться
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) { // проверка на то, что мы действительно кликнули по табу
            tabs.forEach((item, i) => {
                if (target == item) {                                 // выводим таб под нужным номером по которому произошел клик
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // TIMER

    const deadline = '2022-10-21'; // дата окончания акции.(наш endtime)

    function getTimeRemaining(endtime) { 
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date()); // получает разницу между датой окончания и текущей
         
        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
              days = Math.floor(t / (1000 * 60 * 60 * 24));   // кол-во дней в миллисекундах
              hours = Math.floor((t / (1000 * 60 * 60) % 24));
              minutes = Math.floor((t / 1000 / 60)% 60);
              seconds = Math.floor((t / 1000)% 60);
        }
        return {                                             // формируем объект с данными о том, сколько осталось времени до конца акции
            'total': t,
            'days' : days,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function getZero(num) {     // если число в таймере меньше 10, подставляет к нему слева 0
        if (num>=0 && num< 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {    // Установка времени на странице
        const timer = document.querySelector(selector),      // принимает любой таймер со страницы
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds');
              timeInterval = setInterval(updateClock, 1000); // обновляет таймер каждую секунду

        updateClock(); // запускаем обновление вручную, тк по коду функция запустится только через секунду
        
              function updateClock() {        // Обновление таймера 
                const t = getTimeRemaining(endtime);    // забирает из функции getTimeRemaining объект со всеми данными

                days.innerHTML = getZero(t.days);                // помещаем в колонки на странице информацию из объекта функции getTimeRemaining
                hours.innerHTML = getZero(t.hours);
                minutes.innerHTML = getZero(t.minutes);
                seconds.innerHTML = getZero(t.seconds);

                if(t.total <= 0) {            // если время акции вышло, то таймер останавливается
                    clearInterval(timeInterval);
                }
              }
    }

    setClock('.timer', deadline);

    // MODAL

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
          //modalClose = document.querySelector('[data-close]'); // закоментируем, тк создается новое модальное окно, 
                                                                //где верстка создается динамически и повешенные действия на новые атрибуты реагировать не будут


    function openModal() {                       // открытие модального окна 
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);            // сброс автоматического открытия, если юзер открыл сам
    }
    
    modalTrigger.forEach(function(item) {         // открытие модального окна по клику
        item.addEventListener('click', openModal);
    });


    function closeModal() {                   // закрытие модального окна 
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    //modalClose.addEventListener('click', closeModal);   // закрытие модального окна при клике на крестик(уже не нужно, 
                                                         //тк создаем динамически новое окно, на которое не действует этот скрипт)


    modal.addEventListener('click', (e) => {       // закрытие модального окна при клике на свободную область
        if(e.target === modal || e.target.getAttribute('data-close') == '' ) {       // добавляем закрытие окна, если клик происходит на элемент с дата-атрибутом(наш крестик)
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {                       // закрытие модального на esc
        if (e.code === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);       // открывает модальное окно автоматически


    function showMOdalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {   // Если текущая прокрутка + высота видимой части
            openModal();                                                                                              // контента совпадают с полной прокруткой
            window.removeEventListener('scroll', showMOdalByScroll);                                                  //то срабатывает открытие модального окна
        }
    }

    window.addEventListener('scroll', showMOdalByScroll); // вызов функции по клику


    // CARDS

    class MenuCard {                                                                  // класс создания карточки со всеми основными аргументами
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.classes = classes;                                                  //массив
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 60;                                                      // стоимость доллара за рубль
            this.changeToRUB(); 
        }

        changeToRUB() {
            this.price = +this.price * this.transfer;                               // конвертация долларов в рубли
        }

        render() {
            const element = document.createElement('div'); // создаем новый div для добавления в него карточек и присваиваем ему класс
            if (this.classes.length === 0) {              //если не было передано ни одного класса
                this.element = 'menu__item';
                element.classList.add(this.element);
                
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

             // обращаемся к новосозданному div и добавляем в него каждый новый класс из массива
            element.innerHTML = `                                                
                
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                    </div>
            
            `;
            this.parent.append(element);                                        // добавление HTML кода карточки со своими значениями
        }
    }
    
    const getResource = async (url) => { 
        const res = await fetch(url);

        if (!res.ok) {  // Если возникает ошибка в запросе, функция возвратит ошибку со статусом
           throw new Error(`Could not feth ${url}, status: ${res.status}`);
        }

        return await res.json();       // получает промис и возвращает его в json
    };

    getResource('http://localhost:3000/menu') // при помощи запроса мы получаем массив в сменю из базы
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => { // перебираем массив и тк внутри у нас массив, диструктуризируем его по отдельным свойствам
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();  // создаем новые объекты класса MenuCard() с переданными свойствами из объекта c меню и рендерим
            });
        });

    
    
    //FORMS

    const forms = document.querySelectorAll('form'); // получение всех форм со страницы
    
    const message = {          //объект с сообщениями для различных случаев после сработки скрипта
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => { // перебираем все наши формы, тк они идут в массиве item - это наша форма 
        bindPostData(item);     // вызываем функцию postData с каждой из форм по очереди
    });
    
    const postData = async (url, data) => { // функция отправляет  запрос на сервер и получает данные
        const res = await fetch(url, {
            method: "POST",
            headers: {
                    'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();       // получает промис и возвращает его в json
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();                // отменяем стандартную перезагрузку страницы

            const statusMessage = document.createElement('img'); // создаем картинку с помощью тега img, которая информирует о загрузке
            statusMessage.src = message.loading;                // в statusMessage теперь хранится картинка
            statusMessage.style.cssText = `
            
                display: block;
                margin: 0 auto;
            `;
             // помещаем нашу картинку в форму
            form.insertAdjacentElement('afterend', statusMessage); // помещаем нашу картинку в форму


            const formData = new FormData(form); //переводим данные в формат formData. В скобках форма из которой забираем данные
            console.log(formData);

            const json = JSON.stringify(Object.fromEntries(formData.entries())); // переводим данные FormData в json
            //сначала переводим данные FormData в масив масивов с помощью formData.entries(), а после в обычный объект с помощью Object.fromEntries


            postData('http://localhost:3000/requests', JSON.stringify(json))
            .then(data => {
                console.log(data);
                    showThanksModal(message.success); // если отправка данных успешно завершилась, то отправляется сообщение success
                    form.reset();                                // очистка формы после отправки данных
                    statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });

            
        });
    }

    function showThanksModal (message) {  //показывает окно благодарности при отправки формы с сайта
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.style.display = 'none'; // добавляем класс скрытия содержимого
        openModal(); // открываем заново модальное окно для новой записи

        const thanksModal = document.createElement('div'); 
        thanksModal.classList.add('modal__dialog'); // назначаем стили новому модальному окну благодарности
        thanksModal.innerHTML = `  
            <div class="modal__content">
                <div class="modal__close" data-close>×</div> 
                <div class="modal__title">${message}</div>
            </div>
        
        `; // создаем содержимое нового модального окна. Крестик для закрытия окна и тайтл с текстом

        document.querySelector('.modal').append(thanksModal); // помещаем наш элемент на страницу
        setTimeout(() => {                          // удаляет наше окно благодарности через 4с
            thanksModal.remove();  
            prevModalDialog.style.display = 'block'; // заново показывает предыдущий контент
            closeModal();
        }, 4000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
});


