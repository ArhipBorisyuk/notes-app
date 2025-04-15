const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const notesList = document.getElementById('notes-list');

// Загружаем заметки при запуске
document.addEventListener('DOMContentLoaded', loadNotes);

// Добавление новой заметки
noteForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = noteInput.value.trim();
    if (text !== '') {
        addNote(text);
        saveNote(text);
        noteInput.value = '';
    }
});

// Создание заметки в DOM
function addNote(text) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.innerHTML = `
    <p>${text}</p>
    <button class="delete-btn" title="Удалить">&times;</button>
  `;

    // Кнопка удаления
    note.querySelector('.delete-btn').addEventListener('click', () => {
        note.remove();
        deleteNote(text);
    });

    notesList.prepend(note); // сверху новые
}

// Сохраняем в localStorage
function saveNote(text) {
    const notes = getNotes();
    notes.push(text);
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Удаление из localStorage
function deleteNote(text) {
    let notes = getNotes();
    notes = notes.filter(n => n !== text);
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Получаем заметки
function getNotes() {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

// Загрузка заметок
function loadNotes() {
    const notes = getNotes();
    notes.forEach(note => addNote(note));
}

document.getElementById('load-sample').addEventListener('click', () => {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // показать индикатор

    fetch('notes.json')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки шаблонов');
            return response.json();
        })
        .then(data => {
            data.forEach(note => {
                addNote(note);
                saveNote(note);
            });
        })
        .catch(err => {
            alert('Не удалось загрузить заметки: ' + err.message);
        })
        .finally(() => {
            loader.style.display = 'none'; // скрыть индикатор
        });
});
