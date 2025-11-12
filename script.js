document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 50
    });

    // 2. Dark/Light Mode Toggle
    const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-desktop');
    const htmlEl = document.documentElement;

    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    };

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            
            // GSAP animation for background transition
            gsap.to('body', {
                backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-color'),
                duration: 0.5,
                ease: 'power1.inOut'
            });
    
            // Re-initialize Three.js scene with new colors if needed
            if (window.threeScene) {
                updateSceneTheme(newTheme);
            }
        });
    });

    // 3. Typing Animation
    const typingTextEl = document.getElementById('typing-text');
    const textToType = "Adv. Arslan Ahmad";
    let charIndex = 0;

    

    function type() {
        if (charIndex < textToType.length) {
            typingTextEl.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            // Optional: loop or just stop
            setTimeout(() => {
                typingTextEl.textContent = '';
                charIndex = 0;
                type();
            }, 3000); // Wait 3s before repeating
        }
    }
    type();

    // 4. Practice Area Typing Animation
    const practiceTypingEl = document.getElementById('practice-typing-text');
    const practiceAreasToType = ["Corporate Law", "Civil Litigation", "Family Law", "Property Law"];
    let practiceIndex = 0;
    let practiceCharIndex = 0;
    let isDeleting = false;

    function typePracticeArea() {
        const currentText = practiceAreasToType[practiceIndex];
        let typeSpeed = 120; // Slower typing speed

        if (isDeleting) {
            // Deleting text
            practiceTypingEl.textContent = currentText.substring(0, practiceCharIndex - 1);
            practiceCharIndex--;
            typeSpeed = 60; // Faster deleting
        } else {
            // Typing text
            practiceTypingEl.textContent = currentText.substring(0, practiceCharIndex + 1);
            practiceCharIndex++;
        }

        // Check if word is fully typed or deleted
        if (!isDeleting && practiceCharIndex === currentText.length) {
            // Pause at end of word
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && practiceCharIndex === 0) {
            // Move to next word
            isDeleting = false;
            practiceIndex = (practiceIndex + 1) % practiceAreasToType.length;
        }

        setTimeout(typePracticeArea, typeSpeed);
    }

    if (practiceTypingEl) {
        typePracticeArea();
    }

    // 4. GSAP Animations
    
    // CTA Button 3D Hover
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(btn => {
        gsap.set(btn, { transformPerspective: 800 });
        
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                duration: 0.3,
                scale: 1.05,
                y: -5,
                rotationX: -10,
                boxShadow: '0 15px 25px rgba(0,0,0,0.2)',
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                duration: 0.3,
                scale: 1,
                y: 0,
                rotationX: 0,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                ease: 'power2.out'
            });
        });
    });

    // Practice Card 3D Hover
    const practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach(card => {
        gsap.set(card, { transformPerspective: 1000 });

        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                y: -10,
                scale: 1.03,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                y: 0,
                scale: 1,
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                ease: 'power2.out'
            });
        });
    });
    
    // Social Icon Hover
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                duration: 0.2,
                scale: 1.2,
                y: -3,
                color: 'var(--accent-color)',
                ease: 'power1.out'
            });
        });
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                duration: 0.2,
                scale: 1,
                y: 0,
                color: 'var(--heading-color)',
                ease: 'power1.out'
            });
        });
    });


    // 5. Three.js Hero Background
    let scene, camera, renderer, scalesGroup, beam, leftPan, rightPan, particlesMesh;
    let goldMaterial, silverMaterial, baseMaterial;
    const state = { mouse: { x: 0, y: 0 } };
    const heroSection = document.getElementById('hero');
    const canvas = document.getElementById('three-canvas');
    const clock = new THREE.Clock();

    function initThree() {
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(75, heroSection.offsetWidth / heroSection.offsetHeight, 0.1, 1000);
        camera.position.set(0, 0, 15);

        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(heroSection.offsetWidth, heroSection.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0); // Fully transparent

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7);
        scene.add(mainLight);

        const rimLight = new THREE.SpotLight(0xd4af37, 2); // Gold rim light
        rimLight.position.set(-5, 5, -5);
        rimLight.lookAt(0, 0, 0);
        scene.add(rimLight);

        // --- Materials ---
        goldMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
        silverMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
        baseMaterial = new THREE.MeshStandardMaterial({ color: 0x1a202c, metalness: 0.5, roughness: 0.7 });

        // --- Constructing the "Scales of Justice" ---
        scalesGroup = new THREE.Group();

        // 1. The Central Pole
        const poleGeo = new THREE.CylinderGeometry(0.15, 0.25, 8, 32);
        const pole = new THREE.Mesh(poleGeo, baseMaterial);
        pole.position.y = -1;
        scalesGroup.add(pole);

        // 2. The Top Beam
        const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 32);
        beam = new THREE.Mesh(beamGeo, goldMaterial);
        beam.rotation.z = Math.PI / 2;
        beam.position.y = 3;
        scalesGroup.add(beam);

        // 3. The Pans (Left and Right)
        function createPan(xPos) {
            const panGroup = new THREE.Group();
            const stringGeo = new THREE.CylinderGeometry(0.02, 0.02, 3, 16);
            const string = new THREE.Mesh(stringGeo, silverMaterial);
            string.position.y = 1.5;
            panGroup.add(string);

            const plateGeo = new THREE.CylinderGeometry(1.2, 0.1, 0.5, 32);
            const plate = new THREE.Mesh(plateGeo, goldMaterial);
            plate.rotation.x = Math.PI;
            panGroup.add(plate);

            panGroup.position.set(xPos, 3 - 1.5, 0);
            return panGroup;
        }

        leftPan = createPan(-2.8);
        rightPan = createPan(2.8);
        scalesGroup.add(leftPan, rightPan);

        // 4. The Base
        const baseGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.5, 32);
        const base = new THREE.Mesh(baseGeo, baseMaterial);
        base.position.y = -5;
        scalesGroup.add(base);

        scene.add(scalesGroup);

        // --- Floating Particles ---
        const particlesGeo = new THREE.BufferGeometry();
        const particlesCount = 200;
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 25;
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMat = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xd4af37,
            transparent: true,
            opacity: 0.7
        });
        particlesMesh = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particlesMesh);

        // Store scene globally for theme toggler
        window.threeScene = scene;

        // Set initial theme and responsive state
        updateSceneTheme(htmlEl.getAttribute('data-bs-theme'));
        onWindowResize();
        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Rotate the whole scale based on mouse
        scalesGroup.rotation.y = Math.sin(time * 0.1) * 0.2 + (state.mouse.x * 0.5);

        // Bobbing effect for pans
        leftPan.position.y = 1.5 + Math.sin(time * 1.5) * 0.2;
        rightPan.position.y = 1.5 + Math.sin(time * 1.5 + Math.PI) * 0.2;

        // Tilt the beam
        beam.rotation.z = (Math.PI / 2) + (Math.sin(time * 1.5) * 0.05);

        // Mouse parallax for camera
        camera.position.x += (state.mouse.x * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (state.mouse.y * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        // Particles movement
        particlesMesh.rotation.y = time * 0.05;

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        const isMobile = window.innerWidth < 992; // Use Bootstrap's lg breakpoint

        camera.aspect = heroSection.offsetWidth / heroSection.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(heroSection.offsetWidth, heroSection.offsetHeight);

        // Responsive positioning and scaling
        if (isMobile) {
            scalesGroup.position.y = 4.5; // Taraazu ko mobile par neeche move karne ke liye
            scalesGroup.position.x = 0;
            scalesGroup.scale.set(1, 1, 1); // Increased mobile scale

            // Mobile view mein beam ko lamba karna aur pans ko door karna
            beam.scale.y = 1.5 ; // Beam ko 20% lamba karega
            leftPan.position.x = -4; // Left pan ko aur left move karega
            rightPan.position.x = 4; // Right pan ko aur right move karega
        } else {
            scalesGroup.position.y = 2; // Taraazu ko desktop par upar move karne ke liye
            scalesGroup.position.x = 12.5; // Adjusted position for larger scale
            scalesGroup.scale.set(1.6, 1.6, 1.6); // Increased desktop scale

            // Desktop view ke liye default values reset karna
            beam.scale.x = 1;
            leftPan.position.x = -2.8;
            rightPan.position.x = 2.8;
        }
    }
    
    // Function to be called by theme toggler
    window.updateSceneTheme = (newTheme) => {
        const isLight = newTheme === 'light';
        const gold = new THREE.Color(0xd4af37);
        const silver = new THREE.Color(0xaaaaaa);
        const darkBase = new THREE.Color(0x1a202c);
        const lightBase = new THREE.Color(0x8d99ae); // A cool grey for light mode

        gsap.to(goldMaterial.color, { r: gold.r, g: gold.g, b: gold.b, duration: 0.5 });
        gsap.to(silverMaterial.color, { r: silver.r, g: silver.g, b: silver.b, duration: 0.5 });
        gsap.to(baseMaterial.color, { r: isLight ? lightBase.r : darkBase.r, g: isLight ? lightBase.g : darkBase.g, b: isLight ? lightBase.b : darkBase.b, duration: 0.5 });
    };

    window.addEventListener('resize', onWindowResize);
    
    // Check if heroSection and canvas exist before initializing three.js
    if(heroSection && canvas) {
        initThree();
    }
    
    // Mouse Movement Listener for parallax
    window.addEventListener('mousemove', (event) => {
        state.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        state.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // 6. Bootstrap ScrollSpy Manual Refresh
    // Sometimes needed after dynamic content or JS init
    const scrollSpyEl = document.body;
    if (bootstrap.ScrollSpy.getInstance(scrollSpyEl)) {
        bootstrap.ScrollSpy.getInstance(scrollSpyEl).refresh();
    } else {
        const scrollSpy = new bootstrap.ScrollSpy(scrollSpyEl, {
            target: '#mainNavbar',
            offset: 80
        });
    }

    // Active link highlighting on scroll
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 85) { // 85px offset for navbar
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 7. Set Dynamic Copyright Year
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

});
