document.addEventListener('DOMContentLoaded', function() {
  initializeApplication();
});

function initializeApplication() {
  // Load data from data.js
  loadInitialCVData();
  
  // Initialize Editor
  initializeCVEditor();
  
  //Load CV and configure events
  loadCV();
  setupEventListeners();
}


function loadInitialCVData() {
  if (isDevelopmentMode()) {
    localStorage.setItem('cv', JSON.stringify(cv));
    console.log("Mode développement - Les données de data.js ont écrasé le localStorage");
  }
  
  const storedCV = localStorage.getItem('cv');
  if (storedCV) {
    try {
      cv = JSON.parse(storedCV);
    } catch (e) {
      console.error("Erreur de parsing du CV, réinitialisation avec data.js", e);
      localStorage.setItem('cv', JSON.stringify(cv));
    }
  }
}

function isDevelopmentMode() {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

function initializeCVEditor() {
  setupToggleButton();
  loadCVState();
  
}

function setupToggleButton() {
  const toggleBtn = document.getElementById('editor-toggle');
  const externalToggleBtn = document.getElementById('external-toggle');
  const panel = document.getElementById('cv-editor-panel');

  //Initial Configuration
  updateToggleState();

  // Events
  toggleBtn.addEventListener('click', togglePanel);
  externalToggleBtn.addEventListener('click', openPanel);

  function togglePanel() {
    panel.classList.toggle('collapsed');
    updateToggleState();
    saveCVState();
  }

  function openPanel() {
    panel.classList.remove('collapsed');
    updateToggleState();
    saveCVState();
  }

  function updateToggleState() {
    const isCollapsed = panel.classList.contains('collapsed');
    
    panel.style.transform = isCollapsed ? 'translateX(100%)' : 'translateX(0)';
    
    toggleBtn.innerHTML = isCollapsed ? 
      ' ▶ <span class="toggle-text"></span>' : 
      '▶ <span class="toggle-text"> Fermer</span>';
    
    externalToggleBtn.style.display = isCollapsed ? 'block' : 'none';
    
  }
}

function loadCV() {
  renderCV();
}

function saveCV() {
  try {
    localStorage.setItem('cv', JSON.stringify(cv));
    saveCVState();
  } catch (e) {
    console.error("Erreur de sauvegarde du CV:", e);
    alert("Erreur lors de la sauvegarde");
  }
}

function setupEventListeners() {
  document.getElementById('cv-style-select').addEventListener('change', function() {
    document.getElementById('theme-style').href = this.value;
    saveCVState();
  });

  document.getElementById('photo-upload').addEventListener('change', handlePhotoUpload);
  document.getElementById('remove-photo').addEventListener('click', confirmPhotoRemoval);

  document.getElementById('add-section-btn').addEventListener('click', addCustomSection);
  
  document.addEventListener('click', handleSectionActions);
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    cv.profile.photo = event.target.result;
    saveAndRender();
  };
  reader.readAsDataURL(file);
}

function confirmPhotoRemoval() {
  if (confirm("Supprimer la photo de profil ?")) {
    cv.profile.photo = '';
    saveAndRender();
  }
}

function addCustomSection() {
  const titleInput = document.getElementById('new-section-title');
  const contentInput = document.getElementById('new-section-content');
  
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  
  if (!title) {
    alert("Un titre est requis");
    return;
  }
  
  cv.customSections = cv.customSections || [];
  cv.customSections.push({ title, content });
  
  saveAndRender();
  
  titleInput.value = '';
  contentInput.value = '';
}

function handleSectionActions(e) {
  const sectionItem = e.target.closest('.section-item');
  if (!sectionItem) return;
  
  const sectionId = sectionItem.dataset.sectionId;
  
  if (e.target.classList.contains('edit-btn')) {
    toggleEditMode(sectionItem);
    return;
  }
  
  if (e.target.classList.contains('delete-btn')) {
    deleteSection(sectionId, sectionItem);
    return;
  }
  
  if (e.target.classList.contains('save-edit-btn')) {
    const textarea = sectionItem.querySelector('.edit-content');
    saveSectionChanges(sectionId, textarea.value);
    toggleEditMode(sectionItem); 
    return;
  }
}

function toggleEditMode(sectionItem) {
  const contentDiv = sectionItem.querySelector('.section-content-display');
  const textarea = sectionItem.querySelector('.edit-content');
  const editBtn = sectionItem.querySelector('.edit-btn');
  
  if (textarea.style.display === 'none' || !textarea.style.display) {
    contentDiv.style.display = 'none';
    textarea.style.display = 'block';
    editBtn.textContent = 'Sauvegarder';
    editBtn.classList.add('save-edit-btn');
    editBtn.classList.remove('edit-btn');
    textarea.focus();
  } else {
    contentDiv.style.display = 'block';
    textarea.style.display = 'none';
    editBtn.textContent = 'Modifier';
    editBtn.classList.add('edit-btn');
    editBtn.classList.remove('save-edit-btn');
  }
}

function deleteSection(sectionId, sectionItem) {
  if (!sectionId.includes('custom-section')) {
    alert("Seules les sections personnalisées peuvent être supprimées");
    return;
  }
  
  if (!confirm("Supprimer définitivement cette section ?")) return;
  
  const index = parseInt(sectionId.split('-')[2]);
  if (isNaN(index) || !cv.customSections?.[index]) {
    alert("Erreur: Section introuvable");
    return;
  }
  
  cv.customSections.splice(index, 1);
  saveAndRender();
}

function saveSectionChanges(sectionId, newContent) {
  const sectionElement = document.getElementById(sectionId);
  if (!sectionElement) return;
  
  const contentDiv = sectionElement.querySelector('.section-content');
  if (contentDiv) {
    contentDiv.innerHTML = convertTextToHtml(newContent);
  }
  
  if (sectionId.includes('custom-section')) {
    const index = parseInt(sectionId.split('-')[2]);
    if (cv.customSections?.[index]) {
      cv.customSections[index].content = newContent;
      saveAndRender();
    }
  } else {
    console.log("Modification d'une section standard - implémentez cette logique");
  }
}

function saveAndRender() {
  saveCV();
  renderCV();
}

function renderCV() {
  const root = document.getElementById('root');
  root.innerHTML = '';
  
  const fragment = document.createDocumentFragment();
  const cvContainer = document.createElement('div');
  cvContainer.className = 'cv-container';
  
  // CV Construction
  cvContainer.appendChild(createHeader());
  
  const main = document.createElement('main');
  main.appendChild(createPersonalInfo());
  main.appendChild(createEducationSection());
  main.appendChild(createSkillsSection());
  main.appendChild(createExperienceSection());
  main.appendChild(createSoftSkillsSection());
  main.appendChild(createLanguagesSection());
  main.appendChild(createCertificationsSection());
  
  if (cv.customSections?.length) {
    cv.customSections.forEach((section, index) => {
      const sectionElement = createCustomSection(section, index);
      main.appendChild(sectionElement);
    });
  }
  
  cvContainer.appendChild(main);
  fragment.appendChild(cvContainer);
  root.appendChild(fragment);
  
  populateSectionsList();
}

function createCustomSection(sectionData, index) {
  const section = document.createElement('section');
  section.className = 'custom-section';
  section.id = `custom-section-${index}`;
  
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = sectionData.title || 'Nouvelle Section';
  section.appendChild(title);
  
  const content = document.createElement('div');
  content.className = 'section-content';
  content.innerHTML = convertTextToHtml(sectionData.content || '');
  section.appendChild(content);
  
  return section;
}


function createSectionItem(sectionElement, sectionId, isCustom, title) {
  const sectionItem = document.createElement('div');
  sectionItem.className = 'section-item';
  sectionItem.dataset.sectionId = sectionId;
  
  const content = extractTextContent(sectionElement);
  
  sectionItem.innerHTML = `
    <h5>${title}</h5>
    <div class="section-content-display">${convertTextToHtml(content)}</div>
    <textarea class="edit-content" style="display:none">${content}</textarea>
    <div class="section-actions">
      ${isCustom ? '<button class="delete-btn">Supprimer</button>' : ''}
      <button class="edit-btn">Modifier</button>
    </div>
  `;
  
  return sectionItem;
}

function extractTextContent(element) {
  return Array.from(element.children)
    .filter(el => !el.classList.contains('section-title'))
    .map(el => {
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        return Array.from(el.querySelectorAll('li')).map(li => `- ${li.textContent}`).join('\n');
      }
      return el.textContent;
    })
    .join('\n\n');
}

function convertTextToHtml(text) {
  if (!text) return '';
  
  return text.split('\n\n')
    .map(paragraph => {
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(i => i.trim());
        return `<ul>${items.map(item => `<li>${item.replace(/^- /, '')}</li>`).join('')}</ul>`;
      }
      return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');
}

function saveCVState() {
  const state = {
    style: document.getElementById('cv-style-select').value,
    panelCollapsed: document.getElementById('cv-editor-panel').classList.contains('collapsed')
  };
  localStorage.setItem('cvEditorState', JSON.stringify(state));
}

function loadCVState() {
  const saved = localStorage.getItem('cvEditorState');
  if (!saved) return;
  
  try {
    const state = JSON.parse(saved);
    const panel = document.getElementById('cv-editor-panel');
    const toggleBtn = document.getElementById('editor-toggle');
    const externalToggleBtn = document.getElementById('external-toggle');
    
    if (state.panelCollapsed) {
      panel.classList.add('collapsed');
      toggleBtn.innerHTML = ' ▶ <span class="toggle-text">Éditeur</span>';
      externalToggleBtn.style.display = 'block';
    }
    
    if (state.style) {
      document.getElementById('cv-style-select').value = state.style;
      document.getElementById('theme-style').href = state.style;
    }
  } catch (e) {
    console.error("Erreur de chargement de l'état:", e);
  }
}

function createCustomSection(sectionData) {
  const section = document.createElement('section');
  section.className = 'custom-section';
  
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = sectionData.title;
  section.appendChild(title);
  
  const content = document.createElement('div');
  content.className = 'section-content';
  content.innerHTML = sectionData.content.replace(/\n/g, '<br>');
  section.appendChild(content);
  
  return section;
}

function populateSectionsList() {
  const container = document.getElementById('sections-container');
  container.innerHTML = '';
  
  document.querySelectorAll('main > section').forEach((section, index) => {
    const sectionId = `section-${index}`;
    section.id = sectionId;
    
    const sectionItem = document.createElement('div');
    sectionItem.className = 'section-item';
    
    const sectionTitle = section.querySelector('.section-title')?.textContent || 'Section sans titre';
    const sectionContent = extractTextContent(section);
    
    sectionItem.innerHTML = `
      <h5>${sectionTitle}</h5>
      <div class="section-actions">
        <button class="edit-btn" data-section="${sectionId}">Modifier</button>
        <button class="delete-btn" data-section="${sectionId}">Supprimer</button>
      </div>
      <textarea class="edit-content" data-section="${sectionId}" style="display:none">${sectionContent}</textarea>
    `;
    
    container.appendChild(sectionItem);
    
    sectionItem.querySelector('.edit-btn').addEventListener('click', function() {
      const textarea = sectionItem.querySelector('.edit-content');
      textarea.style.display = textarea.style.display === 'none' ? 'block' : 'none';
    });
    
    sectionItem.querySelector('.delete-btn').addEventListener('click', function() {
      if (confirm('Supprimer cette section ?')) {
        if (!section.classList.contains('custom-section')) {
          alert('Les sections standard ne peuvent pas être supprimées');
          return;
        }
        
        const sectionIndex = Array.from(document.querySelectorAll('main > section')).indexOf(section);
        if (sectionIndex !== -1 && cv.customSections) {
          cv.customSections.splice(sectionIndex - 7, 1); 
          saveCV();
          renderCV();
        }
      }
    });
    
    sectionItem.querySelector('.edit-content').addEventListener('change', function() {
      updateSectionContent(sectionId, this.value);
      saveCVState();
    });
  });
}

function extractTextContent(section) {
  const contentElements = Array.from(section.children)
    .filter(el => !el.classList.contains('section-title'));
  
  return contentElements.map(el => {
    if (el.tagName === 'UL' || el.tagName === 'OL') {
      return Array.from(el.querySelectorAll('li')).map(li => `- ${li.textContent}`).join('\n');
    } else if (el.tagName === 'DIV') {
      return el.textContent;
    } else {
      return el.innerHTML.replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<[^>]+>/g, '')
                        .trim();
    }
  }).join('\n\n');
}

function updateSectionContent(sectionId, textContent) {
  const section = document.getElementById(sectionId);
  const title = section.querySelector('.section-title');
  
  const htmlContent = textContent
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n- ').filter(i => i);
        return `<ul>${items.map(item => `<li>${item.replace(/^- /, '')}</li>`).join('')}</ul>`;
      } else {
        return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
      }
    })
    .join('');
  
  if (title) {
    section.innerHTML = title.outerHTML + htmlContent;
  } else {
    section.innerHTML = htmlContent;
  }
  
  if (section.classList.contains('custom-section')) {
    const sectionIndex = Array.from(document.querySelectorAll('main > section')).indexOf(section);
    if (sectionIndex !== -1 && cv.customSections) {
      cv.customSections[sectionIndex - 7].content = textContent; 
      saveCV();
    }
  }
}

function saveCVState() {
  const panel = document.getElementById('cv-editor-panel');
  const state = {
    style: document.getElementById('cv-style-select').value,
    panelPosition: panel.style.transform,
  };
  localStorage.setItem('cvEditorState', JSON.stringify(state));
}

function loadCVState() {
  const panel = document.getElementById('cv-editor-panel');
  const toggleBtn = document.getElementById('editor-toggle');
  const externalToggleBtn = document.getElementById('external-toggle');

  panel.classList.remove('collapsed');
  panel.style.transform = 'translateX(0)';
  toggleBtn.textContent = ' ◀ ';
  externalToggleBtn.style.display = 'none';

  const saved = localStorage.getItem('cvEditorState');
  if (saved) {
    const state = JSON.parse(saved);
    
    if (state.style) {
      document.getElementById('cv-style-select').value = state.style;
      document.getElementById('theme-style').setAttribute('href', state.style);
    }
    
    if (state.panelCollapsed) {
      panel.classList.add('collapsed');
      panel.style.transform = 'translateX(100%)';
      toggleBtn.textContent = ' ▶ ';
      externalToggleBtn.style.display = 'block';
    }
  }
}

function createHeader() {
  const header = document.createElement('header');
  
  const headerContainer = document.createElement('div');
  headerContainer.className = 'header-container';
  
  if (cv.profile.photo) {
      const img = document.createElement('img');
      img.src = cv.profile.photo;
      img.alt = `Photo de profil de ${cv.profile.firstName} ${cv.profile.lastName}`;
      img.className = 'profile-pic';
      headerContainer.appendChild(img);
  }
  
  const headerText = document.createElement('div');
  headerText.className = 'header-text';
  
  const h1 = document.createElement('h1');
  h1.textContent = `${cv.profile.firstName} ${cv.profile.lastName}`;
  
  const h2 = document.createElement('h2');
  h2.textContent = cv.profile.professionalTitle || '';
  
  headerText.appendChild(h1);
  headerText.appendChild(h2);
  headerContainer.appendChild(headerText);
  
  header.appendChild(headerContainer);
  return header;
}

function createPersonalInfo() {
  const section = document.createElement('section');
  section.className = 'personal-info';
  
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = 'Informations Personnelles';
  section.appendChild(title);
  
  if (cv.profile.professionalSummary) {
      const summary = document.createElement('div');
      summary.className = 'professional-summary';
      summary.textContent = cv.profile.professionalSummary;
      section.appendChild(summary);
  }
  
  const infoList = document.createElement('ul');
  infoList.className = 'info-list';
  
  // Email
  if (cv.profile.email) {
      const emailItem = document.createElement('li');
      emailItem.innerHTML = `<strong>Email :</strong> <a href="mailto:${cv.profile.email}">${cv.profile.email}</a>`;
      infoList.appendChild(emailItem);
  }
  
  // Phone
  if (cv.profile.phone) {
      const phoneItem = document.createElement('li');
      phoneItem.innerHTML = `<strong>Téléphone :</strong> ${cv.profile.phone}`;
      infoList.appendChild(phoneItem);
  }
  
  // Links
  if (cv.profile.links && cv.profile.links.length > 0) {
      cv.profile.links.forEach(link => {
          const linkItem = document.createElement('li');
          linkItem.innerHTML = `<strong>${link.name} :</strong> <a href="${link.url}" target="_blank">${link.url}</a>`;
          infoList.appendChild(linkItem);
      });
  }
  
  section.appendChild(infoList);
  return section;
}

// Create education section
function createEducationSection() {
  const section = document.createElement('section');
  section.className = 'education';
  
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = 'Formation';
  section.appendChild(title);
  
  const educationList = document.createElement('ul');
  educationList.className = 'education-list';
  
  cv.education.forEach(edu => {
      const eduItem = document.createElement('li');
      eduItem.className = 'education-item';
      
      const diploma = document.createElement('h4');
      diploma.textContent = edu.diploma;
      
      const details = document.createElement('div');
      details.className = 'education-details';
      
      const organisation = document.createElement('span');
      organisation.className = 'organisation';
      organisation.textContent = edu.organisation;
      
      const year = document.createElement('span');
      year.className = 'year';
      year.textContent = edu.year;
      
      details.appendChild(organisation);
      details.appendChild(year);
      
      eduItem.appendChild(diploma);
      eduItem.appendChild(details);
      
      if (edu.details) {
          const description = document.createElement('p');
          description.className = 'description';
          description.textContent = edu.details;
          eduItem.appendChild(description);
      }
      
      educationList.appendChild(eduItem);
  });
  
  section.appendChild(educationList);
  return section;
}

// Create skills section
function createSkillsSection() {
  const section = document.createElement('section');
  section.className = 'skills';
  
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = 'Compétences Techniques';
  section.appendChild(title);
  
  const skillsContainer = document.createElement('div');
  skillsContainer.className = 'skills-container';
  
  cv.technologySkills.forEach(skillGroup => {
      const skillCategory = document.createElement('div');
      skillCategory.className = 'skill-category';
      
      const skillName = document.createElement('h4');
      skillName.textContent = skillGroup.skill;
      skillCategory.appendChild(skillName);
      
      const skillDetails = document.createElement('ul');
      skillDetails.className = 'skill-details';
      skillDetails.textContent = skillGroup.details;
      
      /*skillGroup.details.forEach(detail => {
          const skillItem = document.createElement('div');
          skillItem.textContent = detail;
          skillDetails.appendChild(skillItem);
      });*/
      
      skillCategory.appendChild(skillDetails);
      skillsContainer.appendChild(skillCategory);
  });
  
  section.appendChild(skillsContainer);
  return section;
}

// Create experience section
function createExperienceSection() {
  const section = document.createElement('section');
  section.className = 'experience';
  
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = 'Expériences Professionnelles';
  section.appendChild(title);
  
  const professionalExperiences = cv.experiences.filter(exp => exp.type === 'Professionnelle');
  const academicExperiences = cv.experiences.filter(exp => exp.type === 'Académique');
  
  if (professionalExperiences.length > 0) {
      professionalExperiences.forEach(exp => {
          section.appendChild(createExperienceItem(exp));
      });
  }
  
  if (academicExperiences.length > 0) {
      const academicTitle = document.createElement('h3');
      academicTitle.className = 'section-title';
      academicTitle.textContent = 'Projets Académiques';
      section.appendChild(academicTitle);
      
      academicExperiences.forEach(exp => {
          section.appendChild(createExperienceItem(exp));
      });
  }
  
  return section;
}

function createExperienceItem(exp) {
  const expItem = document.createElement('div');
  expItem.className = 'experience-item';
  
  const header = document.createElement('div');
  header.className = 'experience-header';
  
  const title = document.createElement('h4');
  title.textContent = exp.title;
  
  const organisation = document.createElement('span');
  organisation.className = 'organisation';
  organisation.textContent = exp.organisation;
  
  header.appendChild(title);
  header.appendChild(organisation);
  
  const meta = document.createElement('div');
  meta.className = 'experience-meta';
  
  const duration = document.createElement('span');
  duration.className = 'duration';
  duration.textContent = exp.duration;
  
  meta.appendChild(duration);
  
  if (exp.year) {
      const year = document.createElement('span');
      year.className = 'year';
      year.textContent = exp.year;
      meta.appendChild(year);
  }
  
  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = exp.description;
  
  expItem.appendChild(header);
  expItem.appendChild(meta);
  expItem.appendChild(description);
  
  if (exp.details && exp.details.length > 0) {
      const detailsList = document.createElement('ul');
      detailsList.className = 'details-list';
      
      exp.details.forEach(detail => {
          const detailItem = document.createElement('li');
          detailItem.textContent = detail;
          detailsList.appendChild(detailItem);
      });
      
      expItem.appendChild(detailsList);
  }
  
  if (exp.technologies && exp.technologies.length > 0) {
      const techList = document.createElement('div');
      techList.className = 'technologies-list';
      techList.textContent = 'Technologies: ' + exp.technologies.join(', ');
      expItem.appendChild(techList);
  }
  
  return expItem;
}

// Create soft skills section
function createSoftSkillsSection() {
  const section = document.createElement('section');
  section.className = 'soft-skills';
  
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = 'Soft Skills';
  section.appendChild(title);
  
  const skillsList = document.createElement('ul');
  skillsList.className = 'skills-list';
  
  cv.softSkills.forEach(skill => {
      const skillItem = document.createElement('li');
      skillItem.textContent = skill;
      skillsList.appendChild(skillItem);
  });
  
  section.appendChild(skillsList);
  return section;
}

// Create languages section
function createLanguagesSection() {
  const section = document.createElement('section');
  section.className = 'languages';
  
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = 'Langues';
  section.appendChild(title);
  
  const languagesList = document.createElement('ul');
  languagesList.className = 'languages-list';
  
  cv.languages.forEach(lang => {
      const langItem = document.createElement('li');
      
      const languageName = document.createElement('span');
      languageName.className = 'language-name';
      languageName.textContent = lang.language;
      
      const languageLevel = document.createElement('span');
      languageLevel.className = 'language-level';
      languageLevel.textContent = ` (${lang.experience})`;
      
      langItem.appendChild(languageName);
      langItem.appendChild(languageLevel);
      languagesList.appendChild(langItem);
  });
  
  section.appendChild(languagesList);
  return section;
}

// Create certifications section
function createCertificationsSection() {
  const section = document.createElement('section');
  section.className = 'certifications';
  
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = 'Certifications';
  section.appendChild(title);
  
  const certsList = document.createElement('ul');
  certsList.className = 'certifications-list';
  
  cv.certifications.forEach(cert => {
      const certItem = document.createElement('li');
      certItem.textContent = cert;
      certsList.appendChild(certItem);
  });
  
  section.appendChild(certsList);
  return section;
}