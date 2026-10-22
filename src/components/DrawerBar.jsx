
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const DRAWER_WIDTH = 248;
const DRAWER_CLOSED_WIDTH = 76;
const APPBAR_HEIGHT = 72;

const COLORES = {
  fondo: "#ffffff",
  texto: "#202939",
  secundario: "#7b8494",
  borde: "#edf0f4",
  naranja: "#ed6b23",
  naranjaClaro: "#fff4ec",
  hover: "#f8f9fb",
};

const OPCIONES_MENU = [
  {
    texto: "Panel principal",
    ruta: "/menu",
    icono: <DashboardOutlinedIcon />,
  },
  {
    texto: "Pedidos",
    ruta: "/pedidos",
    icono: <ShoppingBagOutlinedIcon />,
  },
  {
    texto: "Productos",
    ruta: "/productos",
    icono: <Inventory2OutlinedIcon />,
  },
  {
    texto: "Categorías",
    ruta: "/categorias",
    icono: <CategoryOutlinedIcon />,
  },
  {
    texto: "Domiciliarios",
    ruta: "/domiciliarios",
    icono: <TwoWheelerOutlinedIcon />,
  },
  {
    texto: "Reportes",
    ruta: "/reportes",
    icono: <BarChartOutlinedIcon />,
  },
  {
    texto: "Configuración",
    ruta: "/configuracion",
    icono: <SettingsOutlinedIcon />,
  },
];

export default function DrawerBar({
  open = true,
  onClose = () => {},
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const esMovil = useMediaQuery(theme.breakpoints.down("md"));
  const mostrarTexto = open || esMovil;

  const ancho = esMovil
    ? DRAWER_WIDTH
    : open
      ? DRAWER_WIDTH
      : DRAWER_CLOSED_WIDTH;

  const rutaActiva = (ruta) => {
    const pathname = location.pathname;

    if (ruta === "/menu" && pathname === "/") {
      return true;
    }

    return pathname === ruta || pathname.startsWith(`${ruta}/`);
  };

  const seleccionarOpcion = (ruta) => {
    navigate(ruta);

    if (esMovil) {
      onClose();
    }
  };

  return (
    <Drawer
      variant={esMovil ? "temporary" : "permanent"}
      open={esMovil ? open : true}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: esMovil ? 0 : ancho,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: ancho,
          boxSizing: "border-box",
          overflowX: "hidden",
          bgcolor: COLORES.fondo,
          color: COLORES.texto,
          borderRight: `1px solid ${COLORES.borde}`,
          transition: theme.transitions.create("width", {
            duration: theme.transitions.duration.shortest,
          }),
        },
      }}
    >
      {/* Espacio debajo del AppBar */}
      <Toolbar
        sx={{
          minHeight: `${APPBAR_HEIGHT}px !important`,
        }}
      />

      {/* Navegación principal */}
      <Box sx={{ px: 1.5, pt: 3, pb: 2 }}>
        {mostrarTexto && (
          <Typography
            sx={{
              px: 1.5,
              mb: 1.5,
              color: "#a0a7b3",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.3,
            }}
          >
            MENÚ PRINCIPAL
          </Typography>
        )}

        <List
          disablePadding
          aria-label="Navegación principal"
        >
          {OPCIONES_MENU.map((opcion) => {
            const activa = rutaActiva(opcion.ruta);

            return (
              <Tooltip
                key={opcion.ruta}
                title={!mostrarTexto ? opcion.texto : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  selected={activa}
                  onClick={() => seleccionarOpcion(opcion.ruta)}
                  aria-current={activa ? "page" : undefined}
                  aria-label={opcion.texto}
                  sx={{
                    position: "relative",
                    minHeight: 45,
                    mb: 0.65,
                    px: mostrarTexto ? 1.6 : 0,
                    justifyContent: mostrarTexto
                      ? "flex-start"
                      : "center",
                    borderRadius: 2,
                    color: activa
                      ? COLORES.naranja
                      : COLORES.secundario,
                    transition: "background-color 0.18s ease",
                    "&.Mui-selected": {
                      bgcolor: COLORES.naranjaClaro,
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "#ffeadb",
                    },
                    "&:hover": {
                      bgcolor: activa
                        ? COLORES.naranjaClaro
                        : COLORES.hover,
                    },
                    "&::before": activa
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "25%",
                          height: "50%",
                          width: 3,
                          bgcolor: COLORES.naranja,
                          borderRadius: "0 3px 3px 0",
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: mostrarTexto ? 37 : "auto",
                      justifyContent: "center",
                      color: "inherit",
                      "& .MuiSvgIcon-root": {
                        fontSize: 21,
                      },
                    }}
                  >
                    {opcion.icono}
                  </ListItemIcon>

                  {mostrarTexto && (
                    <ListItemText
                      primary={opcion.texto}
                      primaryTypographyProps={{
                        fontSize: 12.5,
                        fontWeight: activa ? 700 : 500,
                        letterSpacing: 0.05,
                      }}
                    />
                  )}

                  {mostrarTexto && activa && (
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        flexShrink: 0,
                        borderRadius: "50%",
                        bgcolor: COLORES.naranja,
                        ml: 1,
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

      {/* Pie del menú */}
      <Box sx={{ px: mostrarTexto ? 2 : 1.25, pb: 2 }}>
        {mostrarTexto ? (
          <Box
            sx={{
              px: 1.5,
              py: 1.75,
              borderRadius: 2,
              bgcolor: "#fafbfc",
              border: `1px solid ${COLORES.borde}`,
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                color: COLORES.texto,
                fontWeight: 700,
              }}
            >
              APP DOMI
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                fontSize: 10,
                lineHeight: 1.6,
                color: COLORES.secundario,
              }}
            >
              Gestión de pedidos y domicilios
            </Typography>
          </Box>
        ) : (
          <Tooltip title="APP DOMI" placement="right" arrow>
            <Box
              sx={{
                height: 40,
                display: "grid",
                placeItems: "center",
                border: `1px solid ${COLORES.borde}`,
                borderRadius: 2,
                fontSize: 11,
                fontWeight: 800,
                color: COLORES.naranja,
              }}
            >
              AD
            </Box>
          </Tooltip>
        )}
      </Box>

      <Divider sx={{ borderColor: COLORES.borde }} />

      <Box
        sx={{
          px: mostrarTexto ? 2 : 0,
          py: 1.75,
          textAlign: mostrarTexto ? "left" : "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 9.5,
            fontWeight: 500,
            color: "#a0a7b3",
          }}
        >
          {mostrarTexto ? "Panel administrativo" : "v1"}
        </Typography>
      </Box>
    </Drawer>
  );
}
