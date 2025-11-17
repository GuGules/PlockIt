# PlockIt
![badge0](https://github.com/GuGules/PlockIt/actions/workflows/buildAndPush.yml/badge.svg)

Plockit est une application qui permet de recueillir des feedbacks en temps réel et de les afficher en temps réel sur un tableau de bord. Elle permet également de mettre en avant par un vote les feedbacks les plus pertinents.

## Installation

PlockIt fonctionne sur Docker, peu importe le système d'exploitation. Il suffit de lancer le container pour lancer l'application. Le seul pré-requis au fonctionnement de l'application est la configuration. Celle-ci se passe via les variables d'environnement listées dans le tableau ci-dessous : 

| Variable d'environnement | Role | Valeur par défaut |
| ------------------------ | ---- | ----------------- |
| `SECURITY_TOKEN` | Permet de définir une clé de sécurité pour interagir avec les paramètres de l'application | `<change-me>` |
| `SECURED_MODE` | Permets de définir si l'application s'exécute en mode sécurisé ou non. En mode sécurisé, l'accès au site est restraint à une liste d'ip enregistré dans l'application, et les actions de configuration nécessitent `SECURITY_TOKEN` pour être réalisée. | `false` |
| `INITIAL_IP` | Permet de définir une première addresse ip autorisée à accéder au site si l'application s'exécute en mode sécurisé | `undefined` |
| `INITIAL_IPS` | Permet de définir une liste d'addresses ip autorisées à accéder au site si l'application s'exécute en mode sécurisé (format: ip1, ip2, ...) | `undefined` |

## Développement

Après avoir cloné l'application : 

Charger les modules de l'application : 
``` 
npm install
```

Lancer l'application (en mode développement avec la recharge à chaque modification) : 
``` 
npm run dev
```

Lancer l'application (en mode production) : 
```
npm run start
```

## Licence

MIT License

Copyright (c) 2025 Jules PILLOT

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.