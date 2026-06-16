// =========================
// VARIABLES
// =========================

let notes =
JSON.parse(localStorage.getItem("notes")) || [];

let trash =
JSON.parse(localStorage.getItem("trash")) || [];

let currentNote = null;

// =========================
// ELEMENTOS
// =========================

const noteTitle =
document.getElementById("noteTitle");

const noteContent =
document.getElementById("noteContent");

const noteCategory =
document.getElementById("noteCategory");

const noteTags =
document.getElementById("noteTags");

const notesList =
document.getElementById("notesList");

const trashList =
document.getElementById("trashList");

const searchInput =
document.getElementById("searchInput");

const filterCategory =
document.getElementById("filterCategory");

// =========================
// NUEVA NOTA
// =========================

document
.getElementById("newNoteBtn")
.addEventListener("click", () => {

    currentNote = null;

    noteTitle.value = "";
    noteContent.value = "";
    noteTags.value = "";

    noteCategory.value = "Escolar";

    document.getElementById(
        "createdDate"
    ).textContent = "-";

    document.getElementById(
        "updatedDate"
    ).textContent = "-";

    updateCounters();
});

// =========================
// GUARDAR
// =========================

document
.getElementById("saveBtn")
.addEventListener("click", saveNote);

function saveNote(){

    if(
        noteTitle.value.trim() === "" &&
        noteContent.value.trim() === ""
    ){
        showToast(
            "Escribe algo antes de guardar"
        );
        return;
    }

    const now =
    new Date().toLocaleString();

    if(currentNote === null){

        const note = {

            id: Date.now(),

            title: noteTitle.value,

            content: noteContent.value,

            category: noteCategory.value,

            tags: noteTags.value,

            favorite:false,

            created: now,

            updated: now
        };

        notes.push(note);

    }else{

        currentNote.title =
        noteTitle.value;

        currentNote.content =
        noteContent.value;

        currentNote.category =
        noteCategory.value;

        currentNote.tags =
        noteTags.value;

        currentNote.updated =
        now;
    }

    saveStorage();

    renderNotes();

    updateDashboard();

    showToast(
        "Nota guardada correctamente"
    );
}

// =========================
// LOCAL STORAGE
// =========================

function saveStorage(){

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    localStorage.setItem(
        "trash",
        JSON.stringify(trash)
    );
}

// =========================
// MOSTRAR NOTAS
// =========================

function renderNotes(){

    notesList.innerHTML = "";

    const search =
    searchInput.value.toLowerCase();

    const category =
    filterCategory.value;

    const filtered =
    notes.filter(note => {

        const matchesText =

            note.title
            .toLowerCase()
            .includes(search)

            ||

            note.content
            .toLowerCase()
            .includes(search)

            ||

            note.tags
            .toLowerCase()
            .includes(search);

        const matchesCategory =

            category === ""

            ||

            note.category === category;

        return (
            matchesText &&
            matchesCategory
        );
    });

    filtered.forEach(note => {

        const div =
        document.createElement("div");

        div.className =
        "note-card";

        div.innerHTML = `
            <h4>
            ${note.favorite ? "⭐" : ""}
            ${note.title}
            </h4>

            <p>
            📁 ${note.category}
            </p>

            <p>
            🏷 ${note.tags}
            </p>
        `;

        div.onclick = () =>
        loadNote(note);

        notesList.appendChild(div);
    });
}

// =========================
// CARGAR NOTA
// =========================

function loadNote(note){

    currentNote = note;

    noteTitle.value =
    note.title;

    noteContent.value =
    note.content;

    noteCategory.value =
    note.category;

    noteTags.value =
    note.tags;

    document.getElementById(
        "createdDate"
    ).textContent =
    note.created;

    document.getElementById(
        "updatedDate"
    ).textContent =
    note.updated;

    updateCounters();
}

// =========================
// BUSQUEDA
// =========================

searchInput
.addEventListener(
"input",
renderNotes
);

filterCategory
.addEventListener(
"change",
renderNotes
);

// =========================
// CONTADORES
// =========================

noteContent
.addEventListener(
"input",
updateCounters
);

function updateCounters(){

    const text =
    noteContent.value.trim();

    const words =

    text === ""
    ? 0
    : text.split(/\s+/).length;

    const chars =
    text.length;

    const readingTime =
    Math.max(
        1,
        Math.ceil(words / 200)
    );

    document.getElementById(
        "wordCount"
    ).textContent = words;

    document.getElementById(
        "charCount"
    ).textContent = chars;

    document.getElementById(
        "readingTime"
    ).textContent =
    readingTime + " min";
}

// =========================
// DASHBOARD
// =========================

function updateDashboard(){

    document.getElementById(
        "totalNotes"
    ).textContent =
    notes.length;

    const favorites =

    notes.filter(
        n => n.favorite
    ).length;

    document.getElementById(
        "favoriteCount"
    ).textContent =
    favorites;

    const categories =

    new Set(
        notes.map(
            n => n.category
        )
    );

    document.getElementById(
        "categoryCount"
    ).textContent =
    categories.size;
}

// =========================
// FAVORITOS
// =========================

document
.getElementById(
"favoriteBtn"
)
.addEventListener(
"click",
() => {

    if(!currentNote){

        showToast(
            "Selecciona una nota"
        );

        return;
    }

    currentNote.favorite =
    !currentNote.favorite;

    saveStorage();

    renderNotes();

    updateDashboard();

    showToast(
        currentNote.favorite
        ?
        "Agregada a favoritos"
        :
        "Quitada de favoritos"
    );
});

// =========================
// MODO OSCURO
// =========================

const darkBtn =
document.getElementById(
"darkModeBtn"
);

if(
localStorage.getItem(
"darkMode"
) === "true"
){
    document.body
    .classList.add("dark");
}

darkBtn
.addEventListener(
"click",
() => {

    document.body
    .classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body
        .classList.contains(
            "dark"
        )
    );
});

// =========================
// ELIMINAR NOTA
// =========================

document
.getElementById("deleteBtn")
.addEventListener("click", deleteNote);

function deleteNote(){

    if(!currentNote){

        showToast(
            "Selecciona una nota"
        );

        return;
    }

    trash.push(currentNote);

    notes = notes.filter(
        n => n.id !== currentNote.id
    );

    currentNote = null;

    noteTitle.value = "";
    noteContent.value = "";
    noteTags.value = "";

    saveStorage();

    renderNotes();

    renderTrash();

    updateDashboard();

    updateCounters();

    showToast(
        "Nota enviada a la papelera"
    );
}

// =========================
// PAPELERA
// =========================

function renderTrash(){

    trashList.innerHTML = "";

    trash.forEach(note => {

        const div =
        document.createElement("div");

        div.className =
        "note-card";

        div.innerHTML = `
            <h4>${note.title}</h4>

            <p>📁 ${note.category}</p>

            <div style="
                display:flex;
                gap:10px;
                margin-top:10px;
            ">

                <button onclick="restoreNote(${note.id})">
                    ♻ Restaurar
                </button>

                <button onclick="deleteForever(${note.id})">
                    ❌ Eliminar
                </button>

            </div>
        `;

        trashList.appendChild(div);

    });
}

function restoreNote(id){

    const note =
    trash.find(
        n => n.id === id
    );

    if(!note) return;

    notes.push(note);

    trash = trash.filter(
        n => n.id !== id
    );

    saveStorage();

    renderNotes();

    renderTrash();

    updateDashboard();

    showToast(
        "Nota restaurada"
    );
}

function deleteForever(id){

    const confirmar =
    confirm(
        "¿Eliminar esta nota permanentemente?"
    );

    if(!confirmar) return;

    trash = trash.filter(
        note => note.id !== id
    );

    saveStorage();

    renderTrash();

    showToast(
        "Nota eliminada permanentemente"
    );
}

// =========================
// EXPORTAR PDF
// =========================

document
.getElementById("pdfBtn")
.addEventListener(
"click",
exportPDF
);

function exportPDF(){

    if(
        noteTitle.value === "" &&
        noteContent.value === ""
    ){
        showToast(
            "No hay contenido"
        );
        return;
    }

    const { jsPDF } =
    window.jspdf;

    const pdf =
    new jsPDF();

    pdf.setFontSize(20);

    pdf.text(
        noteTitle.value,
        10,
        20
    );

    pdf.setFontSize(12);

    pdf.text(
        "Categoría: " +
        noteCategory.value,
        10,
        35
    );

    pdf.text(
        "Etiquetas: " +
        noteTags.value,
        10,
        45
    );

    const lines =
    pdf.splitTextToSize(
        noteContent.value,
        180
    );

    pdf.text(
        lines,
        10,
        60
    );

    pdf.save(
        "nota.pdf"
    );

    showToast(
        "PDF exportado"
    );
}

// =========================
// EXPORTAR JSON
// =========================

document
.getElementById(
"exportJsonBtn"
)
.addEventListener(
"click",
exportJSON
);

function exportJSON(){

    const data =
    JSON.stringify(
        notes,
        null,
        2
    );

    const blob =
    new Blob(
        [data],
        {
            type:
            "application/json"
        }
    );

    const url =
    URL.createObjectURL(
        blob
    );

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    "notas.json";

    a.click();

    showToast(
        "Respaldo creado"
    );
}

// =========================
// IMPORTAR JSON
// =========================

document
.getElementById(
"importJson"
)
.addEventListener(
"change",
importJSON
);

function importJSON(event){

    const file =
    event.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload =
    function(e){

        try{

            const imported =
            JSON.parse(
                e.target.result
            );

            notes =
            imported;

            saveStorage();

            renderNotes();

            updateDashboard();

            showToast(
                "Notas importadas"
            );

        }catch{

            showToast(
                "Archivo inválido"
            );
        }
    };

    reader.readAsText(
        file
    );
}

// =========================
// TOAST
// =========================

function showToast(message){

    const toast =
    document.getElementById(
        "toast"
    );

    toast.textContent =
    message;

    toast.classList.add(
        "show"
    );

    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2500);
}

// =========================
// GUARDADO AUTOMÁTICO
// =========================

setInterval(() => {

    if(currentNote){

        currentNote.title =
        noteTitle.value;

        currentNote.content =
        noteContent.value;

        currentNote.tags =
        noteTags.value;

        currentNote.category =
        noteCategory.value;

        currentNote.updated =
        new Date()
        .toLocaleString();

        saveStorage();
    }

}, 5000);

// =========================
// INICIALIZAR
// =========================

renderNotes();

renderTrash();

updateDashboard();

updateCounters();

// =========================
// CANVAS PROFESIONAL
// =========================

const canvas =
document.getElementById(
    "drawingCanvas"
);

const ctx =
canvas.getContext("2d");

let drawing = false;

let eraserMode = false;

const brushColor =
document.getElementById(
    "brushColor"
);

const brushSize =
document.getElementById(
    "brushSize"
);

// =========================
// CONFIGURACIÓN
// =========================

ctx.lineCap = "round";
ctx.lineJoin = "round";

// =========================
// POSICIÓN DEL MOUSE
// =========================

function getMousePos(event){

    const rect =
    canvas.getBoundingClientRect();

    return {

        x:
        event.clientX -
        rect.left,

        y:
        event.clientY -
        rect.top
    };
}

// =========================
// INICIAR DIBUJO
// =========================

function startDrawing(event){

    drawing = true;

    const pos =
    getMousePos(event);

    ctx.beginPath();

    ctx.moveTo(
        pos.x,
        pos.y
    );
}

// =========================
// DIBUJAR
// =========================

function draw(event){

    if(!drawing) return;

    const pos =
    getMousePos(event);

    ctx.lineWidth =
    brushSize.value;

    ctx.strokeStyle =
    eraserMode
    ?
    "#FFFFFF"
    :
    brushColor.value;

    ctx.lineTo(
        pos.x,
        pos.y
    );

    ctx.stroke();
}

// =========================
// DETENER
// =========================

function stopDrawing(){

    drawing = false;

    ctx.beginPath();
}

// =========================
// EVENTOS MOUSE
// =========================

canvas.addEventListener(
    "mousedown",
    startDrawing
);

canvas.addEventListener(
    "mousemove",
    draw
);

canvas.addEventListener(
    "mouseup",
    stopDrawing
);

canvas.addEventListener(
    "mouseleave",
    stopDrawing
);

// =========================
// SOPORTE TÁCTIL
// =========================

canvas.addEventListener(
"touchstart",
(event)=>{

    event.preventDefault();

    const touch =
    event.touches[0];

    startDrawing({

        clientX:
        touch.clientX,

        clientY:
        touch.clientY
    });

});

canvas.addEventListener(
"touchmove",
(event)=>{

    event.preventDefault();

    const touch =
    event.touches[0];

    draw({

        clientX:
        touch.clientX,

        clientY:
        touch.clientY
    });

});

canvas.addEventListener(
"touchend",
stopDrawing
);

// =========================
// BORRADOR
// =========================

document
.getElementById(
"eraserBtn"
)
.addEventListener(
"click",
()=>{

    eraserMode =
    !eraserMode;

    showToast(

        eraserMode
        ?
        "Borrador activado"
        :
        "Lápiz activado"

    );
});

// =========================
// LIMPIAR LIENZO
// =========================

document
.getElementById(
"clearCanvasBtn"
)
.addEventListener(
"click",
()=>{

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    showToast(
        "Lienzo limpiado"
    );
});

// =========================
// EXPORTAR PNG
// =========================

document
.getElementById(
"saveImageBtn"
)
.addEventListener(
"click",
()=>{

    const link =
    document.createElement(
        "a"
    );

    link.download =
    "dibujo.png";

    link.href =
    canvas.toDataURL(
        "image/png"
    );

    link.click();

    showToast(
        "Imagen exportada"
    );
});

// =========================
// REDIMENSIONAR
// =========================

window.addEventListener(
"resize",
()=>{

    ctx.lineCap =
    "round";

    ctx.lineJoin =
    "round";

});

// =========================
// MENSAJE INICIAL
// =========================

showToast(
"Bienvenido a Notas Carolina Pro 🚀"
);

document
.getElementById(
"emptyTrashBtn"
)
.addEventListener(
"click",
()=>{

    if(trash.length === 0){

        showToast(
            "La papelera está vacía"
        );

        return;
    }

    const confirmar =
    confirm(
        "¿Vaciar toda la papelera?"
    );

    if(!confirmar) return;

    trash = [];

    saveStorage();

    renderTrash();

    showToast(
        "Papelera vaciada"
    );

});
