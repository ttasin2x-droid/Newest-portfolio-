import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// --- 1. CLEAN PRELOADER ---
const preloaderHTML = `<div id="site-preloader" style="position:fixed; inset:0; background:#f8fafc; z-index:99999; display:flex; justify-content:center; align-items:center; transition:opacity 0.5s ease;"><div style="width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite;"></div><style>@keyframes spin { 100% { transform: rotate(360deg); } }</style></div>`;
if (!document.getElementById('site-preloader')) { document.body.insertAdjacentHTML('afterbegin', preloaderHTML); }

function removePreloader() { 
    if(typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 50 }); 
    const loader = document.getElementById('site-preloader');
    if(loader) { 
        loader.style.opacity = '0'; 
        setTimeout(() => loader.remove(), 500); 
    }
}
window.addEventListener('load', removePreloader);
setTimeout(removePreloader, 3000); // 3 second fallback

// --- 2. ADVANCED VISITOR TRACKING (Non-blocking) ---
if (!localStorage.getItem('admin_bypass')) {
    const visitRef = ref(db, 'site_stats/visits');
    runTransaction(visitRef, (currentVisits) => { return (currentVisits || 0) + 1; });

    if (!sessionStorage.getItem('logged_device')) {
        fetch('https://ipwho.is/')
            .then(res => res.json())
            .then(data => {
                const ua = navigator.userAgent;
                let deviceType = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ? "Mobile" : "Desktop";
                const success = data.success !== false;
                push(ref(db, 'visit_logs'), { 
                    ip: data.ip || 'Unknown', 
                    city: success ? data.city : 'Unknown', 
                    country: success ? data.country : 'Unknown', 
                    device_type: deviceType, 
                    time: new Date().toLocaleString() 
                });
                sessionStorage.setItem('logged_device', 'true');
            }).catch(console.error);
    }
}

// --- DYNAMIC DATA BINDING ---
const setTxt = (id, val) => { const el = document.getElementById(id); if(el && val) el.innerText = val; };
const setHref = (id, val) => { const el = document.getElementById(id); if(el && val) el.href = val; };

onValue(ref(db, 'site_content'), (snap) => {
    const d = snap.val();
    if(d) {
        if(d.hero) { setTxt('heroSubtitle', d.hero.subtitle); setTxt('heroTitle', d.hero.title); setTxt('heroDesc', d.hero.desc); }
        if(d.about) { setTxt('aboutTitle', d.about.title); setTxt('aboutSubtitle', d.about.subtitle); setTxt('aboutDesc', d.about.desc); setTxt('aboutLoc', d.about.location); setTxt('aboutPhone', d.about.phone); setTxt('aboutEmail', d.about.email); }
        if(d.links) { setHref('linkFB', d.links.fb); setHref('linkInsta', d.links.insta); setHref('linkWA', d.links.wa); }
    }
});

onValue(ref(db, 'hero'), snap => { if(snap.val()?.imageUrl) document.getElementById('dynamicHeroImg').src = snap.val().imageUrl; });
onValue(ref(db, 'profile'), snap => { if(snap.val()?.imageUrl) document.getElementById('dynamicProfileImg').src = snap.val().imageUrl; });

// --- PROJECTS / CREATIONS INJECTION ---
// Refactored to map DB data into modern project cards.
const creationsBar = document.getElementById('creationsBar');
if(creationsBar) { 
    onValue(ref(db, 'creations'), (snap) => { 
        const data = snap.val(); 
        if(data) {
            creationsBar.innerHTML = ""; 
            Object.values(data).reverse().forEach((item, index) => { 
                // NOTE: Using fallbacks for role/tools if they don't exist in your DB yet. Add them to Firebase!
                const role = item.role || "Front-End Developer";
                const tool = item.tool || "React / Web";
                const desc = item.desc || "A professional digital solution focused on user experience and clean design.";

                creationsBar.innerHTML += `
                <a href="${item.link}" target="_blank" class="glass-panel project-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="project-img-wrapper">
                        <img src="${item.image}" alt="${item.title} interface screenshot" loading="lazy">
                    </div>
                    <div class="project-info">
                        <h3>${item.title}</h3>
                        <p>${desc}</p>
                        <div class="project-meta">
                            <span class="badge-sm">${role}</span>
                            <span class="badge-sm">${tool}</span>
                        </div>
                    </div>
                </a>`; 
            }); 
        } 
    }); 
}

// --- GALLERY LOGIC ---
const galleryGrid = document.getElementById('galleryGrid');
let initialCount = 6; 
let visibleCount = initialCount;

if(galleryGrid) { 
    onValue(ref(db, 'home_works'), (snap) => { 
        const data = snap.val(); 
        galleryGrid.innerHTML = ""; 
        if(data) { 
            const images = Object.values(data).reverse(); 
            images.forEach((item, index) => { 
                galleryGrid.innerHTML += `
                <div class="gallery-item glass-panel" onclick="window.openLightboxFromURL('${item.url}')">
                    <img src="${item.url}" loading="lazy" alt="Gallery Work">
                    <div class="gallery-overlay"><i class="fas fa-expand"></i></div>
                </div>`; 
            }); 
            initGalleryLogic(); 
        } else {
            galleryGrid.innerHTML = "<p class='text-light text-center w-100'>No works currently available.</p>";
        }
    }); 
}

function initGalleryLogic() { 
    const items = document.querySelectorAll('.gallery-item'); 
    const moreBtn = document.getElementById("view-more-btn"); 
    items.forEach((item, i) => { if (i < initialCount) item.classList.add('visible'); }); 
    if(items.length > initialCount && moreBtn) moreBtn.style.display = 'inline-flex'; 
}

// --- GLOBAL UTILITY FUNCTIONS ---
window.loadMoreImages = () => { 
    const items = document.querySelectorAll('.gallery-item'); 
    let end = visibleCount + 3; 
    for (let i = visibleCount; i < end && i < items.length; i++) { 
        items[i].classList.add('visible'); 
    } 
    visibleCount = end; 
    if (visibleCount >= items.length) document.getElementById("view-more-btn").style.display = 'none'; 
    document.getElementById("view-less-btn").style.display = 'inline-flex'; 
}

window.viewLessImages = () => { 
    const items = document.querySelectorAll('.gallery-item'); 
    items.forEach((item, i) => { if (i >= initialCount) item.classList.remove('visible'); }); 
    visibleCount = initialCount; 
    document.getElementById("view-more-btn").style.display = 'inline-flex'; 
    document.getElementById("view-less-btn").style.display = 'none'; 
    document.getElementById('gallery').scrollIntoView({behavior: 'smooth'}); 
}

window.openLightboxFromURL = (url) => { 
    const lb = document.getElementById('lightbox'); 
    document.getElementById('lightbox-img').src = url; 
    lb.classList.add('active'); 
    document.body.style.overflow = 'hidden'; 
}

window.closeLightbox = (event) => { 
    if (event.target.id === 'lightbox' || event.target.tagName === 'I') { 
        document.getElementById('lightbox').classList.remove('active'); 
        document.body.style.overflow = 'auto'; 
    } 
}

window.openModal = (id) => { 
    document.getElementById(id).style.display = 'flex'; 
    document.body.style.overflow = 'hidden';
}
window.closeModal = (e, id) => { 
    if (e.target.id === id || e.target.tagName === 'BUTTON') { 
        document.getElementById(id).style.display = 'none'; 
        document.body.style.overflow = 'auto';
    } 
}

window.scrollToTop = () => { window.scrollTo({top: 0, behavior: 'smooth'}); }
window.onscroll = () => { 
    const btn = document.getElementById("backToTop"); 
    if(btn) btn.style.display = (window.scrollY > 400) ? "flex" : "none"; 
};
