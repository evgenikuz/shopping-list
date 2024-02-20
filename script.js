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
        addNote(firstLetter(inputForm.value.trim()), false);
        inputForm.value = '';
    }
})

function addNote(noteText,isChecked) {
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
        console.log(toCheckId)
    }
})
