
import React from "react";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const COLORES = {
  texto: "#172033",
  secundario: "#667085",
  borde: "#e8ecf2",
  naranja: "#f97316",
  naranjaHover: "#ea580c",
  naranjaClaro: "#fff3e8",
  blanco: "#ffffff",
};

const campoSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    bgcolor: COLORES.blanco,
    "& fieldset": {
      borderColor: COLORES.borde,
    },
    "&:hover fieldset": {
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused fieldset": {
      borderColor: COLORES.naranja,
      borderWidth: 1.5,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: COLORES.naranja,
  },
};

const botonPrincipalSx = {
  bgcolor: COLORES.naranja,
  color: "#ffffff",
  borderRadius: 2.5,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "0 4px 10px rgba(249, 115, 22, 0.16)",
  "&:hover": {
    bgcolor: COLORES.naranjaHover,
    boxShadow: "0 6px 14px rgba(249, 115, 22, 0.22)",
  },
  "&:disabled": {
    bgcolor: "#fed7aa",
    color: "#ffffff",
  },
};

export default function DialogoProducto({
  open,
  onClose,
  onSubmit,
  formulario,
  actualizarCampo,
  productoSeleccionado,
  guardando = false,
}) {
  const esDuplicado =
    !productoSeleccionado &&
    formulario.nombre.trim().endsWith("(copia)");

  const esEdicion = Boolean(productoSeleccionado);

  const titulo = esEdicion
    ? "Editar producto"
    : esDuplicado
      ? "Duplicar producto"
      : "Nuevo producto";

  const descripcion = esEdicion
    ? "Actualiza la información del producto."
    : esDuplicado
      ? "Verifica los datos y guarda la nueva copia."
      : "Completa la información para agregarlo al catálogo.";

  const textoBoton = guardando
    ? "Guardando..."
    : esEdicion
      ? "Guardar cambios"
      : esDuplicado
        ? "Guardar copia"
        : "Registrar producto";

  function manejarCambio(campo) {
    return (evento) => {
      actualizarCampo(campo, evento.target.value);
    };
  }

  return (
    <Dialog
      open={open}
      onClose={guardando ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.16)",
        },
      }}
    >
      <Box component="form" onSubmit={onSubmit}>
        {/* ENCABEZADO */}
        <DialogTitle sx={{ px: 3, pt: 3, pb: 2 }}>
          <Stack
            direction="row"
            alignItems="flex-start"
            spacing={1.5}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                bgcolor: COLORES.naranjaClaro,
                color: COLORES.naranja,
                flexShrink: 0,
              }}
            >
              {esEdicion ? (
                <EditOutlinedIcon />
              ) : (
                <AddRoundedIcon />
              )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 850,
                  letterSpacing: "-0.5px",
                }}
              >
                {titulo}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: COLORES.secundario,
                }}
              >
                {descripcion}
              </Typography>
            </Box>

            <IconButton
              onClick={onClose}
              disabled={guardando}
              size="small"
              aria-label="Cerrar formulario"
              sx={{
                color: "#98a2b3",
                mt: -0.5,
                mr: -1,
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider sx={{ borderColor: COLORES.borde }} />

        {/* CAMPOS */}
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={2.2}>
            <TextField
              label="Nombre del producto"
              value={formulario.nombre}
              onChange={manejarCambio("nombre")}
              fullWidth
              required
              autoFocus
              disabled={guardando}
              inputProps={{ maxLength: 150 }}
              sx={campoSx}
            />

            <TextField
              label="Descripción"
              value={formulario.descripcion}
              onChange={manejarCambio("descripcion")}
              fullWidth
              multiline
              minRows={2}
              disabled={guardando}
              inputProps={{ maxLength: 500 }}
              sx={campoSx}
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <TextField
                label="Precio (COP)"
                type="number"
                value={formulario.precio}
                onChange={manejarCambio("precio")}
                inputProps={{ min: 0, step: "0.01" }}
                fullWidth
                required
                disabled={guardando}
                sx={campoSx}
              />

              <TextField
                label="Stock disponible"
                type="number"
                value={formulario.stock}
                onChange={manejarCambio("stock")}
                inputProps={{ min: 0, step: 1 }}
                fullWidth
                required
                disabled={guardando}
                sx={campoSx}
              />
            </Stack>

            <TextField
              label="URL de imagen (opcional)"
              type="url"
              value={formulario.imagen_url}
              onChange={manejarCambio("imagen_url")}
              fullWidth
              disabled={guardando}
              sx={campoSx}
            />

            {esEdicion && (
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
                disabled={guardando}
                sx={campoSx}
              >
                <MenuItem value="true">Disponible</MenuItem>
                <MenuItem value="false">No disponible</MenuItem>
              </TextField>
            )}
          </Stack>
        </DialogContent>

        <Divider sx={{ borderColor: COLORES.borde }} />

        {/* BOTONES */}
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={onClose}
            color="inherit"
            disabled={guardando}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2.5,
              px: 2,
            }}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={guardando}
            startIcon={
              !guardando ? (
                esEdicion ? (
                  <EditOutlinedIcon />
                ) : (
                  <AddRoundedIcon />
                )
              ) : undefined
            }
            sx={{
              ...botonPrincipalSx,
              minWidth: 170,
              py: 1.1,
            }}
          >
            {guardando ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              textoBoton
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
