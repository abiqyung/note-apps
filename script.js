const currentDateTimeDiv = document.getElementById('currentDateTime');

function updateDateTime() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const timeString = `${hours}:${minutes}`;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);

    currentDateTimeDiv.innerHTML = `
        <p>${timeString}
        &nbsp;
        ${dateString}
        </p>
    `;
}

updateDateTime();
setInterval(updateDateTime, 1000);



function addNote() {
    const noteText = document.getElementById('noteText').value;
    const urgency = document.getElementById('urgencySelect').value;
    const dueDate = document.getElementById('dueDate').value;

    if (noteText.trim() === '') {
        alert('Please enter a note');
        return;
    }

    if (dueDate === '') {
        alert('Please select a due date');
        return;
    }

    const notesContainer = document.getElementById('notesContainer');
    const noteElement = document.createElement('div');
    noteElement.className = `note ${urgency}`;

    const currentDate = new Date();
    const dateString = currentDate.toLocaleString();

    noteElement.innerHTML = `
        <input type="checkbox" class="done-checkbox" onclick="toggleDone(this)">
        <div class="note-content-main">
            <div class="note-content">   
                <p class="note-text">${noteText}</p>
                <div class="note-details">
                    <p class="due-date">Due by: ${dueDate}</p>
                    <p class="caution" style="display: none;"> Past due date!</p>
                </div>
                <div class="note-buttons-container">
                    <p class="date">Created on: ${dateString}</p>
                    <div class="note-buttons">
                        <button class="edit-button" onclick="editNote(this)">Edit</button>
                        <button class="delete-button" onclick="deleteNote(this)">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    notesContainer.insertBefore(noteElement, notesContainer.querySelector('h2').nextSibling);
    document.getElementById('noteText').value = '';
    document.getElementById('dueDate').value = '';

    checkDueDates();
}

function editNote(button) {
    const noteElement = button.parentElement.parentElement.parentElement;
    const noteTextElement = noteElement.querySelector('.note-text');
    const newText = prompt('Edit your note:', noteTextElement.textContent);
    if (newText !== null && newText.trim() !== '') {
        noteTextElement.textContent = newText;
    }
    checkDueDates();
}

function deleteNote(button) {
    const noteElement = button.closest('.note');
    if (noteElement) {
        noteElement.remove();
    }
}


function toggleDone(checkbox) {
    const noteElement = checkbox.closest('.note');
    if (!noteElement) return; 

    if (checkbox.checked) {
        noteElement.classList.add('done');
        const doneNotesContainer = document.getElementById('doneNotesContainer');
        doneNotesContainer.appendChild(noteElement);
    } else {
        noteElement.classList.remove('done');
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.appendChild(noteElement);
    }
    checkDueDates();
}


function checkDueDates() {
    const notes = document.querySelectorAll('.note');
    const currentDate = new Date();
    notes.forEach(note => {
        const dueDateElement = note.querySelector('.due-date');
        const cautionElement = note.querySelector('.caution');
        const dueDate = new Date(dueDateElement.textContent.replace('Due by: ', ''));
        if (currentDate > dueDate) {
            cautionElement.style.display = 'block';
        } else {
            cautionElement.style.display = 'none';
        }
    });
}

setInterval(checkDueDates, 60000); // check every minute
