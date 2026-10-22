
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";

const COLORES = {
  fondo: "#f5f6f8",
  blanco: "#ffffff",
  texto: "#1d2939",
  secundario: "#667085",
  borde: "#e4e7ec",
  naranja: "#ed6b23",
  naranjaHover: "#d95b16",
};

const validarCorreo = (correo) => {
  const valor = correo.trim();

  if (!valor) return "Ingresa tu correo electrónico.";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    return "Ingresa un correo válido.";
  }

  return "";
};

const campoSx = {
  "& .MuiInputLabel-root": {
    color: COLORES.secundario,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: COLORES.naranja,
  },
  "& .MuiOutlinedInput-root": {
    color: COLORES.texto,
    bgcolor: COLORES.blanco,
    borderRadius: 2,
    "& fieldset": {
      borderColor: COLORES.borde,
    },
    "&:hover fieldset": {
      borderColor: "#cbd0d8",
    },
    "&.Mui-focused fieldset": {
      borderColor: COLORES.naranja,
      borderWidth: 1,
    },
  },
  "& .MuiFormHelperText-root": {
    mx: 0,
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

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Por ahora permite entrar sin correo ni contraseña.
  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/menu-principal");
  };

  const notify = (message, severity = "info") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const abrirRecuperacion = () => {
    setResetEmail(email);
    setResetError("");
    setForgotOpen(true);
  };

  const handleResetSubmit = (event) => {
    event.preventDefault();

    const error = validarCorreo(resetEmail);
    setResetError(error);

    if (error) return;

    setForgotOpen(false);

    notify(
      "La recuperación estará disponible cuando conectes el servicio.",
      "info"
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: COLORES.fondo,
        p: 2,
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 410,
          boxSizing: "border-box",
          p: { xs: 3, sm: 4 },
          bgcolor: COLORES.blanco,
          border: `1px solid ${COLORES.borde}`,
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(16, 24, 40, 0.05)",
        }}
      >
        {/* Logo */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{ mb: 4 }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              borderRadius: 2,
              bgcolor: COLORES.naranja,
              color: "#ffffff",
              fontSize: 20,
              fontWeight: 800,
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
            APP DOMI
          </Typography>
        </Stack>

        {/* Encabezado */}
        <Box sx={{ mb: 3.5 }}>
          <Typography
            sx={{
              fontSize: 27,
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: -1,
              color: COLORES.texto,
            }}
          >
            Iniciar sesión
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: 13,
              color: COLORES.secundario,
            }}
          >
            Ingresa para continuar.
          </Typography>
        </Box>

        {/* Formulario */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.25}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="nombre@ejemplo.com"
              sx={campoSx}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              sx={campoSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      sx={{ color: COLORES.secundario }}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlined fontSize="small" />
                      ) : (
                        <VisibilityOutlined fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
            }}
          >
            <Button
              type="button"
              onClick={abrirRecuperacion}
              sx={{
                p: 0,
                minWidth: 0,
                fontSize: 12,
                fontWeight: 600,
                color: COLORES.naranja,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "transparent",
                  color: COLORES.naranjaHover,
                },
              }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              ...botonPrincipalSx,
              mt: 3,
              minHeight: 46,
              fontSize: 14,
            }}
          >
            Ingresar
          </Button>
        </Box>
      </Paper>

      {/* Diálogo de recuperación */}
      <Dialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            bgcolor: COLORES.blanco,
            borderRadius: 3,
            border: `1px solid ${COLORES.borde}`,
          },
        }}
      >
        <Box component="form" onSubmit={handleResetSubmit} noValidate>
          <DialogTitle
            sx={{
              color: COLORES.texto,
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            Recuperar contraseña
          </DialogTitle>

          <DialogContent>
            <Typography
              sx={{
                color: COLORES.secundario,
                fontSize: 13,
                lineHeight: 1.7,
                mb: 2.5,
              }}
            >
              Ingresa el correo asociado a tu cuenta.
            </Typography>

            <TextField
              fullWidth
              autoFocus
              label="Correo electrónico"
              type="email"
              value={resetEmail}
              onChange={(event) => {
                setResetEmail(event.target.value);
                setResetError("");
              }}
              error={Boolean(resetError)}
              helperText={resetError}
              sx={campoSx}
            />
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button
              onClick={() => setForgotOpen(false)}
              sx={{
                color: COLORES.secundario,
                textTransform: "none",
              }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={botonPrincipalSx}
            >
              Continuar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;

          setToast((prev) => ({ ...prev, open: false }));
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() =>
            setToast((prev) => ({ ...prev, open: false }))
          }
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
