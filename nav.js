document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject the Spinner
    const spinner = document.createElement('div');
    spinner.id = 'spinner';
    spinner.innerHTML = '<div class="lu-spinner"></div>';
    document.body.prepend(spinner);

    // 2. Inject the Header
    const header = document.createElement('header');
    header.innerHTML = `
        <a href="index.html" class="logo-box">
            <div class="logo-icon">LU</div>
            <div class="logo-text">CONNECT</div>
        </a>
        <button class="menu-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open')">☰</button>
    `;
    document.body.prepend(header);

    // 3. Inject the Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
        <a href="index.html">Home</a>
        <a href="download.html">Download App</a>
        <a href="about.html">About Us</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="contact.html">Contact Us</a>
    `;
    document.body.insertBefore(sidebar, document.body.children[2]);

    // 4. Inject the Premium Footer
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div class="footer-grid">
            <div class="footer-col">
                <h4>LU Connect</h4>
                <p style="color: #6d7382; font-size: 14px; line-height: 1.6;">The exclusive social network for Kenyan university students.</p>
            </div>
            <div class="footer-col">
                <h4>Product</h4>
                <a href="download.html">Download App</a>
                <a href="about.html">About Us</a>
            </div>
            <div class="footer-col">
                <h4>Legal</h4>
                <a href="privacy.html">Privacy Policy</a>
                <a href="contact.html">Contact Support</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2026 LU Connect. Built by <strong>Samuel Mugasia</strong>. All rights reserved.</p>
        </div>
    `;
    document.body.appendChild(footer);

    // 5. Hide spinner after load
    setTimeout(() => {
        spinner.style.opacity = '0';
        setTimeout(() => spinner.remove(), 500);
    }, 800);

    // 6. Highlight active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    sidebar.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });
});
