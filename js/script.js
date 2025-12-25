// ЖДЕМ ПОЛНОЙ ЗАГРУЗКИ СТРАНИЦЫ
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена!');
    
    // ЭЛЕМЕНТЫ
    const clouds = document.querySelector('.clouds');
    const stars = document.querySelector('.stars');
    const moon = document.querySelector('.moon');
    const ground = document.querySelector('.ground');
    const trees = document.querySelector('.trees');
    const bigTree = document.querySelector('.big-tree');
    const dedulya = document.querySelector('.dedulya');
    
    // ПЕРЕМЕННЫЕ ДЛЯ ПАРАЛЛАКСА
    let paraX = 0;
    let paraY = 0;
    let targetX = 0;
    let targetY = 0;
    let isParaActive = true;
    
    // КАК БЫСТРО ДВИГАЕТСЯ КАЖДЫЙ СЛОЙ
    const layerSpeeds = {
        trees: 0.08,
        ground: 0.06,
        stars: 0.05,
        moon: 0.03,
        clouds: 0.02,
    };
    
    // ОСНОВНАЯ ФУНКЦИЯ ПАРАЛЛАКСА
    function moveLayers() {
        // ПЛАВНОЕ ДВИЖЕНИЕ
        paraX += (targetX - paraX) * 0.1;
        paraY += (targetY - paraY) * 0.1;
        
        if (isParaActive) {
            // ПЕРЕМЕЩАЮ ВСЕ СЛОИ
            if (ground) ground.style.transform = `translate(${paraX * layerSpeeds.ground}px, ${paraY * layerSpeeds.ground}px)`;
            if (clouds) clouds.style.transform = `translate(${paraX * layerSpeeds.clouds}px, ${paraY * layerSpeeds.clouds}px)`;
            if (stars) stars.style.transform = `translate(${paraX * layerSpeeds.stars}px, ${paraY * layerSpeeds.stars}px)`;
            if (moon) moon.style.transform = `translate(${paraX * layerSpeeds.moon}px, ${paraY * layerSpeeds.moon}px)`;
            if (trees) trees.style.transform = `translate(${paraX * layerSpeeds.trees}px, ${paraY * layerSpeeds.trees}px)`;
            if (bigTree) bigTree.style.transform = `translate(${paraX * 0.09}px, ${paraY * 0.09}px)`;
        }
        
        // ПРОДОЛЖАЮ АНИМАЦИЮ
        requestAnimationFrame(moveLayers);
    }
    
    // КОГДА ДВИГАЕТСЯ МЫШКА
    function onMouseMove(e) {
        if (!isParaActive) return;
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        targetX = e.clientX - centerX;
        targetY = e.clientY - centerY;
    }
    
    // ВЫКЛЮЧЕНИЕ ПАРАЛЛАКСА (КОГДА ЕЛКА ПОЯВЛЯЕТСЯ)
    window.stopParallax = function() {
        console.log('Выключаем параллакс');
        isParaActive = false;
        
        // ПЛАВНО ВСЕ НА МЕСТО
        const allLayers = [clouds, ground, stars, moon, trees, bigTree];
        const startTime = Date.now();
        
        function returnToPlace() {
            const timePassed = Date.now() - startTime;
            const howMuch = Math.min(timePassed / 1000, 1);
            const smooth = 1 - Math.pow(1 - howMuch, 3);
            
            const x = paraX * (1 - smooth);
            const y = paraY * (1 - smooth);
            
            // ДЛЯ КАЖДОГО СЛОЯ
            if (clouds) clouds.style.transform = `translate(${x * 0.01}px, ${y * 0.01}px)`;
            if (ground) ground.style.transform = `translate(${x * 0.03}px, ${y * 0.03}px)`;
            if (stars) stars.style.transform = `translate(${x * 0.025}px, ${y * 0.025}px)`;
            if (moon) moon.style.transform = `translate(${x * 0.015}px, ${y * 0.015}px)`;
            if (trees) trees.style.transform = `translate(${x * 0.035}px, ${y * 0.035}px)`;
            if (bigTree) bigTree.style.transform = `translate(${x * 0.045}px, ${y * 0.045}px)`;
            
            if (howMuch < 1) {
                requestAnimationFrame(returnToPlace);
            } else {
                // КОГДА ВСЁ ВЕРНУЛОСЬ
                allLayers.forEach(layer => {
                    if (layer) layer.style.transform = 'translate(0px, 0px)';
                });
            }
        }
        
        returnToPlace();
    };
    
    // ЗАПУСК ПАРАЛЛАКС
    moveLayers();
    document.addEventListener('mousemove', onMouseMove);
    
    // ДЕД МОРОЗ
    if (dedulya) {
        console.log('Дед найден!');
        
        // НАСТРАИВАЕМ ДЕДА
        dedulya.style.position = 'absolute';
        dedulya.style.left = '0';
        dedulya.style.top = '10%';
        dedulya.style.width = '550px';
        dedulya.style.height = '274px';
        
        let isFlying = false;
        let flightStart = null;
        let flightId = null;
        let flightNum = 0;
        
        // АНИМАЦИЯ ПОЛЕТА
        function flyDed(timestamp) {
            if (!flightStart) flightStart = timestamp;
            
            const timePassed = timestamp - flightStart;
            const progress = Math.min(timePassed / 20000, 1);
            
            // ПЛАВНОСТЬ
            let smooth;
            if (progress < 0.5) {
                smooth = 2 * progress * progress;
            } else {
                smooth = 1 - Math.pow(-2 * progress + 2, 2) / 2;
            }
            
            // ПОЗИЦИЯ ОТ ЛЕВА ДО ПРАВА
            const from = -800;
            const to = window.innerWidth + 800;
            const now = from + (to - from) * smooth;
            
            // ПОКАЧИВАНИЕ
            const swing = Math.sin(progress * Math.PI * 15) * 25;
            
            // ДВИГАЕМ ДЕДА
            dedulya.style.transform = `translateX(${now}px) translateY(${swing}px)`;
            
            if (progress < 1) {
                flightId = requestAnimationFrame(flyDed);
            } else {
                // КОНЕЦ ПОЛЕТА
                isFlying = false;
                flightStart = null;
                
                console.log(`Полет ${flightNum} завершен`);
                
                // ПОСЛЕ ПЕРВОГО ПОЛЕТА - ЕЛКА
                if (flightNum === 1) {
                    setTimeout(() => {
                        if (window.showTree) {
                            window.showTree();
                        }
                    }, 2000);
                }
                
                // ЖДЕМ И СНОВА ЛЕТИМ
                setTimeout(startFlight, 5000);
            }
        }
        
        // ЗАПУСК ПОЛЕТА
        window.startDedulyaFlight = function() {
            if (isFlying) return;
            
            flightNum++;
            console.log(`Полет ${flightNum} начался!`);
            isFlying = true;
            flightStart = null;
            
            // НАЧАЛЬНАЯ ПОЗИЦИЯ
            dedulya.style.transform = 'translateX(-800px) translateY(0px)';
            
            // ЗАПУСК АНИМАЦИИ
            requestAnimationFrame((time) => {
                flightId = requestAnimationFrame(flyDed);
            });
        };
        
        // ПЕРВЫЙ ПОЛЕТ ЧЕРЕЗ 3 СЕКУНДЫ
        setTimeout(window.startDedulyaFlight, 3000);
        
        // ЧИСТИМ ПРИ УХОДЕ
        window.addEventListener('beforeunload', function() {
            if (flightId) {
                cancelAnimationFrame(flightId);
            }
        });
    }
    
    // ФЕЙЕРВЕРКИ ПРИ КЛИКЕ
    document.addEventListener('click', function(e) {
        const colors = ['#7F55B1', '#9B7EBD', '#F49BAB', '#ffff00', '#FFE1E0'];
        
        for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.style.position = 'absolute';
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
            dot.style.width = '7px';
            dot.style.height = '7px';
            dot.style.borderRadius = '50%';
            dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            dot.style.zIndex = '1000';
            document.body.appendChild(dot);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            
            const anim = dot.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
            
            anim.onfinish = () => {
                if (dot.parentNode) {
                    dot.parentNode.removeChild(dot);
                }
            };
        }
    });
    
    // КОГДА МЫШКА УХОДИТ - СТОП
    document.addEventListener('mouseleave', function() {
        targetX = 0;
        targetY = 0;
    });
    
    // ПЛАВНОЕ ПОЯВЛЕНИЕ СТРАНИЦЫ
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
});

//  ЕЛКА
(function() {
    console.log('Загружаю елку...');
    
    // ЭЛЕМЕНТЫ ЕЛКИ
    const overlay = document.querySelector('.overlay');
    const tree = document.querySelector('.big-tree');
    const garlandBox = document.querySelector('.garland-container');
    const garland1 = document.querySelector('.light1');
    const garland2 = document.querySelector('.light2');
    const star = document.querySelector('.star');
    const text = document.querySelector('.new-year-text');
    
    // ПРОВЕРКА
    if (!overlay || !tree || !garlandBox) {
        console.log('Что-то не найдено');
        return;
    }
    
    // СОСТОЯНИЕ
    let treeVisible = false;
    let garlandOn = false;
    let starVisible = false;
    let blinkTimer = null;
    let clickHandler = null;
    
    // ПОКАЗАТЬ ЕЛКУ
    window.showTree = function() {
        if (treeVisible) return;
        
        console.log('Показываю елку');
        treeVisible = true;
        
        // ВЫКЛЮЧАЕМ ПАРАЛЛАКС
        if (window.stopParallax) {
            window.stopParallax();
        }
        
        // ТЕМНЕЕ ФОН
        overlay.style.backgroundColor = 'rgba(25, 18, 58, 0.5)';
        
        // ПОКАЗ ЕЛКИ
        setTimeout(() => {
            tree.classList.add('show');
            garlandBox.classList.add('show');
            
            // КЛИК ПО ЕЛКЕ
            setTimeout(() => {
                if (clickHandler) {
                    tree.removeEventListener('click', clickHandler);
                }
                
                clickHandler = function(e) {
                    const rect = tree.getBoundingClientRect();
                    const clickY = e.clientY - rect.top;
                    
                    // ЕСЛИ КЛИК ВНИЗУ - ГИРЛЯНДА
                    if (clickY > rect.height * 0.2) {
                        console.log('Включаю гирлянду');
                        toggleGarland();
                    } 
                    // ЕСЛИ КЛИК ВВЕРХУ - ЗВЕЗДА
                    else {
                        console.log('Зажигаю звезду');
                        showStar();
                    }
                };
                
                tree.addEventListener('click', clickHandler);
            }, 1000);
        }, 500);
    };
    
    // ГИРЛЯНДА ВКЛ/ВЫКЛ
    function toggleGarland() {
        if (!garlandOn) {
            console.log('Гирлянда включена');
            garlandOn = true;
            
            garland1.style.opacity = '1';
            garland2.style.opacity = '0';
            
            // МИГАНИЕ
            blinkTimer = setInterval(() => {
                if (garland1.style.opacity === '1') {
                    garland1.style.opacity = '0';
                    garland2.style.opacity = '1';
                } else {
                    garland1.style.opacity = '1';
                    garland2.style.opacity = '0';
                }
            }, 300);
        } else {
            console.log('Гирлянда выключена');
            garlandOn = false;
            
            if (blinkTimer) {
                clearInterval(blinkTimer);
                blinkTimer = null;
            }
            
            garland1.style.opacity = '0';
            garland2.style.opacity = '0';
        }
        
        checkText();
    }
    
    // ПОКАЗАТЬ ЗВЕЗДУ
    function showStar() {
        if (starVisible) return;
        
        console.log('Звезда зажглась');
        starVisible = true;
        
        if (star && tree) {
            star.style.left = '45%';
            star.style.top = '10%';
            star.classList.add('show');
        }
        
        checkText();
    }
    
    // ПРОВЕРКА ДЛЯ ТЕКСТА
    function checkText() {
        if (garlandOn && starVisible && text && !text.classList.contains('show')) {
            console.log('Показываю текст...');
            
            setTimeout(() => {
                text.classList.add('show');
            }, 3000);
        }
    }
})();