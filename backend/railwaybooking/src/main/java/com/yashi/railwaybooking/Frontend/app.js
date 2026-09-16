/**
 * IRCTC RailConnect - NextGen Railway Reservation Portal
 * Client Application Logic & Backend REST Integration
 */

// API Configuration
const API_BASE_URL = 'http://localhost:8081/api';

// Comprehensive Fallback Trains Dataset across major Indian rail corridors
const DEFAULT_TRAINS = [
    {
        trainId: 1,
        trainName: "Vande Bharat Express",
        trainNumber: "22436",
        sourceStation: "New Delhi",
        destinationStation: "Varanasi",
        departureTime: "06:00 AM",
        arrivalTime: "02:00 PM",
        fare: 1750.0,
        totalSeats: 120,
        availableSeats: 118,
        trainType: "Vande Bharat"
    },
    {
        trainId: 2,
        trainName: "Rajdhani Express",
        trainNumber: "12952",
        sourceStation: "New Delhi",
        destinationStation: "Mumbai",
        departureTime: "04:55 PM",
        arrivalTime: "08:35 AM",
        fare: 2450.0,
        totalSeats: 150,
        availableSeats: 142,
        trainType: "Rajdhani"
    },
    {
        trainId: 3,
        trainName: "Shatabdi Express",
        trainNumber: "12002",
        sourceStation: "New Delhi",
        destinationStation: "Bhopal",
        departureTime: "06:00 AM",
        arrivalTime: "02:40 PM",
        fare: 1350.0,
        totalSeats: 100,
        availableSeats: 95,
        trainType: "Shatabdi"
    },
    {
        trainId: 4,
        trainName: "Duronto Express",
        trainNumber: "12260",
        sourceStation: "Mumbai",
        destinationStation: "Howrah",
        departureTime: "05:15 PM",
        arrivalTime: "08:15 PM",
        fare: 2800.0,
        totalSeats: 140,
        availableSeats: 136,
        trainType: "Duronto"
    },
    {
        trainId: 5,
        trainName: "Karnataka Express",
        trainNumber: "12628",
        sourceStation: "New Delhi",
        destinationStation: "Bengaluru",
        departureTime: "08:00 PM",
        arrivalTime: "06:45 AM",
        fare: 2100.0,
        totalSeats: 150,
        availableSeats: 147,
        trainType: "Express"
    },
    {
        trainId: 6,
        trainName: "Chennai Mail",
        trainNumber: "12602",
        sourceStation: "Mumbai",
        destinationStation: "Chennai",
        departureTime: "10:30 PM",
        arrivalTime: "04:00 AM",
        fare: 1850.0,
        totalSeats: 120,
        availableSeats: 116,
        trainType: "Mail"
    },
    {
        trainId: 7,
        trainName: "Golden Temple Mail",
        trainNumber: "12903",
        sourceStation: "Mumbai",
        destinationStation: "Amritsar",
        departureTime: "06:45 PM",
        arrivalTime: "05:30 AM",
        fare: 1650.0,
        totalSeats: 130,
        availableSeats: 125,
        trainType: "Express"
    },
    {
        trainId: 8,
        trainName: "Vande Bharat Express",
        trainNumber: "20834",
        sourceStation: "Howrah",
        destinationStation: "Puri",
        departureTime: "06:10 AM",
        arrivalTime: "12:35 PM",
        fare: 1420.0,
        totalSeats: 100,
        availableSeats: 94,
        trainType: "Vande Bharat"
    },
    {
        trainId: 9,
        trainName: "Lucknow Shatabdi",
        trainNumber: "12004",
        sourceStation: "New Delhi",
        destinationStation: "Lucknow",
        departureTime: "06:10 AM",
        arrivalTime: "12:45 PM",
        fare: 1280.0,
        totalSeats: 110,
        availableSeats: 104,
        trainType: "Shatabdi"
    },
    {
        trainId: 10,
        trainName: "Goa Express",
        trainNumber: "12780",
        sourceStation: "New Delhi",
        destinationStation: "Goa",
        departureTime: "03:15 PM",
        arrivalTime: "05:40 AM",
        fare: 2200.0,
        totalSeats: 140,
        availableSeats: 132,
        trainType: "Superfast"
    },
    {
        trainId: 11,
        trainName: "Deccan Queen Express",
        trainNumber: "12123",
        sourceStation: "Mumbai",
        destinationStation: "Pune",
        departureTime: "05:10 PM",
        arrivalTime: "08:25 PM",
        fare: 680.0,
        totalSeats: 120,
        availableSeats: 114,
        trainType: "Superfast"
    },
    {
        trainId: 12,
        trainName: "Ganga Kaveri Express",
        trainNumber: "12670",
        sourceStation: "Varanasi",
        destinationStation: "Chennai",
        departureTime: "01:10 AM",
        arrivalTime: "02:30 PM",
        fare: 2350.0,
        totalSeats: 130,
        availableSeats: 122,
        trainType: "Superfast"
    }
];

// Application State
let appState = {
    currentUser: null,
    trainsList: [],
    searchResults: [],
    bookingsList: [],
    activeBookingTrain: null,
    selectedClass: "3A",
    selectedCoach: "B1",
    selectedSeat: { number: 24, type: "Lower Berth", label: "B1-24" },
    currentBookingStep: 1,
    paymentMethod: "UPI",
    bookingFilter: "ALL",
    bookingSearchQuery: ""
};

// Initialization on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initClock();
    initDatePickers();
    loadUserSession();
    fetchTrains();
    loadBookings();
    updateSimulatorRoute();
});

/* ==========================================================================
   Theme Mode (Dark / Light) Logic
   ========================================================================== */
function initTheme() {
    const savedTheme = localStorage.getItem('railway_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = (currentTheme === 'light') ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('railway_theme', newTheme);
    updateThemeButton(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
}

function updateThemeButton(theme) {
    const btn = document.getElementById('themeToggleBtn');
    const text = document.getElementById('themeText');
    if (!btn || !text) return;

    if (theme === 'dark') {
        btn.innerHTML = `<i class="fa-solid fa-sun text-warning"></i> <span id="themeText">Light Mode</span>`;
    } else {
        btn.innerHTML = `<i class="fa-solid fa-moon"></i> <span id="themeText">Dark Mode</span>`;
    }
}

/* ==========================================================================
   Clock & Live Route Simulator
   ========================================================================== */
function initClock() {
    const clockEl = document.getElementById('liveClock');
    if (!clockEl) return;
    setInterval(() => {
        const now = new Date();
        clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${now.toLocaleTimeString('en-IN', { hour12: false })} IST | ${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    }, 1000);
}

function initDatePickers() {
    const dateInput = document.getElementById('journeyDateInput');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
        dateInput.min = new Date().toISOString().split('T')[0];
    }
}

function updateSimulatorRoute() {
    const fromVal = document.getElementById('fromStationInput')?.value.trim();
    const toVal = document.getElementById('toStationInput')?.value.trim();

    const simRouteText = document.getElementById('simRouteText');
    const simStart = document.getElementById('simStartStn');
    const simEnd = document.getElementById('simEndStn');

    if (fromVal && toVal) {
        if (simRouteText) simRouteText.textContent = `${fromVal} ➔ ${toVal}`;
        if (simStart) simStart.textContent = fromVal.split('(')[0].trim();
        if (simEnd) simEnd.textContent = toVal.split('(')[0].trim();
    } else if (fromVal) {
        if (simRouteText) simRouteText.textContent = `Departing from ${fromVal} ➔ (Enter Destination)`;
        if (simStart) simStart.textContent = fromVal.split('(')[0].trim();
        if (simEnd) simEnd.textContent = "Any City";
    } else if (toVal) {
        if (simRouteText) simRouteText.textContent = `(Enter Origin) ➔ Arriving at ${toVal}`;
        if (simStart) simStart.textContent = "Any City";
        if (simEnd) simEnd.textContent = toVal.split('(')[0].trim();
    } else {
        if (simRouteText) simRouteText.textContent = `Search Any Route Across India`;
        if (simStart) simStart.textContent = "Origin";
        if (simEnd) simEnd.textContent = "Destination";
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ==========================================================================
   Tab Navigation
   ========================================================================== */
function switchTab(tabKey) {
    document.querySelectorAll('.tab-section').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active');
    });

    document.querySelectorAll('.main-nav .nav-item').forEach(item => item.classList.remove('active'));

    if (tabKey === 'search') {
        const sec = document.getElementById('searchSection');
        if (sec) { sec.style.display = 'block'; sec.classList.add('active'); }
        document.getElementById('navSearch')?.classList.add('active');
    } else if (tabKey === 'pnr') {
        const sec = document.getElementById('pnrSection');
        if (sec) { sec.style.display = 'block'; sec.classList.add('active'); }
        document.getElementById('navPnr')?.classList.add('active');
    } else if (tabKey === 'bookings') {
        const sec = document.getElementById('bookingsSection');
        if (sec) { sec.style.display = 'block'; sec.classList.add('active'); }
        document.getElementById('navBookings')?.classList.add('active');
        loadBookings();
    } else if (tabKey === 'admin') {
        const sec = document.getElementById('adminSection');
        if (sec) { sec.style.display = 'block'; sec.classList.add('active'); }
        document.getElementById('navAdmin')?.classList.add('active');
        renderAdminTrainTable();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   User Authentication & Session
   ========================================================================== */
function loadUserSession() {
    const saved = localStorage.getItem('railway_user');
    if (saved) {
        try {
            appState.currentUser = JSON.parse(saved);
            updateUserNavUI();
        } catch (e) {
            console.error("Session parse error", e);
        }
    } else {
        // Default Demo User Session for smooth out-of-the-box experience
        appState.currentUser = {
            id: 2,
            fullName: "Yashi Saxena",
            email: "yashi@example.com",
            role: "USER"
        };
        updateUserNavUI();
    }
}

function updateUserNavUI() {
    const guestArea = document.getElementById('guestUserArea');
    const loggedArea = document.getElementById('loggedUserArea');
    const userNameEl = document.getElementById('navUserName');
    const userRoleEl = document.getElementById('navUserRole');
    const userAvatarEl = document.getElementById('userAvatarText');

    if (appState.currentUser) {
        if (guestArea) guestArea.style.display = 'none';
        if (loggedArea) loggedArea.style.display = 'flex';
        if (userNameEl) userNameEl.textContent = appState.currentUser.fullName || "Passenger";
        if (userRoleEl) userRoleEl.textContent = appState.currentUser.role || "PASSENGER";
        if (userAvatarEl) {
            const initials = (appState.currentUser.fullName || "P")
                .split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();
            userAvatarEl.textContent = initials || "YS";
        }
    } else {
        if (guestArea) guestArea.style.display = 'flex';
        if (loggedArea) loggedArea.style.display = 'none';
    }
}

function handleLogout() {
    appState.currentUser = null;
    localStorage.removeItem('railway_user');
    updateUserNavUI();
    showToast("Logged out successfully.", "info");
}

function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'flex';
    switchAuthTab(mode);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
}

function switchAuthTab(mode) {
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tabBtnLogin');
    const tabReg = document.getElementById('tabBtnRegister');
    const title = document.getElementById('authModalTitle');

    if (mode === 'login') {
        if (loginForm) loginForm.style.display = 'block';
        if (regForm) regForm.style.display = 'none';
        tabLogin?.classList.add('active');
        tabReg?.classList.remove('active');
        if (title) title.textContent = "Passenger Login";
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (regForm) regForm.style.display = 'block';
        tabLogin?.classList.remove('active');
        tabReg?.classList.add('active');
        if (title) title.textContent = "Register New Passenger";
    }
}

function fillLogin(email, pass) {
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');
    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = pass;
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            appState.currentUser = {
                id: data.userId || 1,
                fullName: data.fullName || "Passenger",
                email: data.email || email,
                role: data.role || "USER"
            };
            localStorage.setItem('railway_user', JSON.stringify(appState.currentUser));
            updateUserNavUI();
            closeAuthModal();
            showToast(`Welcome back, ${appState.currentUser.fullName}!`, "success");
            loadBookings();
        } else {
            showToast(data.message || "Invalid email or password", "error");
        }
    })
    .catch(err => {
        console.warn("Backend login failed, using local session:", err);
        let name = "Yashi Saxena";
        let role = "USER";
        let id = 2;
        if (email.includes("admin")) {
            name = "Admin User";
            role = "ADMIN";
            id = 1;
        }
        appState.currentUser = { id, fullName: name, email, role };
        localStorage.setItem('railway_user', JSON.stringify(appState.currentUser));
        updateUserNavUI();
        closeAuthModal();
        showToast(`Logged in successfully as ${name}`, "success");
    });
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    const fullName = document.getElementById('regFullName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    const payload = { fullName, email, phone, password };

    fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast("Registration successful! Please login.", "success");
            switchAuthTab('login');
            fillLogin(email, password);
        } else {
            showToast(data.message || "Registration failed", "error");
        }
    })
    .catch(err => {
        console.warn("Backend registration fallback:", err);
        showToast("Account registered locally! You can now login.", "success");
        switchAuthTab('login');
        fillLogin(email, password);
    });
}

/* ==========================================================================
   Flexible Free-Search Train Routing & Filtering Logic
   ========================================================================== */
function cleanStationName(name) {
    if (!name) return "";
    // Clean string from formatting like "New Delhi (NDLS)" -> "new delhi" or "delhi"
    return name.split('(')[0].split('/')[0].trim().toLowerCase();
}

function setFromStation(station) {
    const el = document.getElementById('fromStationInput');
    if (el) el.value = station;
    updateSimulatorRoute();
    handleSearchTrains();
}

function setToStation(station) {
    const el = document.getElementById('toStationInput');
    if (el) el.value = station;
    updateSimulatorRoute();
    handleSearchTrains();
}

function clearSearchFilters() {
    const fromEl = document.getElementById('fromStationInput');
    const toEl = document.getElementById('toStationInput');
    if (fromEl) fromEl.value = "";
    if (toEl) toEl.value = "";
    const vande = document.getElementById('checkVandeBharat');
    const avail = document.getElementById('checkAvailableOnly');
    if (vande) vande.checked = false;
    if (avail) avail.checked = false;

    updateSimulatorRoute();
    handleSearchTrains();
    showToast("Displaying all available train routes across India", "info");
}

function setJourneyDate(dayOffset) {
    const dateInput = document.getElementById('journeyDateInput');
    if (!dateInput) return;
    const target = new Date();
    target.setDate(target.getDate() + dayOffset);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
}

function swapStations() {
    const fromEl = document.getElementById('fromStationInput');
    const toEl = document.getElementById('toStationInput');
    if (fromEl && toEl) {
        const temp = fromEl.value;
        fromEl.value = toEl.value;
        toEl.value = temp;
        updateSimulatorRoute();
        handleSearchTrains();
    }
}

function quickRoute(from, to) {
    setFromStation(from);
    setToStation(to);
    switchTab('search');
    handleSearchTrains();
}

function fetchTrains() {
    fetch(`${API_BASE_URL}/trains/all`)
        .then(res => {
            if (!res.ok) throw new Error("Status " + res.status);
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                appState.trainsList = data;
            } else {
                appState.trainsList = DEFAULT_TRAINS;
            }
            handleSearchTrains();
        })
        .catch(err => {
            console.warn("Could not fetch trains from backend, using default list:", err);
            appState.trainsList = DEFAULT_TRAINS;
            handleSearchTrains();
        });

function handleSearchTrains(event) {
    if (event) event.preventDefault();

    const rawFrom = (document.getElementById('fromStationInput')?.value || "").trim();
    const rawTo = (document.getElementById('toStationInput')?.value || "").trim();

    updateSimulatorRoute();

    // Build query string for backend search
    const query = `source=${encodeURIComponent(rawFrom)}&destination=${encodeURIComponent(rawTo)}`;

    fetch(`${API_BASE_URL}/trains/search?${query}`)
        .then(res => {
            if (!res.ok) throw new Error("Status " + res.status);
            return res.json();
        })
        .then(data => {
            const matched = Array.isArray(data) ? data : [];
            appState.searchResults = matched;
            // Update UI header and summary
            const resultsHeader = document.getElementById('resultsHeader');
            const countEl = document.getElementById('resultsCount');
            const summaryEl = document.getElementById('searchRouteSummary');
            if (resultsHeader) resultsHeader.style.display = 'flex';
            if (countEl) countEl.textContent = matched.length;
            if (summaryEl) {
                if (rawFrom && rawTo) {
                    summaryEl.textContent = `Showing trains between ${rawFrom} ➔ ${rawTo}`;
                } else if (rawFrom) {
                    summaryEl.textContent = `Showing all trains departing from ${rawFrom}`;
                } else if (rawTo) {
                    summaryEl.textContent = `Showing all trains arriving at ${rawTo}`;
                } else {
                    summaryEl.textContent = `Showing all available train routes across India (${matched.length} trains)`;
                }
            }
            renderTrainCards(matched);
        })
        .catch(err => {
            console.warn("Backend search failed, falling back to client-side filtering:", err);
            // Fallback client-side filtering (original logic)
            const fromVal = cleanStationName(rawFrom);
            const toVal = cleanStationName(rawTo);
            let matched = appState.trainsList;
            if (fromVal && toVal) {
                matched = appState.trainsList.filter(train => {
                    const src = (train.sourceStation || train.source || "").toLowerCase();
                    const dest = (train.destinationStation || train.destination || "").toLowerCase();
                    return (src.includes(fromVal) || fromVal.includes(src)) &&
                           (dest.includes(toVal) || toVal.includes(dest));
                });
            } else if (fromVal) {
                matched = appState.trainsList.filter(train => {
                    const src = (train.sourceStation || train.source || "").toLowerCase();
                    return src.includes(fromVal) || fromVal.includes(src);
                });
            } else if (toVal) {
                matched = appState.trainsList.filter(train => {
                    const dest = (train.destinationStation || train.destination || "").toLowerCase();
                    return dest.includes(toVal) || toVal.includes(dest);
                });
            }
            appState.searchResults = matched;
            // Update UI header and summary (fallback)
            const resultsHeader = document.getElementById('resultsHeader');
            const countEl = document.getElementById('resultsCount');
            const summaryEl = document.getElementById('searchRouteSummary');
            if (resultsHeader) resultsHeader.style.display = 'flex';
            if (countEl) countEl.textContent = matched.length;
            if (summaryEl) {
                if (rawFrom && rawTo) {
                    summaryEl.textContent = `Showing trains between ${rawFrom} ➔ ${rawTo}`;
                } else if (rawFrom) {
                    summaryEl.textContent = `Showing all trains departing from ${rawFrom}`;
                } else if (rawTo) {
                    summaryEl.textContent = `Showing all trains arriving at ${rawTo}`;
                } else {
                    summaryEl.textContent = `Showing all available train routes across India (${matched.length} trains)`;
                }
            }
            renderTrainCards(matched);
        });
}


function filterTrainResults() {
    const vandeOnly = document.getElementById('checkVandeBharat')?.checked;
    const availOnly = document.getElementById('checkAvailableOnly')?.checked;

    let list = [...appState.searchResults];

    if (vandeOnly) {
        list = list.filter(t => (t.trainType || "").toLowerCase().includes("vande") || (t.trainName || "").toLowerCase().includes("vande"));
    }
    if (availOnly) {
        list = list.filter(t => (t.availableSeats || 0) > 0);
    }

    renderTrainCards(list);
}

function sortTrainResults(criteria) {
    let sorted = [...appState.searchResults];
    if (criteria === 'fareLow') {
        sorted.sort((a, b) => (a.fare || 0) - (b.fare || 0));
    } else if (criteria === 'fareHigh') {
        sorted.sort((a, b) => (b.fare || 0) - (a.fare || 0));
    } else if (criteria === 'seats') {
        sorted.sort((a, b) => (b.availableSeats || 0) - (a.availableSeats || 0));
    } else if (criteria === 'trainName') {
        sorted.sort((a, b) => (a.trainName || "").localeCompare(b.trainName || ""));
    }
    renderTrainCards(sorted);
}

function renderTrainCards(trains) {
    const container = document.getElementById('trainsContainer');
    if (!container) return;

    if (!trains || trains.length === 0) {
        container.innerHTML = `
            <div class="card" style="padding: 40px; text-align: center; background: var(--card-bg); border-radius: 16px; border: 1.5px dashed var(--border-color);">
                <i class="fa-solid fa-train" style="font-size: 40px; color: var(--text-muted); margin-bottom: 12px;"></i>
                <h3 style="color: var(--text-main);">No Direct Trains Found For This Query</h3>
                <p style="color: var(--text-muted); margin-top: 4px;">Try searching for other major stations or clear the search to view all routes.</p>
                <button class="btn btn-primary" style="margin-top: 16px;" onclick="clearSearchFilters()">View All Available Trains</button>
            </div>
        `;
        return;
    }

    container.innerHTML = trains.map(train => {
        const trainId = train.trainId || train.id;
        const trainType = train.trainType || "Superfast";
        let typeTagClass = "tag-superfast";
        if (trainType.includes("Vande")) typeTagClass = "tag-vande";
        else if (trainType.includes("Rajdhani")) typeTagClass = "tag-rajdhani";
        else if (trainType.includes("Shatabdi")) typeTagClass = "tag-shatabdi";
        else if (trainType.includes("Duronto")) typeTagClass = "tag-duronto";

        const seats = train.availableSeats ?? 100;
        let seatStatus = `<span class="seat-status-pill status-available"><i class="fa-solid fa-circle-check"></i> AVL ${seats}</span>`;
        if (seats <= 10 && seats > 0) {
            seatStatus = `<span class="seat-status-pill status-few"><i class="fa-solid fa-triangle-exclamation"></i> ONLY ${seats} LEFT</span>`;
        } else if (seats <= 0) {
            seatStatus = `<span class="seat-status-pill status-waiting"><i class="fa-solid fa-hourglass-half"></i> WL 14</span>`;
        }

        const fare3A = Math.round(train.fare || 1500);
        const fare2A = Math.round((train.fare || 1500) * 1.4);
        const fare1A = Math.round((train.fare || 1500) * 2.1);
        const fareSL = Math.round((train.fare || 1500) * 0.45);

        return `
            <div class="train-card" id="train-card-${trainId}">
                <div class="train-card-top">
                    <div class="train-title-group">
                        <span class="train-num-badge">${train.trainNumber || "12001"}</span>
                        <h3>${train.trainName || "Express Train"}</h3>
                        <span class="train-type-tag ${typeTagClass}">${trainType}</span>
                    </div>
                    <div class="train-runs-on">
                        Runs On: <span class="run-active">M</span> <span class="run-active">T</span> <span class="run-active">W</span> <span class="run-active">T</span> <span class="run-active">F</span> <span class="run-active">S</span> <span class="run-active">S</span>
                    </div>
                </div>

                <div class="train-schedule-grid">
                    <div class="time-box">
                        <h4>${train.departureTime || "06:00 AM"}</h4>
                        <div class="station-label">${train.sourceStation || train.source || "Origin"}</div>
                    </div>
                    <div class="duration-indicator">
                        <span class="duration-text">8h 00m</span>
                        <div class="route-line"></div>
                    </div>
                    <div class="time-box dest">
                        <h4>${train.arrivalTime || "02:00 PM"}</h4>
                        <div class="station-label">${train.destinationStation || train.destination || "Destination"}</div>
                    </div>
                </div>

                <div class="train-classes-row">
                    <div class="class-avail-card active" onclick="startBookingModal(${trainId}, '3A', ${fare3A})">
                        <div class="class-name-fare">
                            <span class="class-code">AC 3 Tier (3A)</span>
                            <span class="class-fare">₹${fare3A}</span>
                        </div>
                        ${seatStatus}
                        <button class="btn-book-card">Book 3A</button>
                    </div>
                    <div class="class-avail-card" onclick="startBookingModal(${trainId}, '2A', ${fare2A})">
                        <div class="class-name-fare">
                            <span class="class-code">AC 2 Tier (2A)</span>
                            <span class="class-fare">₹${fare2A}</span>
                        </div>
                        <span class="seat-status-pill status-available"><i class="fa-solid fa-circle-check"></i> AVL ${Math.max(1, Math.round(seats * 0.4))}</span>
                        <button class="btn-book-card">Book 2A</button>
                    </div>
                    <div class="class-avail-card" onclick="startBookingModal(${trainId}, '1A', ${fare1A})">
                        <div class="class-name-fare">
                            <span class="class-code">AC First (1A)</span>
                            <span class="class-fare">₹${fare1A}</span>
                        </div>
                        <span class="seat-status-pill status-few"><i class="fa-solid fa-triangle-exclamation"></i> AVL ${Math.max(1, Math.round(seats * 0.15))}</span>
                        <button class="btn-book-card">Book 1A</button>
                    </div>
                    <div class="class-avail-card" onclick="startBookingModal(${trainId}, 'SL', ${fareSL})">
                        <div class="class-name-fare">
                            <span class="class-code">Sleeper (SL)</span>
                            <span class="class-fare">₹${fareSL}</span>
                        </div>
                        <span class="seat-status-pill status-available"><i class="fa-solid fa-circle-check"></i> AVL ${seats + 20}</span>
                        <button class="btn-book-card">Book SL</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/* ==========================================================================
   Multi-Step Interactive Booking & Seat Picker Flow
   ========================================================================== */
function startBookingModal(trainId, travelClass = '3A', fare = 1750) {
    const train = appState.trainsList.find(t => (t.trainId || t.id) === trainId) || DEFAULT_TRAINS[0];
    appState.activeBookingTrain = { ...train, chosenFare: fare, chosenClass: travelClass };
    appState.selectedClass = travelClass;

    const passengerInput = document.getElementById('bookPassengerName');
    const emailInput = document.getElementById('bookPassengerEmail');
    if (appState.currentUser) {
        if (passengerInput) passengerInput.value = appState.currentUser.fullName || "Yashi Saxena";
        if (emailInput) emailInput.value = appState.currentUser.email || "yashi@example.com";
    }

    const titleEl = document.getElementById('bookingModalTitle');
    const subtitleEl = document.getElementById('bookingModalSubtitle');
    const travelDate = document.getElementById('journeyDateInput')?.value || "2026-09-15";

    if (titleEl) titleEl.textContent = `Book Ticket: ${train.trainNumber} ${train.trainName}`;
    if (subtitleEl) subtitleEl.textContent = `${train.sourceStation} ➔ ${train.destinationStation} | Journey Date: ${travelDate}`;

    goToBookingStep(1);
    generateCoachSeatLayout();

    const modal = document.getElementById('bookingModal');
    if (modal) modal.style.display = 'flex';
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.style.display = 'none';
}

function goToBookingStep(step) {
    appState.currentBookingStep = step;

    ['bookingStep1', 'bookingStep2', 'bookingStep3'].forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) el.style.display = (idx + 1 === step) ? 'block' : 'none';
    });

    const s1 = document.getElementById('step1Indicator');
    const s2 = document.getElementById('step2Indicator');
    const s3 = document.getElementById('step3Indicator');
    const l1 = document.getElementById('stepLine1');
    const l2 = document.getElementById('stepLine2');

    s1?.classList.toggle('active', step >= 1);
    s1?.classList.toggle('completed', step > 1);
    l1?.classList.toggle('active', step >= 2);

    s2?.classList.toggle('active', step >= 2);
    s2?.classList.toggle('completed', step > 2);
    l2?.classList.toggle('active', step >= 3);

    s3?.classList.toggle('active', step === 3);

    if (step === 3) {
        calculateFareBreakdown();
    }
}

function handleCoachChange() {
    const coachVal = document.getElementById('bookCoachSelect')?.value || "B1 (AC 3 Tier)";
    const coachPrefix = coachVal.split(' ')[0];
    appState.selectedCoach = coachPrefix;
    const visualCoachEl = document.getElementById('visualCoachName');
    if (visualCoachEl) visualCoachEl.textContent = coachPrefix;
    generateCoachSeatLayout();
}

function generateCoachSeatLayout() {
    const grid = document.getElementById('coachSeatsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const berthTypes = ['Lower', 'Middle', 'Upper', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];

    for (let i = 1; i <= 32; i++) {
        const bType = berthTypes[(i - 1) % 8];
        const isBooked = (i === 3 || i === 7 || i === 12 || i === 18 || i === 25);
        const isSelected = (i === appState.selectedSeat.number);

        const btn = document.createElement('div');
        btn.className = `berth-seat-btn ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`;
        btn.innerHTML = `
            <span class="seat-num">${i}</span>
            <span class="seat-type">${bType}</span>
        `;

        if (!isBooked) {
            btn.onclick = () => {
                document.querySelectorAll('.berth-seat-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                appState.selectedSeat = {
                    number: i,
                    type: bType + " Berth",
                    label: `${appState.selectedCoach}-${i}`
                };
                const seatLabel = document.getElementById('selectedSeatLabel');
                if (seatLabel) seatLabel.textContent = `${appState.selectedCoach}-${i} (${bType} Berth)`;
            };
        }

        grid.appendChild(btn);
    }
}

function calculateFareBreakdown() {
    const baseFare = appState.activeBookingTrain?.chosenFare || 1750;
    const gst = Math.round(baseFare * 0.05);
    const superfast = 45;
    const total = baseFare + gst + superfast;

    const baseEl = document.getElementById('fareBaseAmount');
    const gstEl = document.getElementById('fareGstAmount');
    const totalEl = document.getElementById('fareTotalAmount');

    if (baseEl) baseEl.textContent = `₹${baseFare.toFixed(2)}`;
    if (gstEl) gstEl.textContent = `₹${gst.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;

    appState.calculatedTotal = total;
}

function selectPayOption(method) {
    appState.paymentMethod = method;
    document.querySelectorAll('.pay-option').forEach(opt => opt.classList.remove('active'));
    const chosen = document.querySelector(`.pay-option input[value="${method}"]`)?.parentElement;
    if (chosen) chosen.classList.add('active');

    const upiForm = document.getElementById('upiFormArea');
    if (upiForm) upiForm.style.display = (method === 'UPI') ? 'block' : 'none';
}

function submitFinalBooking() {
    const btnPay = document.getElementById('btnConfirmPay');
    if (btnPay) {
        btnPay.disabled = true;
        btnPay.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Payment & Generating Ticket...`;
    }

    const passengerName = document.getElementById('bookPassengerName')?.value || "Yashi Saxena";
    const travelDate = document.getElementById('journeyDateInput')?.value || new Date().toISOString().split('T')[0];
    const trainId = appState.activeBookingTrain?.trainId || appState.activeBookingTrain?.id || 1;
    const totalAmount = appState.calculatedTotal || 1882.50;
    const coach = appState.selectedCoach || "B1";
    const seatNumber = `${coach}-${appState.selectedSeat.number} (${appState.selectedSeat.type})`;

    const bookingPayload = {
        trainId: trainId,
        userId: appState.currentUser?.id || 1,
        passengerName: passengerName,
        travelDate: travelDate,
        coach: coach,
        seatNumber: seatNumber,
        seatsBooked: 1,
        totalAmount: totalAmount,
        paymentMethod: appState.paymentMethod || "UPI"
    };

    fetch(`${API_BASE_URL}/bookings/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
    })
    .then(savedBooking => {
        handleBookingSuccess(savedBooking, bookingPayload);
    })
    .catch(err => {
        console.warn("Backend booking error, generating local confirmed ticket:", err);
        const mockPnr = "8" + Math.floor(100000000 + Math.random() * 900000000);
        const mockBooking = {
            bookingId: Date.now(),
            pnr: mockPnr,
            passengerName: passengerName,
            travelDate: travelDate,
            coach: coach,
            seatNumber: seatNumber,
            seatsBooked: 1,
            totalAmount: totalAmount,
            bookingStatus: "CONFIRMED",
            train: appState.activeBookingTrain
        };
        handleBookingSuccess(mockBooking, bookingPayload);
    })
    .finally(() => {
        if (btnPay) {
            btnPay.disabled = false;
            btnPay.innerHTML = `<i class="fa-solid fa-shield-halved"></i> Pay & Generate E-Ticket`;
        }
    });
}

function handleBookingSuccess(bookingData, payload) {
    closeBookingModal();
    showToast(`🎉 Booking Confirmed! PNR: ${bookingData.pnr}`, "success");

    // Prepend to local bookings
    appState.bookingsList.unshift(bookingData);
    updateBookingsCount();

    // Show E-Ticket with navigation options
    displayTicketModal(bookingData, payload);
    loadBookings();
}

/* ==========================================================================
   Post-Booking Navigation Actions (Back Button, Go to Bookings, Return Trip)
   ========================================================================== */
function handleAfterBookingBack() {
    closeTicketModal();
    switchTab('search');
    goToBookingStep(1);
    showToast("Returned to train search", "info");
    const container = document.getElementById('trainsContainer');
    if (container) container.scrollIntoView({ behavior: 'smooth' });
}

function handleAfterBookingViewBookings() {
    closeTicketModal();
    switchTab('bookings');
    showToast("Viewing all your booked tickets", "success");
}

function handleBookReturn() {
    closeTicketModal();
    swapStations();
    setJourneyDate(2);
    switchTab('search');
    handleSearchTrains();
    showToast("Route reversed for your return journey!", "info");
}

/* ==========================================================================
   IRCTC E-Ticket Boarding Pass Modal
   ========================================================================== */
function displayTicketModal(booking, details = {}) {
    const modal = document.getElementById('ticketModal');
    if (!modal) return;

    const train = booking.train || appState.activeBookingTrain || DEFAULT_TRAINS[0];

    document.getElementById('modalTicketPnr').textContent = booking.pnr || "8421093847";
    document.getElementById('modalTicketTrainName').textContent = `${train.trainNumber || "22436"} / ${(train.trainName || "VANDE BHARAT").toUpperCase()}`;
    document.getElementById('modalTicketClass').textContent = `${booking.coach || "B1"} (${appState.selectedClass || "3A"}) / GENERAL`;
    document.getElementById('modalTicketDate').textContent = booking.travelDate || "2026-09-15";
    document.getElementById('modalTicketStatus').textContent = booking.bookingStatus || "CONFIRMED";
    
    document.getElementById('modalTicketSource').textContent = train.sourceStation || train.source || "New Delhi";
    document.getElementById('modalTicketDepTime').innerHTML = `<i class="fa-regular fa-clock"></i> ${train.departureTime || "06:00 AM"}`;
    document.getElementById('modalTicketDest').textContent = train.destinationStation || train.destination || "Varanasi Jn";
    document.getElementById('modalTicketArrTime').innerHTML = `<i class="fa-regular fa-clock"></i> ${train.arrivalTime || "02:00 PM"}`;

    document.getElementById('modalTicketPassName').innerHTML = `<strong>${booking.passengerName || "Yashi Saxena"}</strong>`;
    document.getElementById('modalTicketAge').textContent = document.getElementById('bookPassengerAge')?.value || "24";
    document.getElementById('modalTicketGender').textContent = document.getElementById('bookPassengerGender')?.value || "Female";
    document.getElementById('modalTicketCoach').textContent = booking.coach || "B1";
    document.getElementById('modalTicketSeat').textContent = booking.seatNumber || "B1-24 (Lower)";
    document.getElementById('modalTicketFare').textContent = `₹${(booking.totalAmount || 1882.50).toFixed(2)}`;

    modal.style.display = 'flex';
}

function closeTicketModal() {
    const modal = document.getElementById('ticketModal');
    if (modal) modal.style.display = 'none';
}

/* ==========================================================================
   Advanced PNR Status Enquiry with Interactive Journey Tracker
   ========================================================================== */
function quickPnrCheck(pnr) {
    const input = document.getElementById('pnrInput');
    if (input) input.value = pnr;
    handlePnrSearch();
}

function copyPnr(pnr) {
    navigator.clipboard.writeText(pnr)
        .then(() => showToast(`Copied PNR ${pnr} to clipboard!`, "success"))
        .catch(() => showToast(`PNR: ${pnr}`, "info"));
}

function handlePnrSearch(event) {
    if (event) event.preventDefault();
    const pnr = (document.getElementById('pnrInput')?.value || "").trim();

    if (!pnr) {
        showToast("Please enter a valid 10-digit PNR", "error");
        return;
    }

    fetch(`${API_BASE_URL}/bookings/pnr/${pnr}`)
        .then(res => {
            if (!res.ok) throw new Error("PNR Not Found");
            return res.json();
        })
        .then(booking => {
            renderPnrResult(booking);
        })
        .catch(err => {
            console.warn("Backend PNR search fallback:", err);
            const found = appState.bookingsList.find(b => b.pnr === pnr);
            if (found) {
                renderPnrResult(found);
            } else {
                const demoLookup = {
                    bookingId: 999,
                    pnr: pnr,
                    passengerName: "Yashi Saxena",
                    travelDate: "2026-09-18",
                    coach: "B1",
                    seatNumber: "B1-24 (Lower Berth)",
                    seatsBooked: 1,
                    totalAmount: 1882.50,
                    bookingStatus: "CONFIRMED",
                    train: DEFAULT_TRAINS[0]
                };
                renderPnrResult(demoLookup);
            }
        });
}

function renderPnrResult(booking) {
    const container = document.getElementById('pnrResultContainer');
    if (!container) return;

    const train = booking.train || DEFAULT_TRAINS[0];
    const isCancelled = (booking.bookingStatus === 'CANCELLED');
    const pnr = booking.pnr || "8421093847";

    container.innerHTML = `
        <div class="pnr-result-card">
            <div class="pnr-result-header">
                <div>
                    <span style="font-size:11px; opacity:0.8;">IRCTC PASSENGER RESERVATION RECORD</span>
                    <h3 style="font-family:'Space Mono'; font-size: 24px; display:flex; align-items:center; gap:10px;">
                        ${pnr}
                        <button class="btn btn-outline btn-sm" style="color:white; border-color:rgba(255,255,255,0.4);" onclick="copyPnr('${pnr}')">
                            <i class="fa-solid fa-copy"></i> Copy PNR
                        </button>
                    </h3>
                </div>
                <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
                    <div class="status-badge ${isCancelled ? 'status-cancelled' : 'status-confirmed'}">
                        ${booking.bookingStatus || 'CONFIRMED'}
                    </div>
                    <span class="pnr-chart-badge"><i class="fa-solid fa-file-signature"></i> CHART PREPARED</span>
                </div>
            </div>

            <!-- Interactive Route Progress Visualizer -->
            <div class="pnr-journey-timeline">
                <div class="journey-timeline-header">
                    <i class="fa-solid fa-route text-primary"></i> LIVE TRAIN JOURNEY TRACKER (${train.trainNumber} ${train.trainName})
                </div>
                <div class="route-progress-steps">
                    <div class="stn-checkpoint">
                        <div class="stn-checkpoint-dot"><i class="fa-solid fa-train-subway"></i></div>
                        <span class="stn-checkpoint-name">${train.sourceStation || "Origin"}</span>
                        <span class="stn-checkpoint-time">Dep: ${train.departureTime || "06:00 AM"}</span>
                        <span class="stn-platform-badge">Platform 4</span>
                    </div>
                    <div class="stn-checkpoint">
                        <div class="stn-checkpoint-dot"><i class="fa-solid fa-clock"></i></div>
                        <span class="stn-checkpoint-name">Transit Station</span>
                        <span class="stn-checkpoint-time">Transit: 10:15 AM</span>
                        <span class="stn-platform-badge">Platform 2</span>
                    </div>
                    <div class="stn-checkpoint">
                        <div class="stn-checkpoint-dot"><i class="fa-solid fa-clock"></i></div>
                        <span class="stn-checkpoint-name">Junction</span>
                        <span class="stn-checkpoint-time">Transit: 12:20 PM</span>
                        <span class="stn-platform-badge">Platform 1</span>
                    </div>
                    <div class="stn-checkpoint upcoming">
                        <div class="stn-checkpoint-dot"><i class="fa-solid fa-flag-checkered"></i></div>
                        <span class="stn-checkpoint-name">${train.destinationStation || "Destination"}</span>
                        <span class="stn-checkpoint-time">Arr: ${train.arrivalTime || "02:00 PM"}</span>
                        <span class="stn-platform-badge">Platform 6</span>
                    </div>
                </div>
            </div>

            <div class="pnr-details-grid">
                <div class="pnr-detail-item">
                    <span class="label">Train No & Name</span>
                    <div class="value">${train.trainNumber} ${train.trainName}</div>
                </div>
                <div class="pnr-detail-item">
                    <span class="label">Journey Route</span>
                    <div class="value">${train.sourceStation} ➔ ${train.destinationStation}</div>
                </div>
                <div class="pnr-detail-item">
                    <span class="label">Journey Date</span>
                    <div class="value">${booking.travelDate}</div>
                </div>
                <div class="pnr-detail-item">
                    <span class="label">Coach & Berth</span>
                    <div class="value text-primary">${booking.coach || 'B1'} (${booking.seatNumber || 'Seat 24'})</div>
                </div>
            </div>

            <div class="pnr-passengers-wrap">
                <h4 style="margin-bottom: 10px; color: var(--text-main);">Passenger & Berth Details</h4>
                <table class="ticket-passengers-table">
                    <thead>
                        <tr>
                            <th>Passenger Name</th>
                            <th>Coach</th>
                            <th>Berth Allocation</th>
                            <th>Booking Status</th>
                            <th>Total Fare</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>${booking.passengerName || 'Passenger'}</strong></td>
                            <td><span class="train-num-badge">${booking.coach || 'B1'}</span></td>
                            <td><strong>${booking.seatNumber || 'B1-24 (Lower Berth)'}</strong></td>
                            <td class="${isCancelled ? 'text-danger' : 'text-success'}"><strong>${booking.bookingStatus || 'CONFIRMED'}</strong></td>
                            <td><strong>₹${(booking.totalAmount || 1882.50).toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="pnr-actions-bar">
                <button class="btn btn-outline" onclick="displayTicketModal(${JSON.stringify(booking).replace(/"/g, '&quot;')})">
                    <i class="fa-solid fa-print"></i> View / Print E-Ticket
                </button>
                ${!isCancelled ? `
                <button class="btn btn-primary" style="background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);" onclick="confirmCancelTicket(${booking.bookingId || booking.id || 1})">
                    <i class="fa-solid fa-ban"></i> Cancel Ticket & Refund
                </button>
                ` : ''}
            </div>
        </div>
    `;

    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
}

/* ==========================================================================
   My Bookings Dashboard with Filter Tabs & Search
   ========================================================================== */
function loadBookings() {
    const userId = appState.currentUser?.id;
    const url = userId ? `${API_BASE_URL}/bookings/user/${userId}` : `${API_BASE_URL}/bookings`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Status " + res.status);
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                appState.bookingsList = data;
            }
            renderBookingsList();
        })
        .catch(err => {
            console.warn("Could not fetch bookings from backend:", err);
            renderBookingsList();
        });
}

function filterBookingsTab(filterType) {
    appState.bookingFilter = filterType;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));

    if (filterType === 'ALL') document.getElementById('tabFilterAll')?.classList.add('active');
    else if (filterType === 'CONFIRMED') document.getElementById('tabFilterCnf')?.classList.add('active');
    else if (filterType === 'CANCELLED') document.getElementById('tabFilterCan')?.classList.add('active');

    renderBookingsList();
}

function filterBookingsSearch(query) {
    appState.bookingSearchQuery = (query || "").toLowerCase().trim();
    renderBookingsList();
}

function renderBookingsList() {
    const container = document.getElementById('userBookingsList');
    if (!container) return;

    updateBookingsCount();

    const allCount = appState.bookingsList.length;
    const cnfCount = appState.bookingsList.filter(b => b.bookingStatus !== 'CANCELLED').length;
    const canCount = appState.bookingsList.filter(b => b.bookingStatus === 'CANCELLED').length;

    const cntAll = document.getElementById('cntFilterAll');
    const cntCnf = document.getElementById('cntFilterCnf');
    const cntCan = document.getElementById('cntFilterCan');

    if (cntAll) cntAll.textContent = allCount;
    if (cntCnf) cntCnf.textContent = cnfCount;
    if (cntCan) cntCan.textContent = canCount;

    let filtered = [...appState.bookingsList];

    // Filter by tab status
    if (appState.bookingFilter === 'CONFIRMED') {
        filtered = filtered.filter(b => b.bookingStatus !== 'CANCELLED');
    } else if (appState.bookingFilter === 'CANCELLED') {
        filtered = filtered.filter(b => b.bookingStatus === 'CANCELLED');
    }

    // Filter by search query
    if (appState.bookingSearchQuery) {
        filtered = filtered.filter(b => {
            const pnr = (b.pnr || "").toLowerCase();
            const pass = (b.passengerName || "").toLowerCase();
            const train = (b.train?.trainName || "").toLowerCase();
            return pnr.includes(appState.bookingSearchQuery) || pass.includes(appState.bookingSearchQuery) || train.includes(appState.bookingSearchQuery);
        });
    }

    if (!filtered || filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: var(--card-bg); border-radius: 16px; border: 1.5px dashed var(--border-color);">
                <i class="fa-solid fa-receipt" style="font-size: 38px; color: var(--text-muted); margin-bottom: 12px;"></i>
                <h3 style="color: var(--text-main);">No Bookings Found</h3>
                <p style="color: var(--text-muted); margin-top: 4px;">No matching ticket records found for your search.</p>
                <button class="btn btn-primary" style="margin-top: 16px;" onclick="switchTab('search')">Book a Journey</button>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(b => {
        const train = b.train || DEFAULT_TRAINS[0];
        const isCancelled = (b.bookingStatus === 'CANCELLED');
        const bookingId = b.bookingId || b.id || 1;

        return `
            <div class="booking-item-card">
                <div class="booking-card-head">
                    <span class="booking-pnr-tag">PNR: ${b.pnr || "8421093847"}</span>
                    <span class="status-badge ${isCancelled ? 'status-cancelled' : 'status-confirmed'}">
                        ${b.bookingStatus || 'CONFIRMED'}
                    </span>
                </div>
                <div class="booking-card-body">
                    <h4>${train.trainName || "Express Train"} (${train.trainNumber || "12001"})</h4>
                    <div class="booking-route-line">
                        <i class="fa-solid fa-location-dot text-primary"></i> ${train.sourceStation || "Origin"} ➔ ${train.destinationStation || "Destination"}
                    </div>
                    <div class="booking-meta-row">
                        <div><span>Passenger:</span> <strong>${b.passengerName || "Passenger"}</strong></div>
                        <div><span>Travel Date:</span> <strong>${b.travelDate || "2026-09-15"}</strong></div>
                        <div><span>Berth / Seat:</span> <strong>${b.seatNumber || "B1-24"}</strong></div>
                        <div><span>Fare Paid:</span> <strong class="text-primary">₹${(b.totalAmount || 1882.50).toFixed(2)}</strong></div>
                    </div>
                    <div class="booking-actions">
                        <button class="btn btn-outline btn-sm" style="flex:1;" onclick="displayTicketModal(${JSON.stringify(b).replace(/"/g, '&quot;')})">
                            <i class="fa-solid fa-print"></i> E-Ticket
                        </button>
                        ${!isCancelled ? `
                        <button class="btn btn-outline btn-sm" style="color: #dc2626; border-color: #fca5a5;" onclick="confirmCancelTicket(${bookingId})">
                            <i class="fa-solid fa-ban"></i> Cancel
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateBookingsCount() {
    const countEl = document.getElementById('bookingsCount');
    if (countEl) {
        countEl.textContent = appState.bookingsList.length;
    }
}

function confirmCancelTicket(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking? Refund will be credited to original payment method in 2-3 business days.")) {
        return;
    }

    fetch(`${API_BASE_URL}/bookings/cancel/${bookingId}`, {
        method: 'PUT'
    })
    .then(res => {
        if (!res.ok) throw new Error("Cancellation failed");
        return res.json();
    })
    .then(cancelledBooking => {
        showToast("Booking cancelled successfully. Train seats restored.", "info");
        const target = appState.bookingsList.find(b => (b.bookingId || b.id) === bookingId);
        if (target) target.bookingStatus = "CANCELLED";
        renderBookingsList();
        fetchTrains();
    })
    .catch(err => {
        console.warn("Backend cancellation error, updating locally:", err);
        const target = appState.bookingsList.find(b => (b.bookingId || b.id) === bookingId);
        if (target) target.bookingStatus = "CANCELLED";
        showToast("Ticket cancelled successfully (local).", "info");
        renderBookingsList();
    });
}

/* ==========================================================================
   Admin Train Master Management
   ========================================================================== */
function renderAdminTrainTable() {
    const tbody = document.getElementById('adminTrainTableBody');
    if (!tbody) return;

    const list = appState.trainsList.length > 0 ? appState.trainsList : DEFAULT_TRAINS;

    tbody.innerHTML = list.map(t => {
        const trainId = t.trainId || t.id;
        return `
            <tr>
                <td>
                    <strong>${t.trainName}</strong>
                    <div style="font-family:'Space Mono'; font-size:12px; color:var(--text-muted);">#${t.trainNumber}</div>
                </td>
                <td><span class="train-type-tag tag-superfast">${t.trainType || 'Express'}</span></td>
                <td>${t.sourceStation} ➔ ${t.destinationStation}</td>
                <td>${t.departureTime} - ${t.arrivalTime}</td>
                <td><strong>₹${t.fare}</strong></td>
                <td><span class="seat-status-pill status-available">${t.availableSeats} / ${t.totalSeats} seats</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#fca5a5;" onclick="handleDeleteTrain(${trainId})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openAddTrainModal() {
    const form = document.getElementById('adminTrainForm');
    if (form) form.reset();
    const modal = document.getElementById('trainAdminModal');
    if (modal) modal.style.display = 'flex';
}

function closeAdminModal() {
    const modal = document.getElementById('trainAdminModal');
    if (modal) modal.style.display = 'none';
}

function handleAdminSaveTrain(event) {
    event.preventDefault();

    const newTrain = {
        trainName: document.getElementById('adminTrainName').value.trim(),
        trainNumber: document.getElementById('adminTrainNumber').value.trim(),
        sourceStation: document.getElementById('adminSource').value.trim(),
        destinationStation: document.getElementById('adminDestination').value.trim(),
        departureTime: document.getElementById('adminDepTime').value.trim(),
        arrivalTime: document.getElementById('adminArrTime').value.trim(),
        fare: parseFloat(document.getElementById('adminFare').value),
        totalSeats: parseInt(document.getElementById('adminSeats').value),
        availableSeats: parseInt(document.getElementById('adminSeats').value),
        trainType: document.getElementById('adminTrainType').value
    };

    fetch(`${API_BASE_URL}/trains/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrain)
    })
    .then(res => res.json())
    .then(saved => {
        showToast("Train added successfully to timetable!", "success");
        closeAdminModal();
        fetchTrains();
        renderAdminTrainTable();
    })
    .catch(err => {
        console.warn("Backend add train fallback:", err);
        newTrain.trainId = Date.now();
        appState.trainsList.push(newTrain);
        closeAdminModal();
        showToast("Train route added locally!", "success");
        renderAdminTrainTable();
        handleSearchTrains();
    });
}

function handleDeleteTrain(id) {
    if (!confirm("Are you sure you want to remove this train from the schedule?")) return;

    fetch(`${API_BASE_URL}/trains/delete/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        showToast("Train deleted successfully.", "info");
        fetchTrains();
        renderAdminTrainTable();
    })
    .catch(err => {
        console.warn("Backend delete fallback:", err);
        appState.trainsList = appState.trainsList.filter(t => (t.trainId || t.id) !== id);
        renderAdminTrainTable();
        handleSearchTrains();
        showToast("Train deleted locally.", "info");
    });
}
