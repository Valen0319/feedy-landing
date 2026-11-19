# Feedy · Landing page

Sitio estático (HTML + CSS + JS modular). Sin backend ni build. Three.js, OrbitControls y STLLoader están en `vendor/three/`.

## Qué poner y dónde
| Archivo | Ubicación |
|---|---|
| Logo | `public/assets/logo/feedy-logo.png` |
| Video del hero (opcional) | `public/assets/video/feedy-hero.mp4` (y `.webm` opcional) |
| Modelo 3D | `public/assets/models/feedy.stl` (mismo nombre para reemplazarlo; recargá con Ctrl+F5) |
| Fotos | `public/assets/images/{producto,desarrollo,impresion-3d,electronica,ensamblaje}/` |

## Manifiesto: `src/config/gallery-manifest.js`
Único archivo a editar: fotos (`src`, `title`, `description`, `category`), categorías, portada, rutas del video. Lo que no existe no se muestra.

## Video del hero
Fondo en bucle, sin sonido, con capa oscura para leer el texto. Si no existe, falla, o el visitante prefiere menos movimiento, se muestra el hero con foto. Recomendado: 1080p máx., 10–20 s, menos de ~8 MB:
```
ffmpeg -i entrada.mov -an -vf "scale=-2:1080,fps=30" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart feedy-hero.mp4
```

## Ejecutar
```
python3 -m http.server 8080   # abrir http://localhost:8080
```
(No funciona con doble clic en `index.html`: los módulos ES requieren http.)

## Publicar
GitHub Pages (Settings → Pages → rama `main`, carpeta raíz), Netlify Drop o Vercel.
