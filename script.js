let form = document.querySelector('form');
let inputForm = document.querySelector('.input-form');
let shoppingList = document.querySelector('.shopping-list');
let shoppingListMain = document.querySelector('.shopping-list__main');
let shoppingListFooter = document.querySelector('.shopping-list__footer');
let noteCounter = 0;
let localStorage = window.localStorage;
let noteArray = [];

let firstLetter = (str) => str.split('')[0].toUpperCase() + str.slice(1)

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (inputForm.value === '') {
        inputForm.classList.add('error')
    } else {
        inputForm.classList.remove('error')
        if (noteCounter === 0) {
            shoppingListMain.classList.remove('d-none');
            shoppingListFooter.classList.remove('d-none');
        }
        addNote(firstLetter(inputForm.value.trim()));
        inputForm.value = '';
    }
})

function addNote(noteText,isChecked = false) {
    noteCounter++;
    const note = document.createElement('div');
    note.className = 'note';
    note.innerHTML = `
    <label>
        <input type="checkbox" class="note__checkbox visually-hidden" id="${noteCounter}" ${isChecked ? 'checked' : ''}>
        <span class="note__custom-checkbox"></span>
        <p class="note__text ${isChecked ? 'checked' : ''}">${noteText}</p>
        <input class="note__input d-none" type="text" value = '${noteText}'>
    </label>
    <div class="note__button-container">
        <button class="note__edit-btn">✏️</button>
        <button class="note__delete-btn">🗑</button>
    </div>
    `
    shoppingListMain.append(note)

    noteArray.push({text: noteText, id: noteCounter, isChecked: isChecked})
    localStorage.setItem('notes', JSON.stringify(noteArray))
}

if(localStorage.notes) {
    shoppingListMain.classList.remove('d-none');
    shoppingListFooter.classList.remove('d-none');
    let localStorageArray = JSON.parse(localStorage.notes.split(','))
    for(let el of localStorageArray) {
        addNote(el.text, el.isChecked);
    }
}
let isEdited = false;
shoppingList.addEventListener('click', function(e) {
    if(e.target.classList.contains('note__checkbox' || 'note__custom-checkbox' || 'note__text')){
        let id = e.target.closest('.note').querySelector('.note__checkbox').getAttribute('id');
        e.target.closest('.note').querySelector('.note__text').classList.toggle('checked');
        e.target.closest('.note').querySelector('.note__checkbox').checked ? checkNote(id) : uncheckNote(id);
    } else if (e.target.classList.contains('note__delete-btn')){ // если нажали на урну
        let id = e.target.closest('.note').querySelector('.note__checkbox').getAttribute('id');
        deleteNote(id, localStorage);
        e.target.closest('.note').remove(); // удаляем задание
        isLast(localStorage); // проверка на последний элемент в массиве
    } else if (e.target.classList.contains('delete-block__delete-checked')){ // если нажали на удалить завершенные
        let checkboxes = document.querySelectorAll('.note__checkbox');
        for (el of checkboxes) {
            if (el.checked) {
             el.closest('.note').remove()
            }
        }
        deleteChecked(localStorage);
        isLast(localStorage); // проверка на последний элемент в массиве
    } else if (e.target.classList.contains('delete-block__delete-all')){ // если нажали на удалить все
        deleteAll(shoppingListMain)
    } else if (e.target.classList.contains('note__edit-btn')) {
        let id = e.target.closest('.note').querySelector('.note__checkbox').getAttribute('id');
        let editButton = e.target.closest('.note').querySelector('.note__edit-btn');
        let noteText = e.target.closest('.note').querySelector('.note__text');
        let noteInput = e.target.closest('.note').querySelector('.note__input');
        editButton.classList.toggle('tick');
        let editButtonsArray = document.querySelectorAll('.note__edit-btn');
        let isEditedCounter = 0
        for (let button of editButtonsArray) {
            if (button.classList.contains('tick')) {
                isEditedCounter++;
            }
        }
        isEditedCounter > 1 ? isEdited = true : isEdited = false
        if(isEdited === true) { //если что-то еще редактируется
            editButton.classList.toggle('tick');
            let editedId;
            for (let button of editButtonsArray) {
                if (button.classList.contains('tick')) {
                    editedId = button.closest('.note').querySelector('.note__checkbox').getAttribute('id')
                }
            }
            editButtonsArray[editedId-1].click(); // имитация клика по кнопке редактируемого инпута
            editButton.click(); //имитация клика по кнопке, которую уже нажал пользователь для запуска редактирования новой строки
        }
        if (isEdited === false && editButton.classList.contains('tick')){ //если ничего не редактируется и есть класс tick
            noteText.classList.add('d-none'); // убираем р
            noteInput.classList.remove('d-none'); // открываем инпут
            editButton.innerHTML = '✅' // меняем кнопку на галку
            noteInput.onkeypress = function(e) { // функция по нажатию на энтер
                let key = e.which || e.keyCode
                if (key === 13) {
                    editNote(id, noteInput, noteText, editButton);
                    noteText.classList.remove('d-none');
                    noteInput.classList.add('d-none');
                }
            }
            editButton.addEventListener('click', function() { // функция по нажатию на кнопку
                editButton.classList.toggle('tick');
                editNote(id, noteInput, noteText, editButton);
            })
        } else { // else для того, чтобы завершение по клику не путало программу, если tick нет, то:
            noteText.classList.remove('d-none'); // возвращаем р
            noteInput.classList.add('d-none'); // убираем инпут
            editButton.innerHTML = '✏️'; // меняем кнопку на карандаш
        }
    }  
})

function checkNote(id) { // добавляем выполнение
    for (obj of noteArray) {
        if (obj.id === +id) {
            obj.isChecked = true;
            localStorage.setItem('notes', JSON.stringify(noteArray))
        }
    }
}
function uncheckNote(id) { // снимаем выполнение
    for (obj of noteArray) {
        if (obj.id === +id) {
            obj.isChecked = false;
            localStorage.setItem('notes', JSON.stringify(noteArray))
        }
    }
}
function deleteNote(id, localStorage) { // удаляем задание по крестику
    for (obj of noteArray) {
        if (obj.id === +id) {
            noteArray.splice(noteArray.indexOf(obj), 1)
            localStorage.setItem('notes', JSON.stringify(noteArray))
        }
    }
}
function isLast(localStorage) { // проверяем, не последний ли это элемент в списке и скрываем кнопки и поле с заданиями
    if (noteArray.length === 0) {
        shoppingListMain.classList.add('d-none');
        shoppingListFooter.classList.add('d-none');
        localStorage.clear();
        noteCounter = 0
    }
}
function deleteChecked(localStorage) { // фильтруем массив по признаку не "isChecked = true"
    noteArray = noteArray.filter(el => !el.isChecked)
    localStorage.setItem('notes', JSON.stringify(noteArray))
}
function deleteAll(notes) { // удаляем со страницы все записи
    notes.innerHTML = '';
    noteCounter = 0;
    localStorage.clear();
    noteArray = [];
    shoppingListMain.classList.add('d-none');
    shoppingListFooter.classList.add('d-none');
}
function editNote(id, noteInput, noteText, editButton) {
    editButton.classList.contains('tick') ? editButton.innerHTML = '✅' : editButton.innerHTML = '✏️'
    if(noteInput.value.trim() === '') {
        noteInput.value = noteText.innerHTML;
        editButton.classList.toggle('tick');
    } else {
        for (obj of noteArray) {
            if(obj.id === +id) {
                obj.text = firstLetter(noteInput.value.trim());
                localStorage.setItem('notes', JSON.stringify(noteArray))
            }
        }
        noteText.innerHTML = firstLetter(noteInput.value.trim());
        editButton.classList.toggle('tick');
    }
    editButton.classList.contains('tick') ? editButton.innerHTML = '✅' : editButton.innerHTML = '✏️'
}