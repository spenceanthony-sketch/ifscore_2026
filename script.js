function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[onclick="showPage('${pageName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === 'demo@ifscore.com' && password === '123456') {
        alert('Login realizado com sucesso!');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        showPage('placar');
    } else {
        alert('Email ou senha inválidos!');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showPage('home');
});
