// Theme Management
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
}
updateThemeIcon();

// Music Management
const musicToggle = document.getElementById('musicToggle');
const nasheemAudio = document.getElementById('nasheemAudio');
let musicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
        nasheemAudio.pause();
        musicPlaying = false;
        musicToggle.style.opacity = '0.5';
    } else {
        nasheemAudio.play().catch(() => {
            alert('Audio file not found. Please add nasheed.mp3 to your project folder.');
        });
        musicPlaying = true;
        musicToggle.style.opacity = '1';
    }
});

// Banner Upload
const bannerImage = document.getElementById('bannerImage');
const bannerUpload = document.getElementById('bannerUpload');

bannerImage.addEventListener('click', () => {
    bannerUpload.click();
});

bannerUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            bannerImage.innerHTML = `<img src="${event.target.result}" alt="Wedding Photo">`;
            localStorage.setItem('bannerImage', event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load saved banner
const savedBanner = localStorage.getItem('bannerImage');
if (savedBanner) {
    bannerImage.innerHTML = `<img src="${savedBanner}" alt="Wedding Photo">`;
}

// Editable Fields
document.querySelectorAll('[contenteditable="true"]').forEach(element => {
    element.addEventListener('blur', () => {
        localStorage.setItem(element.id, element.innerText);
        updateDisplayNames();
    });
});

// Load saved editable fields
document.querySelectorAll('[contenteditable="true"]').forEach(element => {
    const saved = localStorage.getItem(element.id);
    if (saved) {
        element.innerText = saved;
    }
});

// Update display names
function updateDisplayNames() {
    const groomName = document.getElementById('groomName').innerText;
    const brideName = document.getElementById('brideName').innerText;
    document.getElementById('displayGroomName').innerText = groomName;
    document.getElementById('displayBrideName').innerText = brideName;
}
updateDisplayNames();

// Save editable input fields
document.querySelectorAll('.editable-input').forEach(input => {
    input.addEventListener('change', () => {
        localStorage.setItem(input.id, input.value);
    });
});

// Load saved input fields
document.querySelectorAll('.editable-input').forEach(input => {
    const saved = localStorage.getItem(input.id);
    if (saved) {
        input.value = saved;
    }
});

// Set default wedding date (example: 28 July 2025)
if (!document.getElementById('weddingDate').value) {
    document.getElementById('weddingDate').value = '2025-07-28';
}

// Set default time
if (!document.getElementById('weddingTime').value) {
    document.getElementById('weddingTime').value = '18:00';
}

// Countdown Timer
function updateCountdown() {
    const weddingDate = new Date(document.getElementById('weddingDate').value);
    if (!weddingDate.getTime()) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }

    const now = new Date().getTime();
    const difference = weddingDate.getTime() - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
        document.getElementById('days').textContent = '🎉';
        document.getElementById('hours').textContent = 'The';
        document.getElementById('minutes').textContent = 'Big';
        document.getElementById('seconds').textContent = 'Day!';
    }
}

document.getElementById('weddingDate').addEventListener('change', updateCountdown);
setInterval(updateCountdown, 1000);
updateCountdown();

// RSVP Management
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const rsvpForm = document.getElementById('rsvpForm');
const cancelRsvp = document.getElementById('cancelRsvp');
const successMessage = document.getElementById('successMessage');

yesBtn.addEventListener('click', () => {
    rsvpForm.classList.remove('hidden');
    successMessage.classList.add('hidden');
    yesBtn.style.opacity = '0.5';
    noBtn.style.opacity = '1';
});

noBtn.addEventListener('click', () => {
    rsvpForm.classList.add('hidden');
    successMessage.classList.add('hidden');
    yesBtn.style.opacity = '1';
    noBtn.style.opacity = '0.5';
    
    // Store "Cannot Attend" response
    const rsvps = JSON.parse(localStorage.getItem('rsvps')) || [];
    rsvps.push({
        guestName: 'Guest - Cannot Attend',
        phoneNumber: 'N/A',
        attendingCount: 0,
        dietaryRestrictions: '',
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('rsvps', JSON.stringify(rsvps));
    
    alert('Thank you for letting us know. We appreciate your response!');
});

cancelRsvp.addEventListener('click', () => {
    rsvpForm.classList.add('hidden');
    document.getElementById('rsvpForm').reset();
    yesBtn.style.opacity = '1';
    noBtn.style.opacity = '1';
});

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const guestName = document.getElementById('guestName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const attendingCount = document.getElementById('attendingCount').value;
    const dietaryRestrictions = document.getElementById('dietaryRestrictions').value;
    
    // Store RSVP in localStorage
    const rsvps = JSON.parse(localStorage.getItem('rsvps')) || [];
    rsvps.push({
        guestName,
        phoneNumber,
        attendingCount,
        dietaryRestrictions,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('rsvps', JSON.stringify(rsvps));
    
    // Show success message
    rsvpForm.classList.add('hidden');
    successMessage.classList.remove('hidden');
    
    // Reset form
    document.getElementById('rsvpForm').reset();
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
        successMessage.classList.add('hidden');
        yesBtn.style.opacity = '1';
        noBtn.style.opacity = '1';
    }, 3000);
});

// View Venue Button
const viewVenueBtn = document.getElementById('viewVenueBtn');
viewVenueBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const venueAddress = document.getElementById('venueAddress').innerText;
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(venueAddress)}`;
    window.open(mapsUrl, '_blank');
});

// Share on WhatsApp
const shareWhatsApp = document.getElementById('shareWhatsApp');
shareWhatsApp.addEventListener('click', () => {
    const groomName = document.getElementById('groomName').innerText;
    const brideName = document.getElementById('brideName').innerText;
    const weddingDate = document.getElementById('weddingDate').value;
    const venueName = document.getElementById('venueName').innerText;
    
    const message = `🎉 You're Invited! 🎉\n\nThe wedding of\n${groomName} & ${brideName}\n\nDate: ${new Date(weddingDate).toLocaleDateString()}\nVenue: ${venueName}\n\nPlease join us on our special day!\n\nWith blessings of Allah ✨`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// Download as PDF
const downloadPDF = document.getElementById('downloadPDF');
downloadPDF.addEventListener('click', () => {
    const element = document.querySelector('.container');
    const opt = {
        margin: 10,
        filename: 'wedding-invitation.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
});

// Admin Dashboard
const adminAccessBtn = document.getElementById('adminAccessBtn');
const adminModal = document.getElementById('adminModal');
const closeAdmin = document.getElementById('closeAdmin');

// Access admin panel with keyboard shortcut (Press 'A' + 'D' + 'M' + 'I' + 'N' quickly)
let adminKeySequence = '';
document.addEventListener('keydown', (e) => {
    adminKeySequence += e.key.toUpperCase();
    if (adminKeySequence.includes('ADMIN')) {
        openAdminPanel();
        adminKeySequence = '';
    }
    if (adminKeySequence.length > 10) {
        adminKeySequence = adminKeySequence.slice(-5);
    }
});

function openAdminPanel() {
    adminModal.classList.remove('hidden');
    updateAdminDashboard();
}

closeAdmin.addEventListener('click', () => {
    adminModal.classList.add('hidden');
});

adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) {
        adminModal.classList.add('hidden');
    }
});

function updateAdminDashboard() {
    const rsvps = JSON.parse(localStorage.getItem('rsvps')) || [];
    const confirmedRsvps = rsvps.filter(r => r.attendingCount > 0);
    const totalGuests = confirmedRsvps.reduce((sum, r) => sum + parseInt(r.attendingCount), 0);
    
    document.getElementById('totalRsvps').textContent = rsvps.length;
    document.getElementById('confirmedCount').textContent = confirmedRsvps.length;
    document.getElementById('totalGuests').textContent = totalGuests;
    
    // Populate table
    const tableBody = document.getElementById('rsvpTableBody');
    tableBody.innerHTML = '';
    
    rsvps.forEach((rsvp, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rsvp.guestName}</td>
            <td>${rsvp.phoneNumber}</td>
            <td>${rsvp.attendingCount}</td>
            <td>${rsvp.dietaryRestrictions || '-'}</td>
            <td><button onclick="deleteRsvp(${index})">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteRsvp(index) {
    if (confirm('Are you sure you want to delete this RSVP?')) {
        const rsvps = JSON.parse(localStorage.getItem('rsvps')) || [];
        rsvps.splice(index, 1);
        localStorage.setItem('rsvps', JSON.stringify(rsvps));
        updateAdminDashboard();
    }
}

// Hijri Date Display
document.getElementById('hijriDay').addEventListener('change', updateHijriDisplay);
document.getElementById('hijriMonth').addEventListener('change', updateHijriDisplay);
document.getElementById('hijriYear').addEventListener('change', updateHijriDisplay);

function updateHijriDisplay() {
    const day = document.getElementById('hijriDay').value;
    const month = document.getElementById('hijriMonth').value;
    const year = document.getElementById('hijriYear').value;
    
    if (day && month && year) {
        const hijriDate = `${day} ${month} ${year}`;
        localStorage.setItem('hijriDate', hijriDate);
    }
}

// Load saved Hijri date
const savedHijriDate = localStorage.getItem('hijriDate');
if (savedHijriDate) {
    // Parse and set values
    const parts = savedHijriDate.split(' ');
    if (parts.length === 3) {
        document.getElementById('hijriDay').value = parts[0];
        document.getElementById('hijriMonth').value = parts[1];
        document.getElementById('hijriYear').value = parts[2];
    }
}

// Initialize
console.log('🎉 Muslim Wedding Invitation Web App Loaded Successfully!');
console.log('💡 Tip: Press A-D-M-I-N quickly to access the admin panel');
