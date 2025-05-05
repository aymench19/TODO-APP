# Gestionnaire de Tâches (To-Do List)
## Fonctionnalités

### Gestion des tâches
- Ajout de nouvelles tâches avec texte, date et priorité
- Marquage des tâches comme complètes/incomplètes
- Suppression des tâches
- Sauvegarde automatique dans le localStorage

### Dashboard de statistiques
- Vue d'ensemble des tâches (total, complétées, incomplètes)
- Barre de progression globale
- Répartition par priorité (haute, normale, faible)

### Fonctionnalités avancées
- Recherche en temps réel
- Tri multiple (par date, priorité, texte, statut)
- Interface colorée selon les priorités

## Technologies utilisées

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript Vanilla
- localStorage pour la persistance des données

## Structure des fichiers
todo-app/
├── index.html # Page principale
├── css/
│ └── style.css # Feuille de style
├── js/
│ ├── main.js # Logique principale
│ └── storage.js # Gestion du localStorage
└── README.md # Documentation