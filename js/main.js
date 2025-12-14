// Mario Digital Signature - Matrix Rain Effect
// Secure, performant, and accessible implementation

(function() {
    'use strict';
    
    // Configuration constants
    const CONFIG = {
        INITIAL_COLUMNS: 15,
        COLUMN_CREATION_INTERVAL: 800,
        MAX_COLUMNS: 50,
        MIN_COLUMN_LENGTH: 10,
        MAX_COLUMN_LENGTH: 30,
        MIN_ANIMATION_DURATION: 15,
        MAX_ANIMATION_DURATION: 25,
        MIN_COLUMN_INTERVAL: 100, // Rate limiting
        CLEANUP_INTERVAL: 5000,
        REDUCED_MOTION_INTERVAL: 2000
    };
    
    // Character set for rain effect
    const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // State management
    let matrixRain = null;
    let rainInterval = null;
    let cleanupInterval = null;
    let lastColumnTime = 0;
    let cachedColumns = null;
    
    // Initialize application
    function init() {
        try {
            matrixRain = document.getElementById('matrix-rain');
            if (!matrixRain) {
                console.error('Matrix rain container not found');
                return;
            }
            
            setupEventListeners();
            createCircuitBoard();
            createInitialRain();
            startRainGeneration();
            startCleanup();
            
            console.log('Mario Digital Signature initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Mario Digital Signature:', error);
        }
    }
    
    // Create circuit board background
    function createCircuitBoard() {
        try {
            const circuitBoard = document.createElement('div');
            circuitBoard.className = 'circuit-board';
            document.body.appendChild(circuitBoard);

            // Create circuit paths
            const paths = [
                { top: '20%', left: '10%', width: '30%', height: '2px', delay: 0 },
                { top: '40%', left: '60%', width: '25%', height: '2px', delay: 2 },
                { top: '60%', left: '20%', width: '40%', height: '2px', delay: 4 },
                { top: '80%', left: '50%', width: '35%', height: '2px', delay: 6 },
                { top: '30%', left: '80%', width: '15%', height: '2px', delay: 1 },
                { top: '70%', left: '5%', width: '20%', height: '2px', delay: 3 },
                { top: '50%', left: '35%', width: '30%', height: '2px', delay: 5 },
                { top: '15%', left: '70%', width: '25%', height: '2px', delay: 7 }
            ];

            paths.forEach(path => {
                const pathElement = document.createElement('div');
                pathElement.className = 'circuit-path';
                pathElement.style.top = path.top;
                pathElement.style.left = path.left;
                pathElement.style.width = path.width;
                pathElement.style.height = path.height;
                pathElement.style.animationDelay = path.delay + 's';
                circuitBoard.appendChild(pathElement);
            });

        } catch (error) {
            console.error('Failed to create circuit board:', error);
        }
    }



    // Create a single rain column safely
    function createRainColumn() {
        try {
            // Rate limiting to prevent performance issues
            const now = Date.now();
            if (now - lastColumnTime < CONFIG.MIN_COLUMN_INTERVAL) {
                return;
            }
            lastColumnTime = now;
            
            // Check maximum column limit
            const currentColumns = matrixRain.querySelectorAll('.rain-column');
            if (currentColumns.length >= CONFIG.MAX_COLUMNS) {
                return;
            }
            
            const column = document.createElement('div');
            column.className = 'rain-column';
            
            // Random position
            const x = Math.random() * 100;
            column.style.left = x + '%';
            
            // Random content - safe DOM manipulation
            const length = Math.floor(Math.random() * (CONFIG.MAX_COLUMN_LENGTH - CONFIG.MIN_COLUMN_LENGTH)) + CONFIG.MIN_COLUMN_LENGTH;
            for (let i = 0; i < length; i++) {
                const char = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
                column.appendChild(document.createTextNode(char));
                column.appendChild(document.createElement('br'));
            }
            
            // Random animation duration
            const duration = Math.random() * (CONFIG.MAX_ANIMATION_DURATION - CONFIG.MIN_ANIMATION_DURATION) + CONFIG.MIN_ANIMATION_DURATION;
            column.style.animationDuration = duration + 's';
            
            // Random delay
            const delay = Math.random() * 10;
            column.style.animationDelay = delay + 's';
            
            matrixRain.appendChild(column);
            
            // Schedule removal after animation
            setTimeout(() => {
                removeColumn(column);
            }, (duration + delay) * 1000);
            
        } catch (error) {
            console.error('Failed to create rain column:', error);
        }
    }
    
    // Safely remove a column
    function removeColumn(column) {
        try {
            if (column && column.parentNode) {
                column.parentNode.removeChild(column);
            }
        } catch (error) {
            console.error('Failed to remove column:', error);
        }
    }
    
    // Create initial rain columns - start immediately
    function createInitialRain() {
        for (let i = 0; i < CONFIG.INITIAL_COLUMNS; i++) {
            createRainColumn(); // No delay - start immediately
        }
    }
    
    // Start continuous rain generation
    function startRainGeneration() {
        const interval = window.matchMedia('(prefers-reduced-motion: reduce)').matches 
            ? CONFIG.REDUCED_MOTION_INTERVAL 
            : CONFIG.COLUMN_CREATION_INTERVAL;
            
        rainInterval = setInterval(createRainColumn, interval);
    }
    
    // Cleanup old columns to prevent memory leaks
    function cleanupOldColumns() {
        try {
            const columns = matrixRain.querySelectorAll('.rain-column');
            if (columns.length > CONFIG.MAX_COLUMNS / 2) {
                // Remove oldest columns
                for (let i = 0; i < Math.min(10, columns.length - CONFIG.MAX_COLUMNS / 2); i++) {
                    removeColumn(columns[i]);
                }
            }
        } catch (error) {
            console.error('Cleanup failed:', error);
        }
    }
    
    // Start periodic cleanup
    function startCleanup() {
        cleanupInterval = setInterval(cleanupOldColumns, CONFIG.CLEANUP_INTERVAL);
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Visibility change for performance optimization
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Reduced motion preference
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        reducedMotionQuery.addListener(handleReducedMotionChange);
        
        // Page unload cleanup
        window.addEventListener('beforeunload', cleanup);
        
        // Keyboard navigation for logo
        const logo = document.getElementById('logo');
        if (logo) {
            logo.addEventListener('keydown', handleLogoKeydown);
        }

        // Component hover effects for connection paths
        setupComponentHoverEffects();
    }
    
    // Handle visibility change
    function handleVisibilityChange() {
        try {
            if (!cachedColumns) {
                cachedColumns = matrixRain.querySelectorAll('.rain-column');
            }
            
            const isHidden = document.hidden;
            cachedColumns.forEach(column => {
                if (column && column.style) {
                    column.style.animationPlayState = isHidden ? 'paused' : 'running';
                }
            });
        } catch (error) {
            console.error('Visibility change handler failed:', error);
        }
    }
    
    // Handle reduced motion preference change
    function handleReducedMotionChange() {
        try {
            if (rainInterval) {
                clearInterval(rainInterval);
            }
            startRainGeneration();
        } catch (error) {
            console.error('Reduced motion handler failed:', error);
        }
    }
    
    // Handle logo keyboard interaction
    function handleLogoKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            // Could add interaction here if needed
            console.log('Mario Digital Signature activated');
        }
    }

    // Setup component hover effects
    function setupComponentHoverEffects() {
        const components = ['github', 'linkedin', 'instagram', 'twitter'];

        components.forEach(component => {
            const link = document.getElementById(`${component}-link`);
            const path = document.getElementById(`${component}-path`);

            if (link && path) {
                link.addEventListener('mouseenter', () => {
                    path.classList.add('active');
                });

                link.addEventListener('mouseleave', () => {
                    path.classList.remove('active');
                });
            }
        });
    }
    
    // Cleanup function
    function cleanup() {
        try {
            if (rainInterval) {
                clearInterval(rainInterval);
            }
            if (cleanupInterval) {
                clearInterval(cleanupInterval);
            }
            
            // Remove all columns
            const columns = matrixRain.querySelectorAll('.rain-column');
            columns.forEach(removeColumn);
            
        } catch (error) {
            console.error('Cleanup failed:', error);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose cleanup function for external use if needed
    window.MarioSignature = {
        cleanup: cleanup,
        createColumn: createRainColumn
    };
    
})();