console.log('Loading Image Toolkit......');

const ZOOM_FACTOR = 0.8;
const DEFAULT_IMG_STYLES = {
    transform: 'none',
    filter: 'none',
    mixBlendMode: 'normal'
}

let REAL_IMG_INTERVAL = null;
let DRAGGING = false;
let TARGET_IMG_INFO = {
    state: false,
    viewContainerEl: null,
    imgViewEl: null,
    imgTipEl: null,

    imgTipTimeout: null,

    curWidth: 0,
    curHeight: 0,
    realWidth: 0,
    realHeight: 0,
    left: 0,
    top: 0,
    moveX: 0,
    moveY: 0,
    rotate: 0
}

$(document).on('click', 'article img', clickImage);

function clickImage(event) {
    const target = event.target;
    if (!target || 'IMG' !== target.tagName) {
        return;
    }
    renderViewContainer(target);
}

function renderViewContainer(target) {
    initViewContainer();
    openViewContainer();
    refreshImg(target.src, target.alt);
}

function initViewContainer() {
    if (null == TARGET_IMG_INFO.viewContainerEl || !TARGET_IMG_INFO.viewContainerEl) {
        const app = document.getElementById('app');
        if (!app) {
            console.error('Cannot get app element!');
            return;
        }
        /*
        <div class="image-toolkit-view-container">
            <div class="img-container">
                <img class="img-view" src="" alt="" >
            </div>
            <div class="img-tip">100%</div>
        </div>
         */
        app.appendChild(TARGET_IMG_INFO.viewContainerEl = document.createElement('div')); // app > image-toolkit-view-container
        TARGET_IMG_INFO.viewContainerEl.setAttribute('class', 'image-toolkit-view-container');
        const imgContainerDiv = document.createElement('div'); // img-container
        imgContainerDiv.setAttribute('class', 'img-container');
        imgContainerDiv.appendChild(TARGET_IMG_INFO.imgViewEl = document.createElement('img')); // img-container > img-view
        TARGET_IMG_INFO.imgViewEl.setAttribute('class', 'img-view');
        TARGET_IMG_INFO.imgViewEl.setAttribute('src', '');
        TARGET_IMG_INFO.imgViewEl.setAttribute('alt', '');
        TARGET_IMG_INFO.viewContainerEl.appendChild(imgContainerDiv); // image-toolkit-view-container > img-container
        TARGET_IMG_INFO.viewContainerEl.appendChild(TARGET_IMG_INFO.imgTipEl = document.createElement('div')); // image-toolkit-view-container > img-tip
        TARGET_IMG_INFO.imgTipEl.setAttribute('class', 'img-tip');
        TARGET_IMG_INFO.imgTipEl.hidden = true;
    }
    initDefaultData();
    // todo renderImgTitle
    // add all events
    addOrRemoveEvent(true);
}

function initDefaultData() {
    DRAGGING = false;
    REAL_IMG_INTERVAL = null;
}

function openViewContainer() {
    if (!TARGET_IMG_INFO.viewContainerEl) {
        console.error('obsidian-image-toolkit: image-toolkit-view-container has not been initialized.');
        return;
    }
    TARGET_IMG_INFO.viewContainerEl.style.setProperty('display', 'block');
    TARGET_IMG_INFO.state = true;
}

function closeViewContainer(event) {
    if (event) {
        const targetClassName = event.target.className;
        if ('img-container' != targetClassName && 'image-toolkit-view-container' != targetClassName) {
            return;
        }
    }
    if (TARGET_IMG_INFO.viewContainerEl) {
        TARGET_IMG_INFO.viewContainerEl.style.setProperty('display', 'none');
        TARGET_IMG_INFO.state = false;
        //renderImgTitle('');
        renderImgView('', '');
        // remove all events
        addOrRemoveEvent(false);
    }
}

function addOrRemoveEvent(flag) {
    if (flag) {
        TARGET_IMG_INFO.viewContainerEl.addEventListener('click', closeViewContainer);
        // drag the image via mouse
        TARGET_IMG_INFO.imgViewEl.addEventListener('mousedown', mousedownImgView);
        // zoom the image via mouse wheel
        TARGET_IMG_INFO.imgViewEl.addEventListener('mousewheel', mousewheelViewContainer);
    } else {
        TARGET_IMG_INFO.viewContainerEl.removeEventListener('click', closeViewContainer);
        TARGET_IMG_INFO.imgViewEl.removeEventListener('mousedown', mousedownImgView);
        TARGET_IMG_INFO.viewContainerEl.removeEventListener('mousewheel', mousewheelViewContainer);
        if (REAL_IMG_INTERVAL) {
            clearInterval(REAL_IMG_INTERVAL);
            REAL_IMG_INTERVAL = null;
        }
    }
}

function mousedownImgView(event) {
    // console.log('mousedownImgView', event);
    DRAGGING = true;
    event.stopPropagation();
    event.preventDefault();
    // 鼠标相对于图片的位置
    TARGET_IMG_INFO.moveX = TARGET_IMG_INFO.imgViewEl.offsetLeft - event.clientX;
    TARGET_IMG_INFO.moveY = TARGET_IMG_INFO.imgViewEl.offsetTop - event.clientY;
    // 鼠标按下时持续触发/移动事件 
    TARGET_IMG_INFO.viewContainerEl.onmousemove = mousemoveImgView;
    // 鼠标松开/回弹触发事件
    TARGET_IMG_INFO.viewContainerEl.onmouseup = mouseupImgView;
    TARGET_IMG_INFO.viewContainerEl.onmouseleave = mouseupImgView;
}

function mousemoveImgView(event, offsetSize) {
    if (!DRAGGING && !offsetSize) {
        return;
    }
    if (event) {
        TARGET_IMG_INFO.left = event.clientX + TARGET_IMG_INFO.moveX;
        TARGET_IMG_INFO.top = event.clientY + TARGET_IMG_INFO.moveY;
    } else if (offsetSize) {
        TARGET_IMG_INFO.left += offsetSize.offsetX;
        TARGET_IMG_INFO.top += offsetSize.offsetY;
    } else {
        return;
    }
    // 修改图片位置
    TARGET_IMG_INFO.imgViewEl.style.setProperty('margin-top', TARGET_IMG_INFO.top + 'px', 'important');
    TARGET_IMG_INFO.imgViewEl.style.setProperty('margin-left', TARGET_IMG_INFO.left + 'px', 'important');
}

function mouseupImgView(event) {
    // console.log('mouseup...');
    DRAGGING = false;
    event.preventDefault();
    event.stopPropagation();
    TARGET_IMG_INFO.imgViewEl.onmousemove = null;
    TARGET_IMG_INFO.imgViewEl.onmouseup = null;
}

function mousewheelViewContainer(event) {
    event.preventDefault();
    event.stopPropagation();
    zoomAndRender(0 < event.wheelDelta ? 0.1 : -0.1, event);
}

function zoomAndRender(ratio, event) {
    let offsetSize = { offsetX: 0, offsetY: 0 };
    if (event) {
        offsetSize.offsetX = event.offsetX;
        offsetSize.offsetY = event.offsetY;
    } else {
        offsetSize.offsetX = TARGET_IMG_INFO.curWidth / 2;
        offsetSize.offsetY = TARGET_IMG_INFO.curHeight / 2;
    }
    const zoomData = zoom(ratio, TARGET_IMG_INFO, offsetSize);
    renderImgTip();
    TARGET_IMG_INFO.imgViewEl.setAttribute('width', zoomData.newWidth) + 'px';
    TARGET_IMG_INFO.imgViewEl.style.setProperty('margin-top', zoomData.top + 'px', 'important');
    TARGET_IMG_INFO.imgViewEl.style.setProperty('margin-left', zoomData.left + 'px', 'important');
}

function zoom(ratio, TARGET_IMG_INFO, offsetSize) {
    const zoomInFlag = ratio > 0;
    ratio = zoomInFlag ? 1 + ratio : 1 / (1 - ratio);
    const curWidth = TARGET_IMG_INFO.curWidth;
    // const curHeight = TARGET_IMG_INFO.curHeight;
    let zoomRatio = curWidth * ratio / TARGET_IMG_INFO.realWidth;
    const newWidth = TARGET_IMG_INFO.realWidth * zoomRatio;
    const newHeight = TARGET_IMG_INFO.realHeight * zoomRatio;
    const left = TARGET_IMG_INFO.left + (offsetSize.offsetX - offsetSize.offsetX * ratio);
    const top = TARGET_IMG_INFO.top + (offsetSize.offsetY - offsetSize.offsetY * ratio);
    // cache image info: curWidth, curHeight, left, top
    TARGET_IMG_INFO.curWidth = newWidth;
    TARGET_IMG_INFO.curHeight = newHeight;
    TARGET_IMG_INFO.left = left;
    TARGET_IMG_INFO.top = top;
    return { newWidth, left, top };
}

function refreshImg(imgSrc, imgAlt) {
    const src = imgSrc ? imgSrc : TARGET_IMG_INFO.imgViewEl.src;
    const alt = imgAlt ? imgAlt : TARGET_IMG_INFO.imgViewEl.alt;
    if (src) {
        let realImg = new Image();
        realImg.src = src;
        REAL_IMG_INTERVAL = setInterval((img) => {
            if (img.width > 0 || img.height > 0) {
                clearInterval(REAL_IMG_INTERVAL);
                REAL_IMG_INTERVAL = null;
                let imgZoomSize = calculateImgZoomSize(img, TARGET_IMG_INFO);
                setImgViewPosition(imgZoomSize, 0);
                renderImgView(src, alt);
                renderImgTip();
                TARGET_IMG_INFO.imgViewEl.style.setProperty('transform', DEFAULT_IMG_STYLES.transform);
                TARGET_IMG_INFO.imgViewEl.style.setProperty('filter', DEFAULT_IMG_STYLES.filter);
                TARGET_IMG_INFO.imgViewEl.style.setProperty('mix-blend-mode', DEFAULT_IMG_STYLES.mixBlendMode);
            }
        }, 40, realImg);
    }
}

/**
 * calculate zoom size of the target image  
 * @param imgSrc 
 * @returns 
 */
function calculateImgZoomSize(realImg) {
    const windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    const windowZoomWidth = windowWidth * ZOOM_FACTOR;
    const windowZoomHeight = windowHeight * ZOOM_FACTOR;

    let tempWidth = realImg.width, tempHeight = realImg.height;
    if (realImg.height > windowZoomHeight) {
        tempHeight = windowZoomHeight;
        if ((tempWidth = tempHeight / realImg.height * realImg.width) > windowZoomWidth) {
            tempWidth = windowZoomWidth;
        }
    } else if (realImg.width > windowZoomWidth) {
        tempWidth = windowZoomWidth;
        tempHeight = tempWidth / realImg.width * realImg.height;
    }
    tempHeight = tempWidth * realImg.height / realImg.width;
    let width = tempWidth + 'px';
    let height = tempHeight + 'px';
    // cache image info: curWidth, curHeight, realWidth, realHeight, left, top
    TARGET_IMG_INFO.left = (windowWidth - tempWidth) / 2;
    TARGET_IMG_INFO.top = (windowHeight - tempHeight) / 2;
    TARGET_IMG_INFO.curWidth = tempWidth;
    TARGET_IMG_INFO.curHeight = tempHeight;
    TARGET_IMG_INFO.realWidth = realImg.width;
    TARGET_IMG_INFO.realHeight = realImg.height;
    const left = TARGET_IMG_INFO.left + 'px';
    const top = TARGET_IMG_INFO.top + 'px';

    /* console.log('calculateImgZoomSize', 'realImg: ' + realImg.width + ',' + realImg.height,
        'tempSize: ' + tempWidth + ',' + tempHeight,
        'windowZoomSize: ' + windowZoomWidth + ',' + windowZoomHeight,
        'windowSize: ' + windowWidth + ',' + windowHeight); */
    return { width, height, top, left };
}

function setImgViewPosition(imgZoomSize, rotate) {
    if (imgZoomSize) {
        TARGET_IMG_INFO.imgViewEl.setAttribute('width', imgZoomSize.width);
        TARGET_IMG_INFO.imgViewEl.style.setProperty('margin-top', imgZoomSize.top, 'important');
        TARGET_IMG_INFO.imgViewEl.style.setProperty('margin-left', imgZoomSize.left, 'important');
    }
    const rotateDeg = rotate ? rotate : 0;
    TARGET_IMG_INFO.imgViewEl.style.transform = 'rotate(' + rotateDeg + 'deg)';
    TARGET_IMG_INFO.rotate = rotateDeg;
}

function renderImgView(src, alt) {
    if (TARGET_IMG_INFO.imgViewEl) {
        TARGET_IMG_INFO.imgViewEl.setAttribute('src', src);
        TARGET_IMG_INFO.imgViewEl.setAttribute('alt', alt);
    }
}

function renderImgTip() {
    if (TARGET_IMG_INFO.realWidth > 0 && TARGET_IMG_INFO.curWidth > 0) {
        if (TARGET_IMG_INFO.imgTipTimeout) {
            clearTimeout(TARGET_IMG_INFO.imgTipTimeout);
        }
        TARGET_IMG_INFO.imgTipEl.hidden = false;
        TARGET_IMG_INFO.imgTipEl.textContent = parseInt(TARGET_IMG_INFO.curWidth * 100 / TARGET_IMG_INFO.realWidth + '') + '%';
        TARGET_IMG_INFO.imgTipTimeout = setTimeout(() => {
            TARGET_IMG_INFO.imgTipEl.hidden = true;
        }, 1000);
    }
}
