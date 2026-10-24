
import React, { useEffect, useState } from "react";

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

const FORMULARIO_INICIAL = {
  nombre: "",
  documento: "",
  telefono: "",
  correo: "",
  vehiculo: "Motocicleta",
  placa: "",
  estado: true,
};

const TIPOS_VEHICULO = [
  "Motocicleta",
  "Bicicleta",
  "Automóvil",
  "A pie",
];

export default function DialogoDomiciliario({
  abierto = false,
  domiciliario = null,
  guardando = false,
  onCerrar = () => {},
  onGuardar = () => {},
}) {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const esEdicion = Boolean(domiciliario);

  useEffect(() => {
    if (!abierto) return;

    if (domiciliario) {
      setFormulario({
        nombre: domiciliario.nombre ?? "",
        documento: domiciliario.documento ?? "",
        telefono: domiciliario.telefono ?? "",
        correo: domiciliario.correo ?? "",
        vehiculo: domiciliario.vehiculo ?? "Motocicleta",
        placa: domiciliario.placa ?? "",
        estado:
          domiciliario.estado === true ||
          domiciliario.estado === 1 ||
          domiciliario.estado === "1" ||
          String(domiciliario.estado).toLowerCase() === "true",
      });
    } else {
      setFormulario({ ...FORMULARIO_INICIAL });
    }

    setErrores({});
    setErrorGeneral("");
  }, [abierto, domiciliario]);

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));

    setErrores((actual) => ({
      ...actual,
      [name]: "",
    }));

    setErrorGeneral("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    const nombre = formulario.nombre.trim();
    const documento = formulario.documento.trim();
    const telefono = formulario.telefono.trim();
    const correo = formulario.correo.trim();
    const placa = formulario.placa.trim();

    if (!nombre) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (nombre.length < 3) {
      nuevosErrores.nombre = "Ingresa al menos 3 caracteres.";
    }

    if (!documento) {
      nuevosErrores.documento = "El documento es obligatorio.";
    } else if (!/^\d{6,15}$/.test(documento)) {
      nuevosErrores.documento =
        "El documento debe contener entre 6 y 15 dígitos.";
    }

    if (!telefono) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (!/^3\d{9}$/.test(telefono)) {
      nuevosErrores.telefono =
        "Ingresa un celular colombiano de 10 dígitos que empiece por 3.";
    }

    if (
      correo &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
    ) {
      nuevosErrores.correo = "Ingresa un correo válido.";
    }

    if (!TIPOS_VEHICULO.includes(formulario.vehiculo)) {
      nuevosErrores.vehiculo = "Selecciona un vehículo válido.";
    }

    if (
      formulario.vehiculo === "Motocicleta" &&
      !placa
    ) {
      nuevosErrores.placa =
        "La placa es obligatoria para motocicleta.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();

    if (guardando || !validarFormulario()) return;

    setErrorGeneral("");

    const datos = {
      nombre: formulario.nombre.trim(),
      documento: formulario.documento.trim(),
      telefono: formulario.telefono.trim(),
      correo: formulario.correo.trim() || null,
      vehiculo: formulario.vehiculo,
      placa: formulario.placa.trim() || null,
      estado: formulario.estado,
    };

    try {
      await onGuardar(datos);
    } catch (error) {
      setErrorGeneral(
        error.message || "No fue posible guardar el domiciliario."
      );
    }
  };

  const manejarCierre = () => {
    if (!guardando) onCerrar();
  };

  return (
    <Dialog
      open={abierto}
      onClose={manejarCierre}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={manejarEnvio} noValidate>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {esEdicion
            ? "Actualizar domiciliario"
            : "Registrar domiciliario"}
        </DialogTitle>

        <DialogContent dividers>
          {errorGeneral && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorGeneral}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ pt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="nombre"
                label="Nombre completo"
                value={formulario.nombre}
                onChange={manejarCambio}
                error={Boolean(errores.nombre)}
                helperText={errores.nombre}
                disabled={guardando}
                autoFocus
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="documento"
                label="Documento"
                value={formulario.documento}
                onChange={manejarCambio}
                error={Boolean(errores.documento)}
                helperText={errores.documento}
                disabled={guardando}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    maxLength: 15,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="telefono"
                label="Teléfono celular"
                value={formulario.telefono}
                onChange={manejarCambio}
                error={Boolean(errores.telefono)}
                helperText={errores.telefono}
                disabled={guardando}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    maxLength: 10,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="correo"
                label="Correo electrónico (opcional)"
                type="email"
                value={formulario.correo}
                onChange={manejarCambio}
                error={Boolean(errores.correo)}
                helperText={errores.correo}
                disabled={guardando}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                required
                name="vehiculo"
                label="Tipo de vehículo"
                value={formulario.vehiculo}
                onChange={manejarCambio}
                error={Boolean(errores.vehiculo)}
                helperText={errores.vehiculo}
                disabled={guardando}
              >
                {TIPOS_VEHICULO.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="placa"
                label={
                  formulario.vehiculo === "Motocicleta"
                    ? "Placa (obligatoria)"
                    : "Placa (opcional)"
                }
                value={formulario.placa}
                onChange={manejarCambio}
                error={Boolean(errores.placa)}
                helperText={errores.placa}
                disabled={guardando}
              />
            </Grid>

            {esEdicion && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  name="estado"
                  label="Estado del domiciliario"
                  value={formulario.estado ? "activo" : "inactivo"}
                  onChange={(event) =>
                    setFormulario((actual) => ({
                      ...actual,
                      estado: event.target.value === "activo",
                    }))
                  }
                  disabled={guardando}
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                </TextField>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={manejarCierre}
            disabled={guardando}
            color="inherit"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={guardando}
            startIcon={
              guardando ? (
                <CircularProgress size={18} color="inherit" />
              ) : null
            }
          >
            {guardando
              ? "Guardando..."
              : esEdicion
                ? "Actualizar"
                : "Registrar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
