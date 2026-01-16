import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyDNtkM7hLeIsD2HzWxQKJFH8fsXOVKrv18",
    authDomain: "tanvir-gallery-free.firebaseapp.com",
    databaseURL: "https://tanvir-gallery-free-default-rtdb.firebaseio.com",
    projectId: "tanvir-gallery-free",
    storageBucket: "tanvir-gallery-free.firebasestorage.app",
    messagingSenderId: "442605910126",
    appId: "1:442605910126:web:b89792cb6204a5b7eb0e7f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- SYSTEM MAINTENANCE CHECK (PROFESSIONAL ANIMATION) ---
const statusRef = ref(db, 'site_status');
onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    // Check if explicitly set to false (offline)
    if (data && data.isLive === false) {
        // Inject styles and HTML for the maintenance screen
        document.body.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
                body { margin: 0; padding: 0; background: #0f172a; font-family: 'Outfit', sans-serif; overflow: hidden; height: 100vh; display: flex; justify-content: center; align-items: center; }
                .m-container { text-align: center; position: relative; z-index: 10; padding: 20px; }
                
                /* Icon Animation */
                .gear-wrapper {
                    position: relative; width: 120px; height: 120px; margin: 0 auto 30px;
                    display: flex; justify-content: center; align-items: center;
                }
                .gear-icon {
                    font-size: 5rem; color: #3b82f6; 
                    animation: spin 4s linear infinite;
                    z-index: 2; filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
                }
                .glow-effect {
                    position: absolute; width: 100%; height: 100%;
                    background: rgba(59, 130, 246, 0.15); border-radius: 50%;
                    filter: blur(20px); animation: pulse 2.5s ease-in-out infinite;
                    z-index: 1;
                }

                /* Text Styling */
                h1 { color: white; font-size: 2.5rem; margin: 0 0 10px; font-weight: 700; letter-spacing: 1px; }
                p { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin: 0; }
                .status-badge {
                    display: inline-block; margin-top: 25px; padding: 8px 20px;
                    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50px; color: #60a5fa; font-size: 0.9rem; font-weight: 600;
                    letter-spacing: 0.5px;
                }

                /* Keyframes */
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } }
            </style>

            <div class="m-container">
                <div class="gear-wrapper">
                    <div class="glow-effect"></div>
                    <i class="fas fa-cog gear-icon"></i>
                </div>
                <h1>System Under Maintenance</h1>
                <p>We are currently upgrading the portfolio to serve you better.<br>Please check back shortly.</p>
                <div class="status-badge">● Status: Offline</div>
            </div>
        `;
        
        // Ensure FontAwesome is loaded if it was removed with body replacement
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
        }
    }
});

// --- DYNAMIC CONTENT LOADING ---

// 1. Dynamic Hero & Profile
onValue(ref(db, 'hero'), (snap) => { if(snap.val()?.imageUrl) document.getElementById('dynamicHeroImg').src = snap.val().imageUrl; });
onValue(ref(db, 'profile'), (snap) => { if(snap.val()?.imageUrl) document.getElementById('dynamicProfileImg').src = snap.val().imageUrl; });

// 2. Home Works
const galleryGrid = document.getElementById('galleryGrid');
if(galleryGrid) { 
    onValue(ref(db, 'home_works'), (snap) => {
        const data = snap.val();
        galleryGrid.innerHTML = "";
        if(data) {
            const images = Object.values(data).reverse();
            images.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = "gallery-item"; 
                
                div.setAttribute('data-aos', 'fade-up');
                div.setAttribute('data-aos-delay', (index % 4) * 150); 
                
                div.setAttribute('onclick', `window.openLightboxFromURL('${item.url}')`);
                div.innerHTML = `<img src="${item.url}" loading="lazy"><div class="overlay"><i class="fas fa-expand"></i></div>`;
                galleryGrid.appendChild(div);
            });
            initGalleryLogic();
            setTimeout(() => { if(typeof AOS !== 'undefined') AOS.refreshHard(); }, 600);
        }
    });
}

// 3. Dynamic SDGs
const sdgGrid = document.getElementById('sdgGrid');
if(sdgGrid) { 
    onValue(ref(db, 'sdgs'), (snap) => {
        const data = snap.val();
        sdgGrid.innerHTML = "";
        if(data) Object.values(data).reverse().forEach((item, index) => {
            sdgGrid.innerHTML += `
                <a href="${item.link}" target="_blank" class="sdg-card" data-aos="fade-up" data-aos-delay="${(index % 3) * 100}">
                    <div class="sdg-img"><img src="${item.image}"></div>
                    <div class="sdg-text"><h3>${item.title}</h3></div>
                </a>`;
        });
    });
}

// --- UI LOGIC & FUNCTIONS ---

window.openLightboxFromURL = (url) => {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = url;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.openModal = (modalId) => { 
    document.getElementById(modalId).style.display = 'flex'; 
}

window.closeModal = (event, modalId) => { 
    if (event.target.id === modalId || event.target.tagName === 'BUTTON') {
        document.getElementById(modalId).style.display = 'none'; 
    }
}

const initialCount = 4;
let visibleCount = initialCount;

function initGalleryLogic() {
    const items = document.querySelectorAll('.gallery-item');
    const moreBtn = document.getElementById("view-more-btn");
    for (let i = 0; i < items.length; i++) { if (i < initialCount) items[i].classList.add('visible'); }
    if(items.length > initialCount && moreBtn) moreBtn.style.display = 'inline-flex';
}
window.initGalleryLogic = initGalleryLogic;

// --- FIXED LOAD MORE FUNCTION ---
window.loadMoreImages = () => {
    const items = document.querySelectorAll('.gallery-item');
    let end = visibleCount + 4;
    let delay = 0;
    
    for (let i = visibleCount; i < end && i < items.length; i++) {
        items[i].removeAttribute('data-aos');
        items[i].removeAttribute('data-aos-delay'); 
        
        setTimeout(() => {
            items[i].classList.add('visible');
            items[i].classList.add('animate-custom');
        }, delay);
        delay += 150;
    }
    
    visibleCount = end;
    const moreBtn = document.getElementById("view-more-btn");
    const lessBtn = document.getElementById("view-less-btn");
    
    if (visibleCount >= items.length) moreBtn.style.display = 'none';
    lessBtn.style.display = 'inline-flex';
}

window.viewLessImages = () => {
    const items = document.querySelectorAll('.gallery-item');
    for (let i = initialCount; i < items.length; i++) {
        items[i].classList.remove('visible');
        items[i].classList.remove('animate-custom');
    }
    visibleCount = initialCount;
    document.getElementById("view-more-btn").style.display = 'inline-flex';
    document.getElementById("view-less-btn").style.display = 'none';
    document.getElementById('my-works').scrollIntoView({behavior: 'smooth'});
}

window.goToPage = (url) => { 
    document.getElementById('pageTransition').classList.add('active'); 
    setTimeout(() => { window.location.href = url; }, 500); 
}

window.closeLightbox = (event) => { 
    if (event.target.id === 'lightbox' || event.target.tagName === 'I') { 
        document.getElementById('lightbox').classList.remove('active'); 
        document.body.style.overflow = 'auto'; 
    } 
}

window.scrollToTop = () => { 
    window.scrollTo({top: 0, behavior: 'smooth'}); 
}

// --- INITIALIZATION ---
window.onload = function() { 
    createSoftSnowfall(); 
    if(typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true }); 
};

window.onscroll = function() { 
    const btn = document.getElementById("backToTop"); 
    if(btn) btn.style.display = (window.scrollY > 300) ? "flex" : "none"; 
};

function createSoftSnowfall() {
    const container = document.getElementById('weather-container');
    if(!container) return;
    for (let i = 0; i < 35; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake'); flake.innerHTML = '❄';
        flake.style.left = Math.random() * 100 + 'vw';
        flake.style.animationDuration = `${Math.random() * 10 + 5}s, ${Math.random() * 4 + 3}s`;
        flake.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(flake);
    }
    setTimeout(() => { container.style.opacity = '0'; }, 6000);
}
