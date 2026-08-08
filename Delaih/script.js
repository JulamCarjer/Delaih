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
let currentStyleType = 'classic-right'; // Menyimpan tipe layout template aktif
let currentLogoImg = new Image();
currentLogoImg.crossOrigin = "anonymous";
currentLogoImg.src = "kamera/Sony.svg";

// ==============================================================================================================================================================================================
// 2. MOCKUP TEMPLATE GRID (DATA)
// ==============================================================================================================================================================================================
const mockupTemplates = [{
        id: '1',
        styleType: 'classic-left', // Layout Standard (EXIF Kiri, Logo Kanan)
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'F4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA'
    },
    {
        id: '2',
        styleType: 'centered', // Layout Logo di Tengah
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4  1/125s  ISO400  23.5mm',
        camera: 'YASHICA'
    },
    {
        id: '3',
        styleType: 'classic-right', // Frame Tebal Ala Polaroid
        photo: 'Foto/kucing.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4  1/125s  ISO400  23.5mm',
        camera: 'YASHICA'
    },
    {
        id: '4',
        styleType: 'centered', // Layout Logo Tengah (Bangunan)
        photo: 'Foto/Bangunan.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA'
    },
    {
        id: '5',
        styleType: 'centered', // Layout Logo Tengah (Bangunan)
        photo: 'Foto/Bangunan.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA'
    },
    {
        id: '6',
        styleType: 'centered', // Layout Logo Tengah (Bangunan)
        photo: 'Foto/Bangunan.jpg',
        logo: 'kamera/yashica.svg',
        exif: 'f/4 | 1/125s | ISO400 | 23.5mm',
        camera: 'YASHICA'
    }
];

// ==============================================================================================================================================================================================
// [PERBAIKAN] LOGIKA RENDER TEMPLATE AGAR JERNIH & BERVARIASI
// ==============================================================================================================================================================================================
function renderTemplateGrid() {
    const gridContainer = document.getElementById('template-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    mockupTemplates.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'frame-card-mockup';
        card.onclick = () => selectTemplateCard(item);

        // [UBAH] Gunakan Canvas mini, bukan img HTML agar jernih
        const canvasId = `mockup-canvas-${index}`;
        card.innerHTML = `<canvas id="${canvasId}" class="mockup-canvas"></canvas>`;

        gridContainer.appendChild(card);

        // Gambar isi template ke canvas mini
        drawMockupCanvas(canvasId, item);
    });
}


//Mini canvas
function renderMiniCanvas(canvas, ctx, img, logoImg, template) {
    const activeStyle = template.styleType || 'classic-right';

    // 1. HITUNG BORDER BERDASARKAN SISI TERPENDEK FOTO
    const baseDimension = Math.min(img.width, img.height);

    let borderRatio = 0.05; // Border samping & atas tipis proporsional
    let barRatio = 0.12; // Bottom bar pas untuk 2 baris teks

    if (activeStyle === 'polaroid-thick') {
        borderRatio = 0.6;
        barRatio = 0.18;
    } else if (activeStyle === 'centered') {
        borderRatio = 0.04;
        barRatio = 0.14;
    }

    const borderSide = Math.round(baseDimension * borderRatio);
    const borderTop = borderSide;
    const borderBottom = Math.round(baseDimension * barRatio);

    // 2. ATUR UKURAN MINI CANVAS SESUAI FOTO + BORDER
    canvas.width = img.width + (borderSide * 2);
    canvas.height = img.height + borderTop + borderBottom;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 3. GAMBAR BINGKAI & FOTO
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, borderSide, borderTop, img.width, img.height);

    const yCenter = canvas.height - (borderBottom / 2);
    const xLeft = borderSide + (baseDimension * 0.015);
    const xRight = canvas.width - borderSide - (baseDimension * 0.015);

    let logoAspect = 2;
    if (logoImg.naturalHeight > 0) {
        logoAspect = logoImg.naturalWidth / logoImg.naturalHeight;
    }

    // 4. GAMBAR TEKS & LOGO SESUAI TIPE FRAME
    if (activeStyle === 'centered') {
        // --- LAYOUT CENTERED ---
        const baseLogoHeight = borderBottom * 0.35;
        const logoTargetWidth = Math.round(baseLogoHeight * logoAspect);

        const logoX = (canvas.width / 2) - (logoTargetWidth / 2);
        const logoY = yCenter - (baseLogoHeight * 0.6);

        if (logoImg.complete && logoImg.naturalWidth !== 0) {
            ctx.drawImage(logoImg, logoX, logoY, logoTargetWidth, baseLogoHeight);
        }

        const fontSizeExif = Math.round(baseDimension * 0.018);
        ctx.fillStyle = '#666666';
        ctx.font = `400 ${fontSizeExif}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(template.exif || '', canvas.width / 2, logoY + baseLogoHeight + 4);

    } else {
        // --- LAYOUT CLASSIC / POLAROID ---
        const mainFontSize = Math.round(baseDimension * 0.022);
        const subFontSize = Math.round(mainFontSize * 0.75);

        ctx.textAlign = "left";

        // Baris 1: EXIF Data
        ctx.fillStyle = '#000000';
        ctx.font = `600 ${mainFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textBaseline = "bottom";
        ctx.fillText(template.exif || '', xLeft, yCenter - (mainFontSize * 0.1));

        // Baris 2: Nama Kamera
        ctx.fillStyle = '#555555';
        ctx.font = `400 ${subFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(template.camera || '', xLeft, yCenter + (mainFontSize * 0.1));

        // Logo Sisi Kanan
        if (logoImg.complete && logoImg.naturalWidth !== 0) {
            const baseLogoHeight = borderBottom * 0.38;
            const logoTargetWidth = Math.round(baseLogoHeight * logoAspect);

            const logoX = xRight - logoTargetWidth;
            const logoY = yCenter - (baseLogoHeight / 2);

            ctx.drawImage(logoImg, logoX, logoY, logoTargetWidth, baseLogoHeight);
        }
    }
}

// Fungsi pembantu untuk menggambar kartu template ke canvas mini
function drawMockupCanvas(canvasId, templateData) {
    const miniCanvas = document.getElementById(canvasId);
    if (!miniCanvas) return;
    const miniCtx = miniCanvas.getContext('2d');

    const img = new Image();
    const logoImg = new Image();
    img.crossOrigin = "anonymous";
    logoImg.crossOrigin = "anonymous";

    // Muat gambar foto dan logo secara paralel
    let imagesLoaded = 0;
    const totalImages = 2;

    function onImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            // Setelah semua gambar dimuat, gambar ke canvas
            renderGenericFrame(miniCanvas, miniCtx, img, logoImg, templateData.styleType, templateData.exif, templateData.camera);
        }
    }

    img.onload = onImageLoad;
    logoImg.onload = onImageLoad;

    // Tangani eror jika gambar tidak ditemukan agar tidak macet
    img.onerror = onImageLoad;
    logoImg.onerror = onImageLoad;

    img.src = templateData.photo;
    logoImg.src = templateData.logo;
}

// ==============================================================================================================================================================================================
// Fungsi ini menyatukan logika gambar agar posisi di template vs edit sama persis
// ==============================================================================================================================================================================================
// ==============================================================================================================================
// FUNGSI GENERIK RENDER FRAME (SUPPORT VARIASI LOGO KIRI & KANAN)
// ==============================================================================================================================
function renderGenericFrame(canvas, ctx, img, logoImg, styleType, exifString, cameraStr, authorStr, dateStr, isPreview) {
    if (!canvas || !ctx || !img) return;

    // 1. AMBIL WARNA & SLIDER
    const bgColor = (typeof frameColorPicker !== 'undefined' && frameColorPicker) ? frameColorPicker.value : '#ffffff';
    const textColor = getContrastColor(bgColor);

    const textSizeSlider = document.getElementById('text-size-slider');
    const logoSizeSlider = document.getElementById('logo-size-slider');
    const barHeightSlider = document.getElementById('bar-height-slider');

    const textScale = (textSizeSlider ? textSizeSlider.value : 100) / 100;
    const logoScale = (logoSizeSlider ? logoSizeSlider.value : 100) / 100;
    const barFactor = (barHeightSlider ? barHeightSlider.value : 60) / 100;

    // 2. HITUNG DIMENSI PROPORSIONAL
    const baseDimension = Math.min(img.width, img.height);
    const activeStyle = styleType || 'classic-right';

    let borderRatio = 0.035;
    let barRatio = 0.12;

    if (activeStyle === 'polaroid-thick') {
        borderRatio = 0.06;
        barRatio = 0.18;
    } else if (activeStyle === 'centered') {
        borderRatio = 0.04;
        barRatio = 0.14;
    }

    const borderSide = Math.round(baseDimension * borderRatio);
    const borderTop = borderSide;
    const borderBottom = Math.round(baseDimension * barRatio * (barFactor / 0.6));

    canvas.width = img.width + (borderSide * 2);
    canvas.height = img.height + borderTop + borderBottom;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 3. GAMBAR BACKGROUND & FOTO
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, borderSide, borderTop, img.width, img.height);

    const yCenter = canvas.height - (borderBottom / 2);
    const xLeft = borderSide + (baseDimension * 0.015);
    const xRight = canvas.width - borderSide - (baseDimension * 0.015);

    let logoAspect = 2;
    if (logoImg && logoImg.naturalHeight > 0) {
        logoAspect = logoImg.naturalWidth / logoImg.naturalHeight;
    }

    // 4. PENATAAN VARIATIF
    if (activeStyle === 'centered') {
        // --- LAYOUT CENTERED (Tengah) ---
        const baseLogoHeight = borderBottom * 0.35;
        const logoTargetHeight = Math.round(baseLogoHeight * logoScale);
        const logoTargetWidth = Math.round(logoTargetHeight * logoAspect);

        const logoX = (canvas.width / 2) - (logoTargetWidth / 2);
        const logoY = yCenter - (logoTargetHeight * 0.7);

        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            ctx.drawImage(logoImg, logoX, logoY, logoTargetWidth, logoTargetHeight);
        }

        const fontSizeExif = Math.round(baseDimension * 0.018 * textScale);
        ctx.fillStyle = textColor === '#FFFFFF' ? '#A0A0A0' : '#666666';
        ctx.font = `400 ${fontSizeExif}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(exifString, canvas.width / 2, logoY + logoTargetHeight + 6);

    } else if (activeStyle === 'classic-left') {
        // ==================================================================
        // VARIASI 1: LOGO DI KIRI, TEKS DI KANAN (RATA KANAN)
        // ==================================================================
        const mainFontSize = Math.round(baseDimension * 0.020 * textScale);
        const subFontSize = Math.round(mainFontSize * 0.78);

        // A. Logo Kamera di Kiri
        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            const baseLogoHeight = borderBottom * 0.38;
            const logoTargetHeight = Math.round(baseLogoHeight * logoScale);
            const logoTargetWidth = Math.round(logoTargetHeight * logoAspect);

            const logoX = xLeft;
            const logoY = yCenter - (logoTargetHeight / 2);

            ctx.drawImage(logoImg, logoX, logoY, logoTargetWidth, logoTargetHeight);
        }

        // B. Teks EXIF & Kamera di Kanan (Rata Kanan)
        ctx.textAlign = "right";

        // Baris 1: EXIF
        ctx.fillStyle = textColor;
        ctx.font = `600 ${mainFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textBaseline = "bottom";
        ctx.fillText(exifString, xRight, yCenter - (mainFontSize * 0.2));

        // Baris 2: Sub-Text
        const subText = [cameraStr, authorStr ? `Shot by ${authorStr}` : '', dateStr].filter(Boolean).join('  ');
        ctx.fillStyle = textColor === '#FFFFFF' ? '#777777' : '#666666';
        ctx.font = `400 ${subFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(subText, xRight, yCenter + (mainFontSize * 0.2));

    } else {
        // ==================================================================
        // VARIASI 2: TEKS DI KIRI (RATA KIRI), LOGO DI KANAN (DEFAULT)
        // ==================================================================
        const mainFontSize = Math.round(baseDimension * 0.020 * textScale);
        const subFontSize = Math.round(mainFontSize * 0.78);

        // A. Teks EXIF & Kamera di Kiri (Rata Kiri)
        ctx.textAlign = "left";

        // Baris 1: EXIF
        ctx.fillStyle = textColor;
        ctx.font = `600 ${mainFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textBaseline = "bottom";
        ctx.fillText(exifString, xLeft, yCenter - (mainFontSize * 0.2));

        // Baris 2: Sub-Text
        const subText = [cameraStr, authorStr ? `Shot by ${authorStr}` : '', dateStr].filter(Boolean).join('  ');
        ctx.fillStyle = textColor === '#FFFFFF' ? '#777777' : '#666666';
        ctx.font = `400 ${subFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(subText, xLeft, yCenter + (mainFontSize * 0.2));

        // B. Logo Kamera di Kanan
        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            const baseLogoHeight = borderBottom * 0.38;
            const logoTargetHeight = Math.round(baseLogoHeight * logoScale);
            const logoTargetWidth = Math.round(logoTargetHeight * logoAspect);

            const logoX = xRight - logoTargetWidth;
            const logoY = yCenter - (logoTargetHeight / 2);

            ctx.drawImage(logoImg, logoX, logoY, logoTargetWidth, logoTargetHeight);
        }
    }
}

// ==============================================================================================================================================================================================
// 3. PEMILIHAN TEMPLATE & TAB SWITCHER
// ==============================================================================================================================================================================================
function selectTemplateCard(template) {
    // 1. Simpan tipe style yang dipilih ke variabel global
    currentStyleType = template.styleType || 'classic-right';

    // 2. Pindah tab ke menu edit
    switchTab('edit');

    // 3. Atur logo aktif sesuai template
    selectLogo(template.camera, template.logo);

    // 4. Muat gambar utama template ke canvas edit
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
        if (btnEdit) btnEdit.classList.add('active');
        if (btnTemplate) btnTemplate.classList.remove('active');
    }
}

// ==============================================================================================================================================================================================
// 4. LOGO SELECTION LOGIC
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
// 5. EXIF & UPLOAD FOTO
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
// 6. DRAWING CANVAS UTAMA (MENU EDIT)
// ====================================================================================================================
function updateCanvas() {
    if (!canvas || !ctx || !loadedImage) return;

    // Ambil Data EXIF dari Input
    const exifString = [
        focalInput ? focalInput.value : '',
        apertureInput ? apertureInput.value : '',
        shutterInput ? shutterInput.value : '',
        isoInput ? isoInput.value : '',
        dateInput ? dateInput.value : ''
    ].filter(Boolean).join('  |  ');

    const cameraAuthorStr = `${cameraModelInput ? cameraModelInput.value : ''}   ${authorInput ? authorInput.value : ''}`;
    const authorStr = authorInput ? authorInput.value : '';
    const dateStr = dateInput ? dateInput.value : '';

    // Gunakan fungsi generik untuk menggambar
    renderGenericFrame(
        canvas,
        ctx,
        loadedImage,
        currentLogoImg,
        currentStyleType,
        exifString,
        cameraAuthorStr,
        false //ini canvas utama menu edit, bukan preview
    );
}


// ==============================================================================================================================
// FUNGSI GENERIK RENDER FRAME (UTAMA & PREVIEW)
// ==============================================================================================================================
function renderGenericFrame(canvas, ctx, img, logoImg, styleType, exifString, cameraStr, authorStr, dateStr, isPreview) {
    if (!canvas || !ctx || !img) return;

    // 1. AMBIL NILAI WARNA & SLIDER (Gunakan fallback agar tidak error)
    const bgColor = (typeof frameColorPicker !== 'undefined' && frameColorPicker) ? frameColorPicker.value : '#ffffff';
    const textColor = getContrastColor(bgColor);

    const textSizeSlider = document.getElementById('text-size-slider');
    const logoSizeSlider = document.getElementById('logo-size-slider');
    const barHeightSlider = document.getElementById('bar-height-slider');

    const textScale = (textSizeSlider ? textSizeSlider.value : 100) / 100;
    const logoScale = (logoSizeSlider ? logoSizeSlider.value : 100) / 100;
    const barFactor = (barHeightSlider ? barHeightSlider.value : 60) / 100;

    // 2. HITUNG DIMENSI KANVAS & BORDER
    const activeStyle = styleType || 'classic-right';
    let borderRatio = 0.05;
    let barRatio = 0.20;

    if (activeStyle === 'polaroid-thick') {
        borderRatio = 0.08;
        barRatio = 0.2;
    } else if (activeStyle === 'centered') {
        borderRatio = 0.05;
        barRatio = 0.3;
    }

    const borderSide = Math.round(img.width * borderRatio);
    const borderBottom = Math.round(img.height * barRatio * barFactor);

    canvas.width = img.width + (borderSide * 2);
    canvas.height = img.height + borderSide + borderBottom;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 3. GAMBAR BACKGROUND & FOTO UTAMA
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, borderSide, borderSide, img.width, img.height);

    //jarak text & logo frame 1
    const yCenter = canvas.height - (borderBottom / 2);
    const xPos = borderSide * 1;

    let logoAspect = 2;
    if (logoImg && logoImg.naturalHeight > 0) {
        logoAspect = logoImg.naturalWidth / logoImg.naturalHeight;
    }

    // 4. PENATAAN TEKS BERDASARKAN LAYOUT
    if (activeStyle === 'centered') {
        // --- LAYOUT CENTERED (Tengah) ---
        const baseLogoHeight = borderBottom * 0.3;
        const logoTargetHeight = Math.round(baseLogoHeight * logoScale);
        const logoTargetWidth = Math.round(logoTargetHeight * logoAspect);

        const logoX = (canvas.width / 2) - (logoTargetWidth / 2);
        const logoY = yCenter - (logoTargetHeight * 0.8);

        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            ctx.drawImage(logoImg, logoX, logoY, logoTargetWidth, logoTargetHeight);
        }

        //TEXT EXIF TENGAH ---------------------------------------------------------------------------------------------------------------------
        const fontSizeExif = Math.round(borderSide * 0.50 * textScale);
        ctx.fillStyle = textColor === '#ffffff' ? '#000000' : '#000000';
        ctx.font = `500 ${fontSizeExif}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        //Posisi text exif
        ctx.fillText(exifString, canvas.width / 2, logoY + logoTargetHeight + 110);

    } else {
        // --- LAYOUT CLASSIC / POLAROID (3 Baris Terpisah) ---
        const baseFontSize = Math.round(borderSide * 0.50 * textScale);

        ctx.textAlign = "left";

        // --- ATUR JARAK POSISI TEKS DI SINI ---
        // Ubah offsetY (misal: 20, 30, 50) untuk menurunkan teks EXIF ke bawah
        const offsetY = 30;

        // Ubah offsetX jika ingin menggeser posisi horizontal dari tepi kanan
        const offsetX = 0;

        // BARIS 1: Tipe Kamera (Paling Besar & Bold)
        const cameraFontSize = Math.round(baseFontSize * 1.5);
        ctx.fillStyle = textColor;
        ctx.font = `600 ${cameraFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(cameraStr, xPos, yCenter - (baseFontSize * 0.50));


        // BARIS 2: Data EXIF (Ukuran Standar)
        ctx.fillStyle = textColor === '#FFFFFF' ? '#CCCCCC' : '#000000';
        ctx.font = `500 ${baseFontSize}px monospace`;
        ctx.fillText(exifString, xPos, yCenter);


        // BARIS 3: Shot By & Tanggal (Kecil & Berdampingan)
        const subFontSize = Math.round(baseFontSize * 0.75);
        ctx.fillStyle = textColor === '#FFFFFF' ? '#888888' : '#000000';
        ctx.font = `400 ${subFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;

        const subText = [
            authorStr ? `Shot by ${authorStr}` : '',
            dateStr
        ].filter(Boolean).join('  •  ');

        ctx.fillText(subText, xPos, yCenter + (baseFontSize * 1.1));

        // LOGO KAMERA (Posisi Kanan)
        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            const baseLogoHeight = borderBottom * 0.35;
            const logoTargetHeight = Math.round(baseLogoHeight * logoScale);
            const logoTargetWidth = Math.round(logoTargetHeight * logoAspect);

            const logoX = canvas.width - (borderSide * 1.5) - logoTargetWidth;
            const logoY = yCenter - (logoTargetHeight / 2);

            ctx.drawImage(logoImg, logoX, logoY, logoTargetWidth, logoTargetHeight);


        } else if (activeStyle === 'classic-left') {
            // ==================================================================
            // VARIASI 1: LOGO DI KIRI, TEKS EXIF DI KANAN
            // ==================================================================
            const mainFontSize = Math.round(baseDimension * 0.020 * textScale);
            const subFontSize = Math.round(mainFontSize * 0.78);

            // A. Gambar Logo Kamera di Kiri
            if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
                const baseLogoHeight = borderBottom * 0.38;
                const logoTargetHeight = Math.round(baseLogoHeight * logoScale);
                const logoTargetWidth = Math.round(logoTargetHeight * logoAspect);

                const logoX = xLeft;
                const logoY = yCenter - (logoTargetHeight / 2);

                ctx.drawImage(logoImg, logoX, logoY, logoTargetWidth, logoTargetHeight);
            }

            // B. Teks EXIF & Kamera di Kanan (Rata Kanan)
            ctx.textAlign = "right";

            // --- ATUR JARAK POSISI TEKS DI SINI ---
            // Ubah offsetY (misal: 20, 30, 50) untuk menurunkan teks EXIF ke bawah
            const offsetY = 300;

            // Ubah offsetX jika ingin menggeser posisi horizontal dari tepi kanan
            const offsetX = 0;

            // Baris 1: EXIF
            ctx.fillStyle = textColor;
            ctx.font = `600 ${mainFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.textBaseline = "bottom";
            ctx.fillText(exifString, xRight - offsetX, yCenter - (mainFontSize * 0.2) + offsetY);

            // Baris 2: Sub-Text (Camera / Shot by / Date)
            const subText = [cameraStr, authorStr ? `Shot by ${authorStr}` : '', dateStr].filter(Boolean).join('  ');
            ctx.fillStyle = textColor === '#FFFFFF' ? '#777777' : '#666666';
            ctx.font = `400 ${subFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.textBaseline = "top";
            ctx.fillText(subText, xRight - offsetX, yCenter + (mainFontSize * 0.2) + offsetY);
        }
    }
}





// ==========================================
// 7. DOWNLOAD FUNCTION
// ==========================================
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

// ==========================================
// INISIALISASI
// ==========================================
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