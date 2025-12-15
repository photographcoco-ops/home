/* 
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio site initialized');

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Populate Gallery with Real Images
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        galleryGrid.innerHTML = ''; // Clear loading message
        const images = [
            'DSC07580.jpg', 'DSC07590.jpg', 'DSC07610.jpg',
            'DSC07684.jpg', 'DSC07686.jpg', 'DSC08243.jpg',
            'DSC08372.jpg', 'DSC09003.jpg', 'DSC09080.jpg',
            'DSC09317.jpg', 'DSC09375.jpg', 'DSC04951.jpg'
        ];

        images.forEach((filename, i) => {
            const item = document.createElement('div');
            item.className = 'gallery-item fade-in';

            const img = document.createElement('img');
            img.src = `assets/images/${filename}`;
            img.alt = `Portfolio Image ${i + 1}`;
            img.loading = 'lazy'; // Performance optimization

            item.appendChild(img);
            observer.observe(item);
            galleryGrid.appendChild(item);
        });
    }
});
