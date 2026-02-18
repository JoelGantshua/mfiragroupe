// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const alertMessage = document.getElementById('alert-message');
    
    // Check if already logged in
    if (localStorage.getItem('auth_token')) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
        submitBtn.disabled = true;
        
        try {
            // Check credentials
            if (email === 'aggroupe@gmail.com' && password === 'Aggroupe1@') {
                // Create session token
                const token = btoa(JSON.stringify({
                    email: email,
                    timestamp: Date.now()
                }));
                
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user_email', email);
                
                // Show success message
                showAlert('Connexion réussie ! Redirection...', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showAlert('Email ou mot de passe incorrect', 'danger');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('Une erreur est survenue. Veuillez réessayer.', 'danger');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    function showAlert(message, type) {
        alertMessage.textContent = message;
        alertMessage.className = `alert alert-${type}`;
        alertMessage.style.display = 'block';
        
        setTimeout(() => {
            alertMessage.style.display = 'none';
        }, 5000);
    }
});

