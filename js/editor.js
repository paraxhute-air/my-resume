/**
 * Portfolio Editor JavaScript
 * Handles password authentication, data editing, and saving
 */

// ========================================
// Configuration
// ========================================
const EDITOR_PASSWORD = 'tjdwns!1';
const STORAGE_KEY = 'portfolio_data';
const AUTH_KEY = 'portfolio_editor_auth';
const DATA_URL = 'resources/data.json';

// ========================================
// State
// ========================================
let portfolioData = null;
let originalImageData = null;

// ========================================
// DOM Elements
// ========================================
const elements = {
  // Password modal
  passwordModal: document.getElementById('password-modal'),
  passwordInput: document.getElementById('password-input'),
  passwordSubmit: document.getElementById('password-submit'),
  passwordError: document.getElementById('password-error'),
  
  // Editor container
  editorContainer: document.getElementById('editor-container'),
  
  // Theme toggle
  themeToggle: document.getElementById('theme-toggle'),
  
  // Profile fields
  profilePreview: document.getElementById('profile-preview'),
  profileImageInput: document.getElementById('profile-image-input'),
  removeImageBtn: document.getElementById('remove-image-btn'),
  profileName: document.getElementById('profile-name'),
  profileTitle: document.getElementById('profile-title'),
  profileSummary: document.getElementById('profile-summary'),
  
  // Lists
  experienceList: document.getElementById('experience-list'),
  projectsList: document.getElementById('projects-list'),
  strengthsList: document.getElementById('strengths-list'),
  
  // Skills
  skillsProgramming: document.getElementById('skills-programming'),
  skillsTools: document.getElementById('skills-tools'),
  skillsLanguages: document.getElementById('skills-languages'),
  
  // Final note
  finalNote: document.getElementById('final-note'),
  
  // Buttons
  addExperience: document.getElementById('add-experience'),
  addProject: document.getElementById('add-project'),
  addStrength: document.getElementById('add-strength'),
  exportBtn: document.getElementById('export-btn'),
  exportBtnBottom: document.getElementById('export-btn-bottom'),
  resetBtn: document.getElementById('reset-btn'),
  
  // Toast
  toast: document.getElementById('toast'),
  
  // Crop modal
  cropModal: document.getElementById('crop-modal'),
  cropImage: document.getElementById('crop-image'),
  cropPreviewArea: document.getElementById('crop-preview-area'),
  zoomSlider: document.getElementById('zoom-slider'),
  zoomValue: document.getElementById('zoom-value'),
  cropApply: document.getElementById('crop-apply'),
  cropCancel: document.getElementById('crop-cancel'),
};

// ========================================
// Theme Management
// ========================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ========================================
// Password Authentication
// ========================================
function initAuth() {
  // Check if already authenticated
  const isAuth = sessionStorage.getItem(AUTH_KEY);
  if (isAuth === 'true') {
    showEditor();
    return;
  }
  
  // Show password modal
  elements.passwordModal?.classList.remove('hidden');
  
  // Handle password submit
  elements.passwordSubmit?.addEventListener('click', handlePasswordSubmit);
  elements.passwordInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handlePasswordSubmit();
  });
}

function handlePasswordSubmit() {
  const password = elements.passwordInput?.value;
  const passwordBox = document.querySelector('.password-box');
  const passwordIcon = document.querySelector('.password-icon');
  const passwordTitle = document.querySelector('.password-title');
  
  if (password === EDITOR_PASSWORD) {
    // Success animation
    sessionStorage.setItem(AUTH_KEY, 'true');
    
    // Change to success state
    passwordBox?.classList.add('success');
    
    // Change lock icon to unlocked
    if (passwordIcon) passwordIcon.textContent = '🔓';
    
    // Change title
    if (passwordTitle) passwordTitle.textContent = 'ACCESS GRANTED';
    
    // Wait for animation then show editor
    setTimeout(() => {
      showEditor();
    }, 1200);
    
  } else {
    // Error animation with vibration and flash
    passwordBox?.classList.remove('error');
    
    // Force reflow to restart animation
    void passwordBox?.offsetWidth;
    
    passwordBox?.classList.add('error');
    elements.passwordError?.classList.remove('hidden');
    elements.passwordInput.value = '';
    elements.passwordInput?.focus();
    
    // Remove error class after animation
    setTimeout(() => {
      passwordBox?.classList.remove('error');
    }, 600);
  }
}

function showEditor() {
  elements.passwordModal?.classList.add('hidden');
  elements.editorContainer?.classList.remove('hidden');
  loadData();
}

// ========================================
// Data Loading
// ========================================
async function loadData() {
  try {
    // Try localStorage first
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (storedData) {
      portfolioData = JSON.parse(storedData);
    } else {
      // Fetch from JSON file
      const response = await fetch(DATA_URL);
      if (response.ok) {
        portfolioData = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioData));
      } else {
        portfolioData = getDefaultData();
      }
    }
    
    renderEditor();
  } catch (error) {
    console.error('Error loading data:', error);
    portfolioData = getDefaultData();
    renderEditor();
  }
}

function getDefaultData() {
  return {
    profile: { name: '', title: '', summary: '', image: '' },
    experience: [],
    projects: [],
    skills: { programming: [], tools: [], languages: [] },
    strengths: [],
    finalNote: ''
  };
}

// ========================================
// Render Editor
// ========================================
function renderEditor() {
  if (!portfolioData) return;
  
  // Profile
  if (elements.profileName) elements.profileName.value = portfolioData.profile?.name || '';
  if (elements.profileTitle) elements.profileTitle.value = portfolioData.profile?.title || '';
  if (elements.profileSummary) elements.profileSummary.value = portfolioData.profile?.summary || '';
  
  if (portfolioData.profile?.image && elements.profilePreview) {
    elements.profilePreview.src = portfolioData.profile.image;
  }
  
  // Skills
  if (elements.skillsProgramming) {
    elements.skillsProgramming.value = (portfolioData.skills?.programming || []).join(', ');
  }
  if (elements.skillsTools) {
    elements.skillsTools.value = (portfolioData.skills?.tools || []).join(', ');
  }
  if (elements.skillsLanguages) {
    elements.skillsLanguages.value = (portfolioData.skills?.languages || []).join(', ');
  }
  
  // Final note
  if (elements.finalNote) elements.finalNote.value = portfolioData.finalNote || '';
  
  // Lists
  renderExperienceList();
  renderProjectsList();
  renderStrengthsList();
}

function renderExperienceList() {
  if (!elements.experienceList) return;
  
  elements.experienceList.innerHTML = (portfolioData.experience || []).map((exp, index) => `
    <div class="item-card" data-index="${index}">
      <div class="grid gap-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">회사명</label>
            <input type="text" class="input-field exp-company" value="${escapeHtml(exp.company || '')}" placeholder="회사명">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">기간</label>
            <input type="text" class="input-field exp-period" value="${escapeHtml(exp.period || '')}" placeholder="2020.01 - 2022.12">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">직책</label>
          <input type="text" class="input-field exp-role" value="${escapeHtml(exp.role || '')}" placeholder="프론트엔드 개발자">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">업무 내용</label>
          <textarea class="input-field exp-description" placeholder="담당 업무를 설명해주세요.">${escapeHtml(exp.description || '')}</textarea>
        </div>
        <button class="remove-btn self-start" onclick="removeExperience(${index})">삭제</button>
      </div>
    </div>
  `).join('');
  
  // Add change listeners
  elements.experienceList.querySelectorAll('.item-card').forEach((card) => {
    const index = parseInt(card.dataset.index);
    card.querySelector('.exp-company')?.addEventListener('input', (e) => {
      portfolioData.experience[index].company = e.target.value;
      saveData();
    });
    card.querySelector('.exp-period')?.addEventListener('input', (e) => {
      portfolioData.experience[index].period = e.target.value;
      saveData();
    });
    card.querySelector('.exp-role')?.addEventListener('input', (e) => {
      portfolioData.experience[index].role = e.target.value;
      saveData();
    });
    card.querySelector('.exp-description')?.addEventListener('input', (e) => {
      portfolioData.experience[index].description = e.target.value;
      saveData();
    });
  });
}

function renderProjectsList() {
  if (!elements.projectsList) return;
  
  elements.projectsList.innerHTML = (portfolioData.projects || []).map((proj, index) => `
    <div class="item-card" data-index="${index}">
      <div class="grid gap-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">프로젝트명</label>
            <input type="text" class="input-field proj-name" value="${escapeHtml(proj.name || '')}" placeholder="프로젝트명">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">기간</label>
            <input type="text" class="input-field proj-period" value="${escapeHtml(proj.period || '')}" placeholder="2023.01 - 2023.06">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">설명</label>
          <textarea class="input-field proj-description" placeholder="프로젝트를 설명해주세요.">${escapeHtml(proj.description || '')}</textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">기술 스택</label>
          <input type="text" class="input-field proj-tech" value="${escapeHtml((proj.tech || []).join(', '))}" placeholder="React, Node.js, MongoDB">
          <p class="text-xs text-[var(--text-muted)] mt-1">쉼표(,)로 구분</p>
        </div>
        <button class="remove-btn self-start" onclick="removeProject(${index})">삭제</button>
      </div>
    </div>
  `).join('');
  
  // Add change listeners
  elements.projectsList.querySelectorAll('.item-card').forEach((card) => {
    const index = parseInt(card.dataset.index);
    card.querySelector('.proj-name')?.addEventListener('input', (e) => {
      portfolioData.projects[index].name = e.target.value;
      saveData();
    });
    card.querySelector('.proj-period')?.addEventListener('input', (e) => {
      portfolioData.projects[index].period = e.target.value;
      saveData();
    });
    card.querySelector('.proj-description')?.addEventListener('input', (e) => {
      portfolioData.projects[index].description = e.target.value;
      saveData();
    });
    card.querySelector('.proj-tech')?.addEventListener('input', (e) => {
      portfolioData.projects[index].tech = e.target.value.split(',').map(t => t.trim()).filter(t => t);
      saveData();
    });
  });
}

function renderStrengthsList() {
  if (!elements.strengthsList) return;
  
  elements.strengthsList.innerHTML = (portfolioData.strengths || []).map((str, index) => `
    <div class="item-card" data-index="${index}">
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">제목</label>
          <input type="text" class="input-field str-title" value="${escapeHtml(str.title || '')}" placeholder="강점 제목">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">설명</label>
          <textarea class="input-field str-description" placeholder="강점을 설명해주세요.">${escapeHtml(str.description || '')}</textarea>
        </div>
        <button class="remove-btn self-start" onclick="removeStrength(${index})">삭제</button>
      </div>
    </div>
  `).join('');
  
  // Add change listeners
  elements.strengthsList.querySelectorAll('.item-card').forEach((card) => {
    const index = parseInt(card.dataset.index);
    card.querySelector('.str-title')?.addEventListener('input', (e) => {
      portfolioData.strengths[index].title = e.target.value;
      saveData();
    });
    card.querySelector('.str-description')?.addEventListener('input', (e) => {
      portfolioData.strengths[index].description = e.target.value;
      saveData();
    });
  });
}

// ========================================
// Add/Remove Items
// ========================================
function addExperience() {
  if (!portfolioData.experience) portfolioData.experience = [];
  portfolioData.experience.push({ company: '', period: '', role: '', description: '' });
  renderExperienceList();
  saveData();
}

function removeExperience(index) {
  portfolioData.experience.splice(index, 1);
  renderExperienceList();
  saveData();
}

function addProject() {
  if (!portfolioData.projects) portfolioData.projects = [];
  portfolioData.projects.push({ name: '', period: '', description: '', tech: [] });
  renderProjectsList();
  saveData();
}

function removeProject(index) {
  portfolioData.projects.splice(index, 1);
  renderProjectsList();
  saveData();
}

function addStrength() {
  if (!portfolioData.strengths) portfolioData.strengths = [];
  portfolioData.strengths.push({ title: '', description: '' });
  renderStrengthsList();
  saveData();
}

function removeStrength(index) {
  portfolioData.strengths.splice(index, 1);
  renderStrengthsList();
  saveData();
}

// Make functions global
window.removeExperience = removeExperience;
window.removeProject = removeProject;
window.removeStrength = removeStrength;

// ========================================
// Save Data
// ========================================
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioData));
}

// ========================================
// Profile Image Handling
// ========================================
function initImageUpload() {
  elements.profileImageInput?.addEventListener('change', handleImageSelect);
  elements.removeImageBtn?.addEventListener('click', removeImage);
}

function handleImageSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    originalImageData = event.target.result;
    showCropModal(originalImageData);
  };
  reader.readAsDataURL(file);
}

function showCropModal(imageSrc) {
  if (!elements.cropModal || !elements.cropImage) return;
  
  elements.cropImage.src = imageSrc;
  elements.cropModal.classList.remove('hidden');
  
  // Reset zoom
  if (elements.zoomSlider) elements.zoomSlider.value = 100;
  if (elements.zoomValue) elements.zoomValue.textContent = '100%';
  
  // Initialize crop area
  initCropArea();
}

function initCropArea() {
  const img = elements.cropImage;
  const area = elements.cropPreviewArea;
  
  if (!img || !area) return;
  
  let scale = 1;
  let posX = 0;
  let posY = 0;
  let isDragging = false;
  let startX, startY;
  
  img.onload = () => {
    // Center image
    const areaRect = area.getBoundingClientRect();
    const imgRatio = img.naturalWidth / img.naturalHeight;
    
    if (imgRatio > areaRect.width / areaRect.height) {
      img.style.height = areaRect.height + 'px';
      img.style.width = 'auto';
    } else {
      img.style.width = areaRect.width + 'px';
      img.style.height = 'auto';
    }
    
    posX = (areaRect.width - img.offsetWidth) / 2;
    posY = (areaRect.height - img.offsetHeight) / 2;
    updateImagePosition();
  };
  
  function updateImagePosition() {
    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  }
  
  // Drag handling
  area.onmousedown = (e) => {
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    area.style.cursor = 'grabbing';
  };
  
  document.onmousemove = (e) => {
    if (!isDragging) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    updateImagePosition();
  };
  
  document.onmouseup = () => {
    isDragging = false;
    area.style.cursor = 'grab';
  };
  
  // Zoom handling
  elements.zoomSlider?.addEventListener('input', (e) => {
    scale = e.target.value / 100;
    if (elements.zoomValue) elements.zoomValue.textContent = e.target.value + '%';
    updateImagePosition();
  });
  
  // Apply crop
  elements.cropApply?.addEventListener('click', () => {
    applyCrop(posX, posY, scale);
  });
  
  // Cancel crop
  elements.cropCancel?.addEventListener('click', () => {
    elements.cropModal?.classList.add('hidden');
  });
}

function applyCrop(posX, posY, scale) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = elements.cropImage;
  const area = elements.cropPreviewArea;
  
  if (!ctx || !img || !area) return;
  
  const areaRect = area.getBoundingClientRect();
  canvas.width = 400;
  canvas.height = 500;
  
  const tempImg = new Image();
  tempImg.onload = () => {
    const imgW = tempImg.width * scale * (areaRect.height / img.offsetHeight);
    const imgH = tempImg.height * scale * (areaRect.height / img.offsetHeight);
    const srcX = (-posX / areaRect.width) * canvas.width;
    const srcY = (-posY / areaRect.height) * canvas.height;
    
    ctx.drawImage(tempImg, -srcX, -srcY, imgW, imgH);
    
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    
    if (elements.profilePreview) {
      elements.profilePreview.src = croppedImage;
    }
    
    portfolioData.profile.image = croppedImage;
    saveData();
    
    elements.cropModal?.classList.add('hidden');
    showToast('이미지가 저장되었습니다.');
  };
  tempImg.src = originalImageData;
}

function removeImage() {
  if (elements.profilePreview) {
    elements.profilePreview.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%236366f1' width='100' height='100'/><text x='50' y='55' font-size='40' text-anchor='middle' fill='white'>👤</text></svg>";
  }
  portfolioData.profile.image = '';
  saveData();
  showToast('이미지가 삭제되었습니다.');
}

// ========================================
// Export JSON
// ========================================
function exportJSON() {
  const dataStr = JSON.stringify(portfolioData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio-data.json';
  a.click();
  
  URL.revokeObjectURL(url);
  showToast('JSON 파일이 다운로드되었습니다.');
}

// ========================================
// Reset Data
// ========================================
function resetData() {
  if (confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    localStorage.removeItem(STORAGE_KEY);
    portfolioData = getDefaultData();
    renderEditor();
    showToast('데이터가 초기화되었습니다.');
  }
}

// ========================================
// Toast Notification
// ========================================
function showToast(message) {
  if (!elements.toast) return;
  
  elements.toast.textContent = message;
  elements.toast.classList.remove('hidden');
  
  setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 3000);
}

// ========================================
// Utility Functions
// ========================================
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========================================
// Event Listeners
// ========================================
function initEventListeners() {
  // Theme toggle
  elements.themeToggle?.addEventListener('click', toggleTheme);
  
  // Profile fields
  elements.profileName?.addEventListener('input', (e) => {
    portfolioData.profile.name = e.target.value;
    saveData();
  });
  
  elements.profileTitle?.addEventListener('input', (e) => {
    portfolioData.profile.title = e.target.value;
    saveData();
  });
  
  elements.profileSummary?.addEventListener('input', (e) => {
    portfolioData.profile.summary = e.target.value;
    saveData();
  });
  
  // Skills
  elements.skillsProgramming?.addEventListener('input', (e) => {
    portfolioData.skills.programming = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    saveData();
  });
  
  elements.skillsTools?.addEventListener('input', (e) => {
    portfolioData.skills.tools = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    saveData();
  });
  
  elements.skillsLanguages?.addEventListener('input', (e) => {
    portfolioData.skills.languages = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    saveData();
  });
  
  // Final note
  elements.finalNote?.addEventListener('input', (e) => {
    portfolioData.finalNote = e.target.value;
    saveData();
  });
  
  // Add buttons
  elements.addExperience?.addEventListener('click', addExperience);
  elements.addProject?.addEventListener('click', addProject);
  elements.addStrength?.addEventListener('click', addStrength);
  
  // Export buttons
  elements.exportBtn?.addEventListener('click', exportJSON);
  elements.exportBtnBottom?.addEventListener('click', exportJSON);
  
  // Reset button
  elements.resetBtn?.addEventListener('click', resetData);
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAuth();
  initEventListeners();
  initImageUpload();
});
