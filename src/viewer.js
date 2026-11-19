import * as THREE from 'three';
import { OrbitControls } from '../vendor/three/OrbitControls.js';
import { STLLoader } from '../vendor/three/STLLoader.js';
import { MODEL_URL } from './config/gallery-manifest.js';

const $ = (s) => document.querySelector(s);

export function initViewer() {
  const stage = $('#stage'), msg = $('#viewer-msg'), drop = $('#drop');
  const nameEl = $('#v-name'), dimsEl = $('#v-dims');
  const say = (text, error = false) => { msg.textContent = text || ''; msg.classList.toggle('on', !!text); msg.classList.toggle('error', error); };

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
  catch { say('Tu navegador no pudo iniciar WebGL, por lo que el visor 3D no está disponible.', true); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  stage.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe9e6df);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100000);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb9b09c, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xfff1d6, 0.8); fill.position.set(-4, 2, -3); scene.add(fill);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const material = new THREE.MeshStandardMaterial({ color: 0x189155, roughness: 0.5, metalness: 0.1 });
  let mesh = null, grid = null, radius = 100, gridOn = true;
  const size = new THREE.Vector3();

  function resize() {
    const { clientWidth: w, clientHeight: h } = stage;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();

  function resetCamera() {
    const d = radius * 2.6;
    camera.position.set(d * 0.8, d * 0.55, d * 0.9);
    camera.near = radius / 100; camera.far = radius * 100; camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0); controls.update();
  }

  function clearModel() {
    if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); mesh = null; }
    if (grid) { scene.remove(grid); grid.geometry.dispose(); grid.material.dispose(); grid = null; }
  }

  function showModel(buffer, name) {
    const geo = new STLLoader().parse(buffer); // soporta STL ASCII y binario
    if (!(geo.attributes.position?.count > 0)) { geo.dispose(); throw new Error('El archivo no contiene geometría válida.'); }
    clearModel();
    geo.computeBoundingBox();
    geo.boundingBox.getSize(size);
    const c = geo.boundingBox.getCenter(new THREE.Vector3());
    geo.translate(-c.x, -c.y, -c.z);
    if (!geo.attributes.normal) geo.computeVertexNormals();
    mesh = new THREE.Mesh(geo, material);
    mesh.rotation.x = -Math.PI / 2; // STL suele ser Z-arriba
    $('#v-scale').value = 1;
    scene.add(mesh);

    radius = Math.max(size.length() / 2, 1e-3);
    const gs = Math.max(size.x, size.y) * 2.4 || 10;
    grid = new THREE.GridHelper(gs, 20, 0x915e18, 0xb9b09c);
    grid.position.y = -size.z / 2; grid.visible = gridOn; scene.add(grid);

    const f = (n) => (Math.round(n * 100) / 100).toString();
    nameEl.textContent = name;
    dimsEl.textContent = `X ${f(size.x)} · Y ${f(size.y)} · Z ${f(size.z)}`;
    say(''); resetCamera();
  }

  async function loadFile(file) {
    if (!/\.stl$/i.test(file.name)) { say('Formato no válido: seleccioná un archivo .stl', true); return; }
    say('Cargando modelo…');
    try { showModel(await file.arrayBuffer(), file.name); }
    catch (e) { say(`No se pudo leer el STL: ${e.message}`, true); }
  }

  async function loadDefault() {
    say('Cargando modelo…');
    try {
      const res = await fetch(`${MODEL_URL}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok || (res.headers.get('content-type') || '').includes('text/html')) throw new Error('missing');
      showModel(await res.arrayBuffer(), 'feedy.stl');
    } catch {
      nameEl.textContent = 'Sin modelo';
      say('Próximamente podrás explorar Feedy en 3D');
    }
  }

  // Controles
  const toggle = (btn, fn) => btn.addEventListener('click', () => { const on = btn.getAttribute('aria-pressed') !== 'true'; btn.setAttribute('aria-pressed', on); fn(on); });
  toggle($('#b-wire'), (on) => { material.wireframe = on; });
  toggle($('#b-grid'), (on) => { gridOn = on; if (grid) grid.visible = on; });
  $('#b-reset').onclick = resetCamera;
  $('#b-center').onclick = () => { controls.target.set(0, 0, 0); controls.update(); };
  $('#v-scale').oninput = (e) => mesh && mesh.scale.setScalar(+e.target.value);
  $('#v-file').onchange = (e) => { const f = e.target.files[0]; if (f) loadFile(f); e.target.value = ''; };

  // Arrastrar y soltar (todo local, sin subir nada)
  let depth = 0;
  const viewer = $('#viewer');
  viewer.addEventListener('dragenter', (e) => { e.preventDefault(); depth++; drop.hidden = false; });
  viewer.addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; drop.hidden = true; } });
  viewer.addEventListener('dragover', (e) => e.preventDefault());
  viewer.addEventListener('drop', (e) => { e.preventDefault(); depth = 0; drop.hidden = true; const f = e.dataTransfer.files[0]; if (f) loadFile(f); });

  // Render solo cuando el visor está en pantalla
  let visible = false;
  const loop = () => { if (!visible) return; requestAnimationFrame(loop); controls.update(); renderer.render(scene, camera); };
  new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) loop(); }).observe(stage);
  addEventListener('pagehide', () => { clearModel(); material.dispose(); renderer.dispose(); });

  loadDefault();
}
