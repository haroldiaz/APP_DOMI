
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

import DrawerBar from "../components/DrawerBar";

const COLORES = {
  fondo: "#f7f8fa",
  blanco: "#ffffff",
  texto: "#202939",
  secundario: "#697586",
  tenue: "#98a2b3",
  borde: "#e6e9ef",
  naranja: "#ed6b23",
  naranjaHover: "#d95b16",
  naranjaClaro: "#fff4ec",
};

const RUTAS = {
  inicio: "/menu",
  pedidos: "/pedidos",
  productos: "/productos",
  categorias: "/categorias",
  domiciliarios: "/domiciliarios",
  reportes: "/reportes",
  configuracion: "/configuracion",
};

const opcionesPagina = [
  { texto: "Panel principal", ruta: RUTAS.inicio },
  { texto: "Pedidos", ruta: RUTAS.pedidos },
  { texto: "Productos", ruta: RUTAS.productos },
  { texto: "Categorías", ruta: RUTAS.categorias },
  { texto: "Domiciliarios", ruta: RUTAS.domiciliarios },
  { texto: "Reportes", ruta: RUTAS.reportes },
  { texto: "Configuración", ruta: RUTAS.configuracion },
];

const indicadores = [
  {
    titulo: "Pedidos de hoy",
    valor: "0",
    descripcion: "Pedidos registrados",
    icono: <ShoppingBagOutlinedIcon />,
    color: "#3767c7",
    fondo: "#edf3ff",
    ruta: RUTAS.pedidos,
  },
  {
    titulo: "Pedidos pendientes",
    valor: "0",
    descripcion: "Por gestionar",
    icono: <PendingActionsOutlinedIcon />,
    color: "#bd7918",
    fondo: "#fff6e6",
    ruta: RUTAS.pedidos,
  },
  {
    titulo: "Productos",
    valor: "0",
    descripcion: "En el catálogo",
    icono: <Inventory2OutlinedIcon />,
    color: "#238363",
    fondo: "#eaf7f1",
    ruta: RUTAS.productos,
  },
  {
    titulo: "Ventas de hoy",
    valor: "$ 0",
    descripcion: "Total registrado",
    icono: <PaymentsOutlinedIcon />,
    color: "#7658bb",
    fondo: "#f2edfc",
    ruta: RUTAS.reportes,
  },
];

const accesos = [
  {
    titulo: "Registrar pedido",
    descripcion: "Crear un nuevo domicilio",
    icono: <ShoppingBagOutlinedIcon />,
    ruta: RUTAS.pedidos,
  },
  {
    titulo: "Gestionar productos",
    descripcion: "Consultar y actualizar el catálogo",
    icono: <Inventory2OutlinedIcon />,
    ruta: RUTAS.productos,
  },
  {
    titulo: "Domiciliarios",
    descripcion: "Administrar el equipo de entregas",
    icono: <LocalShippingOutlinedIcon />,
    ruta: RUTAS.domiciliarios,
  },
  {
    titulo: "Consultar reportes",
    descripcion: "Revisar las cifras del negocio",
    icono: <BarChartOutlinedIcon />,
    ruta: RUTAS.reportes,
  },
];

function TarjetaIndicador({ item, onClick }) {
  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        height: "100%",
        border: `1px solid ${COLORES.borde}`,
        borderRadius: 2.5,
        bgcolor: COLORES.blanco,
        cursor: "pointer",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: "#d2d7e0",
          boxShadow: "0 5px 18px rgba(16,24,40,0.045)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1.5}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: COLORES.secundario,
            }}
          >
            {item.titulo}
          </Typography>

          <Box
            sx={{
              width: 38,
              height: 38,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              color: item.color,
              bgcolor: item.fondo,
              borderRadius: 2,
              "& .MuiSvgIcon-root": { fontSize: 20 },
            }}
          >
            {item.icono}
          </Box>
        </Stack>

        <Typography
          sx={{
            mt: 2,
            color: COLORES.texto,
            fontSize: { xs: 26, sm: 29 },
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: "-0.8px",
            overflowWrap: "anywhere",
          }}
        >
          {item.valor}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ mt: 1 }}
        >
          <Typography
            sx={{
              fontSize: 11,
              color: COLORES.tenue,
            }}
          >
            {item.descripcion}
          </Typography>

          <ArrowForwardOutlinedIcon
            sx={{ fontSize: 16, color: "#b3bdca" }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function MenuPrincipal() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const esMovil = useMediaQuery(theme.breakpoints.down("md"));

  const [menuAbierto, setMenuAbierto] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.innerWidth >= 900
  );

  useEffect(() => {
    setMenuAbierto(!esMovil);
  }, [esMovil]);

  const seleccionarOpcion = (ruta) => {
    navigate(ruta);

    if (esMovil) {
      setMenuAbierto(false);
    }
  };

  const opcionActual =
    opcionesPagina.find(
      (opcion) =>
        location.pathname === opcion.ruta ||
        location.pathname.startsWith(`${opcion.ruta}/`)
    ) ||
    (location.pathname === "/"
      ? opcionesPagina[0]
      : { texto: "Panel principal", ruta: RUTAS.inicio });

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

      {/* APP BAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.96)",
          color: COLORES.texto,
          borderBottom: `1px solid ${COLORES.borde}`,
          backdropFilter: "blur(12px)",
          zIndex: (actualTheme) =>
            actualTheme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: "70px !important",
            px: { xs: 2, md: 3 },
            gap: 1.5,
          }}
        >
          <Tooltip title={esMovil ? "Abrir menú" : "Contraer menú"}>
            <IconButton
              onClick={() =>
                setMenuAbierto((anterior) => !anterior)
              }
              aria-label="Abrir o contraer menú"
              sx={{
                color: COLORES.secundario,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#f3f5f8",
                },
              }}
            >
              <MenuOutlinedIcon />
            </IconButton>
          </Tooltip>

          {/* Marca */}
          <Box
            onClick={() => seleccionarOpcion(RUTAS.inicio)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                seleccionarOpcion(RUTAS.inicio);
              }
            }}
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
                width: 38,
                height: 38,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                bgcolor: COLORES.naranja,
                color: "#ffffff",
                borderRadius: 2,
                fontSize: 19,
                fontWeight: 900,
              }}
            >
              D
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: "-0.5px",
                  whiteSpace: "nowrap",
                }}
              >
                APP{" "}
                <Box component="span" sx={{ color: COLORES.naranja }}>
                  DOMI
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 0.35,
                  fontSize: 10,
                  color: COLORES.tenue,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Gestión de domicilios
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Notificaciones">
            <IconButton
              aria-label="Notificaciones"
              sx={{
                width: 39,
                height: 39,
                color: COLORES.secundario,
                border: `1px solid ${COLORES.borde}`,
                borderRadius: 2,
                "&:hover": { bgcolor: "#f8f9fb" },
              }}
            >
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              my: 2,
              mx: { xs: 0, sm: 0.5 },
              borderColor: COLORES.borde,
            }}
          />

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            sx={{ minWidth: 0 }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#fff0e5",
                color: "#ad4c17",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              A
            </Avatar>

            <Box
              sx={{
                minWidth: 0,
                display: { xs: "none", sm: "block" },
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORES.texto,
                }}
              >
                Administrador
              </Typography>

              <Typography
                sx={{
                  fontSize: 10,
                  color: COLORES.tenue,
                  mt: 0.25,
                }}
              >
                Panel de gestión
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* DRAWER BAR COMPARTIDO */}
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
          mt: "70px",
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 3, md: 4 },
          overflowX: "hidden",
        }}
      >
        <Box sx={{ maxWidth: 1500, mx: "auto" }}>
          {/* ENCABEZADO */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3.5 }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 11,
                  color: COLORES.secundario,
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                RESUMEN GENERAL
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 27, sm: 31 },
                  lineHeight: 1.2,
                  fontWeight: 800,
                  color: COLORES.texto,
                  letterSpacing: "-1px",
                }}
              >
                {opcionActual.texto}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontSize: 13,
                  color: COLORES.secundario,
                  lineHeight: 1.7,
                }}
              >
                Consulta el estado de tu negocio desde un solo lugar.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => seleccionarOpcion(RUTAS.pedidos)}
              sx={{
                alignSelf: { xs: "stretch", sm: "center" },
                minHeight: 43,
                px: 2.2,
                borderRadius: 2,
                bgcolor: COLORES.naranja,
                color: "#ffffff",
                boxShadow: "none",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  bgcolor: COLORES.naranjaHover,
                  boxShadow: "none",
                },
              }}
            >
              Registrar pedido
            </Button>
          </Stack>

          {/* INDICADORES */}
          <Grid container spacing={2}>
            {indicadores.map((item) => (
              <Grid
                key={item.titulo}
                size={{ xs: 12, sm: 6, xl: 3 }}
              >
                <TarjetaIndicador
                  item={item}
                  onClick={() => seleccionarOpcion(item.ruta)}
                />
              </Grid>
            ))}
          </Grid>

          {/* CONTENIDO INFERIOR */}
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            {/* ACTIVIDAD */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  minHeight: 320,
                  height: "100%",
                  p: { xs: 2.5, sm: 3 },
                  bgcolor: COLORES.blanco,
                  border: `1px solid ${COLORES.borde}`,
                  borderRadius: 2.5,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: COLORES.texto,
                      }}
                    >
                      Actividad reciente
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 12,
                        color: COLORES.secundario,
                      }}
                    >
                      Movimiento de pedidos y entregas
                    </Typography>
                  </Box>

                  <Chip
                    label="Actividad"
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: COLORES.borde,
                      color: COLORES.secundario,
                      fontSize: 10,
                    }}
                  />
                </Stack>

                <Divider sx={{ my: 2.5, borderColor: COLORES.borde }} />

                <Box
                  sx={{
                    minHeight: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2.5,
                      bgcolor: "#f5f7fa",
                      color: "#8b95a5",
                      mb: 2,
                    }}
                  >
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 24 }} />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: COLORES.texto,
                      fontWeight: 700,
                    }}
                  >
                    Sin actividad para mostrar
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.75,
                      fontSize: 12,
                      maxWidth: 300,
                      lineHeight: 1.7,
                      color: COLORES.secundario,
                    }}
                  >
                    Cuando conectes los pedidos reales, aquí aparecerán los
                    movimientos recientes de tu negocio.
                  </Typography>

                  <Button
                    endIcon={<ArrowForwardOutlinedIcon />}
                    onClick={() => seleccionarOpcion(RUTAS.pedidos)}
                    sx={{
                      mt: 1.5,
                      fontSize: 12,
                      fontWeight: 700,
                      color: COLORES.naranjaHover,
                      textTransform: "none",
                    }}
                  >
                    Ir a pedidos
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* ACCESOS RÁPIDOS */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  height: "100%",
                  bgcolor: COLORES.blanco,
                  border: `1px solid ${COLORES.borde}`,
                  borderRadius: 2.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: COLORES.texto,
                  }}
                >
                  Accesos rápidos
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    mb: 2.25,
                    fontSize: 12,
                    color: COLORES.secundario,
                  }}
                >
                  Acciones frecuentes
                </Typography>

                <Stack spacing={1}>
                  {accesos.map((acceso, indice) => (
                    <React.Fragment key={acceso.ruta}>
                      {indice > 0 && (
                        <Divider sx={{ borderColor: "#f0f2f5" }} />
                      )}

                      <Box
                        component="button"
                        type="button"
                        onClick={() => seleccionarOpcion(acceso.ruta)}
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.25,
                          border: 0,
                          borderRadius: 2,
                          bgcolor: "transparent",
                          textAlign: "left",
                          cursor: "pointer",
                          font: "inherit",
                          "&:hover": {
                            bgcolor: "#f7f8fa",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            flexShrink: 0,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: 2,
                            bgcolor: "#f5f7fa",
                            color: "#526071",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20,
                            },
                          }}
                        >
                          {acceso.icono}
                        </Box>

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: COLORES.texto,
                            }}
                          >
                            {acceso.titulo}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.35,
                              fontSize: 11,
                              color: COLORES.secundario,
                              lineHeight: 1.5,
                            }}
                          >
                            {acceso.descripcion}
                          </Typography>
                        </Box>

                        <ArrowForwardOutlinedIcon
                          sx={{
                            fontSize: 17,
                            color: "#a7b0bd",
                            flexShrink: 0,
                          }}
                        />
                      </Box>
                    </React.Fragment>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* PIE DE PÁGINA */}
          <Box
            sx={{
              mt: 3.5,
              pt: 2,
              borderTop: `1px solid ${COLORES.borde}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 10, color: COLORES.tenue }}>
              APP DOMI · Panel administrativo
            </Typography>

            <Typography sx={{ fontSize: 10, color: COLORES.tenue }}>
              Gestión de pedidos y domicilios
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
