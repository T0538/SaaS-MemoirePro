Sécurité des Clés API LIA

- Ne jamais exposer une clé API dans le frontend.
- Utiliser un proxy backend pour tous les appels IA.
- Stocker les clés dans des variables d’environnement (`.env`), jamais dans le code.
- Activer la rotation automatique des clés (`GEMINI_API_KEYS`), avec intervalle configurable.
- Restreindre l’accès par IP (`ALLOWED_IPS`) et par plage horaire (`ALLOWED_HOURS`).
- Surveiller les fuites en scannant les assets build et en journalisant les accès.
- Mettre en place des alertes en cas d’erreur d’authentification ou de surcharge.
- Révoquer et remplacer immédiatement une clé suspecte.
- Limiter les permissions des clés et compartimenter par environnement (dev/staging/prod).
- Auditer régulièrement le dépôt pour rechercher des secrets accidentellement commités.
