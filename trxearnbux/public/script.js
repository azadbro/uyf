const tg = window.Telegram.WebApp;
tg.expand();

let user = tg.initDataUnsafe.user;
let userId = user.id;
let username = user.username || user.first_name;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Set welcome message
  document.getElementById("welcome").innerText = `Hi ${username}!`;
  
  // Set referral link
  document.getElementById("refLink").value = `https://t.me/trxearnbux?start=${userId}`;
  
  // Show earn section by default
  showSection('earn');
  
  // Load user data
  loadUserData();
  
  // Set up event listeners
  setupEventListeners();
}

function setupEventListeners() {
  // Watch ad button
  document.getElementById("watchAd").addEventListener("click", handleWatchAd);
  
  // Withdraw button
  document.getElementById("withdrawBtn").addEventListener("click", handleWithdraw);
  
  // Navigation tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      showSection(section);
      updateActiveTab(section);
    });
  });
}

let cooldown = false;
let timer;

async function handleWatchAd() {
  if (cooldown) return;

  showLoading(true);

  try {
    // Ads sequence: Monetag then OnclickA
    await show_9723717();
    
    // OnclickA trigger
    const s = document.createElement("script");
    s.src = "https://js.onclckmn.com/static/onclicka.js";
    document.body.appendChild(s);

    setTimeout(async () => {
      try {
        const res = await fetch("/api/earn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });
        
        const data = await res.json();
        
        if (data.balance !== undefined) {
          updateBalance(data.balance);
          updateStats();
          showToast("Ad watched successfully! +0.005 TRX earned", "success");
        }
        
        showLoading(false);
      } catch (error) {
        console.error('Error earning:', error);
        showToast("Error processing ad. Please try again.", "error");
        showLoading(false);
      }
    }, 1000);

    startCooldown();
  } catch (error) {
    console.error('Error showing ad:', error);
    showToast("Error loading ad. Please try again.", "error");
    showLoading(false);
  }
}

function startCooldown() {
  cooldown = true;
  let seconds = 30;
  
  const cooldownElement = document.getElementById("cooldown");
  const watchAdButton = document.getElementById("watchAd");
  
  watchAdButton.disabled = true;
  watchAdButton.style.opacity = '0.6';
  
  timer = setInterval(() => {
    cooldownElement.innerHTML = `<i class="fas fa-clock"></i> Wait ${seconds}s before next ad`;
    seconds--;
    
    if (seconds < 0) {
      clearInterval(timer);
      cooldownElement.innerHTML = "";
      cooldown = false;
      watchAdButton.disabled = false;
      watchAdButton.style.opacity = '1';
    }
  }, 1000);
}

async function handleWithdraw() {
  const amount = parseFloat(document.getElementById("amount").value);
  const binanceUid = document.getElementById("binanceUid").value;

  if (!binanceUid.trim()) {
    showToast("Please enter your Binance UID", "error");
    return;
  }

  if (!amount || amount < 0.5) {
    showToast("Minimum withdrawal amount is 0.5 TRX", "error");
    return;
  }

  showLoading(true);

  try {
    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount, binanceUid })
    });

    const data = await res.json();
    
    if (data.status === "ok") {
      showToast("Withdrawal request submitted successfully!", "success");
      document.getElementById("amount").value = "";
      document.getElementById("binanceUid").value = "";
      loadUserData(); // Refresh balance
    } else {
      showToast(data.message || "Withdrawal failed", "error");
    }
  } catch (error) {
    console.error('Error withdrawing:', error);
    showToast("Error processing withdrawal. Please try again.", "error");
  } finally {
    showLoading(false);
  }
}

function showSection(id) {
  // Hide all sections
  document.querySelectorAll(".page").forEach(sec => {
    sec.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(id).classList.add('active');
}

function updateActiveTab(sectionId) {
  // Remove active class from all tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active class to clicked tab
  document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

async function loadUserData() {
  try {
    // Load user balance and stats
    const res = await fetch("/api/earn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    
    const data = await res.json();
    
    if (data.balance !== undefined) {
      updateBalance(data.balance);
      updateStats();
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

function updateBalance(balance) {
  const balanceElements = [
    document.getElementById("balance"),
    document.getElementById("headerBalance")
  ];
  
  balanceElements.forEach(element => {
    if (element) {
      element.textContent = balance.toFixed(3);
    }
  });
}

function updateStats() {
  // Update ads watched count (you'll need to implement this based on your data structure)
  const adsWatched = 0; // Get from user data
  document.getElementById("adsWatched").textContent = adsWatched;
  
  // Update total earned
  const balance = parseFloat(document.getElementById("balance").textContent);
  document.getElementById("totalEarned").textContent = balance.toFixed(3);
  
  // Update task progress
  updateTaskProgress(adsWatched);
}

function updateTaskProgress(adsWatched) {
  const progressBar = document.getElementById("taskProgress");
  const currentProgress = document.getElementById("currentProgress");
  const taskStatus = document.getElementById("taskStatus");
  
  if (progressBar && currentProgress && taskStatus) {
    const progress = Math.min(adsWatched, 100);
    const percentage = (progress / 100) * 100;
    
    progressBar.style.width = `${percentage}%`;
    currentProgress.textContent = progress;
    
    if (progress >= 100) {
      taskStatus.textContent = "Completed!";
      taskStatus.style.background = "rgba(40, 167, 69, 0.1)";
      taskStatus.style.color = "#28a745";
    }
  }
}

function copyReferralLink() {
  const refLink = document.getElementById("refLink");
  refLink.select();
  refLink.setSelectionRange(0, 99999);
  
  try {
    document.execCommand("copy");
    showToast("Referral link copied to clipboard!", "success");
  } catch (err) {
    // Fallback for modern browsers
    navigator.clipboard.writeText(refLink.value).then(() => {
      showToast("Referral link copied to clipboard!", "success");
    }).catch(() => {
      showToast("Failed to copy link", "error");
    });
  }
}

function showLoading(show) {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    if (show) {
      loadingOverlay.classList.add('show');
    } else {
      loadingOverlay.classList.remove('show');
    }
  }
}

function showToast(message, type = "success") {
  const toast = document.getElementById("successToast");
  const toastMessage = document.getElementById("toastMessage");
  
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    
    // Update toast styling based on type
    toast.className = `toast ${type}-toast`;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Utility function to format numbers
function formatNumber(num) {
  return parseFloat(num).toFixed(3);
}

// Add scroll behavior for header
let lastScrollTop = 0;
let header = document.querySelector('.header');
let scrollThreshold = 50; // Minimum scroll distance to trigger header hide/show

window.addEventListener('scroll', function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollDifference = Math.abs(scrollTop - lastScrollTop);
  
  // Only trigger if scroll difference is significant
  if (scrollDifference > scrollThreshold) {
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down - hide header
      header.classList.add('header-hidden');
    } else if (scrollTop < lastScrollTop) {
      // Scrolling up - show header
      header.classList.remove('header-hidden');
    }
    
    lastScrollTop = scrollTop;
  }
});

// Add smooth scrolling for better UX
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    // Close any open modals or overlays
    showLoading(false);
  }
});

// Add touch gesture support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const sections = ['earn', 'refer', 'wallet', 'tasks'];
  const currentSection = document.querySelector('.page.active').id;
  const currentIndex = sections.indexOf(currentSection);
  
  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe left - next section
    const nextIndex = (currentIndex + 1) % sections.length;
    showSection(sections[nextIndex]);
    updateActiveTab(sections[nextIndex]);
  } else if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe right - previous section
    const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
    showSection(sections[prevIndex]);
    updateActiveTab(sections[prevIndex]);
  }
}
