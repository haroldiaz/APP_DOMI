
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import DrawerBar from "../components/DrawerBar";

const COLORES = {
  fondo: "#f8fafc",
  blanco: "#ffffff",
  texto: "#172033",
  secundario: "#64748b",
  borde: "#e9edf3",
  naranja: "#f97316",
  naranjaHover: "#ea580c",
};

const REPORTES = {
  hoy: {
    etiqueta: "Hoy",
    ventas: 285000,
    pedidos: 18,
    entregados: 15,
    enCamino: 1,
    pendientes: 2,
    graficaTitulo: "Ventas por hora",
    grafica: [
      { etiqueta: "8 a. m.", ventas: 25000 },
      { etiqueta: "10 a. m.", ventas: 42000 },
      { etiqueta: "12 p. m.", ventas: 31000 },
      { etiqueta: "2 p. m.", ventas: 55000 },
      { etiqueta: "4 p. m.", ventas: 60000 },
      { etiqueta: "6 p. m.", ventas: 72000 },
    ],
    productos: [
      { nombre: "Hamburguesa clásica", unidades: 8, ventas: 144000 },
      { nombre: "Jugo natural", unidades: 6, ventas: 42000 },
      { nombre: "Pizza familiar", unidades: 4, ventas: 168000 },
    ],
  },
  semana: {
    etiqueta: "Últimos 7 días",
    ventas: 1850000,
    pedidos: 126,
    entregados: 108,
    enCamino: 7,
    pendientes: 11,
    graficaTitulo: "Ventas por día",
    grafica: [
      { etiqueta: "Lun", ventas: 220000 },
      { etiqueta: "Mar", ventas: 315000 },
      { etiqueta: "Mié", ventas: 190000 },
      { etiqueta: "Jue", ventas: 360000 },
      { etiqueta: "Vie", ventas: 285000 },
      { etiqueta: "Sáb", ventas: 245000 },
      { etiqueta: "Dom", ventas: 235000 },
    ],
    productos: [
      { nombre: "Hamburguesa clásica", unidades: 96, ventas: 1728000 },
      { nombre: "Jugo natural", unidades: 74, ventas: 518000 },
      { nombre: "Pizza familiar", unidades: 51, ventas: 2142000 },
    ],
  },
  mes: {
    etiqueta: "Últimos 30 días",
    ventas: 7250000,
    pedidos: 498,
    entregados: 456,
    enCamino: 18,
    pendientes: 24,
    graficaTitulo: "Ventas por semana",
    grafica: [
      { etiqueta: "Sem. 1", ventas: 1550000 },
      { etiqueta: "Sem. 2", ventas: 1800000 },
      { etiqueta: "Sem. 3", ventas: 1620000 },
      { etiqueta: "Sem. 4", ventas: 2280000 },
    ],
    productos: [
      { nombre: "Hamburguesa clásica", unidades: 386, ventas: 6948000 },
      { nombre: "Jugo natural", unidades: 290, ventas: 2030000 },
      { nombre: "Pizza familiar", unidades: 204, ventas: 8568000 },
    ],
  },
};

const formatoPrecio = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);

const formatoCompacto = (valor) => {
  if (valor >= 1000000) {
    return `$${(valor / 1000000).toLocaleString("es-CO", {
      maximumFractionDigits: 1,
    })} M`;
  }

  if (valor >= 1000) {
    return `$${Math.round(valor / 1000)} mil`;
  }

  return formatoPrecio(valor);
};

export default function Reportes() {
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(true);
  const [periodo, setPeriodo] = useState("semana");

  const [notificacion, setNotificacion] = useState({
    abierta: false,
    texto: "",
    tipo: "success",
  });

  const reporte = REPORTES[periodo];

  const ticketPromedio =
    reporte.pedidos > 0
      ? Math.round(reporte.ventas / reporte.pedidos)
      : 0;

  const maxVentas = Math.max(
    ...reporte.grafica.map((item) => item.ventas),
    1
  );

  const pedidosCompletados = reporte.entregados;
  const totalPedidos = reporte.pedidos;

  const porcentajes = [
    {
      nombre: "Entregados",
      cantidad: reporte.entregados,
      color: "#16a34a",
    },
    {
      nombre: "En camino",
      cantidad: reporte.enCamino,
      color: "#2563eb",
    },
    {
      nombre: "Pendientes",
      cantidad: reporte.pendientes,
      color: "#f59e0b",
    },
  ];

  const mostrarNotificacion = (texto, tipo = "success") => {
    setNotificacion({
      abierta: true,
      texto,
      tipo,
    });
  };

  const exportarCSV = () => {
    const filas = [
      ["Reporte APP DOMI"],
      ["Periodo", reporte.etiqueta],
      [],
      ["Indicador", "Valor"],
      ["Ventas totales", reporte.ventas],
      ["Pedidos registrados", reporte.pedidos],
      ["Pedidos entregados", reporte.entregados],
      ["Pedidos en camino", reporte.enCamino],
      ["Pedidos pendientes", reporte.pendientes],
      ["Ticket promedio", ticketPromedio],
      [],
      ["Ventas del periodo", "Valor COP"],
      ...reporte.grafica.map((item) => [
        item.etiqueta,
        item.ventas,
      ]),
      [],
      ["Productos", "Unidades", "Ventas COP"],
      ...reporte.productos.map((producto) => [
        producto.nombre,
        producto.unidades,
        producto.ventas,
      ]),
    ];

    const contenido = filas
      .map((fila) =>
        fila
          .map((celda) => {
            const valor = String(celda ?? "");
            return `"${valor.replace(/"/g, '""')}"`;
          })
          .join(";")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", contenido], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = `Reporte_APP_DOMI_${periodo}.csv`;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    URL.revokeObjectURL(url);

    mostrarNotificacion("Reporte CSV exportado.");
  };

  const indicadores = [
    {
      titulo: "Ventas totales",
      valor: formatoPrecio(reporte.ventas),
      descripcion: reporte.etiqueta,
      color: "#7c3aed",
      fondo: "#f5f3ff",
    },
    {
      titulo: "Pedidos registrados",
      valor: reporte.pedidos,
      descripcion: "Total del período",
      color: "#2563eb",
      fondo: "#eff6ff",
    },
    {
      titulo: "Entregas completadas",
      valor: reporte.entregados,
      descripcion: "Pedidos entregados",
      color: "#059669",
      fondo: "#ecfdf5",
    },
    {
      titulo: "Pedidos pendientes",
      valor: reporte.pendientes + reporte.enCamino,
      descripcion: "Sin completar",
      color: "#d97706",
      fondo: "#fffbeb",
    },
  ];

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
          borderBottom: `1px solid ${COLORES.borde}`,
          backdropFilter: "blur(12px)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
            onClick={() => setMenuAbierto((actual) => !actual)}
            aria-label="Abrir o contraer menú"
            sx={{ color: "#475569", borderRadius: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            onClick={() => navigate("/menuPrincipal")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              flexGrow: 1,
              minWidth: 0,
              cursor: "pointer",
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

            <Box>
              <Typography
                sx={{
                  fontSize: 19,
                  fontWeight: 900,
                  letterSpacing: "-0.6px",
                }}
              >
                App <Box component="span" sx={{ color: COLORES.naranja }}>Domi</Box>
              </Typography>

              <Typography
                sx={{
                  display: { xs: "none", sm: "block" },
                  color: "#94a3b8",
                  fontSize: 10,
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
                border: `1px solid ${COLORES.borde}`,
                borderRadius: 2.5,
                color: COLORES.secundario,
              }}
            >
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: { xs: 0, sm: 1 }, my: 2 }}
          />

          <Stack direction="row" spacing={1.2} alignItems="center">
            <Avatar
              sx={{
                width: 39,
                height: 39,
                bgcolor: "#ffedd5",
                color: "#c2410c",
                fontWeight: 800,
              }}
            >
              A
            </Avatar>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
                Administrador
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                Panel de gestión
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* DRAWER BAR REUTILIZADO */}
      <DrawerBar
        open={menuAbierto}
        onClose={() => setMenuAbierto(false)}
      />

      {/* CONTENIDO DE REPORTES */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          mt: "72px",
          p: { xs: 2, sm: 3, lg: 4 },
          overflowX: "hidden",
        }}
      >
        {/* Encabezado y filtros */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          sx={{ mb: 3.5 }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 27, md: 32 },
                fontWeight: 900,
                letterSpacing: "-1px",
                color: COLORES.texto,
              }}
            >
              Reportes
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                fontSize: 13,
                color: COLORES.secundario,
              }}
            >
              Consulta las ventas y el rendimiento de tus pedidos.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              select
              size="small"
              label="Período"
              value={periodo}
              onChange={(event) => setPeriodo(event.target.value)}
              sx={{
                minWidth: 180,
                bgcolor: "#ffffff",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="hoy">Hoy</MenuItem>
              <MenuItem value="semana">Últimos 7 días</MenuItem>
              <MenuItem value="mes">Últimos 30 días</MenuItem>
            </TextField>

            <Button
              variant="contained"
              startIcon={<DownloadOutlinedIcon />}
              onClick={exportarCSV}
              sx={{
                ...botonPrincipalSx,
                px: 2,
                whiteSpace: "nowrap",
              }}
            >
              Exportar CSV
            </Button>
          </Stack>
        </Stack>

        {/* Aviso de datos de prueba */}
        <Alert
          severity="info"
          icon={false}
          sx={{
            mb: 3,
            border: "1px solid #dbeafe",
            bgcolor: "#eff6ff",
            color: "#1e40af",
            borderRadius: 2.5,
            fontSize: 12,
          }}
        >
          Vista de demostración: las cifras son de ejemplo y aún no provienen
          de la base de datos.
        </Alert>

        {/* Indicadores */}
        <Grid container spacing={2}>
          {indicadores.map((indicador) => (
            <Grid key={indicador.titulo} size={{ xs: 12, sm: 6, xl: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  height: "100%",
                  border: `1px solid ${COLORES.borde}`,
                  borderRadius: 3,
                  bgcolor: COLORES.blanco,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: COLORES.secundario,
                      }}
                    >
                      {indicador.titulo}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1.5,
                        fontSize: { xs: 24, sm: 27 },
                        fontWeight: 900,
                        letterSpacing: "-0.8px",
                        color: COLORES.texto,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {indicador.valor}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.75,
                        fontSize: 11,
                        color: "#94a3b8",
                      }}
                    >
                      {indicador.descripcion}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 9,
                      height: 42,
                      borderRadius: 5,
                      bgcolor: indicador.color,
                      flexShrink: 0,
                    }}
                  />
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Gráfica de ventas y estado de pedidos */}
        <Grid container spacing={2.5} sx={{ mt: 0.3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                height: "100%",
                border: `1px solid ${COLORES.borde}`,
                borderRadius: 3,
                bgcolor: COLORES.blanco,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
              >
                <Box>
                  <Typography sx={tituloSeccionSx}>
                    {reporte.graficaTitulo}
                  </Typography>

                  <Typography sx={textoSecundarioSx}>
                    Total del período: {formatoPrecio(reporte.ventas)}
                  </Typography>
                </Box>

                <Chip
                  label={reporte.etiqueta}
                  size="small"
                  sx={{
                    bgcolor: "#fff7ed",
                    color: "#c2410c",
                    fontWeight: 700,
                  }}
                />
              </Stack>

              {/* Gráfica de barras hecha con MUI y CSS */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "stretch",
                  gap: { xs: 0.75, sm: 1.5 },
                  mt: 4,
                  height: 220,
                }}
              >
                {reporte.grafica.map((dato) => {
                  const altura = Math.max(
                    5,
                    (dato.ventas / maxVentas) * 100
                  );

                  return (
                    <Box
                      key={dato.etiqueta}
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        sx={{
                          mb: 1,
                          fontSize: { xs: 9, sm: 10 },
                          color: COLORES.secundario,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatoCompacto(dato.ventas)}
                      </Typography>

                      <Box
                        sx={{
                          height: 155,
                          width: "100%",
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "68%",
                            maxWidth: 48,
                            height: `${altura}%`,
                            minHeight: 5,
                            borderRadius: "6px 6px 2px 2px",
                            bgcolor: COLORES.naranja,
                            opacity: dato.ventas === maxVentas ? 1 : 0.65,
                            transition: "height 0.25s ease",
                          }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          mt: 1.25,
                          fontSize: { xs: 9, sm: 11 },
                          fontWeight: 600,
                          color: COLORES.secundario,
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {dato.etiqueta}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                height: "100%",
                border: `1px solid ${COLORES.borde}`,
                borderRadius: 3,
                bgcolor: COLORES.blanco,
              }}
            >
              <Typography sx={tituloSeccionSx}>
                Estado de los pedidos
              </Typography>

              <Typography sx={textoSecundarioSx}>
                Distribución de pedidos del período
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  mb: 3,
                  display: "flex",
                  width: "100%",
                  height: 10,
                  overflow: "hidden",
                  borderRadius: 10,
                  bgcolor: "#f1f5f9",
                }}
              >
                {porcentajes.map((estado) => (
                  <Box
                    key={estado.nombre}
                    sx={{
                      width: `${
                        totalPedidos
                          ? (estado.cantidad / totalPedidos) * 100
                          : 0
                      }%`,
                      height: "100%",
                      bgcolor: estado.color,
                      transition: "width 0.25s ease",
                    }}
                  />
                ))}
              </Box>

              <Stack spacing={2.5}>
                {porcentajes.map((estado) => {
                  const porcentaje = totalPedidos
                    ? Math.round(
                        (estado.cantidad / totalPedidos) * 100
                      )
                    : 0;

                  return (
                    <Stack
                      key={estado.nombre}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.2}
                      >
                        <Box
                          sx={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            bgcolor: estado.color,
                          }}
                        />

                        <Box>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: COLORES.texto,
                            }}
                          >
                            {estado.nombre}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.3,
                              fontSize: 11,
                              color: "#94a3b8",
                            }}
                          >
                            {porcentaje}% del total
                          </Typography>
                        </Box>
                      </Stack>

                      <Typography
                        sx={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: COLORES.texto,
                        }}
                      >
                        {estado.cantidad}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>

              <Divider sx={{ my: 3, borderColor: COLORES.borde }} />

              <Typography sx={textoSecundarioSx}>
                Ticket promedio por pedido
              </Typography>

              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: 24,
                  fontWeight: 900,
                  color: COLORES.texto,
                }}
              >
                {formatoPrecio(ticketPromedio)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Productos más vendidos */}
        <Paper
          elevation={0}
          sx={{
            mt: 2.5,
            border: `1px solid ${COLORES.borde}`,
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: COLORES.blanco,
          }}
        >
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={tituloSeccionSx}>
                Productos más vendidos
              </Typography>

              <Typography sx={textoSecundarioSx}>
                Resumen de unidades e ingresos por producto.
              </Typography>
            </Box>

            <Chip
              label={reporte.etiqueta}
              size="small"
              variant="outlined"
              sx={{ borderColor: COLORES.borde }}
            />
          </Box>

          <Divider sx={{ borderColor: COLORES.borde }} />

          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: 500 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "minmax(180px, 1fr) 100px minmax(130px, 170px)",
                  gap: 2,
                  px: 3,
                  py: 1.5,
                  bgcolor: "#f8fafc",
                }}
              >
                <Typography sx={cabeceraTablaSx}>
                  Producto
                </Typography>

                <Typography sx={cabeceraTablaSx} textAlign="right">
                  Unidades
                </Typography>

                <Typography sx={cabeceraTablaSx} textAlign="right">
                  Ventas
                </Typography>
              </Box>

              {reporte.productos.map((producto, indice) => (
                <React.Fragment key={producto.nombre}>
                  {indice > 0 && (
                    <Divider sx={{ borderColor: "#f1f5f9" }} />
                  )}

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "minmax(180px, 1fr) 100px minmax(130px, 170px)",
                      gap: 2,
                      alignItems: "center",
                      px: 3,
                      py: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: COLORES.texto,
                        }}
                      >
                        {producto.nombre}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 12,
                        color: COLORES.secundario,
                        textAlign: "right",
                      }}
                    >
                      {producto.unidades}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        color: COLORES.texto,
                      }}
                    >
                      {formatoPrecio(producto.ventas)}
                    </Typography>
                  </Box>
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Paper>

        <Typography
          sx={{
            mt: 3,
            textAlign: "center",
            fontSize: 11,
            color: "#94a3b8",
          }}
        >
          APP DOMI · Reportes de gestión
        </Typography>
      </Box>

      {/* Notificaciones */}
      <Snackbar
        open={notificacion.abierta}
        autoHideDuration={3000}
        onClose={(_, razon) => {
          if (razon === "clickaway") return;

          setNotificacion((anterior) => ({
            ...anterior,
            abierta: false,
          }));
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={notificacion.tipo}
          variant="filled"
          onClose={() =>
            setNotificacion((anterior) => ({
              ...anterior,
              abierta: false,
            }))
          }
        >
          {notificacion.texto}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const tituloSeccionSx = {
  fontSize: 17,
  fontWeight: 800,
  color: COLORES.texto,
  letterSpacing: "-0.3px",
};

const textoSecundarioSx = {
  mt: 0.75,
  fontSize: 12,
  color: COLORES.secundario,
};

const cabeceraTablaSx = {
  fontSize: 11,
  fontWeight: 800,
  color: COLORES.secundario,
  whiteSpace: "nowrap",
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
