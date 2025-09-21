const dataService = require('./dataService');

const searchByName = (name) => {
  const cvs = dataService.getAllCVs();
  const searchTerm = name.toLowerCase();
  
  return cvs.filter(cv => {
    const fullName = `${cv.name} ${cv.lastname || ''}`.toLowerCase();
    return fullName.includes(searchTerm);
  });
};

const searchByTechnology = (technology) => {
  const cvs = dataService.getAllCVs();
  const searchTerm = technology.toLowerCase();
  
  return cvs.filter(cv => {
    if (cv.skills && Array.isArray(cv.skills)) {
      return cv.skills.some(skill => 
        typeof skill === 'string' 
          ? skill.toLowerCase().includes(searchTerm)
          : (skill.name && skill.name.toLowerCase().includes(searchTerm))
      );
    }
    return false;
  });
};

const searchByExperience = (minYears) => {
  const cvs = dataService.getAllCVs();
  
  return cvs.filter(cv => {
    if (cv.yearsOfExperience && cv.yearsOfExperience >= minYears) {
      return true;
    }
    
    if (cv.experiences && Array.isArray(cv.experiences)) {
      const totalYears = cv.experiences.reduce((total, exp) => {
        if (exp.years) return total + (exp.years * 12);
        
        if (exp.startDate && exp.endDate) {
          const start = new Date(exp.startDate + "-01"); 
          const end = new Date(exp.endDate + "-01");
          
          let years = end.getFullYear() - start.getFullYear();
          let months = end.getMonth() - start.getMonth();

          if (months < 0) {
            years--; 
            months += 12;
          }          
          return total + (years*12) + months;
        }
        
        return total;
      }, 0);
      
      return totalYears >= minYears;
    }
    
    return false;
  });
};

const advancedSearch = (criteria) => {
  let results = dataService.getAllCVs();
  
  if (criteria.name) {
    results = results.filter(cv => {
      const fullName = `${cv.name} ${cv.lastname || ''}`.toLowerCase();
      return fullName.includes(criteria.name.toLowerCase());
    });
  }
  
  if (criteria.skill) {
    results = results.filter(cv => {
      if (!cv.skills || !Array.isArray(cv.skills)) return false;
      
      return cv.skills.some(skill => 
        typeof skill === 'string'
          ? skill.toLowerCase().includes(criteria.skill.toLowerCase())
          : (skill.name && skill.name.toLowerCase().includes(criteria.skill.toLowerCase()))
      );
    });
  }
  
  if (criteria.minYears) {
    results = searchByExperience(criteria.minYears).filter(cv => 
      results.some(r => r.id === cv.id)
    );
  }
  
  return results;
};

module.exports = {
  searchByName,
  searchByTechnology,
  searchByExperience,
  advancedSearch
};
