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

// --- ULTRA PREMIUM MAINTENANCE MODE ---
const statusRef = ref(db, 'site_status');
onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    
    if (data && data.isLive === false) {
        document.body.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;600;800&display=swap');
                
                body { 
                    margin: 0; padding: 0; 
                    background: linear-gradient(-45deg, #020617, #0f172a, #1e1b4b, #0f172a);
                    background-size: 400% 400%;
                    animation: gradientBG 15s ease infinite;
                    font-family: 'Outfit', sans-serif; 
                    height: 100vh; display: flex; 
                    justify-content: center; align-items: center; 
                    overflow: hidden; color: white;
                }

                /* Glassmorphism Card */
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 50px 40px;
                    border-radius: 30px;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    max-width: 450px; width: 90%;
                    position: relative; overflow: hidden;
                }

                /* Shine Effect on Card */
                .glass-card::before {
                    content: ''; position: absolute; top: 0; left: -100%;
                    width: 50%; height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent);
                    transform: skewX(-25deg);
                    animation: shine 6s infinite;
                }

                /* Double Ring Loader */
                .loader-container { position: relative; width: 100px; height: 100px; margin: 0 auto 30px; display: flex; justify-content: center; align-items: center; }
                .ring {
                    position: absolute; border-radius: 50%; border: 3px solid transparent;
                }
                .ring-1 {
                    width: 100%; height: 100%;
                    border-top: 3px solid #3b82f6; border-left: 3px solid #3b82f6;
                    animation: spin 2s linear infinite;
                }
                .ring-2 {
                    width: 70%; height: 70%;
                    border-bottom: 3px solid #ec4899; border-right: 3px solid #ec4899;
                    animation: spin-reverse 1.5s linear infinite;
                }
                .icon-center { font-size: 1.8rem; color: white; animation: pulse 2s ease-in-out infinite; }

                /* Typography */
                h1 { 
                    font-size: 2.2rem; margin: 0 0 10px; font-weight: 800; 
                    background: linear-gradient(to right, #fff, #94a3b8);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                p { color: #94a3b8; font-size: 1rem; line-height: 1.6; font-weight: 300; margin-bottom: 30px; }

                /* Progress Bar */
                .progress-wrapper {
                    width: 100%; height: 4px; background: rgba(255,255,255,0.1);
                    border-radius: 10px; overflow: hidden; margin-top: 20px;
                }
                .progress-bar {
                    width: 50%; height: 100%;
                    background: linear-gradient(90deg, #3b82f6, #ec4899);
                    animation: loading 2s ease-in-out infinite;
                    border-radius: 10px;
                }

                /* Animations */
                @keyframes gradientBG { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes spin-reverse { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 0.6; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } }
                @keyframes shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
                @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }

            </style>

            <div class="glass-card">
                <div class="loader-container">
                    <div class="ring ring-1"></div>
                    <div class="ring ring-2"></div>
                    <i class="fas fa-wrench icon-center"></i>
                </div>
                <h1>System Upgrade</h1>
                <p>We're crafting a better experience.<br>The portfolio is currently offline for scheduled maintenance.</p>
                
                <div style="font-size: 0.8rem; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">Restoring System...</div>
                <div class="progress-wrapper">
                    <div class="progress-bar"></div>
                </div>
            </div>
        `;

        // Ensure FontAwesome Loads
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
