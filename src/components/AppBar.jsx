
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  AppBar as MuiAppBar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const COLORES = {
  blanco: "#ffffff",
  texto: "#202939",
  secundario: "#667085",
  borde: "#e4e7ec",
  naranja: "#ed6b23",
  naranjaHover: "#d95b16",
  naranjaClaro: "#fff1e8",
};

const OPCIONES_MENU = [
  {
    nombre: "Inicio",
    ruta: "/menu-principal",
  },
  {
    nombre: "Pedidos",
    ruta: "/pedidos/registro",
  },
  {
    nombre: "Domiciliario",
    ruta: "/domiciliario",
  },
];

export default function AppBarComponent({
  titulo = "APP DOMI",
  opciones = OPCIONES_MENU,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));

  const [menuAbierto, setMenuAbierto] = useState(false);

  const navegar = (ruta) => {
    navigate(ruta);
    setMenuAbierto(false);
  };

  const rutaActiva = (ruta) => location.pathname === ruta;

  return (
    <>
      <MuiAppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: COLORES.blanco,
          color: COLORES.texto,
          borderBottom: `1px solid ${COLORES.borde}`,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: "68px !important",
            px: { xs: 2, md: 4 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1400,
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Marca */}
            <Box
              onClick={() => navegar("/menu-principal")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: COLORES.naranja,
                  color: COLORES.blanco,
                  borderRadius: 2,
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                D
              </Box>

              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: -0.4,
                  color: COLORES.texto,
                }}
              >
                {titulo}
              </Typography>
            </Box>

            {/* Navegación escritorio */}
            {!esMovil && (
              <Box
                component="nav"
                aria-label="Navegación principal"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                {opciones.map((opcion) => {
                  const activa = rutaActiva(opcion.ruta);

                  return (
                    <Button
                      key={opcion.ruta}
                      onClick={() => navegar(opcion.ruta)}
                      aria-current={activa ? "page" : undefined}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        color: activa
                          ? COLORES.naranjaHover
                          : COLORES.secundario,
                        bgcolor: activa
                          ? COLORES.naranjaClaro
                          : "transparent",
                        fontSize: 13,
                        fontWeight: activa ? 700 : 500,
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          bgcolor: COLORES.naranjaClaro,
                          color: COLORES.naranjaHover,
                        },
                      }}
                    >
                      {opcion.nombre}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* Botón móvil */}
            {esMovil && (
              <Button
                onClick={() => setMenuAbierto(true)}
                sx={{
                  color: COLORES.texto,
                  border: `1px solid ${COLORES.borde}`,
                  borderRadius: 2,
                  px: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Menú
              </Button>
            )}
          </Box>
        </Toolbar>
      </MuiAppBar>

      {/* Navegación móvil */}
      <Drawer
        anchor="right"
        open={menuAbierto}
        onClose={() => setMenuAbierto(false)}
        PaperProps={{
          sx: {
            width: 280,
            maxWidth: "85vw",
            bgcolor: COLORES.blanco,
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                bgcolor: COLORES.naranja,
                color: COLORES.blanco,
                borderRadius: 2,
                fontWeight: 800,
              }}
            >
              D
            </Box>

            <Typography fontWeight={800} color={COLORES.texto}>
              {titulo}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: COLORES.borde, mb: 2 }} />

          <List disablePadding>
            {opciones.map((opcion) => {
              const activa = rutaActiva(opcion.ruta);

              return (
                <ListItemButton
                  key={opcion.ruta}
                  selected={activa}
                  onClick={() => navegar(opcion.ruta)}
                  sx={{
                    mb: 0.75,
                    borderRadius: 2,
                    color: activa
                      ? COLORES.naranjaHover
                      : COLORES.texto,
                    "&.Mui-selected": {
                      bgcolor: COLORES.naranjaClaro,
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: COLORES.naranjaClaro,
                    },
                  }}
                >
                  <ListItemText
                    primary={opcion.nombre}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: activa ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
