const $buttonGyroScoop = document.querySelector('.calibration__button');
const $values = document.querySelector('.values');
const $dressImg = document.querySelector('.dreams__dress');
const $flowerImg = document.querySelector('.flower');
const $shine = document.querySelector('.shine-layer');
const $shadow = document.querySelector('.shadow-layer');

let currentRotateX = 0;
let currentRotateY = 0;
const lerpFactor = 0.08;

const handleGyro = (event) => {
    const beta = event.beta || 0;
    const gamma = event.gamma || 0;

    const targetRotateY = Math.max(-40, Math.min(40, gamma * 1.2));

    const targetRotateX = Math.max(-12, Math.min(12, (beta - 45) * -0.5));

    currentRotateX += (targetRotateX - currentRotateX) * lerpFactor;
    currentRotateY += (targetRotateY - currentRotateY) * lerpFactor;

    const transform = `perspective(1200px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) translateZ(50px)`;

    if ($dressImg) $dressImg.style.transform = transform;

    if ($shine) {
        const shineLocation = (gamma * 1.5) + 50;
        const shineAngle = 135 - (gamma * 0.5);

        $shine.style.background = `
            linear-gradient(${shineAngle}deg, 
            transparent 0%, 
            rgba(255,255,255,0) ${shineLocation - 30}%, 
            rgba(255,255,255,0.9) ${shineLocation}%, 
            rgba(255,255,255,0) ${shineLocation + 30}%, 
            transparent 100%)
        `;
        $shine.style.transform = transform;
    }

    if ($shadow) {
        const shadowX = (gamma * -2.0).toFixed(2);
        $shadow.style.transform = `translateX(${shadowX}px) scale(${1 + Math.abs(gamma * 0.005)})`;
        $shadow.style.opacity = Math.max(0.1, 0.4 - Math.abs(gamma * 0.01));
    }

    if ($flowerImg) {
        $flowerImg.style.transform = `perspective(1200px) translateZ(-60px) translateX(${(-gamma * 0.6).toFixed(2)}px)`;
    }
};

const activateGyro = () => {
    window.addEventListener('deviceorientation', handleGyro);
    if ($buttonGyroScoop) $buttonGyroScoop.style.display = 'none';
};

const init = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        if ($buttonGyroScoop) {
            $buttonGyroScoop.style.display = 'block';
            $buttonGyroScoop.addEventListener('click', (e) => {
                e.preventDefault();
                DeviceOrientationEvent.requestPermission().then(state => {
                    if (state === 'granted') activateGyro();
                });
            });
        }
    } else {
        activateGyro();
    }
};

init();