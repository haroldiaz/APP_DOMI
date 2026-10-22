
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(null);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const notify = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const cerrarToast = (_, reason) => {
    if (reason === "clickaway") return;

    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const cambiarCorreo = (event) => {
    const valor = event.target.value;
    setEmail(valor);

    if (emailTouched) {
      setEmailError(validarCorreo(valor));
    }
  };

  const cambiarPassword = (event) => {
    const valor = event.target.value;
    setPassword(valor);

    if (passwordTouched) {
      setPasswordError(
        !valor.trim()
          ? "Ingresa tu contraseña."
          : valor.length < 6
            ? "Debe tener al menos 6 caracteres."
            : ""
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setEmailTouched(true);
    setPasswordTouched(true);

    const errorCorreo = validarCorreo(email);

    const errorPassword = !password.trim()
      ? "Ingresa tu contraseña."
      : password.length < 6
        ? "Debe tener al menos 6 caracteres."
        : "";

    setEmailError(errorCorreo);
    setPasswordError(errorPassword);

    if (errorCorreo || errorPassword) return;

    setIsLoading(true);

    try {
      // Acceso de demostración. No consulta un backend.
      await new Promise((resolve) => setTimeout(resolve, 500));

      const correoNormalizado = email.trim().toLowerCase();

      if (
        correoNormalizado !== "demo@domi.com" ||
        password !== "123456"
      ) {
        notify("Correo o contraseña incorrectos.", "error");
        return;
      }

      setUserLoggedIn({
        email: correoNormalizado,
      });

      notify("Acceso de demostración concedido.");
    } finally {
      setIsLoading(false);
    }
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
      "La recuperación estará disponible al conectar el servicio.",
      "info"
    );
  };

  const cerrarSesion = () => {
    setUserLoggedIn(null);
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
    setEmailTouched(false);
    setPasswordTouched(false);
    setShowPassword(false);

    notify("Sesión de demostración cerrada.", "info");
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
        {/* Marca */}
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

        {userLoggedIn ? (
          <Stack spacing={2.5}>
            <Box>
              <Typography
                sx={{
                  fontSize: 25,
                  fontWeight: 800,
                  letterSpacing: -0.8,
                  color: COLORES.texto,
                  mb: 1,
                }}
              >
                Sesión iniciada
              </Typography>

              <Typography sx={{ color: COLORES.secundario, fontSize: 14 }}>
                {userLoggedIn.email}
              </Typography>
            </Box>

            <Alert severity="info">
              Este acceso es una demostración. Todavía no hay conexión con
              el backend.
            </Alert>

            <Button
              fullWidth
              variant="contained"
              onClick={cerrarSesion}
              sx={botonSecundarioSx}
            >
              Cerrar sesión
            </Button>
          </Stack>
        ) : (
          <>
            {/* Título */}
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
                Ingresa tus datos para continuar.
              </Typography>
            </Box>

            {/* Formulario */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.25}>
                <TextField
                  fullWidth
                  size="medium"
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={cambiarCorreo}
                  onBlur={() => {
                    setEmailTouched(true);
                    setEmailError(validarCorreo(email));
                  }}
                  error={emailTouched && Boolean(emailError)}
                  helperText={emailTouched ? emailError : ""}
                  autoComplete="email"
                  placeholder="nombre@ejemplo.com"
                  sx={campoSx}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={cambiarPassword}
                  onBlur={() => {
                    setPasswordTouched(true);
                    setPasswordError(
                      !password.trim()
                        ? "Ingresa tu contraseña."
                        : password.length < 6
                          ? "Debe tener al menos 6 caracteres."
                          : ""
                    );
                  }}
                  error={passwordTouched && Boolean(passwordError)}
                  helperText={passwordTouched ? passwordError : ""}
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
                          sx={{
                            color: COLORES.secundario,
                          }}
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

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
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
                disabled={isLoading}
                sx={{
                  mt: 3,
                  minHeight: 46,
                  borderRadius: 2,
                  bgcolor: COLORES.naranja,
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: COLORES.naranjaHover,
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#f4b18d",
                    color: "#ffffff",
                  },
                }}
              >
                {isLoading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={17} color="inherit" />
                    <span>Verificando...</span>
                  </Stack>
                ) : (
                  "Ingresar"
                )}
              </Button>
            </Box>

            {/* Credenciales de prueba */}
            <Box
              sx={{
                mt: 3,
                p: 1.5,
                bgcolor: "#f9fafb",
                border: `1px solid ${COLORES.borde}`,
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  color: COLORES.secundario,
                  fontSize: 11,
                  lineHeight: 1.8,
                  textAlign: "center",
                }}
              >
                Demo: demo@domi.com · 123456
              </Typography>
            </Box>
          </>
        )}
      </Paper>

      {/* Recuperación */}
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
            boxShadow: "0 16px 40px rgba(16, 24, 40, 0.12)",
          },
        }}
      >
        <Box component="form" onSubmit={handleResetSubmit} noValidate>
          <DialogTitle
            sx={{
              color: COLORES.texto,
              fontSize: 20,
              fontWeight: 800,
              pb: 1,
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

            <Button type="submit" variant="contained" sx={botonPrincipalSx}>
              Continuar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={cerrarToast}
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

const botonSecundarioSx = {
  color: COLORES.texto,
  bgcolor: "#ffffff",
  border: `1px solid ${COLORES.borde}`,
  borderRadius: 2,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#f9fafb",
    boxShadow: "none",
  },
};
