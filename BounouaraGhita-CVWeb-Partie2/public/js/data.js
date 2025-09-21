let cv = {
    profile: {
        photo: "images/photo.jpg",
        firstName: "Ghita",
        lastName: "Bounouara",
        phone: "(+212) 663 156 904",
        email: "ghita.bnr2003@gmail.com",
        professionalTitle: "Étudiante en Master Qualité du Logiciel",
        professionalSummary:"Ingénieure en informatique avec une bonne expérience sur les architectures logicielles et les nouvelles technologies informatique, en l'occurence Jakarta EE, Spring Boot, React et Angular. Expérimentée dans la gestion de projets agiles, planification, exécution et coordination des tâches avec des équipes multifonctionnelles. Disposante des compétences requises en communication et en résolution de problèmes avec un esprit ouvert en collaboration efficace avec les parties prenantes et les membres de l'équipe.",
        links: [
            { name: "LinkedIn", url: "https://www.linkedin.com/in/ghita-bounouaraa02b06253" },
            { name: "GitHub", url: "https://github.com/ghitabnr" }
        ]
    },
    education: [
        {
            diploma: "Master en Qualité du Logiciel",
            organisation: "FSDM - Université Sidi Mohammed ben Abdellah - Fès ",
            year: "(2024 - 2026)",
            details: ""
        },
        {
            diploma: "Licence en Sciences Mathématiques et Informatique",
            organisation: "FSDM - Université Sidi Mohammed ben Abdellah - Fès ",
            year: "(2023 - 2024)",
            details: ""
        },
        {
            diploma: "DEUG en Sciences Mathématiques et Informatique",
            organisation: "FSDM - Université Sidi Mohammed ben Abdellah - Fès ",
            year: "(2020 - 2023)",
            details: ""
        },
        {
            diploma: "Baccalauréat en Sciences Mathématiques B",
            organisation: "Lycée Technique de Fès ",
            year: "(2017 - 2020)",
            details: ""
        }
    ],
    technologySkills: [
        {
            skill: "Systèmes d'Exploitation",
            details: "Linux / Windows"
        },
        {
            skill: "Langages de Programmation",
            details: "Java / Python / C / PHP"
        },
        {
            skill: "Ingénierie du Web",
            details: "HTML / CSS / JavaScript / Node.js / Angular / React"
        },
        {
            skill: "Jakarta Entreprise Edition (JEE)",
            details: "Architecture 3 tiers / Modèle MVC2 / Servlets et JSP / Modèle DAO / Framework Spring, Spring Boot / JPA / Hibernate / Administration Tomcat"
        },
        {
            skill: "Bases de Données",
            details: "MySQL / SQL Server"
        },
        {
            skill: "Cloud Computing",
            details: "AWS (EC2, S3, RDS, ...) / Docker / Apache CloudStack"
        },
        {
            skill: "Outils de Développement",
            details: "Eclipse / Visual Studio / STS"
        },
        {
            skill: "Ingénierie DevOps",
            details: "Maven / Git / GitHub / GitLab / Jira / Jenkins / JUnit / Selenuim / JaCoCo / Trello"
        },
        {
            skill: "Conception & Architecture Logicielle",
            details: "UML / Merise"
        },
        {
            skill: "Technologie XML",
            details: "Standard XML / Bases de données XML / Parseurs XML (DOM, SAX) / DTD / XSD (XML Schema) / XSLT / XPath / XQuery"
        },
        {
            skill: "Méthodologies Agiles",
            details: "Agile  / Scrum"
        },
        {
            skill: "Data Science / IA",
            details: "Deep Learning"
        }
    ],
    experiences: [
        {
            type: "Professionnelle",
            organisation: "Dr Stone (Casablanca)",
            title: "Data Scientist",
            description: "Développement d'un système de détection en temps réel des oranges pourries basé sur du deep learning et l'utilisation de drones.",
            technologies: ["PyTorch", "YOLOv5", "Roboflow"],
            duration: "Mars 2024 - Mai 2024 (3 mois)"
        },
        {
            type: "Professionnelle",
            organisation: "Webhelp (Fès)",
            title: "Développeur Web",
            description: "Conception et développement d'une application web de gestion des hôtels.",
            technologies: ["HTML", "CSS", "JavaScript"],
            duration: "Octobre 2022 - Novembre 2022 (1 mois)"
        },
        {
            type: "Académique",
            organisation: "Projet Académique",
            title: "Analyse statique et génération de diagrammes UML (Java)",
            description: "Développement d'une application Java permettant l'extraction automatique des packages, classes, interfaces et annotations à partir d'un projet Java en utilisant l'introspection.",
            details: [
                "Construction de diagrammes de packages et de classes UML",
                "Extraction des relations (agrégation, extension, utilisation, etc.) entre entités",
                "Persistance des données en XML personnalisé et export XMI (standard OMG)",
                "Étude de XMI, MOF et EMF + benchmark de plugins Eclipse UML",
                "Création d'une interface Swing pour la visualisation graphique des diagrammes"
            ],
            technologies: ["Java", "UML", "XML", "Swing"],
            duration: "Déc. 2024 – Jan. 2025"
        },
        {
            type: "Académique",
            organisation: "Projet Académique",
            title: "Analyse d'une Classe Java via Introspection",
            description: "Développement d'une application Java permettant d'extraire et d'afficher via une interface Swing le squelette complet d'une classe.",
            details: [
                "Création d'une classe ClassParser pour extraire les informations via réflexion",
                "Utilisation de javap pour comparer les résultats obtenus avec l'outil JDK",
                "Développement d'une interface Swing ClassParserFrame pour afficher les résultats de manière graphique",
                "Vérification des informations extraites avec un terminal Eclipse et débogage"
            ],
            technologies: ["Java", "Introspection", "Swing"],
            year: "2024",
            duration: "Décembre "
        },
        {
            type: "Académique",
            organisation: "Projet Académique",
            title: "Gestion des Étudiants - Application CRUD en Java",
            description: "Développement d'une application Maven pour gérer des étudiants avec une architecture en couches.",
            details: [
                "Création d'un projet Maven structuré avec une gestion de dépendances",
                "Implémentation de la couche DAO pour manipuler les données étudiantes",
                "Développement de la couche Business pour gérer les services métier",
                "Tests unitaires des services métier avec une implémentation simulée de la DAO",
                "Gestion de version et hébergement du projet sur GitLab"
            ],
            technologies: ["Java", "Maven", "XML", "JUnit"],
            year: "2025",
            duration: "Avril "
        },
        {
            type: "Académique",
            organisation: "Projet Académique",
            title: "Déploiement d'une application JEE dans Docker sur AWS",
            description: "Déploiement d'une application full-stack (frontend + backend) sur AWS avec ECS Fargate et AWS Copilot.",
            details: [
                "Préparation de l'environnement cloud sécurisé sur AWS",
                "Installation et configuration de Docker, AWS Copilot CLI",
                "Utilisation de AWS Copilot pour automatiser le déploiement de services",
                "Déploiement d'une architecture full-stack sur ECS Fargate",
                "Mise en place d'un système de Service Discovery pour la communication entre services"
            ],
            technologies: ["AWS", "Docker", "JEE", "AWS Copilot"],
            year: "2025",
            duration: "Mars "
        }
    ],
    softSkills: [
        "Esprit d'équipe",
        "Communication",
        "Capacité de Résolution de problèmes"
    ],
    languages: [
        {
            language: "Français",
            experience: "courant"
        },
        {
            language: "Anglais",
            experience: "courant"
        },
        {
            language: "Arabe",
            experience: "maternelle"
        }
    ],
    certifications: [
        "Certificat de participation INNOVATION CAMP-INJAZ (2025)",
        "Software Engineer – ALX Academy (Mai 2023 - Août 2024)",
        "Microsoft Office Specialist: Master – Microsoft (Février 2022 - Juillet 2022)",
        "Advanced English as a Second Language – Saylor Academy (2021)"
    ]
};

if (!localStorage.getItem('cv')) {
    localStorage.setItem('cv', JSON.stringify(cv));
  } else {
    localStorage.setItem('cv', JSON.stringify(cv));
  }
