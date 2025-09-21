const pdfService = require('../src/services/pdfService');
const puppeteer = require('puppeteer');

jest.mock('puppeteer');

describe('Service de génération de PDF', () => {
  const mockCV = {
    id: 1,
    name: 'ghita',
    lastname: 'bounouara',
    title: 'Développeure Full Stack',
    email: 'gb@example.com',
    phone: '0123456789',
    summary: 'Développeure expérimentée',
    skills: ['JavaScript', 'React', 'Node.js'],
    experiences: [
      { 
        title: 'Junior Developer', 
        company: 'fsdm', 
        startDate: '2025-05', 
        endDate: 'present',
        description: 'Développement d\'applications web'
      }
    ],
    education: [
      {
        degree: 'Master MQL',
        institution: 'fsdm',
        startYear: '2024',
        endYear: '2026'
      }
    ]
  };

  const mockBrowser = {
    newPage: jest.fn(),
    close: jest.fn()
  };
  
  const mockPage = {
    setContent: jest.fn(),
    pdf: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    puppeteer.launch.mockResolvedValue(mockBrowser);
    mockBrowser.newPage.mockResolvedValue(mockPage);
    mockPage.pdf.mockResolvedValue(Buffer.from('mock pdf content'));
  });

  test('generatePDF devrait créer un PDF à partir des données du CV', async () => {
    const pdfBuffer = await pdfService.generatePDF(mockCV);
    
    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockBrowser.newPage).toHaveBeenCalled();
    expect(mockPage.setContent).toHaveBeenCalled();
    expect(mockPage.pdf).toHaveBeenCalled();
    expect(mockBrowser.close).toHaveBeenCalled();
    
    expect(mockPage.setContent.mock.calls[0][0]).toContain('ghita bounouara');
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
  });

  test('generatePDF devrait gérer les cas où certaines sections sont manquantes', async () => {
    const minimalCV = {
      id: 2,
      name: 'chaymae',
      email: 'chaymae@example.com'
    };
    
    await pdfService.generatePDF(minimalCV);
    
    const htmlContent = mockPage.setContent.mock.calls[0][0];
    expect(htmlContent).toContain('chaymae');
    expect(htmlContent).toContain('chaymae@example.com');
    
    expect(htmlContent).not.toContain('Résumé');
    expect(htmlContent).not.toContain('Expérience professionnelle');
  });
});
