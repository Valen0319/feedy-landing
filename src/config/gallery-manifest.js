/**
 * MANIFIESTO DE FEEDY  (único archivo que necesitás editar)
 *
 * FOTOS: cada una es un objeto con
 *   src         Ruta de la imagen (copiala en public/assets/images/<carpeta>/).
 *   title       Título corto (hover y lightbox).
 *   description Descripción breve (lightbox).
 *   category    Una clave de CATEGORIES.
 * - Agregar: sumá un objeto a PHOTOS.  - Quitar: borrá su línea.
 * - Reemplazar: cambiá `src` o pisá el archivo con el mismo nombre.
 * - Si una imagen no existe, NO se muestra (nunca hay imágenes rotas).
 * - Las de category "producto" van a "Producto terminado" y, si no hay video, al hero.
 *   Para elegir otra portada, completá HERO_SRC.
 * Las rutas de abajo son ejemplos: ajustalas a los nombres de tus archivos.
 */
export const HERO_SRC = 'public/assets/images/producto/feedy-imagen-realista.jpg';

/** Video del hero: bucle, sin sonido. Alcanza con el mp4; el webm es opcional.
 *  Si ningún archivo existe, el hero muestra la versión con foto. */
export const HERO_VIDEO = { mp4: 'public/assets/video/video feedy.mp4', webm: '' };

export const CATEGORIES = {
  diseno: 'Diseño 3D',
  impresion: 'Impresión 3D',
  pintado: 'Pintado',
  electronica: 'Electrónica',
  ensamblaje: 'Ensamblaje',
  programacion: 'Programación',
  pruebas: 'Pruebas',
  producto: 'Producto terminado',
};

export const PHOTOS = [
  { src: 'public/assets/images/impresion-3d/IMG_4814.jpg', title: 'Impresión 3D', description: 'Piezas en proceso de impresión.', category: 'impresion' },
  { src: 'public/assets/images/impresion-3d/IMG_4815.jpg', title: 'Impresión 3D', description: 'Piezas impresas del alimentador.', category: 'impresion' },
  { src: 'public/assets/images/impresion-3d/IMG_4816.jpg', title: 'Impresión 3D', description: 'Detalles de fabricación.', category: 'impresion' },
  { src: 'public/assets/images/impresion-3d/IMG_4818.jpg', title: 'Impresión 3D', description: 'Proceso de impresión.', category: 'impresion' },
  { src: 'public/assets/images/impresion-3d/IMG_4819.jpg', title: 'Impresión 3D', description: 'Componentes impresos.', category: 'impresion' },
  { src: 'public/assets/images/impresion-3d/IMG_4820.jpg', title: 'Impresión 3D', description: 'Piezas terminadas.', category: 'impresion' },
  { src: 'public/assets/images/electronica/IMG_4817.jpg', title: 'Electrónica', description: 'Conexionado de los componentes electrónicos.', category: 'electronica' },
  { src: 'public/assets/images/ensamblaje/IMG_4877.jpg', title: 'Ensamblaje', description: 'Montaje mecánico del alimentador.', category: 'ensamblaje' },
  { src: 'public/assets/images/desarrollo/prog.jpg', title: 'Programación', description: 'Desarrollo del software de control.', category: 'programacion' },
  { src: 'public/assets/images/desarrollo/prog blac.jpg', title: 'Programación', description: 'Interfaz y lógica de Feedy.', category: 'programacion' },
  { src: 'public/assets/images/desarrollo/prog neg.jpg', title: 'Programación', description: 'Interfaz de configuración en modo oscuro.', category: 'programacion' },
  { src: 'public/assets/images/producto/feedy-imagen-realista.jpg', title: 'Feedy terminado', description: 'Vista realista del producto.', category: 'producto' },
  { src: 'public/assets/images/producto/IMG_4917.jpg', title: 'Feedy terminado', description: 'Producto terminado.', category: 'producto' },
];

export const MODEL_URL = 'public/assets/models/feedy-model.stl';
export const LOGO_URL = 'public/assets/logo/feedy solo logo.png';
