
import React, { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";  
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import TablaDomiciliarios from "./TablaDomiciliario";
import DialogoDomiciliario from "./DialogDomiciliario";
import useDomiciliarios from "../../hooks/useDomiciliarios";

export default function PanelDomiciliarios() {
  const {
    domiciliarios = [],
    cargando,
    error,
    cargarDomiciliarios,
    guardarDomiciliario,
    cambiarEstadoDomiciliario,
    eliminarDomiciliario,
  } = useDomiciliarios();

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [domiciliarioEditando, setDomiciliarioEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [notificacion, setNotificacion] = useState({
    abierto: false,
    mensaje: "",
    tipo: "success",
  });

  const mostrarNotificacion = (mensaje, tipo = "success") => {
    setNotificacion({
      abierto: true,
      mensaje,
      tipo,
    });
  };

  const cerrarNotificacion = (_, motivo) => {
    if (motivo === "clickaway") return;

    setNotificacion((actual) => ({
      ...actual,
      abierto: false,
    }));
  };

  const obtenerId = (domiciliario) =>
    domiciliario?.id ?? domiciliario?.domiciliario_id;

  const estaActivo = (estado) =>
    estado === true ||
    estado === 1 ||
    estado === "1" ||
    String(estado).toLowerCase() === "true";

  const estadisticas = useMemo(() => {
    const lista = Array.isArray(domiciliarios) ? domiciliarios : [];

    const activos = lista.filter((d) => estaActivo(d.estado)).length;

    return {
      total: lista.length,
      activos,
      inactivos: lista.length - activos,
    };
  }, [domiciliarios]);

  const domiciliariosFiltrados = useMemo(() => {
    const lista = Array.isArray(domiciliarios) ? domiciliarios : [];
    const termino = busqueda.trim().toLowerCase();

    return lista.filter((domiciliario) => {
      const coincideBusqueda = [
        domiciliario.nombre,
        domiciliario.documento,
        domiciliario.telefono,
        domiciliario.correo,
        domiciliario.vehiculo,
        domiciliario.placa,
      ].some((valor) =>
        String(valor ?? "").toLowerCase().includes(termino)
      );

      const activo = estaActivo(domiciliario.estado);

      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && activo) ||
        (filtroEstado === "inactivos" && !activo);

      return coincideBusqueda && coincideEstado;
    });
  }, [domiciliarios, busqueda, filtroEstado]);

  const abrirCrear = () => {
    setDomiciliarioEditando(null);
    setDialogoAbierto(true);
  };

  const abrirEditar = (domiciliario) => {
    setDomiciliarioEditando(domiciliario);
    setDialogoAbierto(true);
  };

  const cerrarDialogo = () => {
    if (guardando) return;

    setDialogoAbierto(false);
    setDomiciliarioEditando(null);
  };

  const manejarGuardar = async (datos) => {
    setGuardando(true);

    try {
      const id = domiciliarioEditando
        ? obtenerId(domiciliarioEditando)
        : null;

      await guardarDomiciliario(datos, id);

      setDialogoAbierto(false);
      setDomiciliarioEditando(null);

      mostrarNotificacion(
        id != null
          ? "Domiciliario actualizado correctamente."
          : "Domiciliario registrado correctamente."
      );
    } catch (err) {
      mostrarNotificacion(
        err.message || "No fue posible guardar el domiciliario.",
        "error"
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarCambioEstado = async (domiciliario) => {
    const id = obtenerId(domiciliario);

    if (id == null) {
      mostrarNotificacion("No se encontró el ID del domiciliario.", "error");
      return;
    }

    const nuevoEstado = !estaActivo(domiciliario.estado);

    try {
      await cambiarEstadoDomiciliario(id, nuevoEstado);

      mostrarNotificacion(
        nuevoEstado
          ? "Domiciliario activado correctamente."
          : "Domiciliario desactivado correctamente."
      );
    } catch (err) {
      mostrarNotificacion(
        err.message || "No fue posible cambiar el estado.",
        "error"
      );
    }
  };

  const manejarEliminar = async (domiciliario) => {
    const id = obtenerId(domiciliario);

    if (id == null) {
      mostrarNotificacion("No se encontró el ID del domiciliario.", "error");
      return;
    }

    const confirmar = window.confirm(
      `¿Estás seguro de eliminar a ${domiciliario.nombre || "este domiciliario"}?`
    );

    if (!confirmar) return;

    try {
      await eliminarDomiciliario(id);

      mostrarNotificacion("Domiciliario eliminado correctamente.");
    } catch (err) {
      mostrarNotificacion(
        err.message || "No fue posible eliminar el domiciliario.",
        "error"
      );
    }
  };

  const tarjetas = [
    {
      titulo: "Total domiciliarios",
      valor: estadisticas.total,
      icono: <PeopleAltOutlinedIcon fontSize="large" />,
      color: "#1976d2",
    },
    {
      titulo: "Activos",
      valor: estadisticas.activos,
      icono: <CheckCircleIcon fontSize="large" />,
      color: "#2e7d32",
    },
    {
      titulo: "Inactivos",
      valor: estadisticas.inactivos,
      icono: <PersonOffOutlinedIcon fontSize="large" />,
      color: "#ed6c02",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%" }}>
      {/* Encabezado */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Gestión de domiciliarios
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Administra los datos y el estado de tus domiciliarios.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cargarDomiciliarios}
            disabled={cargando}
          >
            Actualizar
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirCrear}
          >
            Nuevo domiciliario
          </Button>
        </Stack>
      </Stack>

      {/* Estadísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {tarjetas.map((tarjeta) => (
          <Grid item xs={12} sm={4} key={tarjeta.titulo}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {tarjeta.titulo}
                    </Typography>

                    <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                      {tarjeta.valor}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: `${tarjeta.color}15`,
                      color: tarjeta.color,
                    }}
                  >
                    {tarjeta.icono}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Búsqueda y filtros */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              size="small"
              label="Buscar domiciliario"
              placeholder="Nombre, documento, teléfono, correo, vehículo o placa"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Filtrar por estado"
              value={filtroEstado}
              onChange={(event) => setFiltroEstado(event.target.value)}
            >
              <MenuItem value="todos">Todos los estados</MenuItem>
              <MenuItem value="activos">Activos</MenuItem>
              <MenuItem value="inactivos">Inactivos</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Errores del hook */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={cargarDomiciliarios}
              disabled={cargando}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Tabla */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {cargando && domiciliarios.length === 0 ? (
          <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Cargando domiciliarios...
            </Typography>
          </Stack>
        ) : (
          <TablaDomiciliarios
            domiciliarios={domiciliariosFiltrados}
            cargando={cargando || guardando}
            onEditar={abrirEditar}
            onCambiarEstado={manejarCambioEstado}
            onEliminar={manejarEliminar}
          />
        )}

        {!cargando && domiciliariosFiltrados.length === 0 && !error && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              {busqueda || filtroEstado !== "todos"
                ? "No se encontraron domiciliarios con esos filtros."
                : "Todavía no hay domiciliarios registrados."}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Diálogo de creación y edición */}
      <DialogoDomiciliario
        abierto={dialogoAbierto}
        domiciliario={domiciliarioEditando}
        guardando={guardando}
        onCerrar={cerrarDialogo}
        onGuardar={manejarGuardar}
      />

      {/* Notificaciones */}
      <Snackbar
        open={notificacion.abierto}
        autoHideDuration={4000}
        onClose={cerrarNotificacion}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={cerrarNotificacion}
          severity={notificacion.tipo}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}
