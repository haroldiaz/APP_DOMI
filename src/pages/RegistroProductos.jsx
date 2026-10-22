
import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Typography,
} from "@mui/material";

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

export default function RegistroProductos() {
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
      mostrarMensaje(
        "Ya existe un producto con ese nombre.",
        "warning"
      );
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

  const obtenerCategoria = (categoriaId) => {
    return (
      categoriasIniciales.find(
        (categoria) => categoria.id === Number(categoriaId)
      )?.nombre || "Sin categoría"
    );
  };

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(precio) || 0);
  };

  const totalDisponibles = productos.filter(
    (producto) => producto.disponible
  ).length;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "#f8fafc",
        minHeight: "100vh",
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
              fontWeight: 800,
              color: "#172033",
              mb: 0.5,
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
            bgcolor: "#f97316",
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#ea580c",
              boxShadow: "none",
            },
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
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            flex: 1,
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Total de productos
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#172033", mt: 0.5 }}
          >
            {productos.length}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            flex: 1,
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Productos disponibles
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "success.main",
              mt: 0.5,
            }}
          >
            {totalDisponibles}
          </Typography>
        </Paper>
      </Stack>

      {/* Tabla de productos */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2.5 }}>
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
                <TableCell sx={{ fontWeight: 800 }}>Producto</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Precio</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>
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
            >
              {categoriasIniciales.map((categoria) => (
                <MenuItem key={categoria.id} value={String(categoria.id)}>
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
            />

            <TextField
              label="Precio (COP)"
              type="number"
              value={formulario.precio}
              onChange={(evento) =>
                actualizarCampo("precio", evento.target.value)
              }
              inputProps={{
                min: 0,
                step: 1,
              }}
              fullWidth
              required
            />

            <TextField
              label="URL de imagen (opcional)"
              type="url"
              value={formulario.imagen_url}
              onChange={(evento) =>
                actualizarCampo("imagen_url", evento.target.value)
              }
              fullWidth
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
            sx={{
              bgcolor: "#f97316",
              boxShadow: "none",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#ea580c",
                boxShadow: "none",
              },
            }}
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

      {/* Mensajes */}
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
  );
}
