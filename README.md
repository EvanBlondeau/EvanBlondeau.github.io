# Portfolio Evan

Site portfolio 

copyright@EvanBlondeau

## Stack CSS actuelle

- Tailwind via CDN: ajouté dans `index.html` et les pages `details-*.html`
- Bootstrap supprimé (CSS/JS retirés des pages)
- Styles spécifiques conservés dans `assets/css/style.css`

## Migration Tailwind (prochaine étape build)

Si vous souhaitez passer sur un build Tailwind (sans CDN) pour de meilleures perfs et purge CSS:

1. Installer Tailwind et PostCSS localement
2. Créer une config Tailwind pour purger les classes utilisées
3. Remplacer le CDN par le CSS généré

Exemple de commande (à adapter si vous ajoutez un package.json):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

Dans `assets/css/tailwind.css` placez:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Build de sortie (exemple):

```bash
npx tailwindcss -i ./assets/css/tailwind.css -o ./assets/css/build.css --minify
```

Puis dans `index.html`, remplacer le CDN par:

```html
<link href="assets/css/build.css" rel="stylesheet">
```