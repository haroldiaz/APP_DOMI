
import React, { useState } from "react";
import DrawerBar from "../components/DrawerBar"; // Ajusta la ruta si tu componente está en otra carpeta

import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

const COLORES = {
  fondo: "#f6f7f9",
  blanco: "#ffffff",
  texto: "#202939",
  secundario: "#667085",
  borde: "#e4e7ec",
  naranja: "#ed6b23",
  naranjaHover: "#d95b16",
};

const pedidosIniciales = [
  {
    id: "DOM-1042",
    cliente: "María Fernanda",
    productos: "2 hamburguesas y 1 jugo",
    total: 38000,
    direccion: "Calle 25 # 18-42",
    indicaciones: "Casa de fachada blanca. Timbre a la derecha.",
    estado: "Asignado",
    incidencia: "",
  },
  {
    id: "DOM-1043",
    cliente: "Juan David",
    productos: "1 pizza familiar",
    total: 42000,
    direccion: "Carrera 20 # 12-18",
    indicaciones: "Apartamento 302. Avisar al llegar.",
    estado: "Recogido",
    incidencia: "",
  },
  {
    id: "DOM-1044",
    cliente: "Laura Gómez",
    productos: "2 perros calientes y 2 gaseosas",
    total: 31000,
    direccion: "Calle 10 # 15-30",
    indicaciones: "Entregar en recepción.",
    estado: "En camino",
    incidencia: "",
  },
];

const formatoPrecio = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);

const estadoColor = {
  Asignado: "warning",
  Recogido: "info",
  "En camino": "primary",
  Entregado: "success",
};

export default function PanelDomiciliario() {
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [menuMovilOpen, setMenuMovilOpen] = useState(false);

  const abrirMenu = () => {
    if (esMovil) {
      setMenuMovilOpen(true);
    } else {
      setDrawerOpen((anterior) => !anterior);
    }
  };

  const [disponible, setDisponible] = useState(true);
  const [pedidos, setPedidos] = useState(pedidosIniciales);

  const [pedidoEntrega, setPedidoEntrega] = useState(null);
  const [efectivoRecibido, setEfectivoRecibido] = useState("");
  const [errorEfectivo, setErrorEfectivo] = useState("");

  const [pedidoIncidencia, setPedidoIncidencia] = useState(null);
  const [tipoIncidencia, setTipoIncidencia] = useState("");
  const [detalleIncidencia, setDetalleIncidencia] = useState("");

  const [mensaje, setMensaje] = useState({
    abierto: false,
    texto: "",
    tipo: "success",
  });

  const activas = pedidos.filter(
    (pedido) => pedido.estado !== "Entregado"
  );

  const entregadas = pedidos.filter(
    (pedido) => pedido.estado === "Entregado"
  );

  const totalRecaudado = entregadas.reduce(
    (total, pedido) => total + Number(pedido.total || 0),
    0
  );

  const notificar = (texto, tipo = "success") => {
    setMensaje({
      abierto: true,
      texto,
      tipo,
    });
  };

  const actualizarPedido = (pedidoId, cambios) => {
    setPedidos((anteriores) =>
      anteriores.map((pedido) =>
        pedido.id === pedidoId
          ? { ...pedido, ...cambios }
          : pedido
      )
    );
  };

  const avanzarPedido = (pedido) => {
    if (pedido.estado === "Asignado") {
      actualizarPedido(pedido.id, { estado: "Recogido" });
      notificar(`Recogida confirmada: ${pedido.id}`);
      return;
    }

    if (pedido.estado === "Recogido") {
      actualizarPedido(pedido.id, { estado: "En camino" });
      notificar(`Pedido en camino: ${pedido.id}`);
      return;
    }

    if (pedido.estado === "En camino") {
      setPedidoEntrega(pedido);
      setEfectivoRecibido(String(pedido.total));
      setErrorEfectivo("");
    }
  };

  const cerrarDialogoEntrega = () => {
    setPedidoEntrega(null);
    setEfectivoRecibido("");
    setErrorEfectivo("");
  };

  const confirmarEntrega = (event) => {
    event.preventDefault();

    if (!pedidoEntrega) return;

    const texto = String(efectivoRecibido).trim();
    const recibido = Number(texto);

    if (
      texto === "" ||
      !Number.isFinite(recibido) ||
      recibido < pedidoEntrega.total
    ) {
      setErrorEfectivo(
        "El efectivo debe ser igual o superior al total del pedido."
      );
      return;
    }

    actualizarPedido(pedidoEntrega.id, {
      estado: "Entregado",
      efectivoRecibido: recibido,
      cambio: recibido - pedidoEntrega.total,
    });

    notificar(`Entrega confirmada: ${pedidoEntrega.id}`);
    cerrarDialogoEntrega();
  };

  const abrirIncidencia = (pedido) => {
    setPedidoIncidencia(pedido);
    setTipoIncidencia("");
    setDetalleIncidencia("");
  };

  const cerrarIncidencia = () => {
    setPedidoIncidencia(null);
    setTipoIncidencia("");
    setDetalleIncidencia("");
  };

  const guardarIncidencia = (event) => {
    event.preventDefault();

    if (!pedidoIncidencia || !tipoIncidencia) {
      notificar("Selecciona el tipo de incidencia.", "warning");
      return;
    }

    const detalle = detalleIncidencia.trim();
    const incidencia = detalle
      ? `${tipoIncidencia}: ${detalle}`
      : tipoIncidencia;

    actualizarPedido(pedidoIncidencia.id, { incidencia });

    notificar("Incidencia registrada.");
    cerrarIncidencia();
  };

  const textoAccion = (estado) => {
    switch (estado) {
      case "Asignado":
        return "Confirmar recogida";
      case "Recogido":
        return "Marcar en camino";
      case "En camino":
        return "Confirmar entrega";
      default:
        return "Entrega completada";
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: COLORES.fondo }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: COLORES.blanco,
          color: COLORES.texto,
          borderBottom: `1px solid ${COLORES.borde}`,
        }}
      >
        <Toolbar sx={{ minHeight: "72px !important", gap: 1.5 }}>
          <IconButton
            onClick={abrirMenu}
            aria-label="Abrir o cerrar menú"
            edge="start"
            sx={{ color: COLORES.texto }}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={{ fontSize: 16, fontWeight: 800 }}>
            APP DOMI
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: 12,
              color: COLORES.secundario,
            }}
          >
            Panel del domiciliario
          </Typography>
        </Toolbar>
      </AppBar>

      <DrawerBar
        open={esMovil ? menuMovilOpen : drawerOpen}
        onClose={() => setMenuMovilOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          ml: { xs: 0, md: drawerOpen ? "248px" : "76px" },
          transition: theme.transitions.create("margin", {
            duration: theme.transitions.duration.shortest,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: "72px !important" }} />
        <Box
          sx={{
            minHeight: "calc(100vh - 72px)",
            bgcolor: COLORES.fondo,
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Encabezado */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 25, sm: 30 },
                fontWeight: 800,
                color: COLORES.texto,
                letterSpacing: -0.8,
              }}
            >
              Panel del domiciliario
            </Typography>

            <Typography
              sx={{ mt: 0.75, color: COLORES.secundario, fontSize: 14 }}
            >
              Administra tus entregas.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              pl: 2,
              border: `1px solid ${COLORES.borde}`,
              borderRadius: 2.5,
              bgcolor: COLORES.blanco,
            }}
          >
            <Box>
              <Typography
                sx={{ color: COLORES.texto, fontWeight: 700, fontSize: 13 }}
              >
                {disponible ? "Disponible" : "No disponible"}
              </Typography>

              <Typography
                sx={{ color: COLORES.secundario, fontSize: 11, mt: 0.25 }}
              >
                {disponible
                  ? "Puedes recibir pedidos"
                  : "No recibir nuevas asignaciones"}
              </Typography>
            </Box>

            <Switch
              checked={disponible}
              onChange={(event) => {
                setDisponible(event.target.checked);
                notificar(
                  event.target.checked
                    ? "Disponibilidad activada."
                    : "Disponibilidad desactivada.",
                  "info"
                );
              }}
              color="warning"
              inputProps={{ "aria-label": "Cambiar disponibilidad" }}
            />
          </Paper>
        </Stack>

        {/* Resumen */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Paper sx={tarjetaResumenSx} elevation={0}>
            <Typography sx={textoSecundarioSx}>
              Entregas activas
            </Typography>
            <Typography sx={numeroResumenSx}>
              {activas.length}
            </Typography>
          </Paper>

          <Paper sx={tarjetaResumenSx} elevation={0}>
            <Typography sx={textoSecundarioSx}>
              Entregas completadas
            </Typography>
            <Typography sx={numeroResumenSx}>
              {entregadas.length}
            </Typography>
          </Paper>

          <Paper sx={tarjetaResumenSx} elevation={0}>
            <Typography sx={textoSecundarioSx}>
              Total de pedidos entregados
            </Typography>
            <Typography sx={{ ...numeroResumenSx, fontSize: 25 }}>
              {formatoPrecio(totalRecaudado)}
            </Typography>
          </Paper>
        </Box>

        {/* Listado */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Typography
            sx={{ fontSize: 20, fontWeight: 800, color: COLORES.texto }}
          >
            Mis entregas
          </Typography>

          <Typography sx={{ fontSize: 12, color: COLORES.secundario }}>
            {activas.length} pendientes de completar
          </Typography>
        </Stack>

        {pedidos.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              border: `1px solid ${COLORES.borde}`,
              borderRadius: 3,
            }}
          >
            <Typography fontWeight={700} color={COLORES.texto}>
              No tienes pedidos asignados.
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2.5,
              alignItems: "start",
            }}
          >
            {pedidos.map((pedido) => (
              <Paper
                key={pedido.id}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  border: `1px solid ${COLORES.borde}`,
                  borderRadius: 3,
                  bgcolor: COLORES.blanco,
                }}
              >
                {/* Número y estado */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: COLORES.secundario,
                        mb: 0.5,
                      }}
                    >
                      PEDIDO {pedido.id}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: COLORES.texto,
                      }}
                    >
                      {pedido.cliente}
                    </Typography>
                  </Box>

                  <Chip
                    size="small"
                    color={estadoColor[pedido.estado] || "default"}
                    label={pedido.estado}
                    variant="outlined"
                  />
                </Stack>

                <Divider sx={{ my: 2, borderColor: COLORES.borde }} />

                {/* Dirección */}
                <Typography sx={etiquetaSx}>
                  DIRECCIÓN DE ENTREGA
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontWeight: 700,
                    fontSize: 15,
                    color: COLORES.texto,
                  }}
                >
                  {pedido.direccion}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.75,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: COLORES.secundario,
                  }}
                >
                  {pedido.indicaciones || "Sin indicaciones adicionales."}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography sx={etiquetaSx}>PRODUCTOS</Typography>
                  <Typography
                    sx={{
                      mt: 0.5,
                      color: COLORES.texto,
                      fontSize: 13,
                    }}
                  >
                    {pedido.productos}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2, borderColor: COLORES.borde }} />

                {/* Total */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography sx={{ color: COLORES.secundario, fontSize: 13 }}>
                    Total a cobrar
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 19,
                      color: COLORES.texto,
                      fontWeight: 800,
                    }}
                  >
                    {formatoPrecio(pedido.total)}
                  </Typography>
                </Stack>

                {pedido.estado === "Entregado" && (
                  <Alert
                    severity="success"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      alignItems: "center",
                    }}
                  >
                    Entrega confirmada.
                    {Number.isFinite(pedido.efectivoRecibido) && (
                      <Box sx={{ mt: 0.5 }}>
                        Efectivo: {formatoPrecio(pedido.efectivoRecibido)}
                        <br />
                        Cambio: {formatoPrecio(pedido.cambio)}
                      </Box>
                    )}
                  </Alert>
                )}

                {pedido.incidencia && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                      Incidencia reportada
                    </Typography>
                    <Typography sx={{ fontSize: 12, mt: 0.5 }}>
                      {pedido.incidencia}
                    </Typography>
                  </Alert>
                )}

                {/* Acciones */}
                <Stack spacing={1.25}>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={pedido.estado === "Entregado"}
                    onClick={() => avanzarPedido(pedido)}
                    sx={{
                      minHeight: 43,
                      bgcolor: COLORES.naranja,
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: COLORES.naranjaHover,
                        boxShadow: "none",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#e5e7eb",
                        color: "#667085",
                      },
                    }}
                  >
                    {textoAccion(pedido.estado)}
                  </Button>

                  {pedido.estado !== "Entregado" && (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => abrirIncidencia(pedido)}
                      sx={{
                        minHeight: 40,
                        color: COLORES.texto,
                        borderColor: COLORES.borde,
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                          borderColor: COLORES.naranja,
                          bgcolor: "#fff7f2",
                        },
                      }}
                    >
                      Reportar incidencia
                    </Button>
                  )}
                </Stack>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* Confirmar entrega y efectivo */}
      <Dialog
        open={Boolean(pedidoEntrega)}
        onClose={cerrarDialogoEntrega}
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={confirmarEntrega} noValidate>
          <DialogTitle sx={{ fontWeight: 800 }}>
            Confirmar entrega
          </DialogTitle>

          <DialogContent>
            {pedidoEntrega && (
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                <Box>
                  <Typography sx={textoSecundarioSx}>
                    Pedido {pedidoEntrega.id}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 21,
                      fontWeight: 800,
                      color: COLORES.texto,
                      mt: 0.5,
                    }}
                  >
                    {formatoPrecio(pedidoEntrega.total)}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.75,
                      fontSize: 12,
                      color: COLORES.secundario,
                    }}
                  >
                    Total que debes cobrar.
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  autoFocus
                  label="Efectivo recibido (COP)"
                  type="number"
                  value={efectivoRecibido}
                  onChange={(event) => {
                    setEfectivoRecibido(event.target.value);
                    setErrorEfectivo("");
                  }}
                  inputProps={{ min: 0, step: 1 }}
                  error={Boolean(errorEfectivo)}
                  helperText={errorEfectivo}
                  required
                />

                <Box
                  sx={{
                    p: 1.75,
                    bgcolor: COLORES.fondo,
                    borderRadius: 2,
                    border: `1px solid ${COLORES.borde}`,
                  }}
                >
                  <Typography sx={textoSecundarioSx}>
                    Cambio para el cliente
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 20,
                      color: COLORES.texto,
                      fontWeight: 800,
                    }}
                  >
                    {formatoPrecio(
                      Math.max(
                        0,
                        Number(efectivoRecibido || 0) -
                          Number(pedidoEntrega.total)
                      )
                    )}
                  </Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button
              onClick={cerrarDialogoEntrega}
              sx={{ color: COLORES.secundario, textTransform: "none" }}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="contained" sx={botonPrincipalSx}>
              Confirmar entrega
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Reportar incidencia */}
      <Dialog
        open={Boolean(pedidoIncidencia)}
        onClose={cerrarIncidencia}
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={guardarIncidencia}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            Reportar incidencia
          </DialogTitle>

          <DialogContent>
            {pedidoIncidencia && (
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                <Typography sx={textoSecundarioSx}>
                  Pedido {pedidoIncidencia.id} · {pedidoIncidencia.cliente}
                </Typography>

                <TextField
                  select
                  fullWidth
                  required
                  label="Tipo de incidencia"
                  value={tipoIncidencia}
                  onChange={(event) =>
                    setTipoIncidencia(event.target.value)
                  }
                >
                  <MenuItem value="Cliente no responde">
                    Cliente no responde
                  </MenuItem>
                  <MenuItem value="Dirección incorrecta">
                    Dirección incorrecta
                  </MenuItem>
                  <MenuItem value="Problema de acceso">
                    Problema de acceso
                  </MenuItem>
                  <MenuItem value="Problema con el pedido">
                    Problema con el pedido
                  </MenuItem>
                  <MenuItem value="Problema de pago">
                    Problema de pago
                  </MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Detalles adicionales"
                  placeholder="Describe brevemente el problema..."
                  value={detalleIncidencia}
                  onChange={(event) =>
                    setDetalleIncidencia(event.target.value)
                  }
                />
              </Stack>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button
              onClick={cerrarIncidencia}
              sx={{ color: COLORES.secundario, textTransform: "none" }}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="contained" sx={botonPrincipalSx}>
              Guardar incidencia
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={mensaje.abierto}
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;

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
      </Box>
    </Box>
  );
}

const tarjetaResumenSx = {
  p: 2.5,
  border: `1px solid ${COLORES.borde}`,
  borderRadius: 3,
  bgcolor: COLORES.blanco,
};

const textoSecundarioSx = {
  fontSize: 12,
  color: COLORES.secundario,
};

const numeroResumenSx = {
  mt: 1,
  fontSize: 30,
  lineHeight: 1.3,
  fontWeight: 800,
  color: COLORES.texto,
};

const etiquetaSx = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: 0.6,
  color: COLORES.secundario,
};

const botonPrincipalSx = {
  bgcolor: COLORES.naranja,
  borderRadius: 2,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: COLORES.naranjaHover,
    boxShadow: "none",
  },
};
