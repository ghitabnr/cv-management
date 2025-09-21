const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/cvs.json');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
}

const getAllCVs = () => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors de la lecture des CVs:', error);
    return [];
  }
};

const saveData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erreur lors de l\'écriture des CVs:', error);
    throw new Error('Impossible de sauvegarder les données');
  }
};

const getCVById = (id) => {
  const cvs = getAllCVs();
  return cvs.find(cv => cv.id === id);
};

const createCV = (cvData) => {
  const cvs = getAllCVs();
  
  if (!cvData.name || !cvData.email) {
    throw new Error('Nom et email sont requis');
  }
  
  const newId = cvs.length > 0 ? Math.max(...cvs.map(cv => cv.id)) + 1 : 1;
  
  const newCV = {
    id: newId,
    ...cvData,
    createdAt: new Date().toISOString()
  };
  
  cvs.push(newCV);
  saveData(cvs);
  
  return newCV;
};

module.exports = {
  getAllCVs,
  getCVById,
  createCV
};
