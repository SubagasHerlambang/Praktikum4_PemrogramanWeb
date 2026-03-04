// ===========================
// API Configuration
// ===========================
const API_BASE = 'http://localhost/Pemesanan_Tiket/api';

// ===========================
// DOM Elements
// ===========================
const formModal = document.getElementById('formModal');
const deleteModal = document.getElementById('deleteModal');
const ticketForm = document.getElementById('ticketForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const toast = document.getElementById('toast');

const openFormButtons = document.querySelectorAll('#openFormBtn, #openFormBtn2');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

const ticketsContainer = document.getElementById('ticketsContainer');
const recentTicketsContainer = document.getElementById('recentTicketsContainer');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const navLinks = document.querySelectorAll('.nav-link');

// Form inputs
const ticketIdInput = document.getElementById('ticketId');
const kodeTiketInput = document.getElementById('kodeTiket');
const namaPenumpangInput = document.getElementById('namaPenumpang');
const ruteInput = document.getElementById('rute');
const tanggalBerangkatInput = document.getElementById('tanggalBerangkat');
const kursiInput = document.getElementById('kursi');
const hargaInput = document.getElementById('harga');
const statusInput = document.getElementById('status');
const formTitle = document.getElementById('formTitle');
const submitBtnText = document.getElementById('submitBtnText');

// Stats
const totalTicketsEl = document.getElementById('totalTickets');
const availableTicketsEl = document.getElementById('availableTickets');
const bookedTicketsEl = document.getElementById('bookedTickets');
const totalRevenueEl = document.getElementById('totalRevenue');

// ===========================
// Global Variables
// ===========================
let allTickets = [];
let currentFilter = 'semua';
let currentSearchTerm = '';
let editingTicketId = null;
let deletingTicketId = null;

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadTickets();
});

function initEventListeners() {
    // Form modal
    openFormButtons.forEach(btn => {
        btn.addEventListener('click', openForm);
    });

    closeFormBtn.addEventListener('click', closeForm);
    cancelFormBtn.addEventListener('click', closeForm);
    
    // Form submission
    ticketForm.addEventListener('submit', handleFormSubmit);

    // Delete modal
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', confirmDelete);

    // Search and filter
    searchInput.addEventListener('input', handleSearch);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
        });
    });

    // Close modal when clicking outside
    formModal.addEventListener('click', (e) => {
        if (e.target === formModal) closeForm();
    });

    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// ===========================
// API Functions
// ===========================
async function loadTickets() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/read.php`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Check if response is an array or has a message property
        if (Array.isArray(data)) {
            allTickets = data;
        } else if (data.message) {
            allTickets = [];
        } else {
            allTickets = [];
        }

        renderTickets();
        updateStats();
        showLoading(false);
    } catch (error) {
        console.error('Error loading tickets:', error);
        showToast('Error memuat data tiket', 'error');
        showLoading(false);
        renderTickets();
    }
}

async function saveTicket(ticketData) {
    try {
        let endpoint = `${API_BASE}/create.php`;
        let method = 'POST';

        if (editingTicketId) {
            endpoint = `${API_BASE}/update.php`;
            method = 'PUT';
            ticketData.id = editingTicketId;
        }

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        const message = editingTicketId ? 'Tiket berhasil diperbarui!' : 'Tiket berhasil disimpan!';
        showToast(message, 'success');
        
        closeForm();
        resetForm();
        loadTickets();
    } catch (error) {
        console.error('Error saving ticket:', error);
        showToast('Error menyimpan tiket', 'error');
    }
}

async function deleteTicket(id) {
    try {
        const response = await fetch(`${API_BASE}/delete.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        showToast('Tiket berhasil dihapus!', 'success');
        closeDeleteModal();
        loadTickets();
    } catch (error) {
        console.error('Error deleting ticket:', error);
        showToast('Error menghapus tiket', 'error');
    }
}

// ===========================
// Form Functions
// ===========================
function openForm() {
    resetForm();
    editingTicketId = null;
    formTitle.textContent = 'Tambah Tiket Baru';
    submitBtnText.textContent = 'Simpan';
    formModal.classList.add('active');
}

function closeForm() {
    formModal.classList.remove('active');
    resetForm();
    editingTicketId = null;
}

function resetForm() {
    ticketForm.reset();
    ticketIdInput.value = '';
}

function openEditForm(ticketId) {
    const ticket = allTickets.find(t => t.id == ticketId);
    if (!ticket) return;

    editingTicketId = ticketId;
    formTitle.textContent = 'Edit Tiket';
    submitBtnText.textContent = 'Perbarui';

    kodeTiketInput.value = ticket.kode_tiket;
    namaPenumpangInput.value = ticket.nama_penumpang;
    ruteInput.value = ticket.rute;
    tanggalBerangkatInput.value = ticket.tanggal_berangkat;
    kursiInput.value = ticket.kursi;
    hargaInput.value = ticket.harga;
    statusInput.value = ticket.status;
    ticketIdInput.value = ticketId;

    formModal.classList.add('active');
}

function handleFormSubmit(e) {
    e.preventDefault();

    const ticketData = {
        kode_tiket: kodeTiketInput.value,
        nama_penumpang: namaPenumpangInput.value,
        rute: ruteInput.value,
        tanggal_berangkat: tanggalBerangkatInput.value,
        kursi: kursiInput.value,
        harga: parseFloat(hargaInput.value),
        status: statusInput.value
    };

    saveTicket(ticketData);
}

// ===========================
// Delete Functions
// ===========================
function openDeleteModal(ticketId) {
    const ticket = allTickets.find(t => t.id == ticketId);
    if (!ticket) return;

    deletingTicketId = ticketId;
    document.getElementById('deleteTicketCode').textContent = ticket.kode_tiket;
    deleteModal.classList.add('active');
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    deletingTicketId = null;
}

function confirmDelete() {
    if (deletingTicketId) {
        deleteTicket(deletingTicketId);
    }
}

// ===========================
// Render Functions
// ===========================
function renderTickets() {
    let filteredTickets = allTickets;

    // Apply search filter
    if (currentSearchTerm) {
        filteredTickets = filteredTickets.filter(ticket => {
            const searchLower = currentSearchTerm.toLowerCase();
            return (
                ticket.kode_tiket.toLowerCase().includes(searchLower) ||
                ticket.nama_penumpang.toLowerCase().includes(searchLower) ||
                ticket.rute.toLowerCase().includes(searchLower)
            );
        });
    }

    // Apply status filter
    if (currentFilter !== 'semua') {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === currentFilter);
    }

    // Render grid view
    if (filteredTickets.length === 0) {
        ticketsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Tidak ada tiket yang sesuai</p>
            </div>
        `;
    } else {
        ticketsContainer.innerHTML = filteredTickets.map(ticket => createTicketCard(ticket)).join('');
        addTicketCardListeners();
    }

    // Render recent tickets (first 5 for dashboard)
    const recentTickets = allTickets.slice(0, 5);
    if (recentTickets.length === 0) {
        recentTicketsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Belum ada data tiket</p>
            </div>
        `;
    } else {
        recentTicketsContainer.innerHTML = recentTickets.map(ticket => createTicketListItem(ticket)).join('');
        addTicketListItemListeners();
    }
}

function createTicketCard(ticket) {
    const statusClass = `status-${ticket.status}`;
    const statusLabel = ticket.status === 'tersedia' ? 'Tersedia' : 'Dipesan';

    return `
        <div class="ticket-card" data-ticket-id="${ticket.id}">
            <div class="ticket-card-header">
                <div class="ticket-card-code">${escapeHtml(ticket.kode_tiket)}</div>
                <div class="ticket-card-price">Rp ${formatCurrency(ticket.harga)}</div>
            </div>
            <div class="ticket-card-body">
                <div class="ticket-card-field">
                    <label>Penumpang</label>
                    <value>${escapeHtml(ticket.nama_penumpang)}</value>
                </div>
                <div class="ticket-card-field">
                    <label>Rute</label>
                    <value>${escapeHtml(ticket.rute)}</value>
                </div>
                <div class="ticket-card-field">
                    <label>Tanggal</label>
                    <value>${formatDate(ticket.tanggal_berangkat)}</value>
                </div>
                <div class="ticket-card-field">
                    <label>Kursi</label>
                    <value>${escapeHtml(ticket.kursi)}</value>
                </div>
            </div>
            <div class="ticket-card-footer">
                <div class="ticket-card-status">
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                </div>
                <div class="ticket-card-buttons">
                    <button class="btn-icon btn-icon-edit" data-edit="${ticket.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-icon-delete" data-delete="${ticket.id}" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createTicketListItem(ticket) {
    const statusClass = `status-${ticket.status}`;
    const statusLabel = ticket.status === 'tersedia' ? 'Tersedia' : 'Dipesan';

    return `
        <div class="ticket-item">
            <div class="ticket-info">
                <div class="ticket-code">${escapeHtml(ticket.kode_tiket)}</div>
                <div class="ticket-name">${escapeHtml(ticket.nama_penumpang)}</div>
                <div class="ticket-route">${escapeHtml(ticket.rute)}</div>
                <div class="ticket-details">
                    <div class="ticket-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(ticket.tanggal_berangkat)}</span>
                    </div>
                    <div class="ticket-detail">
                        <i class="fas fa-chair"></i>
                        <span>${escapeHtml(ticket.kursi)}</span>
                    </div>
                    <div class="ticket-detail">
                        <i class="fas fa-money-bill"></i>
                        <span>Rp ${formatCurrency(ticket.harga)}</span>
                    </div>
                </div>
            </div>
            <div class="ticket-actions">
                <span class="status-badge ${statusClass}">${statusLabel}</span>
                <button class="btn-icon btn-icon-edit" data-edit="${ticket.id}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-icon-delete" data-delete="${ticket.id}" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function addTicketCardListeners() {
    document.querySelectorAll('[data-edit]').forEach(btn => {
        btn.addEventListener('click', () => openEditForm(btn.dataset.edit));
    });

    document.querySelectorAll('[data-delete]').forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(btn.dataset.delete));
    });
}

function addTicketListItemListeners() {
    document.querySelectorAll('[data-edit]').forEach(btn => {
        btn.addEventListener('click', () => openEditForm(btn.dataset.edit));
    });

    document.querySelectorAll('[data-delete]').forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(btn.dataset.delete));
    });
}

// ===========================
// Search & Filter Functions
// ===========================
function handleSearch(e) {
    currentSearchTerm = e.target.value;
    renderTickets();
}

function handleFilter(e) {
    const filterValue = e.target.dataset.filter;
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.closest('.filter-btn').classList.add('active');
    
    currentFilter = filterValue;
    renderTickets();
}

// ===========================
// Statistics Functions
// ===========================
function updateStats() {
    const total = allTickets.length;
    const available = allTickets.filter(t => t.status === 'tersedia').length;
    const booked = allTickets.filter(t => t.status === 'dipesan').length;
    const revenue = allTickets.reduce((sum, t) => sum + parseFloat(t.harga), 0);

    totalTicketsEl.textContent = total;
    availableTicketsEl.textContent = available;
    bookedTicketsEl.textContent = booked;
    totalRevenueEl.textContent = 'Rp ' + formatCurrency(revenue);
}

// ===========================
// Navigation Functions
// ===========================
function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionName).classList.add('active');

    // Update nav links
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
}

// ===========================
// Utility Functions
// ===========================
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.add('active');
    } else {
        loadingSpinner.classList.remove('active');
    }
}

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type} active`;

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID').format(value);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
