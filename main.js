/**
 * IT Support - Main JavaScript
 * Handles SPA Routing, FAQ logic, Form Validation, and Theme Toggling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Data ---
    const faqData = [
        {
            id: 1,
            category: 'getting-started',
            question: 'How do I set up my account for the first time?',
            answer: 'To set up your account, click the "Sign Up" button in the top right corner. You will need your employee ID and a valid company email address. Follow the link sent to your email to verify your identity and set your password.'
        },
        {
            id: 2,
            category: 'getting-started',
            question: 'Where can I find the user manual for the new dashboard?',
            answer: 'The comprehensive user manual is available under the "Resources" tab in your dashboard. You can also download a PDF version for offline viewing from the "Downloads" section of the help center.'
        },
        {
            id: 3,
            category: 'account-billing',
            question: 'How can I change my subscription plan?',
            answer: 'You can change your subscription plan directly from the "Billing" section of your account settings. Select "Update Plan" and choose the tier that best fits your needs. Changes will be reflected in the next billing cycle.'
        },
        {
            id: 4,
            category: 'account-billing',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and direct bank transfers for enterprise accounts. You can manage your payment methods in the "Payment" tab.'
        },
        {
            id: 5,
            category: 'technical-issues',
            question: 'What should I do if the app is crashing on startup?',
            answer: 'First, ensure you are running the latest version of the app. Clear your browser cache or app data and restart your device. If the issue persists, please check our Status page for ongoing outages or submit a bug report via the contact form.'
        },
        {
            id: 6,
            category: 'technical-issues',
            question: 'How do I recover a deleted file?',
            answer: 'Files deleted within the last 30 days can be recovered from the "Trash" folder in your drive. If the file was deleted more than 30 days ago, it might be permanently removed unless you have an enterprise-level backup enabled.'
        },
        {
            id: 7,
            category: 'getting-started',
            question: 'Can I use IT Support on multiple devices?',
            answer: 'Yes, you can log in to your account from up to 5 devices simultaneously. This includes web browsers, mobile phones, and tablets. Active sessions can be managed from the "Security" tab in your profile.'
        },
        {
            id: 8,
            category: 'technical-issues',
            question: 'How do I reset my API key?',
            answer: 'Navigate to the "Developer" settings in your profile. Click on "Rotate Key" next to your active API key. Please note that rotating your key will immediately invalidate the previous one.'
        }
    ];

    // --- State Management ---
    const state = {
        currentPage: 'home',
        faqFilter: 'all',
        faqSearchQuery: '',
        isDarkMode: localStorage.getItem('theme') === 'dark'
    };

    // --- Elements ---
    const appContainer = document.getElementById('app');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a, .btn-ticket, .footer-links a');
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const faqList = document.getElementById('faq-list');
    const faqSearchInput = document.getElementById('faq-search');
    const heroSearchInput = document.getElementById('hero-search');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const supportForm = document.getElementById('support-form');
    const formSuccess = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('reset-form');
    const attachmentInput = document.getElementById('attachment');
    const fileNamePreview = document.getElementById('file-name');
    const floatingHelpBtn = document.getElementById('floating-help');

    // --- Initialization ---
    function init() {
        applyTheme();
        handleRouting();
        renderFAQ();
        window.addEventListener('hashchange', handleRouting);
    }

    // --- Routing ---
    function handleRouting() {
        const hash = window.location.hash.replace('#', '') || 'home';
        state.currentPage = hash;

        sections.forEach(section => {
            section.classList.remove('active-section');
            if (section.id === hash) {
                section.classList.add('active-section');
            }
        });

        // Update Nav Active State
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${hash}`) {
                link.classList.add('active');
            }
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Theme Logic ---
    themeToggle.addEventListener('click', () => {
        state.isDarkMode = !state.isDarkMode;
        localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
        applyTheme();
    });

    function applyTheme() {
        if (state.isDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // --- FAQ Logic ---
    function renderFAQ() {
        if (!faqList) return;

        const filtered = faqData.filter(item => {
            const matchesCategory = state.faqFilter === 'all' || item.category === state.faqFilter;
            const matchesSearch = item.question.toLowerCase().includes(state.faqSearchQuery.toLowerCase()) || 
                                 item.answer.toLowerCase().includes(state.faqSearchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        faqList.innerHTML = filtered.length > 0 ? '' : '<p class="text-center">No results found for your search.</p>';

        filtered.forEach(item => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            
            // Highlight search matches
            let questionHtml = item.question;
            let answerHtml = item.answer;
            if (state.faqSearchQuery) {
                const regex = new RegExp(`(${state.faqSearchQuery})`, 'gi');
                questionHtml = item.question.replace(regex, '<span class="highlight">$1</span>');
                answerHtml = item.answer.replace(regex, '<span class="highlight">$1</span>');
            }

            faqItem.innerHTML = `
                <button class="faq-question" aria-expanded="false">
                    <span>${questionHtml}</span>
                    <span class="chevron">▼</span>
                </button>
                <div class="faq-answer">
                    <p>${answerHtml}</p>
                </div>
            `;

            faqItem.querySelector('.faq-question').addEventListener('click', () => {
                const isActive = faqItem.classList.contains('active');
                // Close others
                document.querySelectorAll('.faq-item').forEach(el => {
                    el.classList.remove('active');
                    el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });
                
                if (!isActive) {
                    faqItem.classList.add('active');
                    faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
                }
            });

            faqList.appendChild(faqItem);
        });
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.faqFilter = tab.dataset.category;
            renderFAQ();
        });
    });

    faqSearchInput.addEventListener('input', (e) => {
        state.faqSearchQuery = e.target.value;
        renderFAQ();
    });

    heroSearchInput.addEventListener('input', (e) => {
        state.faqSearchQuery = e.target.value;
        // If user is searching on hero, we should probably redirect to FAQ if they press enter or start typing
        // but for now, we'll just update state and let them navigate.
    });

    heroSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            window.location.hash = 'faq';
            renderFAQ();
        }
    });

    // --- Form Logic ---
    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm()) {
                // Simulate submission
                supportForm.style.display = 'none';
                formSuccess.style.display = 'block';
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    function validateForm() {
        let isValid = true;
        const inputs = supportForm.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            if (!input.value.trim()) {
                formGroup.classList.add('invalid');
                isValid = false;
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                formGroup.classList.add('invalid');
                isValid = false;
            } else {
                formGroup.classList.remove('invalid');
            }
        });

        return isValid;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    resetFormBtn.addEventListener('click', () => {
        supportForm.reset();
        supportForm.style.display = 'block';
        formSuccess.style.display = 'none';
        fileNamePreview.textContent = '';
    });

    attachmentInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNamePreview.textContent = `Selected: ${e.target.files[0].name}`;
        }
    });

    // --- Helpers ---
    floatingHelpBtn.addEventListener('click', () => {
        window.location.hash = 'contact';
    });

    // Global keyboard shortcut
    window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            heroSearchInput.focus();
            // If on FAQ page, focus FAQ search
            if (state.currentPage === 'faq') {
                faqSearchInput.focus();
            }
        }
    });

    init();
});
