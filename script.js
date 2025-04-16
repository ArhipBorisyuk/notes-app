const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const notesList = document.getElementById('notes-list');
const loader = document.getElementById('loader');

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

    const shortText = text.length > 72 ? text.slice(0, 72) + '...' : text;
    let isExpanded = false;

    note.innerHTML = `
        <p class="note-text">${shortText}</p>
        <button class="delete-btn">&times;</button>
    `;

    const textElem = note.querySelector('.note-text');
    textElem.style.cursor = 'pointer';
    textElem.addEventListener('click', () => {
        isExpanded = !isExpanded;
        textElem.textContent = isExpanded ? text : shortText;
    });

    note.querySelector('.delete-btn').addEventListener('click', () => {
        note.remove();
        deleteNote(text);
    });

    notesList.prepend(note);
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

// Экспорт заметок
document.getElementById('export-notes').addEventListener('click', () => {
    loader.style.display = 'block';
    setTimeout(() => {
        const notes = getNotes();
        const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'notes.json';
        link.click();
        loader.style.display = 'none';
    }, 1000);
});

// Импорт заметок из файла
document.getElementById('import-notes').addEventListener('click', () => {
    document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    loader.style.display = 'block';

    reader.onload = function (e) {
        setTimeout(() => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    data.forEach(note => {
                        addNote(note);
                        saveNote(note);
                    });
                } else {
                    alert('Файл должен содержать массив заметок!');
                }
            } catch (err) {
                alert('Ошибка при импорте файла: ' + err.message);
            }
            loader.style.display = 'none';
            event.target.value = '';
        }, 1000);
    };

    reader.readAsText(file);
});
