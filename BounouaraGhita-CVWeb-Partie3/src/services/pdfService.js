const puppeteer = require('puppeteer');

const generatePDF = async (cvData) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']        
  });

  const page = await browser.newPage();
  
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>CV de ${cvData.name} ${cvData.lastname || ''}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          text-align: justify;
        }
        .cv-container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .cv-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #ccc1ae;
          padding-bottom: 10px;
        }
      
        .header-content {
          flex: 1;
        }
        h1 {
          color: #333;
          margin: 0 0 5px 0;
        }
        .title {
          color: #555;
          margin: 0 0 10px 0;
          font-size: 1.2em;
        }
        .contact-info, .summary, .experiences, 
        .education, .skills-section, .languages,
        .softSkills, .certifications {
          margin-bottom: 20px;
        }
        h3 {
          color: #ccc1ae;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .exp-item, .edu-item {
          margin-bottom: 15px;
        }
        .company-date, .school-date {
          color: #777;
          font-style: italic;
          margin: 5px 0;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .badge {
          background-color: #f1f1f1;
          padding: 5px 10px;
          border-radius: 3px;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 5px;
        }
      </style>
    </head>
    <body>
      <div class="cv-container">
        <div class="cv-header">
            <h1>${cvData.name} ${cvData.lastname || ''}</h1>
            <p class="title">${cvData.title || 'Professionnel'}</p>
          </div>
        </div>
        
        <div class="contact-info">
          <h3>Contact</h3>
          <p><strong>Email:</strong> ${cvData.email}</p>
          ${cvData.linkedin ? `<p><strong>LinkedIn:</strong> ${cvData.linkedin}</p>` : ''}
          ${cvData.github ? `<p><strong>GitHub:</strong> ${cvData.github}</p>` : ''}
          ${cvData.phone ? `<p><strong>Téléphone:</strong> ${cvData.phone}</p>` : ''}
          ${cvData.address ? `<p><strong>Adresse:</strong> ${cvData.address}</p>` : ''}
        </div>
        
        ${cvData.summary ? `
        <div class="summary">
          <h3>Résumé</h3>
          <p>${cvData.summary}</p>
        </div>
        ` : ''}
        
        ${cvData.experiences && cvData.experiences.length > 0 ? `
        <div class="experiences">
          <h3>Expériences professionnelles</h3>
          ${cvData.experiences.map(exp => `
            <div class="exp-item">
              <h4>${exp.title}</h4>
              <p class="company-date">${exp.company} ( ${exp.startDate} | ${exp.endDate || 'Présent'} )</p>
              <p class="description">${exp.description || ''}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${cvData.education && cvData.education.length > 0 ? `
        <div class="education">
          <h3>Formation</h3>
          ${cvData.education.map(edu => `
            <div class="edu-item">
              <h4>${edu.degree}</h4>
              <p class="school-date">${edu.institution} | ${edu.startYear} - ${edu.endYear || 'Présent'}</p>
              <p class="description">${edu.description || ''}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${cvData.skills && cvData.skills.length > 0 ? `
        <div class="skills-section">
          <h3>Compétences</h3>
          <div class="skills">
            ${cvData.skills.map(skill => `
              <span class="badge">${typeof skill === 'string' ? skill : skill.name}</span>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${cvData.languages && cvData.languages.length > 0 ? `
        <div class="languages">
          <h3>Langues</h3>
          <ul>
            ${cvData.languages.map(lang => `
              <li><strong>${lang.name}:</strong> ${lang.level || 'Courant'}</li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${cvData.softSkills && cvData.softSkills.length > 0 ? `
        <div class="softSkills">
          <h3>Soft Skills</h3>
          <ul>
            ${cvData.softSkills.map(soft => `
              <li>${soft.level || ''}</li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${cvData.certifications && cvData.certifications.length > 0 ? `
        <div class="certifications">
          <h3>Certifications</h3>
          <ul>
            ${cvData.certifications.map(certif => `
              <li>${certif.level || ''}</li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(htmlContent);
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: {
      top: '50px',
      right: '20px',
      bottom: '50px',
      left: '20px'
    },
    printBackground: true
  });
  
  await browser.close();
  
  return pdfBuffer;
};

module.exports = {
  generatePDF
};