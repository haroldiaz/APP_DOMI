
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import DrawerBar from "../components/DrawerBar";

const COLORES = {
  fondo: "#f8fafc",
  blanco: "#ffffff",
  texto: "#172033",
  secundario: "#64748b",
  borde: "#e5e7eb",
  naranja: "#f97316",
  naranjaHover: "#ea580c",
};

const categoriasIniciales = [
  { id: 1, nombre: "Comidas" },
  { id: 2, nombre: "Bebidas" },
  { id: 3, nombre: "Postres" },
];

const productosIniciales = [
  {
    id: 1,
    nombre: "Hamburguesa clásica",
    categoria_id: 1,
    descripcion: "Hamburguesa tradicional",
    precio: 18000,
    imagen_url: "",
    disponible: true,
  },
  {
    id: 2,
    nombre: "Jugo natural",
    categoria_id: 2,
    descripcion: "Jugo de fruta natural",
    precio: 7000,
    imagen_url: "",
    disponible: true,
  },
];

const formularioInicial = {
  nombre: "",
  categoria_id: "",
  descripcion: "",
  precio: "",
  imagen_url: "",
  disponible: true,
};

const campoSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: COLORES.blanco,
    "& fieldset": {
      borderColor: COLORES.borde,
    },
    "&:hover fieldset": {
      borderColor: "#cbd0d8",
    },
    "&.Mui-focused fieldset": {
      borderColor: COLORES.naranja,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: COLORES.naranja,
  },
};

const botonPrincipalSx = {
  bgcolor: COLORES.naranja,
  color: "#ffffff",
  borderRadius: 2,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: COLORES.naranjaHover,
    boxShadow: "none",
  },
};

export default function RegistroProductos() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const esMovil = useMediaQuery(theme.breakpoints.down("md"));

  // Inicialmente abierto en escritorio y cerrado en móviles.
  const [menuAbierto, setMenuAbierto] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth >= 900
  );

  const [productos, setProductos] = useState(productosIniciales);
  const [busqueda, setBusqueda] = useState("");

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formulario, setFormulario] = useState({ ...formularioInicial });

  const [mensaje, setMensaje] = useState({
    abierto: false,
    texto: "",
    tipo: "success",
  });

  // Cerrar el panel temporal al cambiar a una pantalla móvil.
  useEffect(() => {
    if (esMovil) {
      setMenuAbierto(false);
    }
  }, [esMovil]);

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const categoria = categoriasIniciales.find(
        (item) => item.id === Number(producto.categoria_id)
      );

      return (
        producto.nombre.toLowerCase().includes(termino) ||
        (categoria?.nombre || "").toLowerCase().includes(termino)
      );
    });
  }, [productos, busqueda]);

  const mostrarMensaje = (texto, tipo = "success") => {
    setMensaje({
      abierto: true,
      texto,
      tipo,
    });
  };

  const cerrarMensaje = (_, razon) => {
    if (razon === "clickaway") return;

    setMensaje((anterior) => ({
      ...anterior,
      abierto: false,
    }));
  };

  const abrirCrear = () => {
    setProductoSeleccionado(null);
    setFormulario({ ...formularioInicial });
    setDialogoAbierto(true);
  };

  const abrirEditar = (producto) => {
    setProductoSeleccionado(producto);

    setFormulario({
      nombre: producto.nombre || "",
      categoria_id: String(producto.categoria_id ?? ""),
      descripcion: producto.descripcion || "",
      precio: String(producto.precio ?? ""),
      imagen_url: producto.imagen_url || "",
      disponible: Boolean(producto.disponible),
    });

    setDialogoAbierto(true);
  };

  const cerrarFormulario = () => {
    setDialogoAbierto(false);
    setProductoSeleccionado(null);
    setFormulario({ ...formularioInicial });
  };

  const actualizarCampo = (campo, valor) => {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const guardarProducto = () => {
    const nombre = formulario.nombre.trim();
    const categoriaId = Number(formulario.categoria_id);
    const precioTexto = String(formulario.precio).trim();
    const precio = Number(precioTexto);

    const categoriaValida = categoriasIniciales.some(
      (categoria) => categoria.id === categoriaId
    );

    if (!nombre) {
      mostrarMensaje("Ingresa el nombre del producto.", "warning");
      return;
    }

    if (!categoriaValida) {
      mostrarMensaje("Selecciona una categoría válida.", "warning");
      return;
    }

    if (
      precioTexto === "" ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      !Number.isInteger(precio)
    ) {
      mostrarMensaje(
        "Ingresa un precio válido, entero y mayor o igual a cero.",
        "warning"
      );
      return;
    }

    const nombreDuplicado = productos.some(
      (producto) =>
        producto.nombre.trim().toLowerCase() === nombre.toLowerCase() &&
        producto.id !== productoSeleccionado?.id
    );

    if (nombreDuplicado) {
      mostrarMensaje("Ya existe un producto con ese nombre.", "warning");
      return;
    }

    const datos = {
      nombre,
      categoria_id: categoriaId,
      descripcion: formulario.descripcion.trim(),
      precio,
      imagen_url: formulario.imagen_url.trim(),
      disponible: Boolean(formulario.disponible),
    };

    if (productoSeleccionado) {
      setProductos((anteriores) =>
        anteriores.map((producto) =>
          producto.id === productoSeleccionado.id
            ? { ...producto, ...datos }
            : producto
        )
      );

      mostrarMensaje("Producto actualizado correctamente.");
    } else {
      setProductos((anteriores) => {
        const siguienteId =
          anteriores.reduce(
            (mayorId, producto) =>
              Math.max(mayorId, Number(producto.id) || 0),
            0
          ) + 1;

        return [
          ...anteriores,
          {
            id: siguienteId,
            ...datos,
          },
        ];
      });

      mostrarMensaje("Producto registrado correctamente.");
    }

    cerrarFormulario();
  };

  const abrirConfirmacionEliminar = (producto) => {
    setProductoSeleccionado(producto);
    setDialogoEliminar(true);
  };

  const cerrarConfirmacionEliminar = () => {
    setDialogoEliminar(false);
    setProductoSeleccionado(null);
  };

  const eliminarProducto = () => {
    if (!productoSeleccionado) return;

    setProductos((anteriores) =>
      anteriores.filter(
        (producto) => producto.id !== productoSeleccionado.id
      )
    );

    cerrarConfirmacionEliminar();
    mostrarMensaje("Producto eliminado correctamente.");
  };

  const obtenerCategoria = (categoriaId) =>
    categoriasIniciales.find(
      (categoria) => categoria.id === Number(categoriaId)
    )?.nombre || "Sin categoría";

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(precio) || 0);

  const totalDisponibles = productos.filter(
    (producto) => producto.disponible
  ).length;

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

      {/* APP BAR SUPERIOR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.96)",
          color: COLORES.texto,
          borderBottom: "1px solid #e9edf3",
          backdropFilter: "blur(12px)",
          zIndex: (actualTheme) => actualTheme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: "72px !important",
            px: { xs: 2, md: 3 },
            gap: 1.5,
          }}
        >
          <IconButton
            onClick={() => setMenuAbierto((anterior) => !anterior)}
            aria-label="Abrir o contraer menú"
            sx={{
              color: "#475569",
              borderRadius: 2,
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box
            onClick={() => navigate("/menuPrincipal")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                navigate("/menuPrincipal");
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              cursor: "pointer",
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "grid",
                placeItems: "center",
                bgcolor: COLORES.naranja,
                color: "#ffffff",
                borderRadius: 2.5,
                fontSize: 19,
                fontWeight: 900,
                flexShrink: 0,
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
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                }}
              >
                App{" "}
                <Box component="span" sx={{ color: COLORES.naranja }}>
                  Domi
                </Box>
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#94a3b8",
                  fontSize: 10,
                  display: { xs: "none", sm: "block" },
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
                border: "1px solid #e9edf3",
                borderRadius: 2.5,
                color: "#64748b",
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
              borderColor: "#e9edf3",
            }}
          />

          <Stack direction="row" spacing={1.2} alignItems="center">
            <Avatar
              sx={{
                width: 39,
                height: 39,
                bgcolor: "#ffedd5",
                color: "#c2410c",
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              A
            </Avatar>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#1e293b",
                }}
              >
                Administrador
              </Typography>

              <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                Panel de gestión
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* DRAWER BAR */}
      <DrawerBar
        open={menuAbierto}
        onClose={() => setMenuAbierto(false)}
      />

      {/* CONTENIDO DE PRODUCTOS */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "calc(100vh - 72px)",
          mt: "72px",
          p: { xs: 2, sm: 3, md: 4 },
          overflowX: "hidden",
        }}
      >
        {/* Encabezado */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: 26, sm: 32 },
                fontWeight: 800,
                color: COLORES.texto,
                mb: 0.5,
                letterSpacing: "-0.7px",
              }}
            >
              Registro de productos
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Administra los productos disponibles de tu negocio.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={abrirCrear}
            sx={{
              ...botonPrincipalSx,
              px: 2.5,
              py: 1.2,
            }}
          >
            Nuevo producto
          </Button>
        </Stack>

        {/* Resumen */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Paper elevation={0} sx={resumenSx}>
            <Typography variant="body2" color="text.secondary">
              Total de productos
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: COLORES.texto, mt: 0.5 }}
            >
              {productos.length}
            </Typography>
          </Paper>

          <Paper elevation={0} sx={resumenSx}>
            <Typography variant="body2" color="text.secondary">
              Productos disponibles
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "success.main", mt: 0.5 }}
            >
              {totalDisponibles}
            </Typography>
          </Paper>
        </Stack>

        {/* Tabla de productos */}
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${COLORES.borde}`,
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: COLORES.blanco,
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
            <TextField
              fullWidth
              size="small"
              label="Buscar productos"
              placeholder="Escribe un nombre o una categoría..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </Box>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell sx={cabeceraTablaSx}>Producto</TableCell>
                  <TableCell sx={cabeceraTablaSx}>Categoría</TableCell>
                  <TableCell sx={cabeceraTablaSx}>Precio</TableCell>
                  <TableCell sx={cabeceraTablaSx}>Estado</TableCell>
                  <TableCell align="right" sx={cabeceraTablaSx}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {productosFiltrados.map((producto) => (
                  <TableRow key={producto.id} hover>
                    <TableCell>
                      <Typography fontWeight={700}>
                        {producto.nombre}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {producto.descripcion || "Sin descripción"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {obtenerCategoria(producto.categoria_id)}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatoPrecio(producto.precio)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          producto.disponible
                            ? "Disponible"
                            : "No disponible"
                        }
                        color={producto.disponible ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => abrirEditar(producto)}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                          }}
                        >
                          Editar
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            abrirConfirmacionEliminar(producto)
                          }
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                          }}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {productosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        No se encontraron productos.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Crear o editar producto */}
        <Dialog
          open={dialogoAbierto}
          onClose={cerrarFormulario}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: 800 }}>
            {productoSeleccionado
              ? "Editar producto"
              : "Registrar producto"}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Nombre del producto"
                value={formulario.nombre}
                onChange={(evento) =>
                  actualizarCampo("nombre", evento.target.value)
                }
                fullWidth
                required
                autoFocus
                inputProps={{ maxLength: 120 }}
                sx={campoSx}
              />

              <TextField
                select
                label="Categoría"
                value={formulario.categoria_id}
                onChange={(evento) =>
                  actualizarCampo("categoria_id", evento.target.value)
                }
                fullWidth
                required
                sx={campoSx}
              >
                {categoriasIniciales.map((categoria) => (
                  <MenuItem
                    key={categoria.id}
                    value={String(categoria.id)}
                  >
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </TextField>

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

              <TextField
                label="Precio (COP)"
                type="number"
                value={formulario.precio}
                onChange={(evento) =>
                  actualizarCampo("precio", evento.target.value)
                }
                inputProps={{ min: 0, step: 1 }}
                fullWidth
                required
                sx={campoSx}
              />

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
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button onClick={cerrarFormulario} color="inherit">
              Cancelar
            </Button>

            <Button
              variant="contained"
              onClick={guardarProducto}
              sx={botonPrincipalSx}
            >
              {productoSeleccionado
                ? "Guardar cambios"
                : "Registrar producto"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmar eliminación */}
        <Dialog
          open={dialogoEliminar}
          onClose={cerrarConfirmacionEliminar}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 800 }}>
            Eliminar producto
          </DialogTitle>

          <DialogContent>
            <Typography>
              ¿Deseas eliminar el producto{" "}
              <Box component="strong" sx={{ fontWeight: 700 }}>
                {productoSeleccionado?.nombre}
              </Box>
              ? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button
              onClick={cerrarConfirmacionEliminar}
              color="inherit"
            >
              Cancelar
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={eliminarProducto}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notificaciones */}
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
          >
            {mensaje.texto}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

const resumenSx = {
  p: 2.5,
  flex: 1,
  border: `1px solid ${COLORES.borde}`,
  borderRadius: 3,
  bgcolor: COLORES.blanco,
};

const cabeceraTablaSx = {
  fontWeight: 800,
  fontSize: 12,
  whiteSpace: "nowrap",
};
