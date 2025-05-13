# Gestionnaire de Tâches
TODO-APP

## Description
Application web de gestion de tâches avec tableau de bord statistique, visualisation des données et citations motivantes.

## Fonctionnalités principales
- Création de tâches avec texte, date et niveau de priorité
- Marquage des tâches comme terminées
- Suppression de tâches avec confirmation
- Système de recherche et filtrage
- Tableau de bord avec statistiques visuelles
- Tri des tâches par différents critères
- Sauvegarde locale dans le navigateur
- Interface adaptée aux mobiles
- Citations aléatoires pour la motivation

## Technologies
- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript natif (ES6+)
- Chart.js pour les graphiques
- LocalStorage pour le stockage
- API Quotable pour les citations

## Installation
1. Téléchargez les fichiers du projet
2. Ouvrez `index.html` dans votre navigateur web

Aucune installation supplémentaire n'est requise.

## Structure du projet
todo-app/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── storage.js         
│   ├── taskRenderer.js    
│   ├── dashboard.js       
│   ├── taskManager.js     
│   └── main.js           
├── images/
│   ├── screenshot.png     
│   └── screenshot1.png    
└── README.md              

## Utilisation
1. Ajoutez une tâche via le formulaire
2. Cliquez sur la case pour marquer une tâche comme terminée
3. Utilisez les boutons de suppression pour supprimer des tâches
4. Consultez les statistiques dans le tableau de bord
5. Appuyez sur "Nouvelle citation" pour une dose de motivation

## Fonctionnalité des citations
- Affichage d'une citation aléatoire au chargement de la page
- Bouton pour charger une nouvelle citation à la demande
- Citations en anglais avec traduction automatique optionnelle
- Cache des citations récentes pour éviter les répétitions
- Mode hors-ligne avec citations par défaut

## Personnalisation
Modifiez les fichiers suivants pour personnaliser :
- `style.css` : couleurs, tailles et disposition
- `js/quotes.js` : sources des citations ou texte par défaut

## Aperçu
![Interface de l'application](/images/screenshot.png)
![Interface de l'application](/images/screenshot1.png)

## Auteur
Chairat Aymen - aymen.chairat@sesame.com.tn
