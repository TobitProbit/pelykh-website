/* ============================================
   Young Investor's Valuation Course
   Interactive JavaScript
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // Theme Toggle (Dark Mode)
  // ============================================
  const initTheme = () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Get saved theme or use system preference
    const getSavedTheme = () => {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return prefersDark.matches ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    };

    // Initialize theme
    setTheme(getSavedTheme());

    // Toggle handler
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Listen for system preference changes
    prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  };

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  const initMobileNav = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        navToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
          navLinks.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  };

  // ============================================
  // Progress Tracking
  // ============================================
  const Progress = {
    STORAGE_KEY: 'valuation-course-progress',

    get: () => {
      try {
        const data = localStorage.getItem(Progress.STORAGE_KEY);
        return data ? JSON.parse(data) : { completedModules: [], currentModule: 1 };
      } catch {
        return { completedModules: [], currentModule: 1 };
      }
    },

    save: (data) => {
      try {
        localStorage.setItem(Progress.STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('Could not save progress:', e);
      }
    },

    completeModule: (moduleNum) => {
      const progress = Progress.get();
      if (!progress.completedModules.includes(moduleNum)) {
        progress.completedModules.push(moduleNum);
        progress.currentModule = Math.max(progress.currentModule, moduleNum + 1);
        Progress.save(progress);
      }
      return progress;
    },

    isModuleCompleted: (moduleNum) => {
      return Progress.get().completedModules.includes(moduleNum);
    },

    getCompletionPercentage: () => {
      const progress = Progress.get();
      return Math.round((progress.completedModules.length / 6) * 100);
    }
  };

  const initProgress = () => {
    const progress = Progress.get();

    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = Progress.getCompletionPercentage() + '%';
    }

    // Update module progress indicators
    document.querySelectorAll('.module-progress-item').forEach((item) => {
      const moduleNum = parseInt(item.dataset.module, 10);
      if (progress.completedModules.includes(moduleNum)) {
        item.classList.add('completed');
        const checkIcon = item.querySelector('.check-icon');
        if (checkIcon) checkIcon.style.display = 'inline';
      }
    });

    // Update module cards on landing page
    document.querySelectorAll('.module-card').forEach((card) => {
      const moduleNum = parseInt(card.dataset.module, 10);
      if (progress.completedModules.includes(moduleNum)) {
        card.classList.add('completed');
        const status = card.querySelector('.module-status');
        if (status) {
          status.innerHTML = '<svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Completed';
          status.classList.add('completed');
        }
      }
    });

    // Complete module button
    const completeBtn = document.querySelector('.complete-module-btn');
    if (completeBtn) {
      const moduleNum = parseInt(completeBtn.dataset.module, 10);

      if (Progress.isModuleCompleted(moduleNum)) {
        completeBtn.innerHTML = '<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Module Completed';
        completeBtn.classList.add('completed');
      }

      completeBtn.addEventListener('click', () => {
        if (!completeBtn.classList.contains('completed')) {
          Progress.completeModule(moduleNum);
          completeBtn.innerHTML = '<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Module Completed';
          completeBtn.classList.add('completed');
          showToast('Module completed! Great work!', 'success');

          // Update progress bar
          const progressBar = document.querySelector('.progress-bar');
          if (progressBar) {
            progressBar.style.width = Progress.getCompletionPercentage() + '%';
          }
        }
      });
    }
  };

  // ============================================
  // Reading Progress Bar
  // ============================================
  const initReadingProgress = () => {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar || !document.querySelector('main')) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      // Combine reading progress with module completion
      const moduleProgress = Progress.getCompletionPercentage();
      const currentModuleNum = parseInt(document.body.dataset.module || '0', 10);

      if (currentModuleNum > 0) {
        // On a module page, show reading progress
        const baseProgress = ((currentModuleNum - 1) / 6) * 100;
        const moduleContribution = (scrollPercent / 100) * (100 / 6);
        progressBar.style.width = Math.min(baseProgress + moduleContribution, 100) + '%';
      } else {
        // On landing/other pages, show overall progress
        progressBar.style.width = moduleProgress + '%';
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  };

  // ============================================
  // Collapsible Sections
  // ============================================
  const initCollapsibles = () => {
    document.querySelectorAll('.collapsible').forEach((collapsible) => {
      const header = collapsible.querySelector('.collapsible-header');
      const content = collapsible.querySelector('.collapsible-content');

      if (header && content) {
        header.addEventListener('click', () => {
          collapsible.classList.toggle('open');
          const isOpen = collapsible.classList.contains('open');
          header.setAttribute('aria-expanded', isOpen);
          content.setAttribute('aria-hidden', !isOpen);
        });

        // Initialize ARIA attributes
        header.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
      }
    });
  };

  // ============================================
  // Quiz Functionality
  // ============================================
  const initQuizzes = () => {
    document.querySelectorAll('.quiz-question').forEach((question) => {
      const options = question.querySelectorAll('.quiz-option');
      const feedback = question.querySelector('.quiz-feedback');
      const correctAnswer = question.dataset.correct;

      options.forEach((option) => {
        option.addEventListener('click', () => {
          // Remove previous selections
          options.forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
          });

          // Mark selection
          option.classList.add('selected');
          const radio = option.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;

          // Check answer
          const isCorrect = option.dataset.value === correctAnswer;
          option.classList.add(isCorrect ? 'correct' : 'incorrect');

          // Show correct answer if wrong
          if (!isCorrect) {
            options.forEach(opt => {
              if (opt.dataset.value === correctAnswer) {
                opt.classList.add('correct');
              }
            });
          }

          // Show feedback
          if (feedback) {
            feedback.classList.add('show');
            feedback.classList.remove('correct', 'incorrect');
            feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
            feedback.textContent = isCorrect
              ? (question.dataset.correctFeedback || 'Correct!')
              : (question.dataset.incorrectFeedback || 'Not quite. ' + (question.dataset.explanation || ''));
          }
        });
      });
    });
  };

  // ============================================
  // Fill in the Blank Exercises
  // ============================================
  const initFillBlanks = () => {
    document.querySelectorAll('.fill-blank input').forEach((input) => {
      const correctAnswer = input.dataset.answer;
      const tolerance = parseFloat(input.dataset.tolerance || '0');

      input.addEventListener('blur', () => {
        const userAnswer = parseFloat(input.value.replace(/[^0-9.-]/g, ''));
        const correct = parseFloat(correctAnswer);

        if (!isNaN(userAnswer)) {
          const isCorrect = Math.abs(userAnswer - correct) <= tolerance;
          input.classList.remove('correct', 'incorrect');
          input.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
    });
  };

  // ============================================
  // Investment Dilemmas
  // ============================================
  const initDilemmas = () => {
    document.querySelectorAll('.dilemma-box').forEach((dilemma) => {
      const options = dilemma.querySelectorAll('.dilemma-option');
      const reveal = dilemma.querySelector('.dilemma-reveal');

      options.forEach((option) => {
        option.addEventListener('click', () => {
          // Remove previous selections
          options.forEach(opt => opt.classList.remove('selected'));

          // Mark selection
          option.classList.add('selected');

          // Show reveal
          if (reveal) {
            reveal.classList.add('show');
          }
        });
      });
    });
  };

  // ============================================
  // Copy to Clipboard
  // ============================================
  const initCopyButtons = () => {
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const targetId = btn.dataset.target;
        const target = document.getElementById(targetId);

        if (!target) return;

        const text = target.textContent || target.innerText;

        try {
          await navigator.clipboard.writeText(text);

          const originalText = btn.innerHTML;
          btn.innerHTML = '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Copied!';
          btn.classList.add('copied');

          showToast('Prompt copied to clipboard!', 'success');

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          showToast('Failed to copy. Please try again.', 'error');
        }
      });
    });
  };

  // ============================================
  // Toast Notifications
  // ============================================
  let toastTimeout;

  const showToast = (message, type = 'default') => {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    // Show toast
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Hide after delay
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Make showToast globally accessible
  window.showToast = showToast;

  // ============================================
  // Comments & Likes (localStorage-based)
  // ============================================
  const Comments = {
    STORAGE_KEY: 'valuation-course-comments',

    getAll: () => {
      try {
        const data = localStorage.getItem(Comments.STORAGE_KEY);
        return data ? JSON.parse(data) : {};
      } catch {
        return {};
      }
    },

    getForPage: (pageId) => {
      const all = Comments.getAll();
      return all[pageId] || { likes: 0, liked: false, comments: [] };
    },

    save: (pageId, data) => {
      try {
        const all = Comments.getAll();
        all[pageId] = data;
        localStorage.setItem(Comments.STORAGE_KEY, JSON.stringify(all));
      } catch (e) {
        console.warn('Could not save comments:', e);
      }
    },

    addComment: (pageId, author, content) => {
      const pageData = Comments.getForPage(pageId);
      pageData.comments.push({
        id: Date.now(),
        author: author || 'Anonymous',
        content,
        date: new Date().toISOString()
      });
      Comments.save(pageId, pageData);
      return pageData;
    },

    toggleLike: (pageId) => {
      const pageData = Comments.getForPage(pageId);
      if (pageData.liked) {
        pageData.likes = Math.max(0, pageData.likes - 1);
        pageData.liked = false;
      } else {
        pageData.likes += 1;
        pageData.liked = true;
      }
      Comments.save(pageId, pageData);
      return pageData;
    }
  };

  const initComments = () => {
    const commentsSection = document.querySelector('.comments-section');
    if (!commentsSection) return;

    const pageId = window.location.pathname;
    const pageData = Comments.getForPage(pageId);

    // Like button
    const likeBtn = commentsSection.querySelector('.like-btn');
    const likeCount = commentsSection.querySelector('.like-count');

    if (likeBtn && likeCount) {
      likeCount.textContent = pageData.likes;
      if (pageData.liked) {
        likeBtn.classList.add('liked');
      }

      likeBtn.addEventListener('click', () => {
        const updated = Comments.toggleLike(pageId);
        likeCount.textContent = updated.likes;
        likeBtn.classList.toggle('liked', updated.liked);

        if (updated.liked) {
          showToast('Thanks for the like!', 'success');
        }
      });
    }

    // Comment form
    const commentForm = commentsSection.querySelector('.comment-form');
    const commentsList = commentsSection.querySelector('.comments-list');

    const renderComments = () => {
      const data = Comments.getForPage(pageId);

      if (data.comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to share your thoughts!</p>';
        return;
      }

      commentsList.innerHTML = data.comments
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(comment => `
          <div class="comment">
            <div class="comment-header">
              <span class="comment-author">${escapeHtml(comment.author)}</span>
              <span class="comment-date">${formatDate(comment.date)}</span>
            </div>
            <div class="comment-content">
              <p>${escapeHtml(comment.content)}</p>
            </div>
          </div>
        `).join('');
    };

    if (commentForm && commentsList) {
      renderComments();

      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const authorInput = commentForm.querySelector('input[name="author"]');
        const contentInput = commentForm.querySelector('textarea[name="content"]');

        const author = authorInput?.value.trim() || 'Anonymous';
        const content = contentInput?.value.trim();

        if (!content) {
          showToast('Please write a comment before submitting.', 'error');
          return;
        }

        Comments.addComment(pageId, author, content);
        renderComments();

        if (authorInput) authorInput.value = '';
        if (contentInput) contentInput.value = '';

        showToast('Comment posted!', 'success');
      });
    }
  };

  // Helper functions
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // ============================================
  // Keyboard Navigation
  // ============================================
  const initKeyboardNav = () => {
    document.addEventListener('keydown', (e) => {
      // Arrow key navigation between modules
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const navBtns = document.querySelectorAll('.nav-btn-prev, .nav-btn-next');
        const targetBtn = e.key === 'ArrowRight'
          ? document.querySelector('.nav-btn-next')
          : document.querySelector('.nav-btn-prev');

        if (targetBtn && targetBtn.href) {
          window.location.href = targetBtn.href;
        }
      }
    });
  };

  // ============================================
  // Analytics (Simple Page View Tracking)
  // ============================================
  const initAnalytics = () => {
    // If using Plausible
    if (window.plausible) {
      // Track module views
      const moduleNum = document.body.dataset.module;
      if (moduleNum) {
        window.plausible('Module View', { props: { module: moduleNum } });
      }

      // Track module completion
      document.querySelectorAll('.complete-module-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (!btn.classList.contains('completed')) {
            window.plausible('Module Complete', { props: { module: btn.dataset.module } });
          }
        });
      });
    }

    // If using Google Analytics
    if (window.gtag) {
      const moduleNum = document.body.dataset.module;
      if (moduleNum) {
        gtag('event', 'view_module', {
          module_number: moduleNum
        });
      }
    }
  };

  // ============================================
  // Initialize Everything
  // ============================================
  const init = () => {
    initTheme();
    initMobileNav();
    initProgress();
    initReadingProgress();
    initCollapsibles();
    initQuizzes();
    initFillBlanks();
    initDilemmas();
    initCopyButtons();
    initComments();
    initSmoothScroll();
    initKeyboardNav();
    initAnalytics();
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
