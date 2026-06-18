document.addEventListener('DOMContentLoaded', () => {
    // Utility function: Toast Alerts
    window.showToast = (message, type = 'success') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check_circle' : 'error';
        toast.innerHTML = `<i class="material-icons">${icon}</i><span>${message}</span>`;
        
        container.appendChild(toast);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'slideUpToast 0.3s ease reverse forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    };

    // Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if(themeToggle) themeToggle.innerHTML = '<i class="material-icons">light_mode</i>';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.innerHTML = isDark ? '<i class="material-icons">light_mode</i>' : '<i class="material-icons">dark_mode</i>';
        });
    }

    // Profile Dropdown Toggle
    const userProfileBtn = document.getElementById('user-profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (userProfileBtn && profileDropdown) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!userProfileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // Sidebar Mobile Toggle
    const menuToggle = document.querySelector('.header-btn[title="Menu"]');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Notification Drawer Toggle
    const notifBell = document.getElementById('notif-bell');
    const notifDrawer = document.getElementById('notif-drawer');
    const closeNotifDrawer = document.getElementById('close-notif-drawer');
    
    if (notifBell && notifDrawer) {
        notifBell.addEventListener('click', (e) => {
            e.preventDefault();
            notifDrawer.classList.add('active');
            
            // Mark notifications as read in backend
            fetch('/notifications/read', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const badge = notifBell.querySelector('.notif-badge');
                        if (badge) badge.remove();
                    }
                })
                .catch(err => console.error(err));
        });
    }
    
    if (closeNotifDrawer && notifDrawer) {
        closeNotifDrawer.addEventListener('click', () => {
            notifDrawer.classList.remove('active');
        });
    }

    // Search Bar Filtering (Dashboard and History)
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            // Filter history table
            const tableRows = document.querySelectorAll('.data-table tbody tr');
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
            
            // Filter activity items
            const activityItems = document.querySelectorAll('.activity-item');
            activityItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? '' : 'none';
            });
            
            // Filter quick action cards
            const cards = document.querySelectorAll('.grid-cols-3 .card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    // Retina Scan Upload and Classification (upload.html)
    const fileInput = document.getElementById('retina-file');
    const dropzone = document.getElementById('upload-dropzone');
    const classifyBtn = document.getElementById('classify-btn');
    const eyeSideSelect = document.getElementById('eye-side');
    const previewContainer = document.getElementById('upload-preview-container');
    const previewImg = document.getElementById('upload-preview-img');
    const previewName = document.getElementById('upload-preview-name');
    
    const progressPanel = document.getElementById('progress-panel');
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    
    const resultPanel = document.getElementById('result-panel');
    const resultImg = document.getElementById('result-img');
    const resultFilename = document.getElementById('result-filename');
    const resultEye = document.getElementById('result-eye');
    const resultDate = document.getElementById('result-date');
    const resultSeverity = document.getElementById('result-severity');
    const resultTitle = document.getElementById('result-title');
    const resultDesc = document.getElementById('result-desc');
    const resultRec = document.getElementById('result-rec');
    
    // File selection logic
    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--primary)';
            dropzone.style.backgroundColor = 'var(--primary-light)';
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.style.borderColor = 'var(--border-color)';
            dropzone.style.backgroundColor = 'var(--bg-card)';
        });
        
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--border-color)';
            dropzone.style.backgroundColor = 'var(--bg-card)';
            
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelected(e.dataTransfer.files[0]);
            }
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                handleFileSelected(fileInput.files[0]);
            }
        });
    }
    
    function handleFileSelected(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid retinal image file (PNG/JPG).', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewName.textContent = file.name;
            previewContainer.style.display = 'block';
            if (classifyBtn) classifyBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    // Classification Submit
    if (classifyBtn && fileInput) {
        classifyBtn.addEventListener('click', () => {
            const file = fileInput.files[0];
            if (!file) return;
            
            classifyBtn.disabled = true;
            progressPanel.style.display = 'block';
            resultPanel.style.display = 'none';
            
            // Setup Form Data
            const formData = new FormData();
            formData.append('file', file);
            formData.append('eye_side', eyeSideSelect ? eyeSideSelect.value : 'Right');
            
            // Progress Bar simulation while waiting for API
            let progress = 0;
            const progressInterval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.floor(Math.random() * 10) + 2;
                    if (progress > 90) progress = 90;
                    updateProgressBar(progress);
                }
            }, 150);
            
            // Send request
            fetch('/classify', {
                method: 'POST',
                body: formData
            })
            .then(res => {
                if (!res.ok) throw new Error('Classification Failed');
                return res.json();
            })
            .then(data => {
                clearInterval(progressInterval);
                updateProgressBar(100);
                
                setTimeout(() => {
                    progressPanel.style.display = 'none';
                    // Populate result details
                    resultImg.src = data.image_url;
                    resultFilename.textContent = data.file_name;
                    resultEye.textContent = data.eye_side;
                    resultDate.textContent = data.date;
                    
                    // Reset classes on severity badge
                    resultSeverity.className = 'severity-pill';
                    resultSeverity.classList.add(data.badge_class);
                    resultSeverity.textContent = data.result;
                    
                    resultTitle.textContent = data.title;
                    resultDesc.textContent = data.description;
                    resultRec.textContent = data.recommendation;
                    
                    resultPanel.style.display = 'block';
                    showToast(`Classification Successful: Scan classified as ${data.result}.`, 'success');
                    
                    // Scroll to results
                    resultPanel.scrollIntoView({ behavior: 'smooth' });
                }, 400);
            })
            .catch(err => {
                clearInterval(progressInterval);
                progressPanel.style.display = 'none';
                classifyBtn.disabled = false;
                showToast('An error occurred during scan classification.', 'error');
                console.error(err);
            });
        });
    }
    
    function updateProgressBar(percentage) {
        if (progressFill && progressPercent) {
            progressFill.style.width = `${percentage}%`;
            progressPercent.textContent = `${percentage}%`;
        }
    }

    // Reports History Modal Loader (history.html)
    const reportModal = document.getElementById('report-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const viewReportBtns = document.querySelectorAll('.view-report-btn');
    
    if (viewReportBtns.length > 0 && reportModal) {
        viewReportBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const scanId = btn.getAttribute('data-id');
                
                // Fetch details
                fetch(`/report/${scanId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        showToast(data.error, 'error');
                        return;
                    }
                    
                    // Fill modal elements
                    document.getElementById('modal-img').src = data.image_url;
                    document.getElementById('modal-filename').textContent = data.file_name;
                    document.getElementById('modal-eye').textContent = data.eye_side;
                    document.getElementById('modal-date').textContent = data.date;
                    
                    const badge = document.getElementById('modal-severity');
                    badge.className = 'severity-pill';
                    badge.classList.add(data.badge_class);
                    badge.textContent = data.result;
                    
                    document.getElementById('modal-confidence').textContent = data.confidence;
                    document.getElementById('modal-title').textContent = data.title;
                    document.getElementById('modal-desc').textContent = data.description;
                    document.getElementById('modal-rec').textContent = data.recommendation;
                    
                    // Show modal
                    reportModal.classList.add('active');
                })
                .catch(err => {
                    showToast('Failed to retrieve report information.', 'error');
                    console.error(err);
                });
            });
        });
    }
    
    if (closeModalBtn && reportModal) {
        closeModalBtn.addEventListener('click', () => {
            reportModal.classList.remove('active');
        });
        
        // Close modal when clicking outside contents
        reportModal.addEventListener('click', (e) => {
            if (e.target === reportModal) {
                reportModal.classList.remove('active');
            }
        });
    }

    // Chatbot Support Interactivity (chatbot.html)
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatHistory = document.getElementById('chat-history');
    const suggestionPills = document.querySelectorAll('.suggestion-pill');
    
    if (chatForm && chatInput && chatHistory) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            
            chatInput.value = '';
            
            // Append User bubble
            appendChatBubble(text, 'user');
            
            // Scroll to bottom
            scrollToBottom(chatHistory);
            
            // Send AJAX
            fetch('/chatbot/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                appendChatBubble(data.response, 'bot', data.timestamp);
                scrollToBottom(chatHistory);
            })
            .catch(err => {
                appendChatBubble('Sorry, I encountered an error. Please try again.', 'bot');
                scrollToBottom(chatHistory);
                console.error(err);
            });
        });
        
        // Suggestion Pills
        if (suggestionPills.length > 0) {
            suggestionPills.forEach(pill => {
                pill.addEventListener('click', () => {
                    chatInput.value = pill.textContent.trim();
                    chatForm.dispatchEvent(new Event('submit'));
                });
            });
        }
        
        // Helper to append bubble
        function appendChatBubble(message, sender, time = null) {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${sender}`;
            
            const timeStr = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            bubble.innerHTML = `${message}<span class="chat-bubble-time">${timeStr}</span>`;
            
            chatHistory.appendChild(bubble);
        }
        
        function scrollToBottom(el) {
            el.scrollTop = el.scrollHeight;
        }
        
        // Auto-scroll on initial load
        scrollToBottom(chatHistory);
    }
});
