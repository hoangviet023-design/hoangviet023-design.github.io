# Portfolio de Viet Hoang

Ce site statique est rapide et gratuit à héberger. Son contenu se modifie via un formulaire, sans code.

```
index.html          → Accueil
entrepreneur.html   → Oomori Ramen
design.html         → Parcours & références UX/UI
vovinam.html        → Vovinam & palmarès
photo.html          → Galerie photo & vidéo
contact.html        → Contact
style.css           → couleurs et typographies (section :root en haut)
main.js, scene.js   → animations et paysage parallax (rien à modifier)
content/site.json   → TOUS LES TEXTES ET PHOTOS
images/             → vos photos et vidéos
cv/                 → votre CV en PDF
.pages.yml          → configuration de l'éditeur Pages CMS
```

Chaque page s'ouvre sur un paysage illustré (ciel violet, rose et pêche, nuages, montagnes, sapins), différent d'une page à l'autre, dont les couches bougent à des vitesses différentes au défilement et à la souris. Une scène de nuit clôt chaque page. Les images bougent en parallax, les cartes s'inclinent en 3D au survol et les titres apparaissent mot par mot. Toutes les animations se désactivent si l'option « réduire les animations » est activée sur l'appareil du visiteur.

---

## 1. Mettre le site en ligne avec GitHub Pages (gratuit, environ 10 minutes)

1. Créez un compte sur **github.com**.
2. Cliquez sur **New repository** et nommez le dépôt `portfolio`. Choisissez **Public** (obligatoire pour GitHub Pages en gratuit).
3. Sur la page du dépôt, cliquez sur **uploading an existing file**. Glissez **tout le contenu** du dossier, y compris le fichier caché `.pages.yml`, puis cliquez sur **Commit changes**.
   > Sur Mac, appuyez sur `Cmd + Maj + .` dans le Finder pour afficher les fichiers cachés.
4. Allez dans **Settings → Pages**. Sous *Source*, choisissez **Deploy from a branch**, puis la branche `main` et le dossier `/ (root)`. Cliquez sur **Save**.
5. Une ou deux minutes plus tard, le site est en ligne sur `https://VOTRE-PSEUDO.github.io/portfolio/`.

### Autre option : Vercel (gratuit également)
1. Créez un compte sur **vercel.com** avec « Continue with GitHub ».
2. Cliquez sur **Add New → Project**, choisissez le dépôt `portfolio` puis cliquez sur **Deploy**. Aucun réglage n'est nécessaire.
3. Le site est en ligne sur `portfolio-xxx.vercel.app`. Chaque modification du dépôt est publiée automatiquement en environ 30 secondes.

Vercel est un peu plus rapide et accepte les dépôts privés. GitHub Pages est le plus simple. Les deux fonctionnent avec l'éditeur décrit ci-dessous.

## 2. Ajouter votre nom de domaine (par exemple viethoang.fr)
1. Achetez le domaine chez OVH, Gandi ou Cloudflare (environ 10 € par an).
2. **GitHub Pages** : allez dans Settings → Pages → *Custom domain*, puis saisissez `viethoang.fr`. Chez votre registrar, créez les enregistrements DNS indiqués par GitHub (4 enregistrements A et un CNAME `www`). Cochez ensuite **Enforce HTTPS**.
   **Vercel** : allez dans Project → Settings → Domains → *Add*, puis suivez les instructions DNS affichées.

## 3. Modifier le contenu vous-même, sans code
1. Allez sur **app.pagescms.org** et connectez-vous avec GitHub.
2. Autorisez l'accès au dépôt `portfolio`.
3. Ouvrez **Contenu du site** : chaque section (Accueil, Restaurants, Design, Vovinam, Photo, Contact) apparaît sous forme de formulaire.
4. Modifiez les textes, glissez vos photos et ajoutez ou supprimez des restaurants, des études de cas ou des photos, puis cliquez sur **Save**.
5. Le site se met à jour tout seul en une à deux minutes.

Cela fonctionne aussi depuis un téléphone.

## Conseils pour les photos et vidéos
- **Photos** : format JPG ou WebP, environ 2000 px de large et moins de 500 Ko. Vous pouvez les compresser gratuitement sur squoosh.app.
- **Galerie** : cochez *Format portrait* pour les photos verticales, afin d'obtenir une mosaïque harmonieuse.
- Tant qu'aucune photo n'est ajoutée, un dégradé élégant s'affiche à sa place.

## Changer les couleurs
Dans `style.css`, en haut du fichier :
```css
--bg: #1c0f26;        /* prune profond */
--accent: #ff86b8;    /* rose */
--accent-2: #ffb98f;  /* pêche */
--violet: #a98bff;    /* violet */
```
Les couleurs du ciel se règlent dans `.scene` (dégradé) et celles des montagnes dans `scene.js` (objet `P`).

## Tester sur votre ordinateur
Dans le dossier, lancez `npx serve`, puis ouvrez l'adresse affichée. Ouvrir directement `index.html` par double-clic ne charge pas le contenu.
