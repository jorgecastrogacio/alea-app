# Registro de Decisiones de Arquitectura y Auditoría - ALEA

Este documento registra todas las decisiones técnicas y de diseño tomadas durante la construcción del prototipo de **ALEA**, garantizando estricta adherencia a la directiva de **Coste Cero (0,00€)**, privacidad para menores y las correcciones de la auditoría de usabilidad (Sesión "Daniela, 11 años").

---

## 1. Stack Tecnológico y Coste Cero
- **Framework:** Next.js 15 (App Router) + TypeScript + Tailwind CSS.
- **Coste de Infraestructura:** 0,00€. Desplegado en Vercel Hobby Tier (`https://alea-app.vercel.app`) y sincronizado con GitHub (`jorgecastrogacio/alea-app`).
- **Sin Base de Datos de Pago:**
  - `data/books.mock.json` enriquecido con metadatos de 15 obras infantiles y juveniles.
  - Conector headless preparado en `lib/api.ts` (`getBooksFromGoogleSheets`) para sincronizar con Google Sheets CSV (0€/mes).
- **Sin APIs de Pago de Catálogo:** Cero uso de DILVE o ISBNdb.
- **Persistencia 100% Local y Privada:** `LocalStorage` con claves `alea_user_profile`, `alea_library_state`, `alea_favorites` y `alea_ratings`.

---

## 2. Hitos de Corrección Quirúrgica (Auditoría Usabilidad "Daniela, 11 años")

### HITO 1: Arreglo del Bug Excluyente y Pregunta Oficial de Mundos
- **Bug #1 Resuelto:** La opción *"Me da igual el formato si la historia es buena"* es estrictamente excluyente: al seleccionarse desmarca todas las demás opciones, y si se selecciona cualquier formato específico, se desmarca de inmediato.
- **Bug #2 Resuelto:** Introducción de la pregunta oficial **"Tus Mundos"** en el onboarding con las 6 opciones oficiales (máximo 3):
  1. *Bosques encantados* (🌲)
  2. *Castillos y secretos* (🏰)
  3. *Mundos submarinos* (🌊)
  4. *Planetas y galaxias* (🚀)
  5. *Islas y aventuras* (🏝️)
  6. *Lugares como el nuestro* (🏙️)
  La selección se guarda y alimenta las recomendaciones del lector.

### HITO 2: Nacimiento de 'Brillo' y Personalización de Mascota
- **Bugs #3 y #11 Resueltos:** Creación del componente `components/BrilloAvatar.tsx` con halo luminoso animado, partículas de brillo y expresiones (`happy`, `curious`, `reading`, `celebrating`).
- Eliminado por completo el uso de `banner_mascot.jpg` que contenía texto recortado.
- Pantalla 1 del onboarding dedicada a la presentación de la mascota, permitiendo al menor personalizar su nombre (por defecto *Brillo* o elegir alternativas como *Chispa*, *Lumi*, etc.).
- El nombre real de la mascota se propaga dinámicamente en cabeceras, diálogos y recomendaciones.

### HITO 3: Metadatos Técnicos y Justificación Natural de Recomendaciones
- **Bug #6 Resuelto:** Añadidos los campos `language` (ej. "Castellano"), `difficulty` ("Fácil", "Media", "Avanzada") y `edition` (ej. "1ª Edición Coleccionista, 2023") en `data/books.mock.json` y visibles en la ficha técnica del libro.
- **Bug #7 Resuelto:** Sustitución de etiquetas crudas por un motor de razonamiento humano y empático en español (`lib/recommendation.ts`):
  Genera frases fluidas como: *"Porque te encantan las grandes aventuras y los misterios, y este libro te atrapará desde el primer capítulo con personajes inolvidables."*

### HITO 4: Favoritos y Valoraciones Privadas
- **Bug #4 Resuelto:** Botón de corazón para añadir o retirar libros de 'Favoritos' tanto en la cabecera del libro como en la ficha.
- Añadida 4ª pestaña en Mi Biblioteca: **'Favoritos'** (junto a *Quiero leer*, *Estoy leyendo* y *Leído*).
- **Bug #5 Resuelto:** Modal interactivo de valoración privada con 1 a 5 estrellas y chips de opinión (*"Engancha desde el principio"*, *"Personajes increíbles"*, *"Final inesperado"*, etc.). Si un libro en estado 'Leído' tiene valoración, muestra sus estrellas en su tarjeta.

### HITO 5: Red de Bibliotecas Públicas Locales (Cero Rebiun)
- **Bug #8 Resuelto:** Reemplazado el botón y modal a **"Buscar en Biblioteca Pública Local"**.
- Muestra disponibilidad en sala infantil ("Disponible en sala infantil - Biblioteca Central / Red Municipal") y consejos de Brillo para préstamo con el ISBN.
- Enlace directo a eBiblio España (`https://catalogo.ebiblio.es/`), eliminando cualquier confusión o referencia a catálogos universitarios como Rebiun.

### HITO 6: Accesibilidad, Responsive y Tagline
- **Bug #15 Resuelto:** Viewport en `app/layout.tsx` sin restricciones de escalado para permitir zoom infantil de accesibilidad.
- **Bug #13 Resuelto:** En tablets/iPads las tarjetas de recomendación tienen ancho adecuado (`min-w-[260px]`), `whitespace-normal` y títulos en multilínea sin cortes bruscos.
- **Bug #10 Resuelto:** Componente modal `EditPreferencesModal.tsx` integrado en *Descubre* y *Mi Universo* para ajustar mundos e intereses en cualquier momento sin tener que reiniciar el onboarding desde cero.
- **Bug #14 Resuelto:** Tagline oficial unificado: *"Descubre tu próxima gran historia"*.
