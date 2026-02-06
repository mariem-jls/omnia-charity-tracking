# omnia-charity-tracking
Application web de suivi des actions caritatives pour l'association Omnia
##  Contexte
Projet développé lors du Hackathon Maratech 2026 pour aider l'association Omnia à digitaliser leur suivi des bénéficiaires.

##  Structure du projet
omnia-charity-tracking/
├── backend/ # API Spring Boot
├── frontend-backoffice/ # Interface administration
├── frontend-frontoffice/ # Interface terrain (mobile)
└── shared/ # Code partagé

##  Installation

### Backend
cd backend
mvn clean install
mvn spring-boot:run
### Front Office (Terrain)
cd frontend-frontoffice
npm install
ng serve --port 4300
### Back Office (Admin)
cd frontend-backoffice
npm install
ng serve --port 4200
### URLs
    API Backend : http://localhost:8080
    Front Office : http://localhost:4300
    Back Office : http://localhost:4200
    Swagger UI : http://localhost:8080/swagger-ui.html
### Equipe
Mensi Ameni & Jlassi Mariem


