# Script de création de structure React pour PowerShell
# Enregistrez ce fichier sous create-structure.ps1

# 1. Créer le projet React (décommentez si besoin)
# npx create-react-app event-app-frontend --template typescript
# cd event-app-frontend

# 2. Création des dossiers
$folders = @(
    "src",
    "src/assets",
    "src/components",
    "src/components/common",
    "src/components/common/Header",
    "src/components/common/Footer",
    "src/components/auth",
    "src/components/events",
    "src/pages",
    "src/pages/WelcomePage",
    "src/pages/HomePage",
    "src/pages/EventPage",
    "src/contexts",
    "src/hooks",
    "src/services",
    "src/utils"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "Créé : $folder" -ForegroundColor Green
    }
}

# 3. Création des fichiers
$files = @(
    # Contextes
    "src/contexts/AuthContext.jsx",
    "src/contexts/EventContext.jsx",
    
    # Hooks
    "src/hooks/useAuth.js",
    "src/hooks/useEvents.js",
    
    # Services
    "src/services/auth.js",
    "src/services/events.js",
    
    # Utils
    "src/utils/helpers.js",
    
    # Composants communs
    "src/components/common/Header/Header.jsx",
    "src/components/common/Header/Header.css",
    "src/components/common/Footer/Footer.jsx",
    "src/components/common/Footer/Footer.css",
    
    # Auth
    "src/components/auth/SignIn.jsx",
    "src/components/auth/SignUp.jsx",
    "src/components/auth/AuthForm.jsx",
    
    # Events
    "src/components/events/EventCard.jsx",
    "src/components/events/EventGrid.jsx",
    "src/components/events/EventDetails.jsx",
    "src/components/events/EventForm.jsx",
    
    # Pages
    "src/pages/WelcomePage/WelcomePage.jsx",
    "src/pages/WelcomePage/HeroSection.jsx",
    "src/pages/WelcomePage/Features.jsx",
    "src/pages/WelcomePage/WelcomePage.css",
    
    "src/pages/HomePage/HomePage.jsx",
    "src/pages/HomePage/AdminView.jsx",
    "src/pages/HomePage/UserView.jsx",
    "src/pages/HomePage/HomePage.css",
    
    "src/pages/EventPage/EventPage.jsx",
    "src/pages/EventPage/AdminControls.jsx",
    "src/pages/EventPage/UserActions.jsx",
    "src/pages/EventPage/EventPage.css"
)

foreach ($file in $files) {
    if (!(Test-Path $file)) {
        New-Item -ItemType File -Path $file -Force | Out-Null
        Write-Host "Créé : $file" -ForegroundColor Cyan
    }
}

Write-Host "Structure créée avec succès!" -ForegroundColor Green
Write-Host "N'oubliez pas d'installer les dépendances :" -ForegroundColor Yellow
Write-Host "npm install @mantine/core @mantine/hooks @mantine/form @emotion/react react-router-dom" -ForegroundColor Magenta