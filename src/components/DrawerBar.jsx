
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
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

const DRAWER_WIDTH = 250;
const DRAWER_CLOSED_WIDTH = 76;

const COLORES = {
  blanco: "#ffffff",
  texto: "#202939",
  secundario: "#64748b",
  borde: "#e9edf3",
  naranja: "#f97316",
  naranjaClaro: "#fff7ed",
};

const opcionesMenu = [
  {
    texto: "Panel principal",
    ruta: "/menuPrincipal",
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
    icono: <AssessmentOutlinedIcon />,
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

  const ancho = esMovil
    ? DRAWER_WIDTH
    : open
      ? DRAWER_WIDTH
      : DRAWER_CLOSED_WIDTH;

  const rutaActiva = (ruta) => {
    if (ruta === "/menuPrincipal" && location.pathname === "/") {
      return true;
    }

    return (
      location.pathname === ruta ||
      location.pathname.startsWith(`${ruta}/`)
    );
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
        width: ancho,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: ancho,
          boxSizing: "border-box",
          overflowX: "hidden",
          bgcolor: COLORES.blanco,
          color: COLORES.texto,
          borderRight: `1px solid ${COLORES.borde}`,
          transition: "width 0.22s ease",
        },
      }}
    >
      <Toolbar sx={{ minHeight: "72px !important" }} />

      <Box sx={{ px: 1.5, py: 3 }}>
        {open && (
          <Typography
            sx={{
              px: 1.5,
              mb: 1.5,
              fontSize: 10,
              fontWeight: 800,
              color: "#94a3b8",
              letterSpacing: 1,
            }}
          >
            ESPACIO DE TRABAJO
          </Typography>
        )}

        <List disablePadding>
          {opcionesMenu.map((opcion) => {
            const activa = rutaActiva(opcion.ruta);

            return (
              <Tooltip
                key={opcion.ruta}
                title={!esMovil && !open ? opcion.texto : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  selected={activa}
                  onClick={() => seleccionarOpcion(opcion.ruta)}
                  aria-current={activa ? "page" : undefined}
                  sx={{
                    minHeight: 48,
                    mb: 0.7,
                    px: open || esMovil ? 1.7 : 0,
                    justifyContent:
                      open || esMovil ? "flex-start" : "center",
                    borderRadius: 2.5,
                    position: "relative",
                    color: activa
                      ? "#ea580c"
                      : COLORES.secundario,
                    "&.Mui-selected": {
                      bgcolor: COLORES.naranjaClaro,
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "#ffedd5",
                    },
                    "&:hover": {
                      bgcolor: activa
                        ? "#ffedd5"
                        : "#f8fafc",
                    },
                    "&::before": activa
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "22%",
                          height: "56%",
                          width: 3,
                          borderRadius: "0 4px 4px 0",
                          bgcolor: COLORES.naranja,
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: open || esMovil ? 38 : "auto",
                      justifyContent: "center",
                      color: "inherit",
                    }}
                  >
                    {opcion.icono}
                  </ListItemIcon>

                  {(open || esMovil) && (
                    <ListItemText
                      primary={opcion.texto}
                      primaryTypographyProps={{
                        fontSize: 13,
                        fontWeight: activa ? 700 : 500,
                      }}
                    />
                  )}

                  {(open || esMovil) && activa && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        flexShrink: 0,
                        borderRadius: "50%",
                        bgcolor: COLORES.naranja,
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

      {(open || esMovil) && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Box
            sx={{
              p: 2,
              bgcolor: COLORES.naranjaClaro,
              border: "1px solid #ffedd5",
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                mb: 1.5,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: "#ffedd5",
                color: "#ea580c",
              }}
            >
              <StorefrontOutlinedIcon fontSize="small" />
            </Box>

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                color: "#9a3412",
              }}
            >
              APP DOMI
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 11,
                lineHeight: 1.6,
                color: "#c2410c",
              }}
            >
              Gestión de pedidos y domicilios.
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ borderColor: COLORES.borde }} />

      <Box
        sx={{
          px: open || esMovil ? 2.5 : 0,
          py: 2,
          textAlign: open || esMovil ? "left" : "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 700,
            color: "#94a3b8",
          }}
        >
          {open || esMovil ? "Panel administrativo" : "AD"}
        </Typography>
      </Box>
    </Drawer>
  );
}
