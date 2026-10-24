import API_BASE from "./api";

const API_URL = `${API_BASE}/domiciliarios`;

async function solicitud(url, opciones = {}) {
  const respuesta = await fetch(url, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...opciones.headers,
    },
  });

  const texto = await respuesta.text();

  let resultado = null;

  if (texto) {
    try {
      resultado = JSON.parse(texto);
    } catch {
      resultado = { mensaje: texto };
    }
  }

  if (!respuesta.ok) {
    throw new Error(
      resultado?.mensaje ||
        resultado?.message ||
        `Error HTTP ${respuesta.status}`
    );
  }

  return resultado;
}

const domiciliarioService = {
  obtenerTodos: () => solicitud(API_URL),

  obtenerPorId: (id) =>
    solicitud(`${API_URL}/${id}`),

  crear: (datos) =>
    solicitud(API_URL, {
      method: "POST",
      body: JSON.stringify(datos),
    }),

  actualizar: (id, datos) =>
    solicitud(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    }),

  cambiarEstado: (id, estado) =>
    solicitud(`${API_URL}/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    }),

  eliminar: (id) =>
    solicitud(`${API_URL}/${id}`, {
      method: "DELETE",
    }),
};

export { domiciliarioService };
export default domiciliarioService;