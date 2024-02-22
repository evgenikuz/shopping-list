let form = document.querySelector('form');
let inputForm = document.querySelector('.input-form');
let shoppingList = document.querySelector('.shopping-list');
let shoppingListMain = document.querySelector('.shopping-list__main');
let shoppingListFooter = document.querySelector('.shopping-list__footer');
let noteCounter = 0;
let localStorage = window.localStorage;
let noteArray = [];

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let firstLetter = (str) => str.split('')[0].toUpperCase() + str.slice(1);
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
        <input class="note__input d-none" type="text" >
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

shoppingList.addEventListener('click', function(e) {
    if(e.target.classList.contains('note__checkbox' || 'note__custom-checkbox' || 'note__text')){
        toCheckId = e.target.closest('label').querySelector('.note__checkbox').getAttribute('id');
        e.target.closest('.note').querySelector('.note__text').classList.toggle('checked');
        e.target.closest('.note').querySelector('.note__checkbox').checked ? checkNote(toCheckId) : uncheckNote(toCheckId);
    } else if (e.target.classList.contains('note__delete-btn')){ // если нажали на крестик
        let id = e.target.closest('.note').querySelector('.note__checkbox').getAttribute('id');
        deleteTask(id, localStorage);
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