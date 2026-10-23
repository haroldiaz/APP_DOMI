
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  CircularProgress,
  Snackbar,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import DrawerBar from "../../components/DrawerBar";
import TablaProductos from "./TablaProductos";
import DialogoProducto from "./DialogRegistroProducto";
import useProductos from "../../hooks/useProductos";

// --------------------------------------------------
// CONFIGURACIÓN
// --------------------------------------------------

const COLORES = {
  fondo: "#f5f7fb",
  blanco: "#ffffff",
  texto: "#172033",
  secundario: "#667085",
  borde: "#e8ecf2",
  naranja: "#f97316",
  naranjaHover: "#ea580c",
  naranjaClaro: "#fff3e8",
  rojo: "#dc2626",
  rojoClaro: "#fef2f2",
};

const FORMULARIO_INICIAL = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "0",
  imagen_url: "",
  disponible: true,
};

const BOTON_PRINCIPAL = {
  bgcolor: COLORES.naranja,
  color: "#fff",
  borderRadius: 2.5,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "0 4px 10px rgba(249, 115, 22, 0.16)",
  "&:hover": {
    bgcolor: COLORES.naranjaHover,
    boxShadow: "0 6px 14px rgba(249, 115, 22, 0.22)",
  },
};

// --------------------------------------------------
// PÁGINA
// --------------------------------------------------

export default function RegistroProductos() {
  const navigate = useNavigate();
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));

  const {
    productos,
    cargando,
    guardando,
    eliminando,
    mensaje,
    guardarProducto,
    eliminarProducto,
    cerrarMensaje,
  } = useProductos();

  const [menuAbierto, setMenuAbierto] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 900
  );
  const [busqueda, setBusqueda] = useState("");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formulario, setFormulario] = useState({ ...FORMULARIO_INICIAL });

  // Cerrar el menú al pasar a una pantalla móvil.
  useEffect(() => {
    if (esMovil) setMenuAbierto(false);
  }, [esMovil]);

  // ------------------------------------------------
  // FORMULARIO
  // ------------------------------------------------

  function abrirCrear() {
    setProductoSeleccionado(null);
    setFormulario({ ...FORMULARIO_INICIAL });
    setDialogoAbierto(true);
  }

  function abrirEditar(producto) {
    setProductoSeleccionado(producto);
    setFormulario({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: String(producto.precio ?? ""),
      stock: String(producto.stock ?? 0),
      imagen_url: producto.imagen_url || "",
      disponible: Boolean(producto.disponible),
    });
    setDialogoAbierto(true);
  }

  function abrirDuplicar(producto) {
    setProductoSeleccionado(null);
    setFormulario({
      nombre: `${producto.nombre || ""} (copia)`,
      descripcion: producto.descripcion || "",
      precio: String(producto.precio ?? ""),
      stock: "0",
      imagen_url: producto.imagen_url || "",
      disponible: true,
    });
    setDialogoAbierto(true);
  }

  function cerrarFormulario() {
    if (guardando) return;

    setDialogoAbierto(false);
    setProductoSeleccionado(null);
    setFormulario({ ...FORMULARIO_INICIAL });
  }

  function actualizarCampo(campo, valor) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function manejarGuardar(evento) {
    evento.preventDefault();

    const guardado = await guardarProducto({
      productoSeleccionado,
      formulario,
    });

    if (guardado) {
      setDialogoAbierto(false);
      setProductoSeleccionado(null);
      setFormulario({ ...FORMULARIO_INICIAL });
    }
  }

  // ------------------------------------------------
  // DESACTIVACIÓN
  // ------------------------------------------------

  function abrirConfirmacionEliminar(producto) {
    setProductoSeleccionado(producto);
    setDialogoEliminar(true);
  }

  function cerrarConfirmacionEliminar() {
    if (eliminando) return;

    setDialogoEliminar(false);
    setProductoSeleccionado(null);
  }

  async function confirmarEliminar() {
    if (!productoSeleccionado) return;

    const eliminado = await eliminarProducto(productoSeleccionado);

    if (eliminado) {
      setDialogoEliminar(false);
      setProductoSeleccionado(null);
    }
  }

  // ------------------------------------------------
  // UTILIDADES
  // ------------------------------------------------

  function formatoPrecio(precio) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(precio) || 0);
  }

  // ------------------------------------------------
  // VISTA
  // ------------------------------------------------

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: COLORES.fondo, color: COLORES.texto }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.94)",
          color: COLORES.texto,
          borderBottom: `1px solid ${COLORES.borde}`,
          backdropFilter: "blur(16px)",
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: "72px !important", px: { xs: 2, md: 3.5 }, gap: 1.5 }}>
          <IconButton
            onClick={() => setMenuAbierto((anterior) => !anterior)}
            aria-label="Abrir o contraer menú"
            sx={{ color: "#475569", borderRadius: 2.5, "&:hover": { bgcolor: "#f1f5f9" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            onClick={() => navigate("/menuPrincipal")}
            role="button"
            tabIndex={0}
            onKeyDown={(evento) => {
              if (evento.key === "Enter" || evento.key === " ") {
                navigate("/menuPrincipal");
              }
            }}
            sx={{ display: "flex", alignItems: "center", gap: 1.3, cursor: "pointer", flexGrow: 1, minWidth: 0 }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                display: "grid",
                placeItems: "center",
                bgcolor: COLORES.naranja,
                color: "#fff",
                borderRadius: 2.5,
                fontSize: 21,
                fontWeight: 900,
                flexShrink: 0,
                boxShadow: "0 4px 10px rgba(249,115,22,0.2)",
              }}
            >
              D
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 19, fontWeight: 900, letterSpacing: "-0.6px", lineHeight: 1.25 }}>
                App <Box component="span" sx={{ color: COLORES.naranja }}>Domi</Box>
              </Typography>
              <Typography
                sx={{
                  color: "#98a2b3",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1.1px",
                  display: { xs: "none", sm: "block" },
                  mt: 0.3,
                }}
              >
                PANEL DE ADMINISTRACIÓN
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Notificaciones">
            <IconButton
              aria-label="Notificaciones"
              sx={{
                width: 42,
                height: 42,
                border: `1px solid ${COLORES.borde}`,
                borderRadius: 2.5,
                color: "#64748b",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: { xs: 0, sm: 1 }, my: 2, borderColor: COLORES.borde }} />

          <Stack direction="row" spacing={1.2} alignItems="center">
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: COLORES.naranjaClaro,
                color: "#c2410c",
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              A
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontSize: 13, fontWeight: 800 }}>Administrador</Typography>
              <Typography sx={{ fontSize: 11, color: "#98a2b3" }}>Panel de gestión</Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <DrawerBar
        open={menuAbierto}
        onClose={() => setMenuAbierto(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100vh",
          mt: "72px",
          p: { xs: 2, sm: 3, md: 4 },
          overflowX: "hidden",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1600, mx: "auto" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ mb: 3.5 }}
          >
            <Box>
              <Typography
                sx={{
                  color: COLORES.secundario,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.7px",
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Gestión comercial
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 27, sm: 32, md: 35 },
                  fontWeight: 850,
                  letterSpacing: "-1.1px",
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                Registro de productos
              </Typography>
              <Typography sx={{ fontSize: 14, color: COLORES.secundario, lineHeight: 1.7 }}>
                Organiza, consulta y administra el catálogo de tu negocio.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={abrirCrear}
              startIcon={<AddRoundedIcon />}
              sx={{
                ...BOTON_PRINCIPAL,
                alignSelf: { xs: "stretch", sm: "center" },
                px: 2.5,
                py: 1.35,
                minHeight: 46,
              }}
            >
              Nuevo producto
            </Button>
          </Stack>

          <TablaProductos
            productos={productos}
            cargando={cargando}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            onCrear={abrirCrear}
            onEditar={abrirEditar}
            onEliminar={abrirConfirmacionEliminar}
            onDuplicar={abrirDuplicar}
            formatoPrecio={formatoPrecio}
          />
        </Box>
      </Box>

      <DialogoProducto
        open={dialogoAbierto}
        onClose={cerrarFormulario}
        onSubmit={manejarGuardar}
        formulario={formulario}
        actualizarCampo={actualizarCampo}
        productoSeleccionado={productoSeleccionado}
        guardando={guardando}
      />

      <Dialog
        open={dialogoEliminar}
        onClose={cerrarConfirmacionEliminar}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3.5,
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.16)",
          },
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                bgcolor: COLORES.rojoClaro,
                color: COLORES.rojo,
                flexShrink: 0,
              }}
            >
              <DeleteOutlineRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 19, fontWeight: 850 }}>Desactivar producto</Typography>
              <Typography sx={{ fontSize: 12, color: COLORES.secundario, mt: 0.3 }}>
                Confirma esta acción
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography sx={{ fontSize: 14, lineHeight: 1.8, color: COLORES.secundario }}>
            ¿Deseas desactivar el producto{" "}
            <Box component="strong" sx={{ fontWeight: 800, color: COLORES.texto }}>
              {productoSeleccionado?.nombre}
            </Box>
            ? Dejará de aparecer en esta lista, pero permanecerá guardado en la base de datos.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={cerrarConfirmacionEliminar}
            color="inherit"
            disabled={eliminando}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2.5, px: 2 }}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmarEliminar}
            disabled={eliminando}
            startIcon={!eliminando ? <DeleteOutlineRoundedIcon /> : undefined}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
              minWidth: 130,
              "&:hover": { boxShadow: "none" },
            }}
          >
            {eliminando ? <CircularProgress size={22} color="inherit" /> : "Desactivar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={mensaje.abierto}
        autoHideDuration={3500}
        onClose={cerrarMensaje}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={mensaje.tipo}
          variant="filled"
          onClose={cerrarMensaje}
          sx={{
            width: "100%",
            borderRadius: 2.5,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
            alignItems: "center",
          }}
        >
          {mensaje.texto}
        </Alert>
      </Snackbar>
    </Box>
  );
}
