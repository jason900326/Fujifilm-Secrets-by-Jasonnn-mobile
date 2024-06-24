let originalImage = new Image();
let originalCanvasData = null;
let selectedFilter = null;

const filterSettings = {
    "Acros": {"brightness": 1.0, "contrast": 1.2, "saturate": 0.0},
    "Astia": {"brightness": 1.15, "contrast": 1.2, "saturate": 1.35},
    "Bleach-Bypass": {"brightness": 1.0, "contrast": 1.5, "saturate": 0.5},
    "Classic-Chrome": {"brightness": 1.0, "contrast": 1.3, "saturate": 0.9},
    "Classic-Negative": {"brightness": 0.95, "contrast": 1.15, "saturate": 1.2},
    "Eterna": {"brightness": 1.0, "contrast": 1.05, "saturate": 0.85},
    "Pro-Neg-Hi": {"brightness": 1.05, "contrast": 1.2, "saturate": 1.05},
    "Pro-Neg-Std": {"brightness": 1.0, "contrast": 1.1, "saturate": 1.05},
    "Provia": {"brightness": 1.0, "contrast": 1.0, "saturate": 1.0},
    "Velvia": {"brightness": 1.2, "contrast": 1.2, "saturate": 1.55}
};

const uploadInput = document.getElementById('upload');
const selectFileButton = document.getElementById('select-file-button');
const selectFileButtonTop = document.getElementById('select-file-button-top');
const downloadButton = document.getElementById('download');
const resetButton = document.getElementById('reset');
const filterStrength = document.getElementById('filter-strength');
const filterPreviews = document.querySelector('.filter-previews');
const controls = document.querySelector('.controls');
const photoContainer = document.getElementById('photo-container');
const photoCanvas = document.getElementById('photo-canvas');

// 標籤切換功能
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(button.getAttribute('data-target')).style.display = 'flex';
    });
});

uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            originalImage.src = event.target.result;
            originalImage.onload = function () {
                drawImage(originalImage);
                displayControls(true);
            }
        }
        reader.readAsDataURL(file);
    }
});

selectFileButton.addEventListener('click', function () {
    uploadInput.click();
});

selectFileButtonTop.addEventListener('click', function () {
    uploadInput.click();
});

resetButton.addEventListener('click', function () {
    drawImage(originalImage);
    filterStrength.value = 100;
    selectedFilter = null;
    applyFilter(true);
    filterStrength.style.display = 'none'; // 重置時隱藏滑桿
    document.querySelector('label[for="filter-strength"]').style.display = 'none';
});

filterPreviews.addEventListener('click', function (event) {
    if (event.target.closest('.filter')) {
        selectedFilter = event.target.closest('.filter').getAttribute('data-filter');
        filterStrength.value = 100; // 重置滑桿值
        applyFilter();
        filterStrength.style.display = 'inline-block'; // 濾鏡選擇後顯示滑桿
        document.querySelector('label[for="filter-strength"]').style.display = 'inline-block';
    }
});

// 事件監聽器：當滑桿的值變化時觸發
filterStrength.addEventListener('input', function () {
    if (selectedFilter) {
        applyFilter();
    }
});

// 事件監聽器：當滑桿被雙擊時觸發
filterStrength.addEventListener('dblclick', function () {
    filterStrength.value = 100;
    if (selectedFilter) {
        applyFilter();
    }
});

function drawImage(image) {
    const ctx = photoCanvas.getContext('2d');
    photoCanvas.width = image.width;
    photoCanvas.height = image.height;
    ctx.drawImage(image, 0, 0, photoCanvas.width, photoCanvas.height);
    originalCanvasData = ctx.getImageData(0, 0, photoCanvas.width, photoCanvas.height);
}

function applyFilter(reset = false) {
    const ctx = photoCanvas.getContext('2d');
    ctx.putImageData(originalCanvasData, 0, 0);

    if (reset) {
        ctx.filter = 'none';
        ctx.drawImage(originalImage, 0, 0, photoCanvas.width, photoCanvas.height);
        return;
    }

    if (!selectedFilter) return;

    const settings = filterSettings[selectedFilter];
    const strength = filterStrength.value / 100;

    const brightness = 1 + (settings.brightness - 1) * strength;
    const contrast = 1 + (settings.contrast - 1) * strength;
    const saturate = 1 + (settings.saturate - 1) * strength;

    const filterString = `brightness(${brightness}) contrast(${contrast}) saturate(${saturate})`;
    ctx.filter = filterString;
    ctx.drawImage(originalImage, 0, 0, photoCanvas.width, photoCanvas.height);
}

downloadButton.addEventListener('click', function () {
    const link = document.createElement('a');
    link.href = photoCanvas.toDataURL('image/jpeg');
    link.download = 'edited-photo.jpg';
    link.click();
});

function displayControls(show) {
    const displayStyle = show ? 'inline-block' : 'none';
    downloadButton.style.display = displayStyle;
    filterStrength.style.display = 'none'; // 初始隱藏滑桿
    resetButton.style.display = displayStyle;
    document.querySelector('label[for="filter-strength"]').style.display = 'none';
    document.getElementById('upload-container').style.display = show ? 'none' : 'block';
    document.getElementById('photo-container').style.display = show ? 'flex' : 'none';
    document.getElementById('tab-container').style.display = show ? 'flex' : 'none';
}