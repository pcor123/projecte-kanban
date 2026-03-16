// script.js - Implementació del Issue 2: Model de dades i persistència

// Variables globals
let tasques = [];
let editantTascaId = null;
let filtres = {
    estat: 'totes',      // 'todo' | 'in-progress' | 'done' | 'totes'
    prioritat: 'totes',  // 'baixa' | 'mitjana' | 'alta' | 'totes'
    text: ''             // text de cerca
};

// Elements del DOM
const formulariTasca = document.getElementById('task-form');
const titolTasca = document.getElementById('task-title');
const descripcioTasca = document.getElementById('task-description');
const prioritatTasca = document.getElementById('task-priority');
const dataVencimentTasca = document.getElementById('task-due-date');
const estatTasca = document.getElementById('task-status');
const cancelEditBtn = document.getElementById('cancel-edit');
const searchInput = document.getElementById('search-tasks');

// Clau per al localStorage
const CLAU_TASQUES = 'tasquesKanban';

// MODEL DE DADES
// ===============

/**
 * Funció per generar un ID únic per a cada tasca
 */
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Estructura d'una tasca (objecte)
 * @param {string} titol - Títol de la tasca
 * @param {string} descripcio - Descripció de la tasca
 * @param {string} prioritat - 'baixa', 'mitjana' o 'alta'
 * @param {string} dataVenciment - Data límit en format YYYY-MM-DD
 * @param {string} estat - 'todo', 'in-progress' o 'done'
 * @returns {Object} Objecte tasca
 */
function crearTasca(titol, descripcio, prioritat, dataVenciment, estat) {
    return {
        id: generarId(),
        titol: titol,
        descripcio: descripcio,
        prioritat: prioritat,
        dataVenciment: dataVenciment,
        estat: estat,
        creatEl: new Date().toISOString()
    };
}

// PERSISTÈNCIA AMB localStorage
// ==============================

/**
 * Carrega les tasques des del localStorage
 * @returns {Array} Array de tasques
 */
function carregarTasques() {
    try {
        const tasquesGuardades = localStorage.getItem(CLAU_TASQUES);
        if (tasquesGuardades) {
            return JSON.parse(tasquesGuardades);
        }
    } catch (error) {
        console.error('Error al carregar les tasques:', error);
    }
    return [];
}

/**
 * Guarda les tasques al localStorage
 * @param {Array} tasquesArray - Array de tasques a guardar
 */
function guardarTasques(tasquesArray) {
    try {
        localStorage.setItem(CLAU_TASQUES, JSON.stringify(tasquesArray));
        console.log('Tasques guardades correctament al localStorage');
    } catch (error) {
        console.error('Error al guardar les tasques:', error);
    }
}

/**
 * Afegeix dades de prova si no hi ha tasques guardades
 */
// Modifica inicialitzarDadesDeProva() perquè retorni les tasques
function inicialitzarDadesDeProva() {
    const dadesProva = [
        crearTasca('Revisar documentació', 'Revisar la documentació del projecte', 'mitjana', '', 'todo'),
        crearTasca('Crear estructura HTML', 'Implementar l\'estructura bàsica del HTML', 'alta', '2024-12-15', 'in-progress'),
        crearTasca('Dissenyar CSS', 'Crear els estils bàsics de l\'aplicació', 'alta', '2024-12-10', 'done'),
        crearTasca('Implementar funcionalitats JS', 'Afegir les funcions bàsiques de JavaScript', 'mitjana', '2024-12-20', 'todo'),
        crearTasca('Provar l\'aplicació', 'Fer proves de totes les funcionalitats', 'baixa', '2024-12-25', 'todo'),
        crearTasca('Documentar el codi', 'Afegir comentaris al codi font', 'mitjana', '2024-12-18', 'todo')
    ];

    guardarTasques(dadesProva);
    console.log('Dades de prova inicialitzades');
    return dadesProva;
}

// FUNCIONS DE GESTIÓ DE TASQUES
// ==============================

/**
 * Afegeix una nova tasca
 * @param {Object} tasca - Objecte tasca
 */
function afegirTasca(tasca) {
    tasques.push(tasca);
    guardarTasques(tasques);
    renderTauler(); // <-- afegim aquí
}

/**
 * Actualitza una tasca existent
 * @param {string} id - ID de la tasca a actualitzar
 * @param {Object} dadesActualitzades - Noves dades de la tasca
 */
function actualitzarTasca(id, dadesActualitzades) {
    const index = tasques.findIndex(t => t.id === id);
    if (index !== -1) {
        tasques[index] = { ...tasques[index], ...dadesActualitzades };
        guardarTasques(tasques);
        renderTauler(); // <-- afegim aquí
    }
}


/**
 * Elimina una tasca
 * @param {string} id - ID de la tasca a eliminar
 */
function eliminarTasca(id) {
    tasques = tasques.filter(t => t.id !== id);
    guardarTasques(tasques);
    renderTauler(); // ← Refresca columnes i estadístiques
    console.log('Tasca eliminada, ID:', id);
}

/**
 * Canvia l'estat d'una tasca
 * @param {string} id - ID de la tasca
 * @param {string} nouEstat - Nou estat ('todo', 'in-progress', 'done')
 */
function canviarEstatTasca(id, nouEstat) {
    const tasca = tasques.find(t => t.id === id);
    if (tasca) {
        tasca.estat = nouEstat;
        guardarTasques(tasques);
        renderTauler(); // ← Mostra l’estat actualitzat al tauler
        console.log(`Tasca ${id} moguda a estat: ${nouEstat}`);
    }
}

/**
 * Obté una tasca pel seu ID
 * @param {string} id - ID de la tasca
 * @returns {Object|null} Tasca trobada o null
 */
function obtenirTascaPerId(id) {
    return tasques.find(t => t.id === id) || null;
}

// FUNCIONS DE LA INTERFÍCIE (bàsiques per ara)
// ============================================

/**
 * Actualitza les estadístiques a la interfície
 */
function actualitzarEstadistiques() {
    const total = tasques.length;
    const fets = tasques.filter(t => t.estat === 'done').length;
    const percentatgeFets = total > 0 ? Math.round((fets / total) * 100) : 0;

    // Actualitzem els comptadors
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = `${percentatgeFets}%`;

    // Actualitzem els comptadors de cada columna
    document.getElementById('todo-count').textContent = tasques.filter(t => t.estat === 'todo').length;
    document.getElementById('in-progress-count').textContent = tasques.filter(t => t.estat === 'in-progress').length;
    document.getElementById('done-count').textContent = fets;

    console.log(`Estadístiques actualitzades: ${total} tasques, ${percentatgeFets}% completades`);
}

/**
 * Reseteja el formulari a l'estat inicial
 */
function resetFormulari() {
    formulariTasca.reset();
    estatTasca.value = 'todo'; // Valor per defecte
    cancelEditBtn.style.display = 'none';
    editantTascaId = null;

    // Canviar el text del botó de guardar
    const botoGuardar = formulariTasca.querySelector('button[type="submit"]');
    botoGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Tasca';
}

// GESTIÓ DEL FORMULARI
// =====================

/**
 * Gestiona l'enviament del formulari
 * @param {Event} event - Event d'enviament del formulari
 */
function manejarEnviamentFormulari(event) {
    event.preventDefault();

    // Validació bàsica: el títol és obligatori
    if (!titolTasca.value.trim()) {
        alert('El títol és obligatori');
        titolTasca.focus();
        return;
    }

    // Crear objecte amb les dades de la tasca
    const dadesTasca = {
        titol: titolTasca.value.trim(),
        descripcio: descripcioTasca.value.trim(),
        prioritat: prioritatTasca.value,
        dataVenciment: dataVencimentTasca.value,
        estat: estatTasca.value
    };

    if (editantTascaId) {
        // Mode edició - actualitzar tasca existent
        actualitzarTasca(editantTascaId, dadesTasca);
        renderTauler();              // ← Actualitza el tauler immediatament
        alert('Tasca actualitzada correctament!');
    } else {
        // Mode nou - afegir nova tasca
        const novaTasca = crearTasca(
            dadesTasca.titol,
            dadesTasca.descripcio,
            dadesTasca.prioritat,
            dadesTasca.dataVenciment,
            dadesTasca.estat
        );
        afegirTasca(novaTasca);
        renderTauler();              // ← Mostra la nova tasca al tauler
        alert('Tasca afegida correctament!');
    }

    // Actualitzar estadístiques i resetar formulari
    actualitzarEstadistiques();
    resetFormulari();
}
/**
 * Prepara el formulari per editar una tasca
 * @param {string} id - ID de la tasca a editar
 */
function prepararEdicioTasca(id) {
    const tasca = obtenirTascaPerId(id);
    if (!tasca) return;

    // Omplir el formulari amb les dades de la tasca
    titolTasca.value = tasca.titol;
    descripcioTasca.value = tasca.descripcio;
    prioritatTasca.value = tasca.prioritat;
    dataVencimentTasca.value = tasca.dataVenciment;
    estatTasca.value = tasca.estat;

    // Actualitzar mode edició
    editantTascaId = id;
    cancelEditBtn.style.display = 'inline-flex';

    // Canviar el text del botó de guardar
    const botoGuardar = formulariTasca.querySelector('button[type="submit"]');
    botoGuardar.innerHTML = '<i class="fas fa-edit"></i> Actualitzar Tasca';

    console.log('Preparat per editar tasca:', tasca);
}

// RENDERITZACIÓ DEL TAULER
// =========================

// Variables para las columnas
const columnaPerFer = document.getElementById('per-fer-tasks');
const columnaEnCurs = document.getElementById('en-curs-tasks');
const columnaFet = document.getElementById('fet-tasks');

function netejarColumnes() {
    columnaPerFer.innerHTML = '';
    columnaEnCurs.innerHTML = '';
    columnaFet.innerHTML = '';
}

function renderTauler() {
    // Netejar totes les columnes
    netejarColumnes();

    // tasques filtrades
    const tasquesFiltrades = getTasquesFiltrades(tasques, filtres);

    // Filtrar tasques per estat
    const tasquesTodo = tasquesFiltrades.filter(t => t.estat === 'todo');
    const tasquesInProgress = tasquesFiltrades.filter(t => t.estat === 'in-progress');
    const tasquesDone = tasquesFiltrades.filter(t => t.estat === 'done');

    // Afegir tasques a les columnes corresponents
    if (tasquesTodo.length > 0) {
        tasquesTodo.forEach(tasca => {
            columnaPerFer.appendChild(crearElementTasca(tasca));
        });
    } else {
        columnaPerFer.innerHTML = '<div class="empty-state"><i class="fas fa-clipboard-list"></i><p>No hi ha tasques pendents</p></div>';
    }

    if (tasquesInProgress.length > 0) {
        tasquesInProgress.forEach(tasca => {
            columnaEnCurs.appendChild(crearElementTasca(tasca));
        });
    } else {
        columnaEnCurs.innerHTML = '<div class="empty-state"><i class="fas fa-cogs"></i><p>Cap tasca en progrés</p></div>';
    }

    if (tasquesDone.length > 0) {
        tasquesDone.forEach(tasca => {
            columnaFet.appendChild(crearElementTasca(tasca));
        });
    } else {
        columnaFet.innerHTML = '<div class="empty-state"><i class="fas fa-check"></i><p>Cap tasca completada</p></div>';
    }

    // Actualitzar estadístiques
    actualitzarEstadistiques();
}

function crearElementTasca(tasca) {
    const div = document.createElement('div');
    div.className = 'tasca-card';

    // Afegim classe segons la prioritat
    div.classList.add(`priority-${tasca.prioritat}`);

    // Títol i badge de prioritat
    const titolDiv = document.createElement('div');
    titolDiv.className = 'tasca-header';
    titolDiv.innerHTML = `
        <strong>${tasca.titol}</strong>
        <span class="badge-prioritat">${tasca.prioritat}</span>
    `;
    div.appendChild(titolDiv);

    // Descripció
    if (tasca.descripcio) {
        const desc = document.createElement('p');
        desc.className = 'tasca-descripcio';
        desc.textContent = tasca.descripcio;
        div.appendChild(desc);
    }

    // Controls: selector d'estat
    const estatSelect = document.createElement('select');
    estatSelect.className = 'tasca-estat';
    ['todo', 'in-progress', 'done'].forEach(estat => {
        const opcio = document.createElement('option');
        opcio.value = estat;
        opcio.textContent = estat === 'todo' ? 'Per fer' : estat === 'in-progress' ? 'En curs' : 'Fet';
        if (tasca.estat === estat) opcio.selected = true;
        estatSelect.appendChild(opcio);
    });
    estatSelect.addEventListener('change', () => {
        canviarEstatTasca(tasca.id, estatSelect.value);
    });
    div.appendChild(estatSelect);

    // Botons d'acció
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'tasca-controls';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'btn btn-secondary btn-sm';
    editBtn.addEventListener('click', () => prepararEdicioTasca(tasca.id));
    controlsDiv.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Eliminar';
    delBtn.className = 'btn btn-danger btn-sm';
    delBtn.addEventListener('click', () => {
        if (confirm('Segur que vols eliminar aquesta tasca?')) {
            eliminarTasca(tasca.id);
        }
    });
    controlsDiv.appendChild(delBtn);

    div.appendChild(controlsDiv);

    return div;
}

// INICIALITZACIÓ DE L'APLICACIÓ
// ==============================

/**
 * Inicialitza l'aplicació quan el DOM està carregat
 */
function inicialitzarApp() {
    console.log('Inicialitzant aplicació Kanban...');

    const avui = new Date().toISOString().split('T')[0];
    dataVencimentTasca.min = avui;

    // Carregar tasques
    tasques = carregarTasques();

    // Si no hi ha tasques carregades, assignar les de prova
    if (!tasques || tasques.length === 0) {
        tasques = inicialitzarDadesDeProva();
    }

    // Renderitzar el tauler
    renderTauler();

    // Configurar event listeners
    formulariTasca.addEventListener('submit', manejarEnviamentFormulari);
    cancelEditBtn.addEventListener('click', resetFormulari);

    console.log('Aplicació inicialitzada correctament');
}


// Filtres issue: Filtres, cerca i estadístiques
// ==============================
function getTasquesFiltrades(tasquesArray, filtres) {
    return tasquesArray.filter(tasca => {

        // FILTRE PER ESTAT
        if (filtres.estat !== 'totes' && tasca.estat !== filtres.estat) {
            return false;
        }

        // FILTRE PER PRIORITAT
        if (filtres.prioritat !== 'totes' && tasca.prioritat !== filtres.prioritat) {
            return false;
        }

        // CERCA DE TEXT
        if (filtres.text) {
            const text = filtres.text.toLowerCase();

            const titol = tasca.titol.toLowerCase();
            const desc = tasca.descripcio.toLowerCase();

            if (!titol.includes(text) && !desc.includes(text)) {
                return false;
            }
        }

        return true;
    });
}


searchInput.addEventListener('input', () => {
    filtres.text = searchInput.value;
    renderTauler();
});

// Iniciar l'aplicació quan el DOM estigui carregat
document.addEventListener('DOMContentLoaded', inicialitzarApp);