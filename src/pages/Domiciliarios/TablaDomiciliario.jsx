
import React from "react";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const COLORES = {
  texto: "#202939",
  secundario: "#667085",
  borde: "#e4e7ec",
  naranja: "#ed6b23",
};

const obtenerEstado = (estado) =>
  estado === true || estado === "true";

export default function TablaDomiciliarios({
  domiciliarios = [],
  cargando = false,
  onEditar = () => {},
  onCambiarEstado = () => {},
  onEliminar = () => {},
}) {
  const lista = Array.isArray(domiciliarios)
    ? domiciliarios
    : [];

  return (
    <Box>
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
          {lista.length} resultados
        </Typography>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${COLORES.borde}`,
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 850 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              {[
                "Domiciliario",
                "Documento",
                "Teléfono",
                "Vehículo",
                "Placa",
                "Estado",
                "Acciones",
              ].map((columna) => (
                <TableCell
                  key={columna}
                  sx={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: COLORES.secundario,
                    whiteSpace: "nowrap",
                  }}
                >
                  {columna}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress
                    size={28}
                    sx={{ color: COLORES.naranja }}
                  />

                  <Typography sx={{ mt: 1, fontSize: 13 }}>
                    Cargando domiciliarios...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : lista.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
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
                    Prueba con otra búsqueda o registra uno nuevo.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              lista.map((domiciliario) => {
                const activo = obtenerEstado(domiciliario.estado);

                return (
                  <TableRow
                    key={domiciliario.id}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell sx={{ minWidth: 190 }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: COLORES.texto,
                        }}
                      >
                        {domiciliario.nombre || "Sin nombre"}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.4,
                          fontSize: 11,
                          color: COLORES.secundario,
                        }}
                      >
                        {domiciliario.correo || "Sin correo"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {domiciliario.documento || "—"}
                    </TableCell>

                    <TableCell>
                      {domiciliario.telefono || "—"}
                    </TableCell>

                    <TableCell>
                      {domiciliario.vehiculo || "—"}
                    </TableCell>

                    <TableCell>
                      {domiciliario.vehiculo === "Motocicleta"
                        ? domiciliario.placa || "Sin placa"
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={activo ? "Activo" : "Inactivo"}
                        color={activo ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                      >
                        <Switch
                          size="small"
                          checked={activo}
                          disabled={cargando}
                          onChange={() =>
                            onCambiarEstado(domiciliario)
                          }
                          color="warning"
                          inputProps={{
                            "aria-label":
                              `Cambiar estado de ${domiciliario.nombre}`,
                          }}
                        />

                        <Button
                          size="small"
                          disabled={cargando}
                          onClick={() => onEditar(domiciliario)}
                          sx={{
                            minWidth: 0,
                            textTransform: "none",
                            fontWeight: 700,
                            color: COLORES.texto,
                          }}
                        >
                          Editar
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          disabled={cargando}
                          onClick={() => onEliminar(domiciliario)}
                          sx={{
                            minWidth: 0,
                            textTransform: "none",
                          }}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
