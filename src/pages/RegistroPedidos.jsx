
import React, { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
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

const COLORES = {
  fondo: "#f6f7f9",
  blanco: "#ffffff",
  texto: "#202939",
  secundario: "#667085",
  borde: "#e4e7ec",
  naranja: "#ed6b23",
  naranjaHover: "#d95b16",
};

const catalogoProductos = [
  { id: 1, nombre: "Hamburguesa clásica", precio: 18000 },
  { id: 2, nombre: "Jugo natural", precio: 7000 },
  { id: 3, nombre: "Pizza familiar", precio: 42000 },
  { id: 4, nombre: "Perro caliente", precio: 12000 },
  { id: 5, nombre: "Gaseosa", precio: 4000 },
  { id: 6, nombre: "Papas fritas", precio: 8000 },
];

const clienteInicial = {
  nombre: "",
  telefono: "",
  direccion: "",
  referencia: "",
  formaPago: "Efectivo contraentrega",
};

const formatoPrecio = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);

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

export default function RegistroPedidos() {
  const [cliente, setCliente] = useState({ ...clienteInicial });
  const [productosPedido, setProductosPedido] = useState([]);

  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("1");

  const [pedidos, setPedidos] = useState([]);

  const [mensaje, setMensaje] = useState({
    abierto: false,
    texto: "",
    tipo: "success",
  });

  const totalProductos = productosPedido.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  const totalPedido = productosPedido.reduce(
    (total, producto) =>
      total + producto.precio * producto.cantidad,
    0
  );

  const totalRegistrado = pedidos.reduce(
    (total, pedido) => total + pedido.total,
    0
  );

  const notificar = (texto, tipo = "success") => {
    setMensaje({
      abierto: true,
      texto,
      tipo,
    });
  };

  const actualizarCliente = (campo, valor) => {
    setCliente((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const agregarProducto = () => {
    const producto = catalogoProductos.find(
      (item) => item.id === Number(productoSeleccionado)
    );

    const cantidadNumerica = Number(cantidad);

    if (!producto) {
      notificar("Selecciona un producto.", "warning");
      return;
    }

    if (
      !Number.isInteger(cantidadNumerica) ||
      cantidadNumerica < 1
    ) {
      notificar(
        "La cantidad debe ser un número entero mayor que cero.",
        "warning"
      );
      return;
    }

    setProductosPedido((anteriores) => {
      const existente = anteriores.find(
        (item) => item.id === producto.id
      );

      if (existente) {
        return anteriores.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidadNumerica,
              }
            : item
        );
      }

      return [
        ...anteriores,
        {
          ...producto,
          cantidad: cantidadNumerica,
        },
      ];
    });

    setProductoSeleccionado("");
    setCantidad("1");
    notificar("Producto agregado al pedido.");
  };

  const cambiarCantidad = (productoId, valor) => {
    const nuevaCantidad = Number(valor);

    if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 1) {
      return;
    }

    setProductosPedido((anteriores) =>
      anteriores.map((producto) =>
        producto.id === productoId
          ? { ...producto, cantidad: nuevaCantidad }
          : producto
      )
    );
  };

  const eliminarProducto = (productoId) => {
    setProductosPedido((anteriores) =>
      anteriores.filter((producto) => producto.id !== productoId)
    );
  };

  const limpiarFormulario = () => {
    setCliente({ ...clienteInicial });
    setProductosPedido([]);
    setProductoSeleccionado("");
    setCantidad("1");
  };

  const registrarPedido = (event) => {
    event.preventDefault();

    if (productosPedido.length === 0) {
      notificar("Agrega al menos un producto.", "warning");
      return;
    }

    const numero = 1001 + pedidos.length;

    const nuevoPedido = {
      id: Date.now(),
      codigo: `DOM-${numero}`,
      fecha: new Date().toLocaleString("es-CO", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      cliente: { ...cliente },
      productos: productosPedido.map((producto) => ({ ...producto })),
      total: totalPedido,
      estado: "Pendiente",
    };

    setPedidos((anteriores) => [nuevoPedido, ...anteriores]);

    limpiarFormulario();

    notificar(`Pedido ${nuevoPedido.codigo} registrado correctamente.`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORES.fondo,
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Encabezado */}
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
                color: COLORES.texto,
                fontSize: { xs: 25, sm: 30 },
                fontWeight: 800,
                letterSpacing: -0.8,
              }}
            >
              Registro de pedidos
            </Typography>

            <Typography
              sx={{ color: COLORES.secundario, fontSize: 14, mt: 0.75 }}
            >
              Registra clientes y organiza sus domicilios.
            </Typography>
          </Box>

          <Chip
            label="APP DOMI"
            sx={{
              alignSelf: { xs: "flex-start", sm: "center" },
              bgcolor: "#fff1e8",
              color: COLORES.naranjaHover,
              fontWeight: 800,
              borderRadius: 2,
            }}
          />
        </Stack>

        {/* Indicadores */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Paper elevation={0} sx={resumenSx}>
            <Typography sx={textoSecundarioSx}>
              Pedidos registrados
            </Typography>
            <Typography sx={numeroSx}>{pedidos.length}</Typography>
          </Paper>

          <Paper elevation={0} sx={resumenSx}>
            <Typography sx={textoSecundarioSx}>
              Pedidos pendientes
            </Typography>
            <Typography sx={numeroSx}>
              {pedidos.filter((pedido) => pedido.estado === "Pendiente").length}
            </Typography>
          </Paper>

          <Paper elevation={0} sx={resumenSx}>
            <Typography sx={textoSecundarioSx}>
              Valor de pedidos registrados
            </Typography>
            <Typography
              sx={{
                ...numeroSx,
                fontSize: { xs: 23, sm: 26 },
              }}
            >
              {formatoPrecio(totalRegistrado)}
            </Typography>
          </Paper>
        </Box>

        {/* Formulario y resumen */}
        <Box
          component="form"
          onSubmit={registrarPedido}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.4fr) minmax(300px, 0.8fr)",
            },
            gap: 2.5,
            alignItems: "start",
          }}
        >
          {/* Información del cliente y productos */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              border: `1px solid ${COLORES.borde}`,
              borderRadius: 3,
              minWidth: 0,
            }}
          >
            <Typography sx={tituloSeccionSx}>
              Información del cliente
            </Typography>

            <Typography sx={descripcionSx}>
              Datos para coordinar la entrega.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
                mt: 2.5,
              }}
            >
              <TextField
                fullWidth
                label="Nombre del cliente"
                value={cliente.nombre}
                onChange={(e) =>
                  actualizarCliente("nombre", e.target.value)
                }
                required
                inputProps={{ maxLength: 100 }}
                sx={campoSx}
              />

              <TextField
                fullWidth
                label="Teléfono"
                type="tel"
                value={cliente.telefono}
                onChange={(e) =>
                  actualizarCliente("telefono", e.target.value)
                }
                required
                inputProps={{ maxLength: 20 }}
                sx={campoSx}
              />

              <TextField
                fullWidth
                label="Dirección de entrega"
                value={cliente.direccion}
                onChange={(e) =>
                  actualizarCliente("direccion", e.target.value)
                }
                required
                sx={{
                  ...campoSx,
                  gridColumn: { xs: "auto", sm: "1 / -1" },
                }}
              />

              <TextField
                fullWidth
                label="Indicaciones adicionales"
                placeholder="Barrio, apartamento, punto de referencia..."
                value={cliente.referencia}
                onChange={(e) =>
                  actualizarCliente("referencia", e.target.value)
                }
                multiline
                minRows={2}
                sx={{
                  ...campoSx,
                  gridColumn: { xs: "auto", sm: "1 / -1" },
                }}
              />

              <TextField
                fullWidth
                select
                label="Forma de pago"
                value={cliente.formaPago}
                onChange={(e) =>
                  actualizarCliente("formaPago", e.target.value)
                }
                sx={{
                  ...campoSx,
                  gridColumn: { xs: "auto", sm: "1 / -1" },
                }}
              >
                <MenuItem value="Efectivo contraentrega">
                  Efectivo contraentrega
                </MenuItem>
                <MenuItem value="Transferencia">
                  Transferencia
                </MenuItem>
                <MenuItem value="Pago anticipado">
                  Pago anticipado
                </MenuItem>
              </TextField>
            </Box>

            <Divider sx={{ my: 3, borderColor: COLORES.borde }} />

            <Typography sx={tituloSeccionSx}>
              Productos del pedido
            </Typography>

            <Typography sx={descripcionSx}>
              Selecciona los productos y sus cantidades.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "minmax(0, 1fr) 110px auto",
                },
                gap: 1.5,
                mt: 2.5,
                alignItems: "start",
              }}
            >
              <TextField
                fullWidth
                select
                label="Producto"
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                sx={campoSx}
              >
                {catalogoProductos.map((producto) => (
                  <MenuItem key={producto.id} value={String(producto.id)}>
                    {producto.nombre} · {formatoPrecio(producto.precio)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                inputProps={{ min: 1, step: 1 }}
                sx={campoSx}
              />

              <Button
                type="button"
                variant="outlined"
                onClick={agregarProducto}
                sx={{
                  height: 56,
                  px: 2,
                  borderRadius: 2,
                  color: COLORES.naranja,
                  borderColor: COLORES.naranja,
                  textTransform: "none",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  "&:hover": {
                    borderColor: COLORES.naranjaHover,
                    bgcolor: "#fff7f2",
                  },
                }}
              >
                Agregar
              </Button>
            </Box>

            {productosPedido.length > 0 && (
              <TableContainer sx={{ mt: 2.5 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell sx={cabeceraTablaSx}>
                        Producto
                      </TableCell>
                      <TableCell sx={cabeceraTablaSx}>
                        Cant.
                      </TableCell>
                      <TableCell sx={cabeceraTablaSx} align="right">
                        Subtotal
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {productosPedido.map((producto) => (
                      <TableRow key={producto.id}>
                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: COLORES.texto,
                              fontWeight: 600,
                            }}
                          >
                            {producto.nombre}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: COLORES.secundario,
                              mt: 0.5,
                            }}
                          >
                            {formatoPrecio(producto.precio)} c/u
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ width: 85 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={producto.cantidad}
                            onChange={(e) =>
                              cambiarCantidad(
                                producto.id,
                                e.target.value
                              )
                            }
                            inputProps={{ min: 1, step: 1 }}
                            sx={{
                              width: 72,
                              ...campoSx,
                            }}
                          />
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{ whiteSpace: "nowrap", fontSize: 12 }}
                        >
                          {formatoPrecio(
                            producto.precio * producto.cantidad
                          )}
                        </TableCell>

                        <TableCell align="right">
                          <Button
                            type="button"
                            size="small"
                            color="error"
                            onClick={() => eliminarProducto(producto.id)}
                            sx={{
                              minWidth: 0,
                              px: 0.75,
                              textTransform: "none",
                            }}
                          >
                            Quitar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {productosPedido.length === 0 && (
              <Box
                sx={{
                  mt: 2.5,
                  p: 3,
                  border: `1px dashed ${COLORES.borde}`,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{ color: COLORES.secundario, fontSize: 13 }}
                >
                  Todavía no has agregado productos.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Resumen del pedido */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              border: `1px solid ${COLORES.borde}`,
              borderRadius: 3,
              minWidth: 0,
            }}
          >
            <Typography sx={tituloSeccionSx}>
              Resumen del pedido
            </Typography>

            <Typography sx={descripcionSx}>
              Revisa los valores antes de registrar.
            </Typography>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "#fff7f2",
                border: "1px solid #ffdfca",
              }}
            >
              <Typography sx={{ ...textoSecundarioSx, color: "#9a4d22" }}>
                Total a cobrar
              </Typography>

              <Typography
                sx={{
                  color: COLORES.naranjaHover,
                  fontSize: { xs: 27, sm: 30 },
                  fontWeight: 800,
                  letterSpacing: -0.7,
                  mt: 0.5,
                  overflowWrap: "anywhere",
                }}
              >
                {formatoPrecio(totalPedido)}
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ my: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Typography sx={textoSecundarioSx}>
                  Productos diferentes
                </Typography>
                <Typography sx={valorResumenSx}>
                  {productosPedido.length}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Typography sx={textoSecundarioSx}>
                  Unidades
                </Typography>
                <Typography sx={valorResumenSx}>
                  {totalProductos}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Typography sx={textoSecundarioSx}>
                  Forma de pago
                </Typography>

                <Typography
                  sx={{
                    ...valorResumenSx,
                    textAlign: "right",
                    maxWidth: "58%",
                  }}
                >
                  {cliente.formaPago}
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: COLORES.borde, mb: 2.5 }} />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                ...botonPrincipalSx,
                minHeight: 48,
              }}
            >
              Registrar pedido
            </Button>

            <Button
              fullWidth
              type="button"
              onClick={limpiarFormulario}
              sx={{
                mt: 1,
                minHeight: 42,
                color: COLORES.secundario,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Limpiar formulario
            </Button>

            <Typography
              sx={{
                mt: 2,
                color: COLORES.secundario,
                fontSize: 11,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Verifica los datos y la dirección antes de confirmar el pedido.
            </Typography>
          </Paper>
        </Box>

        {/* Tabla de pedidos registrados */}
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            border: `1px solid ${COLORES.borde}`,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Typography sx={tituloSeccionSx}>
              Pedidos registrados
            </Typography>

            <Typography sx={descripcionSx}>
              Consulta los pedidos creados durante esta sesión.
            </Typography>
          </Box>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell sx={cabeceraTablaSx}>Pedido</TableCell>
                  <TableCell sx={cabeceraTablaSx}>Cliente</TableCell>
                  <TableCell sx={cabeceraTablaSx}>Dirección</TableCell>
                  <TableCell sx={cabeceraTablaSx}>Forma de pago</TableCell>
                  <TableCell sx={cabeceraTablaSx}>Total</TableCell>
                  <TableCell sx={cabeceraTablaSx}>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id} hover>
                    <TableCell>
                      <Typography
                        sx={{
                          color: COLORES.texto,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {pedido.codigo}
                      </Typography>

                      <Typography
                        sx={{
                          color: COLORES.secundario,
                          fontSize: 11,
                          mt: 0.5,
                        }}
                      >
                        {pedido.fecha}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: COLORES.texto,
                        }}
                      >
                        {pedido.cliente.nombre}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 11,
                          color: COLORES.secundario,
                          mt: 0.5,
                        }}
                      >
                        {pedido.cliente.telefono}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: COLORES.texto,
                          maxWidth: 220,
                        }}
                      >
                        {pedido.cliente.direccion}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ fontSize: 12 }}>
                      {pedido.cliente.formaPago}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatoPrecio(pedido.total)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={pedido.estado}
                        color="warning"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {pedidos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography
                        sx={{ color: COLORES.secundario, fontSize: 13 }}
                      >
                        Aún no hay pedidos registrados.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Typography
          sx={{
            mt: 2,
            color: COLORES.secundario,
            fontSize: 11,
            textAlign: "center",
          }}
        >
          APP DOMI · Registro y gestión de pedidos
        </Typography>
      </Box>

      <Snackbar
        open={mensaje.abierto}
        autoHideDuration={3000}
        onClose={(_, razon) => {
          if (razon === "clickaway") return;

          setMensaje((anterior) => ({
            ...anterior,
            abierto: false,
          }));
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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

const resumenSx = {
  p: 2.5,
  border: `1px solid ${COLORES.borde}`,
  borderRadius: 3,
  bgcolor: COLORES.blanco,
};

const textoSecundarioSx = {
  color: COLORES.secundario,
  fontSize: 12,
};

const numeroSx = {
  mt: 1,
  fontSize: 29,
  lineHeight: 1.3,
  fontWeight: 800,
  letterSpacing: -0.6,
  color: COLORES.texto,
};

const tituloSeccionSx = {
  color: COLORES.texto,
  fontSize: 19,
  fontWeight: 800,
  letterSpacing: -0.35,
};

const descripcionSx = {
  mt: 0.75,
  color: COLORES.secundario,
  fontSize: 12,
  lineHeight: 1.7,
};

const valorResumenSx = {
  color: COLORES.texto,
  fontSize: 12,
  fontWeight: 700,
};

const cabeceraTablaSx = {
  color: COLORES.secundario,
  fontSize: 11,
  fontWeight: 800,
  whiteSpace: "nowrap",
};
