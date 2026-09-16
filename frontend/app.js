/**
 * RailYatri - Railway Ticket Reservation System Frontend Logic
 */

// Determine API Base URL (Works whether served from Spring Boot or standalone)
const API_BASE_URL = (window.location.port === "8081" || window.location.pathname.includes("/api"))
    ? ""
    : "http://localhost:8081";

// Global State
let currentTrains = [];
let selectedTrain = null;
let currentUser = null;

// Initialize Application on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    initUserSession();
    setDefaultDate();
    loadAllTrains();
});

/* ========================================================
   SESSION & AUTHENTICATION
   ======================================================== */
function initUserSession() {
    const savedUser = localStorage.getItem("railwayUser");
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateNavUser(currentUser);
        } catch (e) {
            localStorage.removeItem("railwayUser");
        }
    }
}

function updateNavUser(user) {
    if (user) {
        document.getElementById("guestNav").style.display = "none";
        document.getElementById("userNav").style.display = "flex";
        document.getElementById("navUserName").textContent = user.fullName || user.email;
        document.getElementById("navUserRole").textContent = user.role || "Passenger";
        document.getElementById("navAvatar").textContent = (user.fullName || "U").charAt(0).toUpperCase();
    } else {
        document.getElementById("guestNav").style.display = "flex";
        document.getElementById("userNav").style.display = "none";
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem("railwayUser");
    updateNavUser(null);
    showToast("Logged out successfully");
    switchTab("search");
}

function openAuthModal(mode = "login") {
    setAuthTab(mode);
    openModal("authModal");
}

function setAuthTab(mode) {
    const isLogin = mode === "login";
    document.getElementById("authModalTitle").textContent = isLogin ? "Sign In" : "Create an Account";
    document.getElementById("tabBtnLogin").classList.toggle("active", isLogin);
    document.getElementById("tabBtnRegister").classList.toggle("active", !isLogin);
    document.getElementById("loginForm").style.display = isLogin ? "block" : "none";
    document.getElementById("registerForm").style.display = isLogin ? "none" : "block";
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok && data.success) {
            currentUser = {
                id: data.userId,
                fullName: data.fullName,
                email: data.email,
                role: data.role
            };
            localStorage.setItem("railwayUser", JSON.stringify(currentUser));
            updateNavUser(currentUser);
            closeModal("authModal");
            showToast(`Welcome back, ${currentUser.fullName}!`);
        } else {
            showToast(data.message || "Invalid credentials!", "error");
        }
    } catch (err) {
        showToast("Backend connection failed: " + err.message, "error");
    }
}

async function handleRegisterSubmit(event) {
    event.preventDefault();
    const fullName = document.getElementById("regFullName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const phone = document.getElementById("regPhone").value.trim();

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, password, phone })
        });

        const data = await res.json();
        if (res.ok && data.success) {
            currentUser = {
                id: data.userId,
                fullName: data.fullName,
                email: data.email,
                role: data.role
            };
            localStorage.setItem("railwayUser", JSON.stringify(currentUser));
            updateNavUser(currentUser);
            closeModal("authModal");
            showToast("Account registered successfully!");
        } else {
            showToast(data.message || "Registration failed.", "error");
        }
    } catch (err) {
        showToast("Error connecting to server: " + err.message, "error");
    }
}

/* ========================================================
   TAB NAVIGATION
   ======================================================== */
function switchTab(tabId) {
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(btn => btn.classList.remove("active"));

    if (tabId === "search") {
        document.getElementById("searchTab").classList.add("active");
        document.getElementById("navSearchBtn").classList.add("active");
    } else if (tabId === "pnr") {
        document.getElementById("pnrTab").classList.add("active");
        document.getElementById("navPnrBtn").classList.add("active");
    } else if (tabId === "bookings") {
        document.getElementById("bookingsTab").classList.add("active");
        document.getElementById("navBookingsBtn").classList.add("active");
        loadUserBookings();
    } else if (tabId === "admin") {
        document.getElementById("adminTab").classList.add("active");
        document.getElementById("navAdminBtn").classList.add("active");
    }
}

/* ========================================================
   TRAIN SEARCH & LISTING
   ======================================================== */
function setDefaultDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formattedDate = tomorrow.toISOString().split("T")[0];
    const dateInput = document.getElementById("journeyDate");
    if (dateInput) {
        dateInput.value = formattedDate;
        dateInput.min = today.toISOString().split("T")[0];
    }
}

function setRoute(source, destination) {
    document.getElementById("fromStation").value = source;
    document.getElementById("toStation").value = destination;
    handleSearchTrains(new Event("submit"));
}

function swapStations() {
    const fromInput = document.getElementById("fromStation");
    const toInput = document.getElementById("toStation");
    const temp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = temp;
}

async function loadAllTrains() {
    const countEl = document.getElementById("resultsCount");
    if (countEl) countEl.textContent = "Loading...";

    try {
        const res = await fetch(`${API_BASE_URL}/api/trains/all`);
        if (!res.ok) throw new Error("Could not fetch trains");
        currentTrains = await res.json();
        renderTrains(currentTrains);
        if (countEl) countEl.textContent = `${currentTrains.length} trains available`;
    } catch (err) {
        console.error("Error loading trains:", err);
        const listEl = document.getElementById("trainsList");
        if (listEl) {
            listEl.innerHTML = `
                <div class="card" style="text-align: center; color: var(--text-muted);">
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">⚠️ Unable to connect to Railway Server at <code>${API_BASE_URL || 'http://localhost:8081'}</code></p>
                    <p style="font-size: 0.9rem;">Make sure the Spring Boot application is running.</p>
                </div>
            `;
        }
        if (countEl) countEl.textContent = "0 trains found";
    }
}

async function handleSearchTrains(event) {
    if (event && event.preventDefault) event.preventDefault();

    const from = document.getElementById("fromStation").value.trim();
    const to = document.getElementById("toStation").value.trim();
    const countEl = document.getElementById("resultsCount");
    const headingEl = document.getElementById("resultsHeading");

    countEl.textContent = "Searching...";

    try {
        let url = `${API_BASE_URL}/api/trains/search?source=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`;
        if (!from && !to) {
            url = `${API_BASE_URL}/api/trains/all`;
        }

        const res = await fetch(url);
        const data = await res.json();
        currentTrains = data;

        if (from && to) {
            headingEl.textContent = `Trains: ${from} ➔ ${to}`;
        } else {
            headingEl.textContent = "All Available Trains";
        }

        countEl.textContent = `${currentTrains.length} trains found`;
        renderTrains(currentTrains);
    } catch (err) {
        showToast("Search failed: " + err.message, "error");
    }
}

function renderTrains(trains) {
    const listEl = document.getElementById("trainsList");
    if (!listEl) return;

    if (!trains || trains.length === 0) {
        listEl.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <p style="font-size: 1.2rem; color: var(--text-muted);">🔍 No trains found matching your search route.</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">Try searching for popular routes like <b>Delhi to Varanasi</b> or <b>Delhi to Mumbai</b>.</p>
                <button class="btn btn-primary mt-3" onclick="loadAllTrains()">View All Trains</button>
            </div>
        `;
        return;
    }

    listEl.innerHTML = trains.map(train => {
        const availableSeats = train.availableSeats ?? 100;
        const isAvailable = availableSeats > 0;
        const seatStatusClass = isAvailable ? "available" : "waiting";
        const seatText = isAvailable ? `Available (${availableSeats} seats)` : "WL (Waitlisted)";
        const trainType = train.trainType || "Express";

        return `
            <div class="train-card">
                <div class="train-main-info">
                    <div class="train-name-row">
                        <span class="train-num-badge">${train.trainNumber}</span>
                        <span class="train-title">${train.trainName}</span>
                        <span class="train-type-badge">${trainType}</span>
                    </div>

                    <div class="train-schedule">
                        <div class="station-time">
                            <span class="time">${train.departureTime || '06:00 AM'}</span>
                            <span class="station">${train.sourceStation}</span>
                        </div>

                        <div class="route-indicator">
                            <span class="duration">Direct</span>
                            <div class="route-line"></div>
                        </div>

                        <div class="station-time">
                            <span class="time">${train.arrivalTime || '02:00 PM'}</span>
                            <span class="station">${train.destinationStation}</span>
                        </div>
                    </div>
                </div>

                <div class="train-booking-side">
                    <div class="fare-box">
                        <span class="currency">₹</span>
                        <span class="fare-amount">${(train.fare || 0).toLocaleString()}</span>
                        <span class="fare-unit">/ passenger</span>
                    </div>

                    <div class="seats-status ${seatStatusClass}">
                        <span>●</span>
                        <span>${seatText}</span>
                    </div>

                    <button class="btn btn-primary" onclick="openBookingModal(${train.trainId})" ${!isAvailable ? 'disabled' : ''}>
                        Book Now
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

/* ========================================================
   BOOKING MODAL & FARE CALCULATION
   ======================================================== */
function openBookingModal(trainId) {
    selectedTrain = currentTrains.find(t => t.trainId === trainId);
    if (!selectedTrain) return;

    // Prefill passenger name if logged in
    const nameInput = document.getElementById("modalPassengerName");
    if (nameInput) {
        nameInput.value = currentUser ? currentUser.fullName : "Yashi Saxena";
    }

    // Populate Train Summary
    const summaryBox = document.getElementById("modalTrainSummary");
    summaryBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${selectedTrain.trainNumber} - ${selectedTrain.trainName}</strong>
                <div style="font-size: 0.85rem; color: #475569;">
                    ${selectedTrain.sourceStation} ➔ ${selectedTrain.destinationStation}
                </div>
            </div>
            <div style="text-align: right;">
                <span class="badge badge-success">Available: ${selectedTrain.availableSeats}</span>
            </div>
        </div>
    `;

    updateBookingFare();
    openModal("bookingModal");
}

function updateBookingFare() {
    if (!selectedTrain) return;

    const coachSelect = document.getElementById("modalCoachClass");
    const seatCountSelect = document.getElementById("modalSeatCount");

    const coachVal = coachSelect.value;
    const seatCount = parseInt(seatCountSelect.value, 10) || 1;

    let multiplier = 0;
    if (coachVal.includes("2A")) multiplier = 450;
    else if (coachVal.includes("1A")) multiplier = 950;
    else if (coachVal.includes("SL")) multiplier = -400;

    const basePerPerson = Math.max(200, (selectedTrain.fare || 1000) + multiplier);
    const subtotal = basePerPerson * seatCount;
    const convenienceFee = 35.40;
    const grandTotal = subtotal + convenienceFee;

    document.getElementById("summaryBaseFare").textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById("summaryTotalFare").textContent = `₹${grandTotal.toFixed(2)}`;
}

async function handleProceedToPayment(event) {
    event.preventDefault();
    if (!selectedTrain) return;

    const passengerName = document.getElementById("modalPassengerName").value.trim();
    const coach = document.getElementById("modalCoachClass").value.split(" ")[0]; // e.g. "B1"
    const seatsCount = parseInt(document.getElementById("modalSeatCount").value, 10);
    const journeyDate = document.getElementById("journeyDate").value || new Date().toISOString().split("T")[0];
    const totalAmount = parseFloat(document.getElementById("summaryTotalFare").textContent.replace("₹", ""));
    const paymentMethod = document.querySelector('input[name="payMethod"]:checked')?.value || "UPI";

    const btn = document.getElementById("btnPayAndBook");
    btn.textContent = "Processing Payment...";
    btn.disabled = true;

    const bookingPayload = {
        trainId: selectedTrain.trainId,
        userId: currentUser ? currentUser.id : 2,
        passengerName: passengerName,
        travelDate: journeyDate,
        coach: coach,
        seatsBooked: seatsCount,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod
    };

    try {
        const res = await fetch(`${API_BASE_URL}/api/bookings/book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingPayload)
        });

        const data = await res.json();

        if (res.ok && data.pnr) {
            closeModal("bookingModal");
            displayTicket(data);
            showToast("Ticket Booked Successfully! PNR: " + data.pnr);
            loadAllTrains(); // Refresh train seat availability
        } else {
            showToast(data.error || "Booking failed. Please try again.", "error");
        }
    } catch (err) {
        showToast("Error processing booking: " + err.message, "error");
    } finally {
        btn.textContent = "Pay & Confirm Ticket";
        btn.disabled = false;
    }
}

/* ========================================================
   TICKET DISPLAY & PRINTING
   ======================================================== */
function displayTicket(booking) {
    document.getElementById("ticketPnr").textContent = booking.pnr;
    document.getElementById("ticketPassengerName").textContent = booking.passengerName;
    document.getElementById("ticketPassengerCount").textContent = booking.seatsBooked || 1;
    document.getElementById("ticketFareAmount").textContent = `₹${(booking.totalAmount || 0).toLocaleString()}`;
    document.getElementById("ticketJourneyDate").textContent = booking.travelDate;
    document.getElementById("ticketCoach").textContent = booking.coach || "B1";
    document.getElementById("ticketSeat").textContent = booking.seatNumber || (booking.coach + "-24");

    const train = booking.train || selectedTrain || {};
    document.getElementById("ticketTrainName").textContent = `${train.trainNumber || '12952'} / ${train.trainName || 'Express'}`;
    document.getElementById("ticketSource").textContent = train.sourceStation || "Origin";
    document.getElementById("ticketDestination").textContent = train.destinationStation || "Destination";

    const statusBadge = document.getElementById("ticketStatusBadge");
    if (booking.bookingStatus === "CANCELLED") {
        statusBadge.textContent = "CANCELLED";
        statusBadge.className = "badge badge-danger";
    } else {
        statusBadge.textContent = "CONFIRMED (CNF)";
        statusBadge.className = "badge badge-success";
    }

    document.getElementById("ticketTxnId").textContent = `TXN: TXN_${Date.now()}`;
    openModal("ticketModal");
}

/* ========================================================
   PNR ENQUIRY
   ======================================================== */
async function searchPnr() {
    const pnrInput = document.getElementById("pnrSearchInput").value.trim();
    if (!pnrInput) {
        showToast("Please enter a 10-digit PNR number", "error");
        return;
    }

    const resultBox = document.getElementById("pnrResult");
    resultBox.style.display = "block";
    resultBox.innerHTML = "<p style='color: var(--text-muted);'>Searching PNR records...</p>";

    try {
        const res = await fetch(`${API_BASE_URL}/api/bookings/pnr/${pnrInput}`);
        if (!res.ok) {
            resultBox.innerHTML = `
                <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 1.25rem; border-radius: var(--radius-sm); text-align: center;">
                    <p style="color: #c53030; font-weight: 600;">❌ No ticket record found for PNR: ${pnrInput}</p>
                    <p style="font-size: 0.85rem; color: #742a2a; margin-top: 0.25rem;">Please check the number and try again.</p>
                </div>
            `;
            return;
        }

        const booking = await res.json();
        const isCancelled = booking.bookingStatus === "CANCELLED";
        const statusClass = isCancelled ? "badge-danger" : "badge-success";
        const train = booking.train || {};

        resultBox.innerHTML = `
            <div style="background: #f8fafc; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem;">
                    <div>
                        <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">PNR Number</span>
                        <h3 style="color: var(--primary); font-size: 1.4rem;">${booking.pnr}</h3>
                    </div>
                    <span class="badge ${statusClass}">${booking.bookingStatus}</span>
                </div>

                <div class="booking-item-body">
                    <div>
                        <span class="booking-field-label">Train Details</span>
                        <span class="booking-field-val">${train.trainNumber} - ${train.trainName}</span>
                    </div>
                    <div>
                        <span class="booking-field-label">Journey Route</span>
                        <span class="booking-field-val">${train.sourceStation} ➔ ${train.destinationStation}</span>
                    </div>
                    <div>
                        <span class="booking-field-label">Date of Journey</span>
                        <span class="booking-field-val">${booking.travelDate}</span>
                    </div>
                    <div>
                        <span class="booking-field-label">Passenger Name</span>
                        <span class="booking-field-val">${booking.passengerName}</span>
                    </div>
                    <div>
                        <span class="booking-field-label">Seat / Coach</span>
                        <span class="booking-field-val">${booking.seatNumber || (booking.coach + '-12')} (${booking.coach})</span>
                    </div>
                    <div>
                        <span class="booking-field-label">Fare Paid</span>
                        <span class="booking-field-val">₹${(booking.totalAmount || 0).toLocaleString()}</span>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; border-top: 1px solid #e2e8f0; padding-top: 0.75rem;">
                    ${!isCancelled ? `<button class="btn btn-sm btn-danger" onclick="cancelTicketFromList(${booking.bookingId})">Cancel Ticket</button>` : ''}
                    <button class="btn btn-sm btn-primary" onclick='displayTicket(${JSON.stringify(booking)})'>View Full Ticket</button>
                </div>
            </div>
        `;
    } catch (err) {
        resultBox.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
    }
}

/* ========================================================
   MY BOOKINGS & TICKET CANCELLATION
   ======================================================== */
async function loadUserBookings() {
    const listEl = document.getElementById("bookingsList");
    listEl.innerHTML = "<p style='color: var(--text-muted);'>Loading bookings...</p>";

    try {
        const url = currentUser 
            ? `${API_BASE_URL}/api/bookings/user/${currentUser.id}`
            : `${API_BASE_URL}/api/bookings`;

        const res = await fetch(url);
        const bookings = await res.json();

        if (!bookings || bookings.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                    <p style="font-size: 1.1rem;">🎟️ You have no booked tickets yet.</p>
                    <button class="btn btn-primary mt-3" onclick="switchTab('search')">Book a Ticket Now</button>
                </div>
            `;
            return;
        }

        listEl.innerHTML = bookings.map(booking => {
            const isCancelled = booking.bookingStatus === "CANCELLED";
            const badgeClass = isCancelled ? "badge-danger" : "badge-success";
            const train = booking.train || {};

            return `
                <div class="booking-item-card">
                    <div class="booking-item-top">
                        <div>
                            <span class="booking-field-label">PNR NUMBER</span>
                            <span class="booking-pnr-tag">${booking.pnr}</span>
                        </div>
                        <span class="badge ${badgeClass}">${booking.bookingStatus}</span>
                    </div>

                    <div class="booking-item-body">
                        <div>
                            <span class="booking-field-label">Train</span>
                            <span class="booking-field-val">${train.trainNumber || ''} ${train.trainName || 'Express'}</span>
                        </div>
                        <div>
                            <span class="booking-field-label">Route</span>
                            <span class="booking-field-val">${train.sourceStation || ''} ➔ ${train.destinationStation || ''}</span>
                        </div>
                        <div>
                            <span class="booking-field-label">Journey Date</span>
                            <span class="booking-field-val">${booking.travelDate}</span>
                        </div>
                        <div>
                            <span class="booking-field-label">Passenger</span>
                            <span class="booking-field-val">${booking.passengerName}</span>
                        </div>
                        <div>
                            <span class="booking-field-label">Coach / Seat</span>
                            <span class="booking-field-val">${booking.seatNumber || booking.coach}</span>
                        </div>
                        <div>
                            <span class="booking-field-label">Amount</span>
                            <span class="booking-field-val">₹${(booking.totalAmount || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div class="booking-item-actions">
                        ${!isCancelled ? `<button class="btn btn-sm btn-outline-danger" onclick="cancelTicketFromList(${booking.bookingId})">Cancel Ticket</button>` : ''}
                        <button class="btn btn-sm btn-primary" onclick='displayTicket(${JSON.stringify(booking)})'>Print Ticket</button>
                    </div>
                </div>
            `;
        }).join("");
    } catch (err) {
        listEl.innerHTML = `<p style="color: red;">Failed to load bookings: ${err.message}</p>`;
    }
}

async function cancelTicketFromList(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking? Allocated seats will be released.")) {
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/bookings/cancel/${bookingId}`, {
            method: "PUT"
        });

        const data = await res.json();
        if (res.ok) {
            showToast("Booking cancelled successfully. Seats restored.");
            loadUserBookings();
            loadAllTrains();
        } else {
            showToast(data.error || "Failed to cancel booking.", "error");
        }
    } catch (err) {
        showToast("Error during cancellation: " + err.message, "error");
    }
}

/* ========================================================
   ADMIN PANEL: ADD TRAIN
   ======================================================== */
async function handleAddTrain(event) {
    event.preventDefault();

    const trainName = document.getElementById("adminTrainName").value.trim();
    const trainNumber = document.getElementById("adminTrainNumber").value.trim();
    const sourceStation = document.getElementById("adminSource").value.trim();
    const destinationStation = document.getElementById("adminDestination").value.trim();
    const departureTime = document.getElementById("adminDeparture").value.trim();
    const arrivalTime = document.getElementById("adminArrival").value.trim();
    const fare = parseFloat(document.getElementById("adminFare").value);
    const totalSeats = parseInt(document.getElementById("adminSeats").value, 10);
    const trainType = document.getElementById("adminType").value;

    const payload = {
        trainName,
        trainNumber,
        sourceStation,
        destinationStation,
        departureTime,
        arrivalTime,
        fare,
        totalSeats,
        availableSeats: totalSeats,
        trainType
    };

    try {
        const res = await fetch(`${API_BASE_URL}/api/trains/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showToast(`Train ${trainName} (${trainNumber}) added successfully!`);
            document.getElementById("addTrainForm").reset();
            loadAllTrains();
            switchTab("search");
        } else {
            showToast("Failed to add train.", "error");
        }
    } catch (err) {
        showToast("Error adding train: " + err.message, "error");
    }
}

/* ========================================================
   MODAL HELPERS & TOAST
   ======================================================== */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("show");
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("show");
}

window.onclick = function(event) {
    if (event.target.classList && event.target.classList.contains("modal")) {
        event.target.classList.remove("show");
    }
};

function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.style.background = (type === "error") ? "#c53030" : "#1e293b";
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}
