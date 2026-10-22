
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";

import {
  Menu as MenuIcon,
  DashboardRounded as DashboardIcon,
  ShoppingBagOutlined as ShoppingBagIcon,
  Inventory2Outlined as InventoryIcon,
  CategoryOutlined as CategoryIcon,
  TwoWheelerOutlined as DeliveryIcon,
  AssessmentOutlined as AssessmentIcon,
  SettingsOutlined as SettingsIcon,
  NotificationsNoneOutlined as NotificationsIcon,
  AddRounded as AddIcon,
  TrendingUpRounded as TrendingUpIcon,
  AttachMoneyRounded as MoneyIcon,
  PendingActionsRounded as PendingIcon,
  PersonOutlineRounded as PersonIcon,
  ArrowForwardRounded as ArrowForwardIcon,
  StorefrontOutlined as StoreIcon,
  LocalShippingOutlined as ShippingIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 250;
const DRAWER_CLOSED_WIDTH = 76;

const opcionesMenu = [
  {
    texto: "Panel principal",
    ruta: "/",
    icono: <DashboardIcon />,
  },
  {
    texto: "Pedidos",
    ruta: "/pedidos",
    icono: <ShoppingBagIcon />,
  },
  {
    texto: "Productos",
    ruta: "/productos",
    icono: <InventoryIcon />,
  },
  {
    texto: "Categorías",
    ruta: "/categorias",
    icono: <CategoryIcon />,
  },
  {
    texto: "Domiciliarios",
    ruta: "/domiciliarios",
    icono: <DeliveryIcon />,
  },
  {
    texto: "Reportes",
    ruta: "/reportes",
    icono: <AssessmentIcon />,
  },
  {
    texto: "Configuración",
    ruta: "/configuracion",
    icono: <SettingsIcon />,
  },
];

const resumen = [
  {
    titulo: "Pedidos de hoy",
    valor: "0",
    descripcion: "Pedidos registrados",
    icono: <ShoppingBagIcon />,
    color: "#2563eb",
    fondo: "#eff6ff",
    ruta: "/pedidos",
  },
  {
    titulo: "Pedidos pendientes",
    valor: "0",
    descripcion: "Por gestionar",
    icono: <PendingIcon />,
    color: "#d97706",
    fondo: "#fffbeb",
    ruta: "/pedidos",
  },
  {
    titulo: "Productos",
    valor: "0",
    descripcion: "En el catálogo",
    icono: <InventoryIcon />,
    color: "#059669",
    fondo: "#ecfdf5",
    ruta: "/productos",
  },
  {
    titulo: "Ventas de hoy",
    valor: "$ 0",
    descripcion: "Total registrado",
    icono: <MoneyIcon />,
    color: "#7c3aed",
    fondo: "#f5f3ff",
    ruta: "/reportes",
  },
];

export default function MenuPrincipal() {
  const [menuAbierto, setMenuAbierto] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const opcionActual =
    opcionesMenu.find((opcion) => opcion.ruta === location.pathname) ||
    opcionesMenu[0];

  const seleccionarOpcion = (ruta) => {
    navigate(ruta);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <CssBaseline />

      {/* BARRA SUPERIOR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.96)",
          color: "#0f172a",
          borderBottom: "1px solid #e9edf3",
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
            onClick={() => setMenuAbierto((anterior) => !anterior)}
            aria-label="Abrir o cerrar menú"
            sx={{
              color: "#475569",
              borderRadius: 2,
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              cursor: "pointer",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "grid",
                placeItems: "center",
                bgcolor: "#f97316",
                color: "#fff",
                borderRadius: 2.5,
                boxShadow: "0 5px 12px rgba(249,115,22,0.22)",
              }}
            >
              <ShippingIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 19,
                  fontWeight: 900,
                  letterSpacing: "-0.6px",
                  lineHeight: 1.2,
                }}
              >
                App <Box component="span" sx={{ color: "#f97316" }}>Domi</Box>
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", fontSize: 10 }}
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
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 1, my: 2, borderColor: "#e9edf3" }}
          />

          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
          >
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
                sx={{ fontSize: 13, fontWeight: 800, color: "#1e293b" }}
              >
                Administrador
              </Typography>

              <Typography
                sx={{ fontSize: 11, color: "#94a3b8" }}
              >
                Panel de gestión
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* MENÚ LATERAL */}
      <Drawer
        variant="permanent"
        sx={{
          width: menuAbierto ? DRAWER_WIDTH : DRAWER_CLOSED_WIDTH,
          flexShrink: 0,
          whiteSpace: "nowrap",
          "& .MuiDrawer-paper": {
            width: menuAbierto ? DRAWER_WIDTH : DRAWER_CLOSED_WIDTH,
            boxSizing: "border-box",
            overflowX: "hidden",
            bgcolor: "#ffffff",
            borderRight: "1px solid #e9edf3",
            transition: "width 0.22s ease",
          },
        }}
      >
        <Toolbar sx={{ minHeight: "72px !important" }} />

        <Box sx={{ px: 1.5, py: 3 }}>
          {menuAbierto && (
            <Typography
              sx={{
                px: 1.5,
                mb: 1.5,
                fontSize: 10,
                fontWeight: 900,
                color: "#94a3b8",
                letterSpacing: 1.2,
              }}
            >
              ESPACIO DE TRABAJO
            </Typography>
          )}

          <List disablePadding>
            {opcionesMenu.map((opcion) => {
              const activo = location.pathname === opcion.ruta;

              return (
                <Tooltip
                  key={opcion.ruta}
                  title={menuAbierto ? "" : opcion.texto}
                  placement="right"
                >
                  <ListItemButton
                    selected={activo}
                    onClick={() => seleccionarOpcion(opcion.ruta)}
                    sx={{
                      minHeight: 48,
                      mb: 0.7,
                      px: menuAbierto ? 1.7 : 0,
                      justifyContent: menuAbierto ? "flex-start" : "center",
                      borderRadius: 2.5,
                      color: activo ? "#ea580c" : "#64748b",
                      bgcolor: activo ? "#fff7ed" : "transparent",
                      position: "relative",
                      "&.Mui-selected": {
                        bgcolor: "#fff7ed",
                      },
                      "&.Mui-selected:hover": {
                        bgcolor: "#ffedd5",
                      },
                      "&:hover": {
                        bgcolor: activo ? "#ffedd5" : "#f8fafc",
                      },
                      "&::before": activo
                        ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "22%",
                            height: "56%",
                            width: 3,
                            borderRadius: "0 4px 4px 0",
                            bgcolor: "#f97316",
                          }
                        : {},
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: menuAbierto ? 38 : "auto",
                        justifyContent: "center",
                        color: "inherit",
                      }}
                    >
                      {opcion.icono}
                    </ListItemIcon>

                    {menuAbierto && (
                      <ListItemText
                        primary={opcion.texto}
                        primaryTypographyProps={{
                          fontSize: 13,
                          fontWeight: activo ? 800 : 600,
                        }}
                      />
                    )}

                    {menuAbierto && activo && (
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#f97316",
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              );
            })}
          </List>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* TARJETA INFORMATIVA */}
        {menuAbierto && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: "#fff7ed",
                border: "1px solid #ffedd5",
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#ffedd5",
                  color: "#ea580c",
                  mb: 1.5,
                }}
              >
                <StoreIcon fontSize="small" />
              </Box>

              <Typography
                sx={{ fontSize: 12, fontWeight: 800, color: "#9a3412" }}
              >
                Tu negocio, organizado
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 11,
                  lineHeight: 1.6,
                  color: "#c2410c",
                }}
              >
                Administra tus productos y coordina los domicilios desde un solo lugar.
              </Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ borderColor: "#e9edf3" }} />

        <Box
          sx={{
            px: menuAbierto ? 2.5 : 0,
            py: 2,
            textAlign: menuAbierto ? "left" : "center",
          }}
        >
          {menuAbierto ? (
            <>
              <Typography sx={{ fontSize: 10, color: "#94a3b8" }}>
                APP DOMI
              </Typography>
              <Typography sx={{ fontSize: 10, color: "#cbd5e1", mt: 0.3 }}>
                Gestión de domicilios
              </Typography>
            </>
          ) : (
            <Typography sx={{ fontSize: 11, fontWeight: 900, color: "#f97316" }}>
              AD
            </Typography>
          )}
        </Box>
      </Drawer>

      {/* CONTENIDO PRINCIPAL */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100vh",
          mt: "72px",
          p: { xs: 2, sm: 3, lg: 4 },
          overflowX: "hidden",
        }}
      >
        {/* ENCABEZADO */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Chip
                label="PANEL GENERAL"
                size="small"
                sx={{
                  bgcolor: "#fff7ed",
                  color: "#ea580c",
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  borderRadius: 1.5,
                }}
              />
            </Stack>

            <Typography
              sx={{
                fontSize: { xs: 27, md: 32 },
                fontWeight: 900,
                letterSpacing: "-1.1px",
                color: "#0f172a",
                lineHeight: 1.25,
              }}
            >
              {opcionActual.texto}
            </Typography>

            <Typography
              sx={{ mt: 1, fontSize: 13, color: "#94a3b8" }}
            >
              Administra tus pedidos, productos y entregas desde un solo lugar.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => seleccionarOpcion("/productos")}
            sx={{
              alignSelf: { xs: "stretch", sm: "center" },
              bgcolor: "#f97316",
              color: "#ffffff",
              px: 2.5,
              py: 1.3,
              borderRadius: 2.5,
              fontSize: 13,
              fontWeight: 800,
              textTransform: "none",
              boxShadow: "0 5px 14px rgba(249,115,22,0.18)",
              "&:hover": {
                bgcolor: "#ea580c",
                boxShadow: "0 7px 18px rgba(249,115,22,0.24)",
              },
            }}
          >
            Nuevo producto
          </Button>
        </Stack>

        {/* TARJETAS DE RESUMEN */}
        <Grid container spacing={2.2}>
          {resumen.map((item) => (
            <Grid key={item.titulo} size={{ xs: 12, sm: 6, xl: 3 }}>
              <Card
                onClick={() => seleccionarOpcion(item.ruta)}
                elevation={0}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  border: "1px solid #e9edf3",
                  borderRadius: 3.5,
                  bgcolor: "#ffffff",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: `${item.color}70`,
                    boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.7, "&:last-child": { pb: 2.7 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#64748b",
                      }}
                    >
                      {item.titulo}
                    </Typography>

                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 2.5,
                        bgcolor: item.fondo,
                        color: item.color,
                      }}
                    >
                      {item.icono}
                    </Box>
                  </Stack>

                  <Typography
                    sx={{
                      mt: 2,
                      fontSize: 29,
                      fontWeight: 900,
                      color: "#0f172a",
                      letterSpacing: "-0.8px",
                    }}
                  >
                    {item.valor}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mt: 1 }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                      {item.descripcion}
                    </Typography>

                    <ArrowForwardIcon
                      sx={{ fontSize: 17, color: "#cbd5e1" }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* SECCIÓN INFERIOR */}
        <Grid container spacing={2.5} sx={{ mt: 0.8 }}>
          <Grid size={{ xs: 12, lg: 7.5 }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                minHeight: 320,
                p: { xs: 2.5, sm: 3 },
                border: "1px solid #e9edf3",
                borderRadius: 3.5,
                bgcolor: "#ffffff",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography
                    sx={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}
                  >
                    Actividad reciente
                  </Typography>

                  <Typography
                    sx={{ fontSize: 12, color: "#94a3b8", mt: 0.6 }}
                  >
                    Resumen de la actividad de tu negocio
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    bgcolor: "#f1f5f9",
                    color: "#64748b",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <TrendingUpIcon />
                </Box>
              </Stack>

              <Divider sx={{ my: 2.5, borderColor: "#f1f5f9" }} />

              <Box
                sx={{
                  minHeight: 190,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 4,
                    bgcolor: "#f8fafc",
                    color: "#94a3b8",
                    mb: 2,
                  }}
                >
                  <ShoppingBagIcon sx={{ fontSize: 30 }} />
                </Box>

                <Typography
                  sx={{ fontSize: 14, fontWeight: 800, color: "#334155" }}
                >
                  Todo está listo para comenzar
                </Typography>

                <Typography
                  sx={{
                    mt: 0.8,
                    fontSize: 12,
                    color: "#94a3b8",
                    maxWidth: 310,
                    lineHeight: 1.7,
                  }}
                >
                  Cuando registres pedidos, aquí podrás consultar la actividad más reciente.
                </Typography>

                <Button
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => seleccionarOpcion("/pedidos")}
                  sx={{
                    mt: 2,
                    textTransform: "none",
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#ea580c",
                  }}
                >
                  Ir a pedidos
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 4.5 }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                minHeight: 320,
                p: { xs: 2.5, sm: 3 },
                border: "1px solid #e9edf3",
                borderRadius: 3.5,
                bgcolor: "#ffffff",
              }}
            >
              <Typography
                sx={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}
              >
                Accesos rápidos
              </Typography>

              <Typography
                sx={{ fontSize: 12, color: "#94a3b8", mt: 0.6, mb: 2.5 }}
              >
                Accede a las tareas más frecuentes
              </Typography>

              <Stack spacing={1.3}>
                {[
                  {
                    texto: "Registrar producto",
                    descripcion: "Añade productos al catálogo",
                    icono: <InventoryIcon />,
                    ruta: "/productos",
                    color: "#059669",
                    fondo: "#ecfdf5",
                  },
                  {
                    texto: "Consultar pedidos",
                    descripcion: "Revisa los pedidos registrados",
                    icono: <ShoppingBagIcon />,
                    ruta: "/pedidos",
                    color: "#2563eb",
                    fondo: "#eff6ff",
                  },
                  {
                    texto: "Gestionar domiciliarios",
                    descripcion: "Administra el equipo de entregas",
                    icono: <PersonIcon />,
                    ruta: "/domiciliarios",
                    color: "#7c3aed",
                    fondo: "#f5f3ff",
                  },
                ].map((acceso) => (
                  <Box
                    key={acceso.ruta}
                    onClick={() => seleccionarOpcion(acceso.ruta)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      border: "1px solid #f1f5f9",
                      borderRadius: 2.5,
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      "&:hover": {
                        bgcolor: "#f8fafc",
                        borderColor: "#e2e8f0",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        borderRadius: 2.5,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: acceso.fondo,
                        color: acceso.color,
                      }}
                    >
                      {acceso.icono}
                    </Box>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: "#334155",
                        }}
                      >
                        {acceso.texto}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.4,
                          fontSize: 10,
                          color: "#94a3b8",
                          lineHeight: 1.5,
                        }}
                      >
                        {acceso.descripcion}
                      </Typography>
                    </Box>

                    <ArrowForwardIcon
                      sx={{ fontSize: 17, color: "#cbd5e1" }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* PIE DE PÁGINA */}
        <Box
          sx={{
            mt: 4,
            pt: 2.5,
            borderTop: "1px solid #e9edf3",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
            © App Domi · Panel administrativo
          </Typography>

          <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
            Gestión de pedidos y domicilios
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
