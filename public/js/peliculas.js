import languages from "/data/languages.js";


const $tabla = document.getElementById("tabla-peliculas");
const $form = document.getElementById("filtros");
const $titulo = document.getElementById("titulo");
const $lenguaje = document.getElementById("lenguaje");

// Cargar idiomas en el select
for (const codigo in languages) {
  const nombre = languages[codigo];
  const option = document.createElement("option");
  option.value = codigo;
  option.textContent = nombre;
  $lenguaje.appendChild(option);
}

// Función para renderizar filas de la tabla
function renderTabla(peliculas) {
  $tabla.innerHTML = "";
  for (const p of peliculas) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${p.title}</td>
      <td>${p.releaseDate}</td>
      <td>${p.language}</td>
      <td>${p.runtime}</td>
      <td>${p.budgetMillions}</td>
      <td>${p.voteAverage}</td>
    `;
    $tabla.appendChild(fila);
  }
}

// Llamar al backend
async function cargarPeliculas(url) {
  const res = await fetch(url);
  const data = await res.json();
  renderTabla(data);
}

// Al cargar la página → populares
cargarPeliculas("/api/movies/populares");

// Al enviar el formulario
$form.addEventListener("submit", e => {
  e.preventDefault();
  const tituloVal = $titulo.value.trim();
  const lenguajeVal = $lenguaje.value;

  if (!tituloVal && !lenguajeVal) {
    cargarPeliculas("/api/movies/populares");
  } else {
    const params = new URLSearchParams();
    if (tituloVal) params.append("titulo", tituloVal);
    if (lenguajeVal) params.append("lenguaje", lenguajeVal);
    cargarPeliculas(`/api/movies?${params.toString()}`);
  }
});


