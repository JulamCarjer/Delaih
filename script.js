// ==========================================
// 1. ELEMEN HTML UTAMA
// ==========================================
const canvas = document.getElementById('preview-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// Form & Inputs
const frameStyleSelect = document.getElementById('quick-frame-select');
const cameraModelInput = document.getElementById('input-camera-model');
const focalInput = document.getElementById('exif-focal');
const apertureInput = document.getElementById('exif-aperture');
const shutterInput = document.getElementById('exif-shutter');
const isoInput = document.getElementById('exif-iso');
const dateInput = document.getElementById('input-date');
const authorInput = document.getElementById('input-author');
const frameColorPicker = document.getElementById('frame-color-picker');
const barHeightSlider = document.getElementById('bar-height-slider');
const exifStatus = document.getElementById('exif-status');

// Logo Element UI
const selectedLogoPreview = document.getElementById('selected-logo-preview');
const selectedLogoTitle = document.getElementById('selected-logo-title');
const logoGridMenu = document.getElementById('logo-grid-menu');

// Variable Global Utama
let loadedImage = null;
let currentStyleType = 'type-1'; // Menyimpan tipe layout template aktif
let currentLogoImg = new Image();
currentLogoImg.crossOrigin = "anonymous";
currentLogoImg.src = "kamera/Sony.svg";

// ==============================================================================================================================================================================================
// 2. MOCKUP TEMPLATE GRID (DATA)
// ==============================================================================================================================================================================================
const mockupTemplates = [{
        id: '1',
        styleType: 'type-1', // Layout 1: Logo Kiri, EXIF Kanan
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'F4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA',
        author: 'Julam Carjer',
        date: '2026.08.09'
    },
    {
        id: '2',
        styleType: 'type-2', // Layout 2: Logo Tengah, EXIF Tengah
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4  1/125s  ISO400  23.5mm',
        camera: 'YASHICA',
        author: 'Julam Carjer',
        date: '2026.08.09'
    },
    {
        id: '3',
        styleType: 'type-3', // Layout 3: Logo Kanan, EXIF Kiri
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4  1/125s  ISO400  23.5mm',
        camera: 'YASHICA',
        author: 'Julam Carjer',
        date: '2026.08.09'
    },
    {
        id: '4',
        styleType: 'type-4', // Layout 4: Tanpa Frame (Direct Watermark)
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA',
        author: 'Julam Carjer',
        date: '2026.08.09'
    },
    {
        id: '5',
        styleType: 'type-5', // Layout 5: Background Blur Frame
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA',
        author: 'Julam Carjer',
        date: '2026.08.09'
    },
    {
        id: '6',
        styleType: 'type-6', // Layout 6: Frame Tebal Polaroid
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA',
        author: 'Julam Carjer',
        date: '2026.08.09'
    },
    {
        id: '7',
        styleType: 'type-7',
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA',
        author: 'Julam Carjer',
        date: '2026.08.09'
    },
    {
        id: '8',
        styleType: 'type-8',
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA',
        author: 'Julam Carjer',
        date: '2026.08.09'
    },
    {
        id: '9',
        styleType: 'type-9',
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA',
        author: 'Julam Carjer',
        date: '2026.08.09'
    }
];


// ==============================================================================================================================================================================================
// 3. RENDER TEMPLATE GRID
// ==============================================================================================================================================================================================
function renderTemplateGrid() {
    const gridContainer = document.getElementById('template-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    mockupTemplates.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'frame-card-mockup';
        card.onclick = () => selectTemplateCard(item);

        const canvasId = `mockup-canvas-${index}`;
        card.innerHTML = `<canvas id="${canvasId}" class="mockup-canvas"></canvas>`;

        gridContainer.appendChild(card);
        drawMockupCanvas(canvasId, item);
    });
}

function drawMockupCanvas(canvasId, templateData) {
    const miniCanvas = document.getElementById(canvasId);
    if (!miniCanvas) return;
    const miniCtx = miniCanvas.getContext('2d');

    const img = new Image();
    const logoImg = new Image();
    img.crossOrigin = "anonymous";
    logoImg.crossOrigin = "anonymous";

    let imagesLoaded = 0;
    const totalImages = 2;

    function onImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            renderGenericFrame(
                miniCanvas,
                miniCtx,
                img,
                logoImg,
                templateData.styleType,
                templateData.exif,
                templateData.camera,
                templateData.author,
                templateData.date,
                true
            );
        }
    }

    img.onload = onImageLoad;
    logoImg.onload = onImageLoad;
    img.onerror = onImageLoad;
    logoImg.onerror = onImageLoad;

    img.src = templateData.photo;
    logoImg.src = templateData.logo;
}




// ==============================================================================================================================================================================================
// 7. PEMILIHAN TEMPLATE & TAB SWITCHER(KLIK GESER)
// ==============================================================================================================================================================================================
function selectTemplateCard(template) {
    currentStyleType = template.styleType || 'type-1';

    if (frameStyleSelect) {
        frameStyleSelect.value = currentStyleType;
    }

    switchTab('edit');
    selectLogo(template.camera, template.logo);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function() {
        loadedImage = img;
        updateCanvas();
    };
    img.onerror = function() {
        console.error("Gagal memuat gambar template:", template.photo);
        alert("Gagal memuat gambar template. Pastikan file ada di folder Foto/ !");
    };
    img.src = template.photo;
}

function switchTab(tabName) {
    const tabTemplate = document.getElementById('tab-template');
    const tabEdit = document.getElementById('tab-edit');
    const btnTemplate = document.getElementById('btn-tab-template');
    const btnEdit = document.getElementById('btn-tab-edit');

    if (tabName === 'template') {
        if (tabTemplate) tabTemplate.classList.remove('hidden');
        if (tabEdit) tabEdit.classList.add('hidden');
        if (btnTemplate) btnTemplate.classList.add('active');
        if (btnEdit) btnEdit.classList.remove('active');
    } else {
        if (tabTemplate) tabTemplate.classList.add('hidden');
        if (tabEdit) tabEdit.classList.remove('hidden');
        if (btnTemplate) btnTemplate.classList.add('active');
        if (btnEdit) btnEdit.classList.remove('active');
    }
}






// ==============================================================================================================================================================================================
// 6. EXIF & UPLOAD FOTO
// ==============================================================================================================================================================================================
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (exifStatus) exifStatus.innerText = "Reading EXIF...";

    try {
        EXIF.getData(file, function() {
            const focal = EXIF.getTag(this, "FocalLength");
            if (focalInput) focalInput.value = focal ? `${Math.round(focal)}mm` : "23.5mm";

            const fNum = EXIF.getTag(this, "FNumber");
            if (apertureInput) apertureInput.value = fNum ? `f/${Number(fNum).toFixed(1)}` : "f/2.8";

            const expTime = EXIF.getTag(this, "ExposureTime");
            if (shutterInput) {
                shutterInput.value = expTime ? (expTime < 1 ? `1/${Math.round(1 / expTime)}s` : `${expTime}s`) : "1/125s";
            }

            const iso = EXIF.getTag(this, "ISOSpeedRatings");
            if (isoInput) isoInput.value = iso ? `ISO ${iso}` : "ISO 400";

            const model = EXIF.getTag(this, "Model");
            if (model && cameraModelInput) {
                cameraModelInput.value = model.toUpperCase();
            }

            if (exifStatus) exifStatus.innerText = "EXIF Data loaded.";
        });
    } catch (error) {
        if (exifStatus) exifStatus.innerText = "EXIF library missing.";
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            loadedImage = img;
            switchTab('edit');
            updateCanvas();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}



// ==============================================================================================================================================================================================
// 8. SWITCHTAB (GESER TAB)
// ==============================================================================================================================================================================================
function switchTab(tabName) {
    const tabTemplate = document.getElementById('tab-template');
    const tabEdit = document.getElementById('tab-edit');
    const btnTemplate = document.getElementById('btn-tab-template');
    const btnEdit = document.getElementById('btn-tab-edit');

    if (tabName === 'template') {
        if (tabTemplate) tabTemplate.classList.remove('hidden');
        if (tabEdit) tabEdit.classList.add('hidden');
        if (btnTemplate) btnTemplate.classList.add('active');
        if (btnEdit) btnEdit.classList.remove('active');
    } else {
        if (tabTemplate) tabTemplate.classList.add('hidden');
        if (tabEdit) tabEdit.classList.remove('hidden');
        if (btnEdit) btnEdit.classList.add('active');
        if (btnTemplate) btnTemplate.classList.remove('active');
    }
}


// ==============================================================================================================================================================================================
// 9. LOGO SELECTION LOGIC
// ==============================================================================================================================================================================================
function toggleLogoDropdown() {
    if (logoGridMenu) logoGridMenu.classList.toggle('hidden');
}

function selectLogo(brandName, logoPath) {
    if (selectedLogoPreview) selectedLogoPreview.src = logoPath;
    if (selectedLogoTitle) selectedLogoTitle.innerText = `${brandName} Logo Selected`;

    currentLogoImg = new Image();
    currentLogoImg.crossOrigin = "anonymous";
    currentLogoImg.onload = () => {
        // Redraw canvas utama saat logo berubah
        updateCanvas();
    };
    currentLogoImg.src = logoPath;

    // Paksakan update jika gambar sudah cache
    if (currentLogoImg.complete) {
        updateCanvas();
    }

    if (logoGridMenu) logoGridMenu.classList.add('hidden');
}

function handleCustomLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        if (selectedLogoPreview) selectedLogoPreview.src = e.target.result;
        if (selectedLogoTitle) selectedLogoTitle.innerText = "Custom Logo Selected";

        currentLogoImg = new Image();
        currentLogoImg.onload = () => {
            updateCanvas();
        };
        currentLogoImg.src = e.target.result;

        if (logoGridMenu) logoGridMenu.classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

// Helper Controls
function setQuickColor(hex) {
    if (frameColorPicker) frameColorPicker.value = hex;
    updateCanvas();
}

// Fungsi ini dipanggil saat pengguna mengubah dropdown di Menu Edit
function changeFrameStyle(selectedStyle) {
    if (selectedStyle) {
        currentStyleType = selectedStyle; // Update tipe style global
    } else {
        const frameSelect = document.getElementById('quick-frame-select');
        if (frameSelect) {
            currentStyleType = frameSelect.value;
        }
    }

    // Refresh tampilan Canvas dengan style baru
    updateCanvas();
}


// Helper Contrast Color
function getContrastColor(hexColor) {
    if (!hexColor || hexColor.length < 6) return '#000000';
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
}



// ==============================================================================================================================================================================================
// 10. EXIF & UPLOAD FOTO
// ==============================================================================================================================================================================================
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (exifStatus) exifStatus.innerText = "Reading EXIF...";

    // Logika pembacaan EXIF (Asumsi pustaka EXIF sudah dimuat di HTML)
    try {
        EXIF.getData(file, function() {
            const focal = EXIF.getTag(this, "FocalLength");
            if (focalInput) focalInput.value = focal ? `${Math.round(focal)}mm` : "23.5mm";

            const fNum = EXIF.getTag(this, "FNumber");
            if (apertureInput) apertureInput.value = fNum ? `f/${Number(fNum).toFixed(1)}` : "f/2.8";

            const expTime = EXIF.getTag(this, "ExposureTime");
            if (shutterInput) {
                shutterInput.value = expTime ? (expTime < 1 ? `1/${Math.round(1 / expTime)}s` : `${expTime}s`) : "1/125s";
            }

            const iso = EXIF.getTag(this, "ISOSpeedRatings");
            if (isoInput) isoInput.value = iso ? `ISO ${iso}` : "ISO 400";

            const model = EXIF.getTag(this, "Model");
            if (model && cameraModelInput) {
                cameraModelInput.value = model.toUpperCase();
            }

            if (exifStatus) exifStatus.innerText = "EXIF Data loaded.";
        });
    } catch (error) {
        console.error("EXIF library not found or error reading EXIF.");
        if (exifStatus) exifStatus.innerText = "EXIF library missing.";
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            loadedImage = img;
            // Pindah tab dan redraw
            switchTab('edit');
            updateCanvas();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// ====================================================================================================================
// 11. DRAWING CANVAS UTAMA (MENU EDIT)
// ====================================================================================================================
function updateCanvas() {
    if (!canvas || !ctx || !loadedImage) return;

    // 1. Murni data EXIF (HAPUS dateInput dari sini)
    const exifString = [
        focalInput ? focalInput.value : '',
        apertureInput ? apertureInput.value : '',
        shutterInput ? shutterInput.value : '',
        isoInput ? isoInput.value : ''
    ].filter(Boolean).join('  |  ');

    const cameraStr = cameraModelInput ? cameraModelInput.value : '';
    const authorStr = authorInput ? authorInput.value : '';
    const dateStr = dateInput ? dateInput.value : ''; // Tanggal dikirim terpisah di sini

    renderGenericFrame(
        canvas,
        ctx,
        loadedImage,
        currentLogoImg,
        currentStyleType,
        exifString,
        cameraStr,
        authorStr,
        dateStr,
        false
    );
}

// ============================================================================================================================================================================================================================================================
// 12. FUNGSI GENERIK RENDER FRAME (UTAMA & PREVIEW)
// ============================================================================================================================================================================================================================================================
function renderGenericFrame(canvas, ctx, img, logoImg, styleType, exifString, cameraStr, authorStr, dateStr, isPreview) {
    if (!canvas || !ctx || !img) return;

    // Paksa styleType menjadi string dan lowercase agar pengecekan aman
    const activeStyle = String(styleType || 'type-1').toLowerCase();
    const baseDimension = Math.min(img.width, img.height);

    // 1. AMBIL NILAI WARNA & SLIDER
    const bgColor = (typeof frameColorPicker !== 'undefined' && frameColorPicker) ? frameColorPicker.value : '#ffffff';
    const textColor = getContrastColor(bgColor);

    const textSizeSlider = document.getElementById('text-size-slider');
    const logoSizeSlider = document.getElementById('logo-size-slider');
    const barHeightSlider = document.getElementById('bar-height-slider');

    const textScale = (textSizeSlider ? textSizeSlider.value : 100) / 100;
    const logoScale = (logoSizeSlider ? logoSizeSlider.value : 100) / 100;
    const barFactor = (barHeightSlider ? barHeightSlider.value : 60) / 100;

    // 2. HITUNG DIMENSI BORDER
    let borderRatio = 0.05;
    let barRatio = 0.20;

    if (['type-6', 't6', 'polaroid-thick', 'type6'].includes(activeStyle)) {
        borderRatio = 0.08;
        barRatio = 0.25;
    } else if (['type-4', 't4', 'no-frame', 'type4'].includes(activeStyle)) {
        borderRatio = 0;
        barRatio = 0;
    }

    const borderSide = Math.round(img.width * borderRatio);
    const borderBottom = Math.round(img.height * barRatio * barFactor);

    // Dapatkan Aspect Ratio Logo
    let logoAspect = 2;
    if (logoImg && logoImg.naturalHeight > 0) {
        logoAspect = logoImg.naturalWidth / logoImg.naturalHeight;
    }

    // Teks Gabungan untuk EXIF + Shot By + Date
    const fullSubText = [
        exifString,
        authorStr ? `Shot by ${authorStr}` : '',
        dateStr
    ].filter(Boolean).join('   ');

    // Ukuran Font Dasar
    const baseFontSize = Math.round((borderSide > 0 ? borderSide : baseDimension * 0.05) * 0.50 * textScale);
    const smallFontSize = Math.round(baseFontSize * 0.85);
    const cameraFontSize = Math.round(baseFontSize * 1.8);



    // =========================================================================
    // LAYOUT 1: LOGO KIRI, EXIF KANAN
    // =========================================================================
    if (['type-1', 't1', 'classic-left', 'type1'].includes(activeStyle)) {
        canvas.width = img.width + (borderSide * 2);
        canvas.height = img.height + borderSide + borderBottom;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, borderSide, borderSide, img.width, img.height);

        const yCenter = canvas.height - (borderBottom / 2);
        const xLeft = borderSide + 15;
        const xRight = canvas.width - borderSide - 15;


        const pureExifText = [
            focalInput ? focalInput.value : '',
            apertureInput ? apertureInput.value : '',
            shutterInput ? shutterInput.value : '',
            isoInput ? isoInput.value : ''
        ].filter(Boolean).join('  |  ');

        // 2. Teks Baris Bawah: Shot By & Tanggal Dipisah
        const authorClean = authorStr ? authorStr.replace(/^Shot by\s+/i, '') : ''; // Cegah kata "Shot by" ganda
        const subTextParts = [];

        if (authorClean) subTextParts.push(`Shot by ${authorClean}`);
        if (dateStr) subTextParts.push(dateStr);

        const subDetailsText = subTextParts.join('   •   '); // Pembatas antara Author dan Tanggal

        // --- CONTOH PENATAN PADA CANVAS (Rata Kanan) ---
        ctx.textAlign = "right";

        // BARIS 1: EXIF (Agak ke atas dari titik tengah)
        ctx.textBaseline = "bottom";
        ctx.fillStyle = textColor;
        ctx.font = `500 ${baseFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(pureExifText, xRight, yCenter - 30);

        // BARIS 2: Shot By & Tanggal (Agak ke bawah dari titik tengah)
        const smallFontSize = Math.round(baseFontSize * 0.85);
        ctx.textBaseline = "top";
        ctx.fillStyle = textColor === '#ffffff' ? '#cccccc' : '#424242'; // Warna lebih soft
        ctx.font = `400 ${smallFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(subDetailsText, xRight, yCenter + 40);

        // Logo Kiri
        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            const logoH = Math.round(borderBottom * 0.35 * logoScale);
            const logoW = Math.round(logoH * logoAspect);
            ctx.drawImage(logoImg, xLeft, yCenter - (logoH / 2), logoW, logoH);

            const typeFontSize = Math.round(baseDimension * 0.05 * textScale);
            ctx.fillStyle = textColor;
            ctx.font = `500 ${typeFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.textBaseline = "top";
            ctx.fillText(cameraStr || 'EZ W-501L', panelXCenter, logoY + logoHeight + 1);

        }


    }

    // =========================================================================
    // LAYOUT 2: LOGO TENGAH, EXIF TENGAH
    // =========================================================================
    else if (['type-2', 't2', 'centered', 'type2'].includes(activeStyle)) {
        canvas.width = img.width + (borderSide * 2);
        canvas.height = img.height + borderSide + borderBottom;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, borderSide, borderSide, img.width, img.height);

        const yCenter = canvas.height - (borderBottom / 2);
        const xCenter = canvas.width / 2;

        // A. Olah Teks Agar Tidak Dobel
        const pureExifText = exifString || '';
        const authorClean = authorStr ? authorStr.replace(/^Shot by\s+/i, '') : '';

        const subParts = [];
        if (authorClean) subParts.push(`Shot by ${authorClean}`);
        if (dateStr) subParts.push(dateStr);
        const subDetailsText = subParts.join('   •   '); // Pembatas titik tengah

        // Logo 
        const logoH = Math.round(borderBottom * 0.28 * logoScale);
        const logoW = Math.round(logoH * logoAspect);

        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            // Logo digeser agak ke atas
            ctx.drawImage(logoImg, xCenter - (logoW / 2), yCenter - logoH - 10, logoW, logoH);
        }

        ctx.textAlign = "center";

        // C. BARIS 1: EXIF (Di Tengah)
        ctx.textBaseline = "top";
        ctx.fillStyle = textColor;
        ctx.font = `500 ${baseFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(pureExifText, xCenter, yCenter + 50);

        // D. BARIS 2: Shot By & Tanggal (Di Bawah EXIF)
        const smallFontSize = Math.round(baseFontSize * 0.85);
        ctx.fillStyle = textColor === '#ffffff' ? '#cccccc' : '#424242'; // Warna sedikit lebih soft
        ctx.font = `400 ${smallFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(subDetailsText, xCenter, yCenter + baseFontSize + 80);
    }


    // =========================================================================
    // LAYOUT 3: LOGO KANAN, EXIF KIRI
    // =========================================================================
    else if (['type-3', 't3', 'classic-right', 'type3'].includes(activeStyle)) {
        canvas.width = img.width + (borderSide * 2);
        canvas.height = img.height + borderSide + borderBottom;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, borderSide, borderSide, img.width, img.height);

        const yCenter = canvas.height - (borderBottom / 2);
        const xLeft = borderSide + 15;
        const xRight = canvas.width - borderSide - 15;

        const pureExifText = [
            focalInput ? focalInput.value : '',
            apertureInput ? apertureInput.value : '',
            shutterInput ? shutterInput.value : '',
            isoInput ? isoInput.value : ''
        ].filter(Boolean).join('   |   ');

        // Baris 2: Shot By dan Tanggal Dipisah Pembatas
        const authorClean = authorStr ? authorStr.replace(/^Shot by\s+/i, '') : '';
        const subParts = [];
        if (authorClean) subParts.push(`Shot by ${authorClean}`);
        if (dateStr) subParts.push(dateStr);
        const subDetailsText = subParts.join('   •   ');

        // 2. GAMBAR TEKS KIRI (2 BARIS VERTIKAL)
        ctx.textAlign = "left";

        // BARIS 1: EXIF (Di atas garis tengah)
        ctx.textBaseline = "bottom";
        ctx.fillStyle = textColor;
        ctx.font = `500 ${baseFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(pureExifText, xLeft, yCenter - 20);

        // BARIS 2: Shot By & Tanggal (Di bawah garis tengah)
        const smallFontSize = Math.round(baseFontSize * 0.85);
        ctx.textBaseline = "top";
        ctx.fillStyle = textColor === '#ffffff' ? '#cccccc' : '#424242';
        ctx.font = `400 ${smallFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(subDetailsText, xLeft, yCenter + 50);

        // 3. GAMBAR LOGO KANAN (Pas di tengah vertikal)
        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            const logoH = Math.round(borderBottom * 0.35 * logoScale);
            const logoW = Math.round(logoH * logoAspect);
            ctx.drawImage(logoImg, xRight - logoW, yCenter - (logoH / 2), logoW, logoH);
        }
    }

    // =========================================================================
    // LAYOUT 4: TANPA FRAME (Direct Watermark ke Atas Foto)
    // =========================================================================
    else if (['type-4', 't4', 'no-frame', 'type4'].includes(activeStyle)) {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const padding = Math.round(baseDimension * 0.04);
        const xLeft = padding;
        const yBottom = canvas.height - padding;

        // Olah Teks
        const cameraText = cameraStr ? `${cameraStr.toUpperCase()}  |  ` : '';
        const line1Exif = `${cameraText}${exifString || ''}`;

        const authorClean = authorStr ? authorStr.replace(/^Shot by\s+/i, '') : '';
        const subParts = [];
        if (authorClean) subParts.push(`Shot by ${authorClean}`);
        if (dateStr) subParts.push(dateStr);
        const line2Details = subParts.join('   •   ');

        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 8;
        ctx.textAlign = "left";

        // BARIS 1: Nama Kamera + EXIF (Di atas)
        ctx.textBaseline = "bottom";
        ctx.fillStyle = '#ffffff';
        ctx.font = `500 ${baseFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(line1Exif, xLeft, yBottom - smallFontSize - 6);

        // BARIS 2: Shot By & Tanggal (Di bawah)
        ctx.textBaseline = "bottom";
        ctx.fillStyle = '#dddddd';
        ctx.font = `400 ${smallFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(line2Details, xLeft, yBottom - smallFontSize + 90);

        ctx.restore();
    }

    // =========================================================================
    // LAYOUT 5: FRAME BLUR BACKGROUND
    // =========================================================================
    else if (['type-5', 't5', 'blur-frame', 'type5'].includes(activeStyle)) {
        const sideBlur = Math.round(baseDimension * 0.06);
        const bottomBlur = Math.round(baseDimension * 0.15 * barFactor);

        canvas.width = img.width + (sideBlur * 2);
        canvas.height = img.height + sideBlur + bottomBlur;

        // Background Blur Foto
        ctx.save();
        ctx.filter = 'blur(25px) brightness(0.7)';
        ctx.drawImage(img, -20, -20, canvas.width + 40, canvas.height + 40);
        ctx.restore();

        // Foto Utama
        ctx.drawImage(img, sideBlur, sideBlur, img.width, img.height);

        const yCenter = canvas.height - (bottomBlur / 2);
        const xLeft = sideBlur + 15;
        const xRight = canvas.width - sideBlur - 15;

        // Olah Teks
        const cameraText = cameraStr ? `${cameraStr.toUpperCase()}  |  ` : '';
        const line1Exif = `${cameraText}${exifString || ''}`;

        const authorClean = authorStr ? authorStr.replace(/^Shot by\s+/i, '') : '';
        const subParts = [];
        if (authorClean) subParts.push(`Shot by ${authorClean}`);
        if (dateStr) subParts.push(dateStr);
        const line2Details = subParts.join('   •   ');

        ctx.textAlign = "left";

        // BARIS 1: Nama Kamera + EXIF
        ctx.textBaseline = "bottom";
        ctx.fillStyle = '#ffffff';
        ctx.font = `500 ${baseFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(line1Exif, xLeft, yCenter + 2);

        // BARIS 2: Shot By & Tanggal
        ctx.textBaseline = "top";
        ctx.fillStyle = '#cccccc';
        ctx.font = `400 ${smallFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.fillText(line2Details, xLeft, yCenter + 30);

        // Logo Kanan (Jika ada logo terpasang)
        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            const logoH = Math.round(bottomBlur * 0.35 * logoScale);
            const logoW = Math.round(logoH * logoAspect);
            ctx.drawImage(logoImg, xRight - logoW, yCenter - (logoH / 2), logoW, logoH);
        }
    }

    // =========================================================================
    // LAYOUT 6: FRAME TEBAL POLAROID
    // =========================================================================
    else if (['type-6', 't6', 'polaroid-clean', 'type6'].includes(activeStyle)) {
        const sideThick = Math.round(baseDimension * 0.08);
        const topThick = Math.round(baseDimension * 0.08);
        const bottomThick = Math.round(baseDimension * 0.22 * barFactor);

        canvas.width = img.width + (sideThick * 2);
        canvas.height = img.height + topThick + bottomThick;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = Math.round(baseDimension * 0.02);
        ctx.shadowOffsetY = Math.round(baseDimension * 0.01);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.drawImage(img, sideThick, topThick, img.width, img.height);

        ctx.save();
        ctx.beginPath();
        ctx.rect(sideThick, topThick, img.width, img.height);
        ctx.clip();

        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = Math.round(baseDimension * 0.015);
        ctx.shadowOffsetY = Math.round(baseDimension * 0.005);

        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        ctx.lineWidth = 10;
        ctx.strokeRect(sideThick, topThick, img.width, img.height);
        ctx.restore();
    }



    // =========================================================================
    // LAYOUT 7: SIDE PANEL VERTICAL EXIF (PRESISI SESUAI REFERENSI)
    // =========================================================================
    else if (['type-7', 't7', 'side-panel-v2', 'type7'].includes(activeStyle)) {
        // A. HITUNG RASIO DINAMIS SESUAI UKURAN FOTO
        // Lebar panel kanan otomatis 45% dari lebar foto asli
        const rightPanelWidth = Math.round(img.width * 0.45);

        // Total canvas menyesuaikan tinggi foto murni & menambahkan panel kanan
        canvas.width = img.width + rightPanelWidth;
        canvas.height = img.height;

        const baseDim = Math.min(canvas.width, canvas.height);

        // B. DRAW BACKGROUND PANEL KANAN & FOTO UTAMA
        ctx.fillStyle = bgColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Foto ditempatkan di sisi kiri murni tanpa margin (0,0)
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Titik tengah horizontal untuk teks di panel kanan
        const panelXCenter = img.width + (rightPanelWidth / 2);
        ctx.textAlign = "center";

        // ---------------------------------------------------------------------
        // 1. BLOK ATAS: LOGO KAMERA & TIPE KAMERA
        // ---------------------------------------------------------------------
        const logoY = Math.round(img.height * 0.08); // 8% dari atas
        const logoHeight = Math.round(img.height * 0.04 * (logoScale || 1));

        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            const logoW = Math.round(logoHeight * (logoAspect || 1.8));
            ctx.drawImage(logoImg, panelXCenter - (logoW / 2), logoY, logoW, logoHeight);
        }

        // Nama Tipe Kamera (di bawah logo)
        const typeFontSize = Math.round(baseDim * 0.025 * (textScale || 1));
        ctx.fillStyle = textColor || '#000000';
        ctx.font = `500 ${typeFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(cameraStr || 'EZ W-501L', panelXCenter, logoY + logoHeight + Math.round(img.height * 0.015));

        // ---------------------------------------------------------------------
        // 2. BLOK TENGAH: DATA EXIF BERSUSUN VERTIKAL
        // ---------------------------------------------------------------------
        // Memecah string EXIF (f/4 | 1/125s | ISO400 | 2.5mm) menjadi array baris
        const pureExifText = exifString || '';
        let exifLines = [];
        if (pureExifText && pureExifText.trim() !== '') {
            exifLines = pureExifText.split('|').map(s => s.trim()).filter(Boolean);
        }

        // Fallback jika input EXIF kosong
        if (exifLines.length === 0) {
            exifLines = ['f/4', '1/125s', 'ISO400', '2.5mm'];
        }

        const exifFontSize = Math.round(baseDim * 0.026 * (textScale || 1));
        const lineHeight = Math.round(exifFontSize * 1.6);
        ctx.font = `400 ${exifFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.fillStyle = textColor || '#000000';
        ctx.textBaseline = "middle";

        // Posisi Y Tengah
        const centerY = canvas.height / 2;
        const totalExifHeight = (exifLines.length - 1) * lineHeight;
        let startExifY = centerY - (totalExifHeight / 2);

        exifLines.forEach((line) => {
            ctx.fillText(line, panelXCenter, startExifY);
            startExifY += lineHeight;
        });

        // ---------------------------------------------------------------------
        // 3. BLOK BAHAW: TANGGAL & SHOT BY
        // ---------------------------------------------------------------------
        const footerFontSize = Math.round(baseDim * 0.024 * (textScale || 1));
        const bottomMargin = Math.round(img.height * 0.06); // 6% dari bawah
        ctx.font = `400 ${footerFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.fillStyle = textColor || '#3d3d3d';
        ctx.textBaseline = "bottom";

        // Baris Paling Bawah: Shot By
        const authorClean = authorStr ? authorStr.replace(/^Shot by\s*/i, '') : 'Julam Carjer';
        const lineShotBy = `Shot By.${authorClean}`;
        ctx.fillText(lineShotBy, panelXCenter, canvas.height - bottomMargin);
        ctx.fillStyle = textColor || '#2e2e2e';

        // Baris Di Atas Shot By: Tanggal
        const lineDate = dateStr || '2026/08/09';
        const dateY = canvas.height - bottomMargin - Math.round(footerFontSize * 1.5);
        ctx.fillStyle = textColor || '#3d3d3d';
        ctx.fillText(lineDate, panelXCenter, dateY);
    }


    // =========================================================================
    // LAYOUT 8: POLAROID 3D REALISTIS (EFEK TIMBUL & BINDING)
    // =========================================================================
    else if (['type-8', 't8', 'polaroid-clean', 'type8'].includes(activeStyle)) {
        // 1. DIMENSI DAN PROPORSI KRUSIAL (SESUAI POLAROID ASLI)
        const baseDimension = Math.min(img.width, img.height);

        // Outer padding agar drop shadow melayang tidak terpotong saat di-export
        const outerPadding = Math.round(baseDimension * 0.08);

        // Ketebalan frame (Kiri, Kanan, Atas seragam; Bawah lebih tebal)
        const sideThick = Math.round(baseDimension * 0.10);
        const topThick = Math.round(baseDimension * 0.10);
        const bottomThick = Math.round(baseDimension * 0.32 * (barFactor || 1));

        // Ukuran kertas Polaroid murni
        const polaroidW = img.width + (sideThick * 2);
        const polaroidH = img.height + topThick + bottomThick;

        // Set Ukuran Canvas Total
        canvas.width = polaroidW + (outerPadding * 2);
        canvas.height = polaroidH + (outerPadding * 2);

        // Posisi Koordinat Utama
        const paperX = outerPadding;
        const paperY = outerPadding;
        const photoX = paperX + sideThick;
        const photoY = paperY + topThick;

        // -------------------------------------------------------------------------
        // 2. BACKGROUND LUAR (KUNCI EXPORT JPG: MEMBUAT BAYANGAN TETAP MUNCUL)
        // -------------------------------------------------------------------------
        // Jika warna Polaroid putih/off-white, beri latar luar abu-abu netral agar timbul
        const currentBgHex = (bgColor || '#F8F7F5').toLowerCase();
        const exportBgColor = (currentBgHex === '#ffffff' || currentBgHex === '#fff' || currentBgHex === '#f8f7f5') ?
            '#ebebeb' :
            '#222222';

        ctx.fillStyle = exportBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // -------------------------------------------------------------------------
        // 3. DROP SHADOW LUAR (EFEK KERTAS MELAYANG / TIMBUL 3D LUAR)
        // -------------------------------------------------------------------------
        ctx.save();
        // Soft Ambient Shadow (Melayang Luas)
        ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
        ctx.shadowBlur = Math.round(baseDimension * 0.05);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = Math.round(baseDimension * 0.025);

        // Gambar Kertas Dasar Polaroid
        ctx.fillStyle = bgColor || '#F8F7F5';
        ctx.fillRect(paperX, paperY, polaroidW, polaroidH);
        ctx.restore();

        // Contact Shadow (Bayangan tegas tipis tepat di bawah sudut bawah kertas)
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = Math.round(baseDimension * 0.012);
        ctx.shadowOffsetY = Math.round(baseDimension * 0.008);
        ctx.fillStyle = bgColor || '#F8F7F5';
        ctx.fillRect(paperX, paperY, polaroidW, polaroidH);
        ctx.restore();

        // -------------------------------------------------------------------------
        // 4. GRADASI LIGHTING CAHAYA KERTAS (PANTULAN CAHAYA 3D)
        // -------------------------------------------------------------------------
        ctx.save();
        const paperLight = ctx.createLinearGradient(paperX, paperY, paperX + polaroidW, paperY + polaroidH);
        paperLight.addColorStop(0, 'rgba(255, 255, 255, 0.45)'); // Kilau dari kiri atas
        paperLight.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        paperLight.addColorStop(1, 'rgba(0, 0, 0, 0.06)'); // Shadow lembut kanan bawah

        ctx.fillStyle = paperLight;
        ctx.fillRect(paperX, paperY, polaroidW, polaroidH);
        ctx.restore();

        // -------------------------------------------------------------------------
        // 5. GAMBAR FOTO UTAMA
        // -------------------------------------------------------------------------
        ctx.drawImage(img, photoX, photoY, img.width, img.height);

        // -------------------------------------------------------------------------
        // 6. EFEK 3D DALAM: INNER SHADOW & BEVEL (FOTO TERTANAM DALAM KERTAS)
        // -------------------------------------------------------------------------
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, img.width, img.height);
        ctx.clip(); // Membatasi bayangan hanya jatuh ke dalam area foto

        // Inner Shadow Atas & Kiri (Potongan Kertas Kelihatan Memiliki Ketebalan)
        ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
        ctx.shadowBlur = Math.round(baseDimension * 0.02);
        ctx.shadowOffsetX = Math.round(baseDimension * 0.004);
        ctx.shadowOffsetY = Math.round(baseDimension * 0.006);

        ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
        ctx.lineWidth = Math.max(2, Math.round(baseDimension * 0.003));
        ctx.strokeRect(photoX, photoY, img.width, img.height);
        ctx.restore();

        // Highlight Putih (Ketebalan Kertas di Sisi Kanan & Bawah Lubang Foto)
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = Math.max(1.5, Math.round(baseDimension * 0.0025));
        ctx.beginPath();
        ctx.moveTo(photoX, photoY + img.height);
        ctx.lineTo(photoX + img.width, photoY + img.height);
        ctx.lineTo(photoX + img.width, photoY);
        ctx.stroke();
        ctx.restore();

        // -------------------------------------------------------------------------
        // 7. EMBOSS BOTTOM CREASE (GARIS LIPATAN KANTONG KIMIA KHAS POLAROID)
        // -------------------------------------------------------------------------
        ctx.save();
        const creaseY = paperY + polaroidH - Math.round(bottomThick * 0.28);

        // Garis Gelap Tipis (Shadow)
        ctx.strokeStyle = "rgba(0, 0, 0, 0.07)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(paperX + Math.round(sideThick * 0.3), creaseY);
        ctx.lineTo(paperX + polaroidW - Math.round(sideThick * 0.3), creaseY);
        ctx.stroke();

        // Garis Terang Tipis (Highlight)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        ctx.moveTo(paperX + Math.round(sideThick * 0.3), creaseY + 1);
        ctx.lineTo(paperX + polaroidW - Math.round(sideThick * 0.3), creaseY + 1);
        ctx.stroke();
        ctx.restore();
    }

    // =========================================================================
    // LAYOUT 9: SIDE PANEL KANAN (FOTO KIRI, PANEL INFORMASI KANAN)
    // =========================================================================
    else if (['type-9', 't9', 'side-panel', 'type9'].includes(activeStyle)) {
        // 1. Tentukan Proporsi
        const topBottomMargin = Math.round(img.height * 0.08); // Border atas & bawah foto
        const sideMargin = Math.round(img.width * 0.08); // Border samping kiri foto
        const rightPanelWidth = Math.round(img.width * 0.65); // Lebar area informasi kanan

        // Total Dimensi Canvas
        canvas.width = img.width + (sideMargin * 2) + rightPanelWidth;
        canvas.height = img.height + (topBottomMargin * 2);

        // 2. Background Dasar
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 3. Gambar Foto Utama di Sisi Kiri
        const photoX = sideMargin;
        const photoY = topBottomMargin;
        ctx.drawImage(img, photoX, photoY, img.width, img.height);

        // 4. Hitung Pusat Koordinat Panel Kanan
        const panelXCenter = photoX + img.width + (rightPanelWidth / 2) + (sideMargin / 2);
        const panelYTop = photoY;
        const panelYBottom = photoY + img.height;

        ctx.textAlign = "center";

        // ---------------------------------------------------------------------
        // A. BLOK ATAS: LOGO KAMERA & TIPE KAMERA
        // ---------------------------------------------------------------------
        const logoHeight = Math.round(img.height * 0.060 * logoScale);
        const logoW = Math.round(logoHeight * logoAspect);
        const logoY = panelYTop + Math.round(img.height * 0.35);

        // Gambar Logo
        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            ctx.drawImage(logoImg, panelXCenter - (logoW / 2), logoY, logoW, logoHeight);
        }

        // Tipe Kamera (Tepat di bawah Logo)
        const typeFontSize = Math.round(baseDimension * 0.035 * textScale);
        ctx.fillStyle = textColor;
        ctx.font = `500 ${typeFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(cameraStr || 'EZ W-501L', panelXCenter, logoY + logoHeight + 140);

        // ---------------------------------------------------------------------
        // B. BLOK BAHAW: EXIF DATA, SHOT BY & TANGGAL
        // ---------------------------------------------------------------------
        const exifFontSize = Math.round(baseDimension * 0.028 * textScale);
        const subFontSize = Math.round(exifFontSize * 0.82);

        // Olah Teks Sub-details (Shot by + Tanggal)
        const authorClean = authorStr ? authorStr.replace(/^Shot by\s*/i, '') : '';
        const subParts = [];
        if (authorClean) subParts.push(`Shot By.${authorClean}`);
        const line2Sub = subParts.join('  •  ');

        // Baris 2: Shot By & Tanggal (Paling Bawah)
        ctx.fillStyle = textColor === '#ffffff' ? '#bbbbbb' : '#555555';
        ctx.font = `400 ${subFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textBaseline = "bottom";
        ctx.fillText(line2Sub, panelXCenter, panelYBottom - 10);

        // Baris 1: EXIF Data (Di atas Shot By & Tanggal)
        // Olah data EXIF murni tanpa tanggal
        const pureExifText = exifString || '';
        ctx.fillStyle = textColor;
        ctx.font = `500 ${exifFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textBaseline = "bottom";
        ctx.fillText(pureExifText || 'f/4  |  1/125s  |  ISO400  |  2.5mm', panelXCenter, panelYBottom - 10 - subFontSize - 110);
    }
}






// ========================================================================================================================================================================
// 13. DOWNLOAD FUNCTION
// ========================================================================================================================================================================
function downloadImage() {
    if (!loadedImage) {
        alert("Silakan upload foto terlebih dahulu!");
        return;
    }

    // Ekspor canvas dengan kualitas tinggi
    const link = document.createElement('a');
    link.download = `delaih-frame-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
}


// ========================================================================================================================================================================
// 14. INISIALISASI
// ========================================================================================================================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render kartu template saat halaman dimuat
    if (typeof renderTemplateGrid === 'function') {
        renderTemplateGrid();
    }

    // 2. Fungsi helper untuk update teks persentase %
    function setupSliderSync(sliderId, displayId) {
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(displayId);

        if (slider && display) {
            // Set nilai awal persentase %
            display.textContent = slider.value + '%';

            // Event saat bulatan slider digeser
            slider.addEventListener('input', (e) => {
                display.textContent = e.target.value + '%';
                updateCanvas(); // Refresh gambar canvas
            });
        }
    }

    // 3. Hubungkan ketiga slider dengan angka persentasenya
    setupSliderSync('bar-height-slider', 'bar-height-val');
    setupSliderSync('text-size-slider', 'text-size-val');
    setupSliderSync('logo-size-slider', 'logo-size-val');

    // 4. Tambahkan event listener untuk input warna & input teks lainnya
    if (typeof frameColorPicker !== 'undefined' && frameColorPicker) {
        frameColorPicker.addEventListener('input', updateCanvas);
    }

    const otherInputs = [
        typeof cameraModelInput !== 'undefined' ? cameraModelInput : null,
        typeof focalInput !== 'undefined' ? focalInput : null,
        typeof apertureInput !== 'undefined' ? apertureInput : null,
        typeof shutterInput !== 'undefined' ? shutterInput : null,
        typeof isoInput !== 'undefined' ? isoInput : null,
        typeof authorInput !== 'undefined' ? authorInput : null
    ];

    otherInputs.forEach(input => {
        if (input) input.addEventListener('input', updateCanvas);
    });
});
