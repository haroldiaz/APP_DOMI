
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import DrawerBar from "../../components/DrawerBar";
import TablaProductos from "../Productos/TablaProductos";
import API_BASE from "../../config/api";

// --------------------------------------------------
// CONFIGURACIÓN VISUAL
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
  verde: "#16a34a",
  verdeClaro: "#ecfdf3",
  rojo: "#dc2626",
  rojoClaro: "#fef2f2",
};

const formularioInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "0",
  imagen_url: "",
  disponible: true,
};

const campoSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    bgcolor: COLORES.blanco,
    "& fieldset": {
      borderColor: COLORES.borde,
    },
    "&:hover fieldset": {
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused fieldset": {
      borderColor: COLORES.naranja,
      borderWidth: 1.5,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: COLORES.naranja,
  },
};

const botonPrincipalSx = {
  bgcolor: COLORES.naranja,
  color: "#ffffff",
  borderRadius: 2.5,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "0 4px 10px rgba(249, 115, 22, 0.16)",
  "&:hover": {
    bgcolor: COLORES.naranjaHover,
    boxShadow: "0 6px 14px rgba(249, 115, 22, 0.22)",
  },
  "&:disabled": {
    bgcolor: "#fed7aa",
    color: "#ffffff",
  },
};

const tarjetaSx = {
  p: 2.5,
  flex: 1,
  minWidth: 0,
  border: `1px solid ${COLORES.borde}`,
  borderRadius: 3,
  bgcolor: COLORES.blanco,
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.025)",
};

// --------------------------------------------------
// CLIENTE HTTP
// --------------------------------------------------

async function solicitarAPI(ruta, opciones = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_BASE}${ruta}`, {
      ...opciones,
      headers: {
        ...(opciones.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...opciones.headers,
      },
    });
  } catch {
    throw new Error(
      `No se pudo conectar con el servidor en ${API_BASE}. ` +
        "Verifica que el backend esté iniciado y que la dirección sea correcta."
    );
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje ||
        `Error en la solicitud (${respuesta.status})`
    );
  }

  return datos;
}

// --------------------------------------------------
// NORMALIZAR PRODUCTOS
// --------------------------------------------------

function normalizarProducto(producto) {
  return {
    ...producto,
    precio: Number(producto.precio || 0),
    stock: Number(producto.stock || 0),
    disponible:
      producto.disponible !== undefined
        ? Boolean(producto.disponible)
        : producto.estado !== undefined
          ? Boolean(producto.estado)
          : true,
  };
}

// --------------------------------------------------
// COMPONENTE PRINCIPAL
// --------------------------------------------------

export default function RegistroProductos() {
  const navigate = useNavigate();
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));

  const [menuAbierto, setMenuAbierto] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.innerWidth >= 900
  );

  const [productos, setProductos] = useState([]);

  // La búsqueda se controla desde la tabla.
  const [busqueda, setBusqueda] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] =
    useState(null);

  const [formulario, setFormulario] = useState({
    ...formularioInicial,
  });

  const [mensaje, setMensaje] = useState({
    abierto: false,
    texto: "",
    tipo: "success",
  });

  // --------------------------------------------------
  // NOTIFICACIONES
  // --------------------------------------------------

  const mostrarMensaje = useCallback(
    (texto, tipo = "success") => {
      setMensaje({
        abierto: true,
        texto,
        tipo,
      });
    },
    []
  );

  function cerrarMensaje(_, razon) {
    if (razon === "clickaway") return;

    setMensaje((anterior) => ({
      ...anterior,
      abierto: false,
    }));
  }

  // --------------------------------------------------
  // MENÚ RESPONSIVE
  // --------------------------------------------------

  useEffect(() => {
    if (esMovil) {
      setMenuAbierto(false);
    }
  }, [esMovil]);

  // --------------------------------------------------
  // CARGAR PRODUCTOS
  // --------------------------------------------------

  const cargarProductos = useCallback(async () => {
    setCargando(true);

    try {
      const datos = await solicitarAPI("/productos");

      if (!Array.isArray(datos.productos)) {
        throw new Error(
          "La API no devolvió la lista de productos esperada."
        );
      }

      setProductos(datos.productos.map(normalizarProducto));
    } catch (error) {
      mostrarMensaje(
        error.message || "No se pudieron cargar los productos.",
        "error"
      );
    } finally {
      setCargando(false);
    }
  }, [mostrarMensaje]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // --------------------------------------------------
  // RESUMEN DE PRODUCTOS
  // --------------------------------------------------

  const totalDisponibles = useMemo(
    () =>
      productos.filter((producto) => producto.disponible).length,
    [productos]
  );

  // --------------------------------------------------
  // ABRIR FORMULARIO PARA CREAR
  // --------------------------------------------------

  function abrirCrear() {
    setProductoSeleccionado(null);
    setFormulario({ ...formularioInicial });
    setDialogoAbierto(true);
  }

  // --------------------------------------------------
  // ABRIR FORMULARIO PARA EDITAR
  // --------------------------------------------------

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

  // --------------------------------------------------
  // DUPLICAR PRODUCTO
  // --------------------------------------------------

  function abrirDuplicar(producto) {
    // Se limpia la selección para que el formulario
    // realice un POST y no un PUT sobre el original.
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

  // --------------------------------------------------
  // CERRAR FORMULARIO
  // --------------------------------------------------

  function cerrarFormulario() {
    if (guardando) return;

    setDialogoAbierto(false);
    setProductoSeleccionado(null);
    setFormulario({ ...formularioInicial });
  }

  function actualizarCampo(campo, valor) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  // --------------------------------------------------
  // GUARDAR PRODUCTO: CREAR O ACTUALIZAR
  // --------------------------------------------------

  async function guardarProducto(evento) {
    evento.preventDefault();

    const nombre = formulario.nombre.trim();
    const precioTexto = String(formulario.precio).trim();
    const stockTexto = String(formulario.stock).trim();

    const precio = Number(precioTexto);
    const stock = Number(stockTexto);

    if (!nombre || nombre.length > 150) {
      mostrarMensaje(
        "El nombre es obligatorio y admite máximo 150 caracteres.",
        "warning"
      );
      return;
    }

    if (
      precioTexto === "" ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      !/^\d+(\.\d{1,2})?$/.test(precioTexto)
    ) {
      mostrarMensaje(
        "Ingresa un precio válido con máximo dos decimales.",
        "warning"
      );
      return;
    }

    if (
      stockTexto === "" ||
      !Number.isSafeInteger(stock) ||
      stock < 0 ||
      !/^\d+$/.test(stockTexto)
    ) {
      mostrarMensaje(
        "El stock debe ser un entero mayor o igual a cero.",
        "warning"
      );
      return;
    }

    const imagen = formulario.imagen_url.trim();

    if (imagen) {
      try {
        const url = new URL(imagen);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        mostrarMensaje(
          "Ingresa una URL de imagen válida.",
          "warning"
        );
        return;
      }
    }

    const datosProducto = {
      nombre,
      descripcion: formulario.descripcion.trim() || null,
      precio,
      stock,
      imagen_url: imagen || null,
    };

    setGuardando(true);

    try {
      // ACTUALIZAR PRODUCTO EXISTENTE
      if (productoSeleccionado) {
        const respuesta = await solicitarAPI(
          `/productos/${productoSeleccionado.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              ...datosProducto,
              estado: formulario.disponible,
            }),
          }
        );

        if (!respuesta.producto) {
          throw new Error(
            "El servidor no devolvió el producto actualizado."
          );
        }

        const actualizado = normalizarProducto(
          respuesta.producto
        );

        setProductos((anteriores) =>
          anteriores.map((producto) =>
            String(producto.id) === String(actualizado.id)
              ? actualizado
              : producto
          )
        );

        mostrarMensaje("Producto actualizado correctamente.");
      } else {
        // CREAR PRODUCTO NUEVO O DUPLICADO
        const respuesta = await solicitarAPI("/productos", {
          method: "POST",
          body: JSON.stringify(datosProducto),
        });

        if (!respuesta.producto) {
          throw new Error(
            "El servidor no devolvió el producto registrado."
          );
        }

        const nuevoProducto = normalizarProducto(
          respuesta.producto
        );

        setProductos((anteriores) => [
          nuevoProducto,
          ...anteriores,
        ]);

        mostrarMensaje(
          formulario.nombre.endsWith("(copia)")
            ? "Producto duplicado correctamente."
            : "Producto registrado correctamente."
        );
      }

      setDialogoAbierto(false);
      setProductoSeleccionado(null);
      setFormulario({ ...formularioInicial });
    } catch (error) {
      mostrarMensaje(
        error.message || "No se pudo guardar el producto.",
        "error"
      );
    } finally {
      setGuardando(false);
    }
  }

  // --------------------------------------------------
  // DESACTIVAR PRODUCTO
  // --------------------------------------------------

  function abrirConfirmacionEliminar(producto) {
    setProductoSeleccionado(producto);
    setDialogoEliminar(true);
  }

  function cerrarConfirmacionEliminar() {
    if (eliminando) return;

    setDialogoEliminar(false);
    setProductoSeleccionado(null);
  }

  async function eliminarProducto() {
    if (!productoSeleccionado) return;

    setEliminando(true);

    try {
      await solicitarAPI(
        `/productos/${productoSeleccionado.id}`,
        {
          method: "DELETE",
        }
      );

      setProductos((anteriores) =>
        anteriores.filter(
          (producto) =>
            String(producto.id) !==
            String(productoSeleccionado.id)
        )
      );

      setDialogoEliminar(false);
      setProductoSeleccionado(null);

      mostrarMensaje("Producto desactivado correctamente.");
    } catch (error) {
      mostrarMensaje(
        error.message || "No se pudo desactivar el producto.",
        "error"
      );
    } finally {
      setEliminando(false);
    }
  }

  // --------------------------------------------------
  // FORMATO DE PRECIOS
  // --------------------------------------------------

  function formatoPrecio(precio) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(precio) || 0);
  }

  // --------------------------------------------------
  // INTERFAZ
  // --------------------------------------------------

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: COLORES.fondo,
        color: COLORES.texto,
      }}
    >
      <CssBaseline />

      {/* BARRA SUPERIOR */}
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
        <Toolbar
          sx={{
            minHeight: "72px !important",
            px: { xs: 2, md: 3.5 },
            gap: 1.5,
          }}
        >
          <IconButton
            onClick={() =>
              setMenuAbierto((anterior) => !anterior)
            }
            aria-label="Abrir o contraer menú"
            sx={{
              color: "#475569",
              borderRadius: 2.5,
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            onClick={() => navigate("/menuPrincipal")}
            role="button"
            tabIndex={0}
            onKeyDown={(evento) => {
              if (
                evento.key === "Enter" ||
                evento.key === " "
              ) {
                navigate("/menuPrincipal");
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.3,
              cursor: "pointer",
              flexGrow: 1,
              minWidth: 0,
            }}
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
              <Typography
                sx={{
                  fontSize: 19,
                  fontWeight: 900,
                  letterSpacing: "-0.6px",
                  lineHeight: 1.25,
                }}
              >
                App{" "}
                <Box
                  component="span"
                  sx={{ color: COLORES.naranja }}
                >
                  Domi
                </Box>
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

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: { xs: 0, sm: 1 },
              my: 2,
              borderColor: COLORES.borde,
            }}
          />

          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
          >
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
              <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
                Administrador
              </Typography>

              <Typography sx={{ fontSize: 11, color: "#98a2b3" }}>
                Panel de gestión
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* MENÚ LATERAL */}
      <DrawerBar
        open={menuAbierto}
        onClose={() => setMenuAbierto(false)}
      />

      {/* CONTENIDO */}
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
          {/* ENCABEZADO */}
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

              <Typography
                sx={{
                  fontSize: 14,
                  color: COLORES.secundario,
                  lineHeight: 1.7,
                }}
              >
                Organiza, consulta y administra el catálogo de tu negocio.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={abrirCrear}
              startIcon={<AddRoundedIcon />}
              sx={{
                ...botonPrincipalSx,
                alignSelf: { xs: "stretch", sm: "center" },
                px: 2.5,
                py: 1.35,
                minHeight: 46,
              }}
            >
              Nuevo producto
            </Button>
          </Stack>

          {/* TARJETAS DE RESUMEN */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
              mb: 3.5,
            }}
          >
            {/* TOTAL DE PRODUCTOS */}
            <Paper elevation={0} sx={tarjetaSx}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORES.secundario,
                      mb: 1.2,
                    }}
                  >
                    Productos registrados
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 32,
                      fontWeight: 850,
                      letterSpacing: "-1px",
                      lineHeight: 1.1,
                    }}
                  >
                    {productos.length}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: 12,
                      color: "#98a2b3",
                    }}
                  >
                    Total en el catálogo
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: COLORES.naranjaClaro,
                    color: COLORES.naranja,
                  }}
                >
                  <Inventory2OutlinedIcon sx={{ fontSize: 27 }} />
                </Box>
              </Stack>
            </Paper>

            {/* PRODUCTOS DISPONIBLES */}
            <Paper elevation={0} sx={tarjetaSx}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORES.secundario,
                      mb: 1.2,
                    }}
                  >
                    Productos disponibles
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 32,
                      fontWeight: 850,
                      letterSpacing: "-1px",
                      lineHeight: 1.1,
                      color: COLORES.verde,
                    }}
                  >
                    {totalDisponibles}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: 12,
                      color: "#98a2b3",
                    }}
                  >
                    Productos activos
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: COLORES.verdeClaro,
                    color: COLORES.verde,
                  }}
                >
                  <CheckCircleOutlineRoundedIcon
                    sx={{ fontSize: 28 }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* TABLA DE PRODUCTOS */}
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

      {/* --------------------------------------------------
          DIÁLOGO DE REGISTRO, EDICIÓN Y DUPLICACIÓN
      -------------------------------------------------- */}

      <Dialog
        open={dialogoAbierto}
        onClose={cerrarFormulario}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3.5,
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.16)",
          },
        }}
      >
        <Box component="form" onSubmit={guardarProducto}>
          <DialogTitle sx={{ px: 3, pt: 3, pb: 2 }}>
            <Stack
              direction="row"
              alignItems="flex-start"
              spacing={1.5}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: COLORES.naranjaClaro,
                  color: COLORES.naranja,
                  flexShrink: 0,
                }}
              >
                {productoSeleccionado ? (
                  <EditOutlinedIcon />
                ) : (
                  <AddRoundedIcon />
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 850,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {productoSeleccionado
                    ? "Editar producto"
                    : formulario.nombre.endsWith("(copia)")
                      ? "Duplicar producto"
                      : "Nuevo producto"}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 12,
                    color: COLORES.secundario,
                  }}
                >
                  {productoSeleccionado
                    ? "Actualiza la información del producto."
                    : formulario.nombre.endsWith("(copia)")
                      ? "Verifica los datos y guarda la nueva copia."
                      : "Completa la información para agregarlo al catálogo."}
                </Typography>
              </Box>

              <IconButton
                onClick={cerrarFormulario}
                disabled={guardando}
                size="small"
                aria-label="Cerrar formulario"
                sx={{ color: "#98a2b3", mt: -0.5, mr: -1 }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <Divider sx={{ borderColor: COLORES.borde }} />

          <DialogContent sx={{ px: 3, py: 3 }}>
            <Stack spacing={2.2}>
              <TextField
                label="Nombre del producto"
                value={formulario.nombre}
                onChange={(evento) =>
                  actualizarCampo("nombre", evento.target.value)
                }
                fullWidth
                required
                autoFocus
                inputProps={{ maxLength: 150 }}
                sx={campoSx}
              />

              <TextField
                label="Descripción"
                value={formulario.descripcion}
                onChange={(evento) =>
                  actualizarCampo("descripcion", evento.target.value)
                }
                fullWidth
                multiline
                minRows={2}
                inputProps={{ maxLength: 500 }}
                sx={campoSx}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
              >
                <TextField
                  label="Precio (COP)"
                  type="number"
                  value={formulario.precio}
                  onChange={(evento) =>
                    actualizarCampo("precio", evento.target.value)
                  }
                  inputProps={{ min: 0, step: "0.01" }}
                  fullWidth
                  required
                  sx={campoSx}
                />

                <TextField
                  label="Stock disponible"
                  type="number"
                  value={formulario.stock}
                  onChange={(evento) =>
                    actualizarCampo("stock", evento.target.value)
                  }
                  inputProps={{ min: 0, step: 1 }}
                  fullWidth
                  required
                  sx={campoSx}
                />
              </Stack>

              <TextField
                label="URL de imagen (opcional)"
                type="url"
                value={formulario.imagen_url}
                onChange={(evento) =>
                  actualizarCampo("imagen_url", evento.target.value)
                }
                fullWidth
                sx={campoSx}
              />

              {productoSeleccionado && (
                <TextField
                  select
                  label="Disponibilidad"
                  value={formulario.disponible ? "true" : "false"}
                  onChange={(evento) =>
                    actualizarCampo(
                      "disponible",
                      evento.target.value === "true"
                    )
                  }
                  fullWidth
                  sx={campoSx}
                >
                  <MenuItem value="true">Disponible</MenuItem>
                  <MenuItem value="false">No disponible</MenuItem>
                </TextField>
              )}
            </Stack>
          </DialogContent>

          <Divider sx={{ borderColor: COLORES.borde }} />

          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={cerrarFormulario}
              color="inherit"
              disabled={guardando}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                px: 2,
              }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={guardando}
              startIcon={
                !guardando ? (
                  productoSeleccionado ? (
                    <EditOutlinedIcon />
                  ) : (
                    <AddRoundedIcon />
                  )
                ) : undefined
              }
              sx={{
                ...botonPrincipalSx,
                minWidth: 170,
                py: 1.1,
              }}
            >
              {guardando ? (
                <CircularProgress size={22} color="inherit" />
              ) : productoSeleccionado ? (
                "Guardar cambios"
              ) : formulario.nombre.endsWith("(copia)") ? (
                "Guardar copia"
              ) : (
                "Registrar producto"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* --------------------------------------------------
          CONFIRMACIÓN DE DESACTIVACIÓN
      -------------------------------------------------- */}

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
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
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
              <Typography sx={{ fontSize: 19, fontWeight: 850 }}>
                Desactivar producto
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: COLORES.secundario,
                  mt: 0.3,
                }}
              >
                Confirma esta acción
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography
            sx={{
              fontSize: 14,
              lineHeight: 1.8,
              color: COLORES.secundario,
            }}
          >
            ¿Deseas desactivar el producto{" "}
            <Box
              component="strong"
              sx={{ fontWeight: 800, color: COLORES.texto }}
            >
              {productoSeleccionado?.nombre}
            </Box>
            ? Dejará de aparecer en esta lista, pero permanecerá
            guardado en la base de datos.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={cerrarConfirmacionEliminar}
            color="inherit"
            disabled={eliminando}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2.5,
              px: 2,
            }}
          >
            Cancelar
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={eliminarProducto}
            disabled={eliminando}
            startIcon={
              !eliminando ? (
                <DeleteOutlineRoundedIcon />
              ) : undefined
            }
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
              minWidth: 130,
              "&:hover": { boxShadow: "none" },
            }}
          >
            {eliminando ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Desactivar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* NOTIFICACIONES */}
      <Snackbar
        open={mensaje.abierto}
        autoHideDuration={3500}
        onClose={cerrarMensaje}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={mensaje.tipo}
          variant="filled"
          onClose={() =>
            setMensaje((anterior) => ({
              ...anterior,
              abierto: false,
            }))
          }
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
