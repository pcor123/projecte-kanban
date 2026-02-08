// script.js - Implementació del Issue 2: Model de dades i persistència

// Variables globals
let tasques = [];
let editantTascaId = null;

// Elements del DOM
const formulariTasca = document.getElementById('task-form');
const titolTasca = document.getElementById('task-title');
const descripcioTasca = document.getElementById('task-description');
const prioritatTasca = document.getElementById('task-priority');
const dataVencimentTasca = document.getElementById('task-due-date');
const estatTasca = document.getElementById('task-status');
const cancelEditBtn = document.getElementById('cancel-edit');

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
function inicialitzarDadesDeProva() {
    if (tasques.length === 0) {
        const dadesProva = [
            crearTasca('Revisar documentació', 'Revisar la documentació del projecte', 'mitjana', '', 'todo'),
            crearTasca('Crear estructura HTML', 'Implementar l\'estructura bàsica del HTML', 'alta', '2024-12-15', 'in-progress'),
            crearTasca('Dissenyar CSS', 'Crear els estils bàsics de l\'aplicació', 'alta', '2024-12-10', 'done'),
            crearTasca('Implementar funcionalitats JS', 'Afegir les funcions bàsiques de JavaScript', 'mitjana', '2024-12-20', 'todo'),
            crearTasca('Provar l\'aplicació', 'Fer proves de totes les funcionalitats', 'baixa', '2024-12-25', 'todo'),
            crearTasca('Documentar el codi', 'Afegir comentaris al codi font', 'mitjana', '2024-12-18', 'todo')
        ];
        
        tasques = dadesProva;
        guardarTasques(tasques);
        console.log('Dades de prova inicialitzades');
    }
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
    console.log('Tasca afegida:', tasca);
}

/**
 * Actualitza una tasca existent
 * @param {string} id - ID de la tasca a actualitzar
 * @param {Object} dadesActualitzades - Noves dades de la tasca
 */
function actualitzarTasca(id, dadesActualitzades) {
    const index = tasques.findIndex(t => t.id === id);
    if (index !== -1) {
        // Mantenim l'ID i la data de creació originals
        tasques[index] = {
            ...tasques[index],
            ...dadesActualitzades
        };
        guardarTasques(tasques);
        console.log('Tasca actualitzada:', tasques[index]);
    }
}

/**
 * Elimina una tasca
 * @param {string} id - ID de la tasca a eliminar
 */
function eliminarTasca(id) {
    tasques = tasques.filter(t => t.id !== id);
    guardarTasques(tasques);
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
    
    // Validació bàsica
    if (!titolTasca.value.trim()) {
        alert('El títol és obligatori');
        titolTasca.focus();
        return;
    }
    
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
        alert('Tasca afegida correctament!');
    }
    
    // Actualitzar estadístiques i resetar formulari
    actualitzarEstadistiques();
    resetFormulari();
    
    // A l'Issue 3 actualitzarem també la visualització de les tasques
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

// INICIALITZACIÓ DE L'APLICACIÓ
// ==============================

/**
 * Inicialitza l'aplicació quan el DOM està carregat
 */
function inicialitzarApp() {
    console.log('Inicialitzant aplicació Kanban...');
    
    // Configurar la data mínima al dia d'avui
    const avui = new Date().toISOString().split('T')[0];
    dataVencimentTasca.min = avui;
    
    // Carregar tasques del localStorage
    tasques = carregarTasques();
    console.log(`Tasques carregades: ${tasques.length}`);
    
    // Inicialitzar dades de prova si no n'hi ha
    inicialitzarDadesDeProva();
    
    // Actualitzar estadístiques
    actualitzarEstadistiques();
    
    // Configurar event listeners
    formulariTasca.addEventListener('submit', manejarEnviamentFormulari);
    cancelEditBtn.addEventListener('click', resetFormulari);
    
    // Afegir funcions globals per a debugging (es poden eliminar en producció)
    window.debug = {
        tasques: () => tasques,
        localStorage: () => JSON.parse(localStorage.getItem(CLAU_TASQUES) || '[]'),
        esborrarTotes: () => {
            localStorage.removeItem(CLAU_TASQUES);
            tasques = [];
            actualitzarEstadistiques();
            console.log('Totes les tasques eliminades');
        }
    };
    
    console.log('Aplicació inicialitzada correctament');
}

// Iniciar l'aplicació quan el DOM estigui carregat
document.addEventListener('DOMContentLoaded', inicialitzarApp);