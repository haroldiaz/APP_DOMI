
import React, { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const COLORES = {
  fondo: "#f6f7f9",
  blanco: "#ffffff",
  texto: "#202939",
  secundario: "#667085",
  borde: "#e4e7ec",
  naranja: "#ed6b23",
  naranjaHover: "#d95b16",
  verde: "#15803d",
};

const domiciliariosIniciales = [
  {
    id: 1,
    nombre: "Carlos Ramírez",
    documento: "1112345678",
    telefono: "3001234567",
    correo: "carlos@ejemplo.com",
    vehiculo: "Motocicleta",
    placa: "ABC12D",
    estado: true,
  },
  {
    id: 2,
    nombre: "Andrés Gómez",
    documento: "1098765432",
    telefono: "3101234567",
    correo: "andres@ejemplo.com",
    vehiculo: "Bicicleta",
    placa: "",
    estado: true,
  },
  {
    id: 3,
    nombre: "Daniel Torres",
    documento: "1001234567",
    telefono: "3201234567",
    correo: "daniel@ejemplo.com",
    vehiculo: "Motocicleta",
    placa: "XYZ45A",
    estado: false,
  },
];

const formularioInicial = {
  nombre: "",
  documento: "",
  telefono: "",
  correo: "",
  vehiculo: "Motocicleta",
  placa: "",
  estado: true,
};

const campoSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#fff",
  },
};

const botonPrincipalSx = {
  minHeight: 42,
  px: 2.5,
  bgcolor: COLORES.naranja,
  borderRadius: 2,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: COLORES.naranjaHover,
    boxShadow: "none",
  },
};

export default function DomiciliariosPage() {
  const [domiciliarios, setDomiciliarios] = useState(
    domiciliariosIniciales
  );

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [domiciliarioEditando, setDomiciliarioEditando] =
    useState(null);

  const [formulario, setFormulario] = useState({
    ...formularioInicial,
  });

  const [errores, setErrores] = useState({});

  const [mensaje, setMensaje] = useState({
    abierto: false,
    texto: "",
    tipo: "success",
  });

  const notificar = (texto, tipo = "success") => {
    setMensaje({
      abierto: true,
      texto,
      tipo,
    });
  };

  // Estadísticas
  const estadisticas = useMemo(() => {
    const activos = domiciliarios.filter(
      (domiciliario) => domiciliario.estado
    ).length;

    return {
      total: domiciliarios.length,
      activos,
      inactivos: domiciliarios.length - activos,
    };
  }, [domiciliarios]);

  // Búsqueda y filtros
  const domiciliariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return domiciliarios.filter((domiciliario) => {
      const coincideBusqueda = [
        domiciliario.nombre,
        domiciliario.documento,
        domiciliario.telefono,
        domiciliario.correo,
        domiciliario.vehiculo,
        domiciliario.placa,
      ].some((valor) =>
        String(valor || "").toLowerCase().includes(termino)
      );

      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && domiciliario.estado) ||
        (filtroEstado === "inactivos" && !domiciliario.estado);

      return coincideBusqueda && coincideEstado;
    });
  }, [domiciliarios, busqueda, filtroEstado]);

  // Abrir formulario de creación
  const abrirCrear = () => {
    setDomiciliarioEditando(null);
    setFormulario({ ...formularioInicial });
    setErrores({});
    setDialogoAbierto(true);
  };

  // Abrir formulario de edición
  const abrirEditar = (domiciliario) => {
    setDomiciliarioEditando(domiciliario);
    setFormulario({ ...domiciliario });
    setErrores({});
    setDialogoAbierto(true);
  };

  // Cerrar formulario
  const cerrarDialogo = () => {
    setDialogoAbierto(false);
    setDomiciliarioEditando(null);
    setErrores({});
  };

  // Actualizar campos
  const cambiarCampo = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));

    setErrores((actuales) => ({
      ...actuales,
      [campo]: "",
    }));
  };

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "Ingresa el nombre completo.";
    }

    if (!/^\d{6,15}$/.test(formulario.documento.trim())) {
      nuevosErrores.documento =
        "El documento debe tener entre 6 y 15 dígitos.";
    }

    if (!/^3\d{9}$/.test(formulario.telefono.trim())) {
      nuevosErrores.telefono =
        "Ingresa un celular colombiano válido de 10 dígitos.";
    }

    if (
      formulario.correo.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formulario.correo.trim()
      )
    ) {
      nuevosErrores.correo = "Ingresa un correo válido.";
    }

    const placa = formulario.placa.trim().toUpperCase();

    if (
      formulario.vehiculo === "Motocicleta" &&
      !placa
    ) {
      nuevosErrores.placa =
        "Ingresa la placa de la motocicleta.";
    }

    const documentoDuplicado = domiciliarios.some(
      (domiciliario) =>
        domiciliario.documento === formulario.documento.trim() &&
        domiciliario.id !== domiciliarioEditando?.id
    );

    if (documentoDuplicado) {
      nuevosErrores.documento =
        "Este documento ya está registrado.";
    }

    const placaDuplicada =
      formulario.vehiculo === "Motocicleta" &&
      domiciliarios.some(
        (domiciliario) =>
          domiciliario.vehiculo === "Motocicleta" &&
          domiciliario.placa.trim().toUpperCase() === placa &&
          domiciliario.id !== domiciliarioEditando?.id
      );

    if (placaDuplicada) {
      nuevosErrores.placa = "Esta placa ya está registrada.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  // Guardar nuevo domiciliario o editar uno existente
  const guardarDomiciliario = (event) => {
    event.preventDefault();

    if (!validarFormulario()) return;

    const datos = {
      ...formulario,
      nombre: formulario.nombre.trim(),
      documento: formulario.documento.trim(),
      telefono: formulario.telefono.trim(),
      correo: formulario.correo.trim(),
      placa:
        formulario.vehiculo === "Motocicleta"
          ? formulario.placa.trim().toUpperCase()
          : "",
    };

    if (domiciliarioEditando) {
      setDomiciliarios((actuales) =>
        actuales.map((domiciliario) =>
          domiciliario.id === domiciliarioEditando.id
            ? { ...domiciliario, ...datos }
            : domiciliario
        )
      );

      notificar("Domiciliario actualizado correctamente.");
    } else {
      const nuevoId =
        domiciliarios.reduce(
          (mayor, domiciliario) =>
            Math.max(mayor, Number(domiciliario.id) || 0),
          0
        ) + 1;

      setDomiciliarios((actuales) => [
        ...actuales,
        { ...datos, id: nuevoId },
      ]);

      notificar("Domiciliario registrado correctamente.");
    }

    cerrarDialogo();
  };

  // Activar o desactivar
  const cambiarEstado = (domiciliario) => {
    const nuevoEstado = !domiciliario.estado;

    setDomiciliarios((actuales) =>
      actuales.map((actual) =>
        actual.id === domiciliario.id
          ? { ...actual, estado: nuevoEstado }
          : actual
      )
    );

    notificar(
      nuevoEstado
        ? "Domiciliario activado."
        : "Domiciliario desactivado.",
      "info"
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        boxSizing: "border-box",
        bgcolor: COLORES.fondo,
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Encabezado */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 25, sm: 30 },
                fontWeight: 800,
                letterSpacing: -0.8,
                color: COLORES.texto,
              }}
            >
              Domiciliarios
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                fontSize: 14,
                color: COLORES.secundario,
              }}
            >
              Gestiona el personal encargado de las entregas.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirCrear}
            sx={botonPrincipalSx}
          >
            Nuevo domiciliario
          </Button>
        </Stack>

        {/* Estadísticas */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            {
              titulo: "Total domiciliarios",
              valor: estadisticas.total,
            },
            {
              titulo: "Domiciliarios activos",
              valor: estadisticas.activos,
            },
            {
              titulo: "Domiciliarios inactivos",
              valor: estadisticas.inactivos,
            },
          ].map((item) => (
            <Grid item xs={12} sm={4} key={item.titulo}>
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
                <Typography
                  sx={{
                    fontSize: 12,
                    color: COLORES.secundario,
                  }}
                >
                  {item.titulo}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 30,
                    lineHeight: 1.3,
                    fontWeight: 800,
                    color: COLORES.texto,
                  }}
                >
                  {item.valor}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Búsqueda y filtros */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            border: `1px solid ${COLORES.borde}`,
            borderRadius: 3,
            bgcolor: COLORES.blanco,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                size="small"
                label="Buscar domiciliario"
                placeholder="Nombre, documento, teléfono o placa"
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
                }
                sx={campoSx}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Estado"
                value={filtroEstado}
                onChange={(event) =>
                  setFiltroEstado(event.target.value)
                }
                sx={campoSx}
              >
                <MenuItem value="todos">Todos los estados</MenuItem>
                <MenuItem value="activos">Activos</MenuItem>
                <MenuItem value="inactivos">Inactivos</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Listado */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 800,
              color: COLORES.texto,
            }}
          >
            Personal registrado
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: COLORES.secundario,
            }}
          >
            {domiciliariosFiltrados.length} resultados
          </Typography>
        </Stack>

        {domiciliariosFiltrados.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              border: `1px solid ${COLORES.borde}`,
              borderRadius: 3,
              bgcolor: COLORES.blanco,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: COLORES.texto,
              }}
            >
              No se encontraron domiciliarios.
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 13,
                color: COLORES.secundario,
              }}
            >
              Cambia los filtros o registra un nuevo domiciliario.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {domiciliariosFiltrados.map((domiciliario) => (
              <Grid
                item
                xs={12}
                md={6}
                key={domiciliario.id}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    height: "100%",
                    boxSizing: "border-box",
                    border: `1px solid ${COLORES.borde}`,
                    borderRadius: 3,
                    bgcolor: COLORES.blanco,
                    transition: "border-color 0.2s",
                    "&:hover": {
                      borderColor: "#f2b38f",
                    },
                  }}
                >
                  {/* Nombre y estado */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: COLORES.texto,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {domiciliario.nombre}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: 12,
                          color: COLORES.secundario,
                        }}
                      >
                        Documento: {domiciliario.documento}
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      label={
                        domiciliario.estado ? "Activo" : "Inactivo"
                      }
                      color={
                        domiciliario.estado ? "success" : "default"
                      }
                      variant="outlined"
                    />
                  </Stack>

                  <Box
                    sx={{
                      my: 2,
                      borderTop: `1px solid ${COLORES.borde}`,
                    }}
                  />

                  {/* Información */}
                  <Stack spacing={1.75}>
                    <CampoInformacion
                      etiqueta="TELÉFONO"
                      valor={domiciliario.telefono}
                    />

                    <CampoInformacion
                      etiqueta="CORREO ELECTRÓNICO"
                      valor={domiciliario.correo || "No registrado"}
                    />

                    <CampoInformacion
                      etiqueta="VEHÍCULO"
                      valor={domiciliario.vehiculo}
                    />

                    {domiciliario.vehiculo === "Motocicleta" && (
                      <CampoInformacion
                        etiqueta="PLACA"
                        valor={domiciliario.placa || "No registrada"}
                      />
                    )}
                  </Stack>

                  {/* Acciones */}
                  <Box
                    sx={{
                      mt: 2.5,
                      pt: 1.5,
                      borderTop: `1px solid ${COLORES.borde}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                    >
                      <Switch
                        size="small"
                        checked={domiciliario.estado}
                        onChange={() =>
                          cambiarEstado(domiciliario)
                        }
                        color="warning"
                        inputProps={{
                          "aria-label": domiciliario.estado
                            ? "Desactivar domiciliario"
                            : "Activar domiciliario",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: domiciliario.estado
                            ? COLORES.verde
                            : COLORES.secundario,
                        }}
                      >
                        {domiciliario.estado ? "Activo" : "Inactivo"}
                      </Typography>
                    </Stack>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => abrirEditar(domiciliario)}
                      sx={{
                        minHeight: 36,
                        px: 1.5,
                        borderColor: COLORES.borde,
                        color: COLORES.texto,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          borderColor: COLORES.naranja,
                          bgcolor: "#fff7f2",
                        },
                      }}
                    >
                      Editar
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Formulario de creación y edición */}
      <Dialog
        open={dialogoAbierto}
        onClose={cerrarDialogo}
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          onSubmit={guardarDomiciliario}
          noValidate
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              fontWeight: 800,
              color: COLORES.texto,
            }}
          >
            {domiciliarioEditando
              ? "Editar domiciliario"
              : "Nuevo domiciliario"}

            <IconButton
              onClick={cerrarDialogo}
              aria-label="Cerrar formulario"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  color: COLORES.secundario,
                }}
              >
                Ingresa los datos personales y la información del
                vehículo del domiciliario.
              </Typography>

              <TextField
                fullWidth
                required
                label="Nombre completo"
                value={formulario.nombre}
                onChange={(event) =>
                  cambiarCampo("nombre", event.target.value)
                }
                error={Boolean(errores.nombre)}
                helperText={errores.nombre}
                sx={campoSx}
              />

              <TextField
                fullWidth
                required
                label="Número de documento"
                value={formulario.documento}
                inputProps={{ maxLength: 15 }}
                onChange={(event) =>
                  cambiarCampo(
                    "documento",
                    event.target.value.replace(/\D/g, "").slice(0, 15)
                  )
                }
                error={Boolean(errores.documento)}
                helperText={errores.documento}
                sx={campoSx}
              />

              <TextField
                fullWidth
                required
                label="Teléfono celular"
                value={formulario.telefono}
                inputProps={{ maxLength: 10 }}
                onChange={(event) =>
                  cambiarCampo(
                    "telefono",
                    event.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                error={Boolean(errores.telefono)}
                helperText={errores.telefono}
                sx={campoSx}
              />

              <TextField
                fullWidth
                type="email"
                label="Correo electrónico (opcional)"
                value={formulario.correo}
                onChange={(event) =>
                  cambiarCampo("correo", event.target.value)
                }
                error={Boolean(errores.correo)}
                helperText={errores.correo}
                sx={campoSx}
              />

              <TextField
                select
                fullWidth
                required
                label="Tipo de vehículo"
                value={formulario.vehiculo}
                onChange={(event) => {
                  const vehiculo = event.target.value;

                  setFormulario((actual) => ({
                    ...actual,
                    vehiculo,
                    placa:
                      vehiculo === "Motocicleta"
                        ? actual.placa
                        : "",
                  }));

                  setErrores((actuales) => ({
                    ...actuales,
                    placa: "",
                  }));
                }}
                sx={campoSx}
              >
                <MenuItem value="Motocicleta">
                  Motocicleta
                </MenuItem>
                <MenuItem value="Bicicleta">Bicicleta</MenuItem>
                <MenuItem value="Automóvil">Automóvil</MenuItem>
                <MenuItem value="A pie">A pie</MenuItem>
              </TextField>

              {formulario.vehiculo === "Motocicleta" && (
                <TextField
                  fullWidth
                  required
                  label="Placa de la motocicleta"
                  value={formulario.placa}
                  onChange={(event) =>
                    cambiarCampo("placa", event.target.value)
                  }
                  error={Boolean(errores.placa)}
                  helperText={errores.placa}
                  inputProps={{ maxLength: 10 }}
                  sx={campoSx}
                />
              )}

              {domiciliarioEditando && (
                <Box
                  sx={{
                    p: 1.5,
                    border: `1px solid ${COLORES.borde}`,
                    borderRadius: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: COLORES.texto,
                        }}
                      >
                        Estado del domiciliario
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.25,
                          fontSize: 12,
                          color: COLORES.secundario,
                        }}
                      >
                        {formulario.estado ? "Activo" : "Inactivo"}
                      </Typography>
                    </Box>

                    <Switch
                      checked={formulario.estado}
                      onChange={(event) =>
                        cambiarCampo("estado", event.target.checked)
                      }
                      color="warning"
                    />
                  </Stack>
                </Box>
              )}
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2.5,
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={cerrarDialogo}
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
              {domiciliarioEditando
                ? "Guardar cambios"
                : "Registrar domiciliario"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={mensaje.abierto}
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;

          setMensaje((actual) => ({
            ...actual,
            abierto: false,
          }));
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={mensaje.tipo}
          variant="filled"
          onClose={() =>
            setMensaje((actual) => ({
              ...actual,
              abierto: false,
            }))
          }
        >
          {mensaje.texto}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function CampoInformacion({ etiqueta, valor }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: 0.6,
          color: COLORES.secundario,
        }}
      >
        {etiqueta}
      </Typography>

      <Typography
        sx={{
          mt: 0.4,
          fontSize: 13,
          fontWeight: 600,
          color: COLORES.texto,
          overflowWrap: "anywhere",
        }}
      >
        {valor}
      </Typography>
    </Box>
  );
}
