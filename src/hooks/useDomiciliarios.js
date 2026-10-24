
import { useCallback, useEffect, useState } from "react";
import API_BASE from "../config/api";

const API_URL = `${API_BASE}/domiciliarios`;

const extraerLista = (respuesta) => {
  if (Array.isArray(respuesta)) return respuesta;
  if (Array.isArray(respuesta?.domiciliarios)) return respuesta.domiciliarios;
  if (Array.isArray(respuesta?.data)) return respuesta.data;
  if (Array.isArray(respuesta?.resultado)) return respuesta.resultado;

  return [];
};

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

export default function useDomiciliarios() {
  const [domiciliarios, setDomiciliarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cargarDomiciliarios = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const respuesta = await solicitud(API_URL);
      setDomiciliarios(extraerLista(respuesta));
    } catch (err) {
      setError(err.message || "Error al cargar los domiciliarios");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDomiciliarios();
  }, [cargarDomiciliarios]);

  const crearDomiciliario = useCallback(
    async (datos) => {
      const resultado = await solicitud(API_URL, {
        method: "POST",
        body: JSON.stringify(datos),
      });

      await cargarDomiciliarios();
      return resultado;
    },
    [cargarDomiciliarios]
  );

  const actualizarDomiciliario = useCallback(
    async (id, datos) => {
      const resultado = await solicitud(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(datos),
      });

      await cargarDomiciliarios();
      return resultado;
    },
    [cargarDomiciliarios]
  );

  const guardarDomiciliario = useCallback(
    async (datos, id = null) => {
      if (id !== null && id !== undefined) {
        return actualizarDomiciliario(id, datos);
      }

      return crearDomiciliario(datos);
    },
    [crearDomiciliario, actualizarDomiciliario]
  );

  const cambiarEstadoDomiciliario = useCallback(
    async (id, estado) => {
      const resultado = await solicitud(`${API_URL}/${id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
      });

      await cargarDomiciliarios();
      return resultado;
    },
    [cargarDomiciliarios]
  );

  const eliminarDomiciliario = useCallback(
    async (id) => {
      const resultado = await solicitud(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      await cargarDomiciliarios();
      return resultado;
    },
    [cargarDomiciliarios]
  );

  return {
    domiciliarios,
    cargando,
    error,
    cargarDomiciliarios,
    crearDomiciliario,
    actualizarDomiciliario,
    guardarDomiciliario,
    cambiarEstadoDomiciliario,
    eliminarDomiciliario,
  };
}
