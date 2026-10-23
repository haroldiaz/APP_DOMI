
import React, { useMemo, useState, useEffect } from "react";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

const COLORES = {
  blanco: "#ffffff",
  texto: "#172033",
  secundario: "#667085",
  borde: "#e8ecf2",
  naranja: "#f97316",
  naranjaClaro: "#fff3e8",
  verde: "#16a34a",
  verdeClaro: "#ecfdf3",
  rojo: "#dc2626",
};

const cabeceraTablaSx = {
  fontWeight: 800,
  fontSize: 11,
  color: COLORES.secundario,
  textTransform: "uppercase",
  letterSpacing: "0.7px",
  whiteSpace: "nowrap",
  py: 2,
  borderBottom: `1px solid ${COLORES.borde}`,
};

const celdaTablaSx = {
  py: 1.8,
  borderBottom: `1px solid ${COLORES.borde}`,
};

const campoFiltroSx = {
  minWidth: { xs: "100%", sm: 170 },
  "& .MuiOutlinedInput-root": {
    bgcolor: "#fafbfc",
    borderRadius: 2.5,
    minHeight: 42,
    fontSize: 13,
    "& fieldset": {
      borderColor: COLORES.borde,
    },
    "&:hover fieldset": {
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused fieldset": {
      borderColor: COLORES.naranja,
    },
  },
};

export default function TablaProductos({
  productos = [],
  cargando = false,
  busqueda = "",
  setBusqueda,
  onCrear,
  onEditar,
  onEliminar,
  onDuplicar,
  formatoPrecio = (precio) => `$${Number(precio || 0).toLocaleString("es-CO")}`,
}) {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroStock, setFiltroStock] = useState("todos");
  const [filasPorPagina, setFilasPorPagina] = useState(10);
  const [pagina, setPagina] = useState(0);

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const disponible =
        producto.disponible !== undefined
          ? Boolean(producto.disponible)
          : Boolean(producto.estado);

      const stock = Number(producto.stock || 0);

      if (filtroEstado === "disponibles" && !disponible) {
        return false;
      }

      if (filtroEstado === "inactivos" && disponible) {
        return false;
      }

      if (filtroStock === "sin-stock" && stock > 0) {
        return false;
      }

      if (
        filtroStock === "stock-bajo" &&
        (stock <= 0 || stock > 5)
      ) {
        return false;
      }

      if (filtroStock === "con-stock" && stock <= 5) {
        return false;
      }

      return true;
    });
  }, [productos, filtroEstado, filtroStock]);

  const totalPaginas = Math.ceil(
    productosFiltrados.length / filasPorPagina
  );

  const productosPagina = useMemo(() => {
    const inicio = pagina * filasPorPagina;

    return productosFiltrados.slice(
      inicio,
      inicio + filasPorPagina
    );
  }, [productosFiltrados, pagina, filasPorPagina]);

  useEffect(() => {
    setPagina(0);
  }, [busqueda, filtroEstado, filtroStock, filasPorPagina]);

  useEffect(() => {
    if (totalPaginas > 0 && pagina >= totalPaginas) {
      setPagina(totalPaginas - 1);
    }
  }, [pagina, totalPaginas]);

  const limpiarFiltros = () => {
    setFiltroEstado("todos");
    setFiltroStock("todos");
    if (setBusqueda) setBusqueda("");
    setPagina(0);
  };

  const filtrosActivos =
    filtroEstado !== "todos" ||
    filtroStock !== "todos" ||
    Boolean(busqueda);

  const renderEstado = (producto) => {
    const disponible =
      producto.disponible !== undefined
        ? Boolean(producto.disponible)
        : Boolean(producto.estado);

    return (
      <Chip
        size="small"
        label={disponible ? "Disponible" : "Inactivo"}
        icon={
          disponible ? (
            <CheckCircleOutlineRoundedIcon />
          ) : undefined
        }
        sx={{
          height: 27,
          fontSize: 11,
          fontWeight: 700,
          borderRadius: 2,
          bgcolor: disponible ? COLORES.verdeClaro : "#f2f4f7",
          color: disponible ? "#15803d" : COLORES.secundario,
          "& .MuiChip-icon": {
            color: "inherit",
            fontSize: 15,
            ml: 0.7,
          },
        }}
      />
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${COLORES.borde}`,
        borderRadius: 3.5,
        overflow: "hidden",
        bgcolor: COLORES.blanco,
        boxShadow: "0 4px 18px rgba(15, 23, 42, 0.025)",
      }}
    >
      {/* ENCABEZADO */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderBottom: `1px solid ${COLORES.borde}`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: "-0.3px",
                color: COLORES.texto,
              }}
            >
              Catálogo de productos
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12,
                color: COLORES.secundario,
              }}
            >
              Consulta, filtra y administra tus productos.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`${productosFiltrados.length} ${
                productosFiltrados.length === 1
                  ? "resultado"
                  : "resultados"
              }`}
              size="small"
              sx={{
                bgcolor: "#f1f5f9",
                color: "#475569",
                fontWeight: 700,
                borderRadius: 2,
                height: 28,
              }}
            />

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={onCrear}
              sx={{
                bgcolor: COLORES.naranja,
                color: "#fff",
                textTransform: "none",
                fontWeight: 750,
                borderRadius: 2.5,
                boxShadow: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#ea580c",
                  boxShadow: "none",
                },
              }}
            >
              Nuevo
            </Button>
          </Stack>
        </Stack>

        {/* BÚSQUEDA Y FILTROS */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.2}
          sx={{ mt: 2.5 }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por nombre, descripción o código..."
            value={busqueda}
            onChange={(evento) => setBusqueda?.(evento.target.value)}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fafbfc",
                borderRadius: 2.5,
                minHeight: 42,
                "& fieldset": {
                  borderColor: COLORES.borde,
                },
                "&:hover fieldset": {
                  borderColor: "#cbd5e1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: COLORES.naranja,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ color: "#98a2b3", fontSize: 21 }}
                  />
                </InputAdornment>
              ),
              endAdornment: busqueda ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Limpiar búsqueda"
                    onClick={() => setBusqueda?.("")}
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />

          <TextField
            select
            size="small"
            label="Estado"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            sx={campoFiltroSx}
          >
            <MenuItem value="todos">Todos los estados</MenuItem>
            <MenuItem value="disponibles">Disponible</MenuItem>
            <MenuItem value="inactivos">Inactivo</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Inventario"
            value={filtroStock}
            onChange={(evento) => setFiltroStock(evento.target.value)}
            sx={campoFiltroSx}
          >
            <MenuItem value="todos">Todo el stock</MenuItem>
            <MenuItem value="sin-stock">Sin existencias</MenuItem>
            <MenuItem value="stock-bajo">Stock bajo (1–5)</MenuItem>
            <MenuItem value="con-stock">Stock mayor a 5</MenuItem>
          </TextField>
        </Stack>

        {filtrosActivos && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 1.5 }}
          >
            <Stack direction="row" spacing={0.7} alignItems="center">
              <FilterListRoundedIcon
                sx={{ fontSize: 17, color: COLORES.secundario }}
              />
              <Typography sx={{ fontSize: 12, color: COLORES.secundario }}>
                Filtros aplicados
              </Typography>
            </Stack>

            <Button
              size="small"
              onClick={limpiarFiltros}
              sx={{
                textTransform: "none",
                color: COLORES.naranja,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Limpiar filtros
            </Button>
          </Stack>
        )}
      </Box>

      {/* TABLA */}
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 850 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafbfc" }}>
              <TableCell sx={cabeceraTablaSx}>Producto</TableCell>
              <TableCell sx={cabeceraTablaSx}>Precio</TableCell>
              <TableCell sx={cabeceraTablaSx}>Stock</TableCell>
              <TableCell sx={cabeceraTablaSx}>Estado</TableCell>
              <TableCell align="right" sx={cabeceraTablaSx}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 8, borderBottom: 0 }}
                >
                  <CircularProgress
                    size={30}
                    sx={{ color: COLORES.naranja }}
                  />
                  <Typography
                    sx={{
                      mt: 1.5,
                      fontSize: 13,
                      color: COLORES.secundario,
                    }}
                  >
                    Cargando productos...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : productosPagina.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 7, borderBottom: 0 }}
                >
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      mx: "auto",
                      mb: 2,
                      borderRadius: 3,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "#f1f5f9",
                      color: "#94a3b8",
                    }}
                  >
                    <Inventory2OutlinedIcon sx={{ fontSize: 28 }} />
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 750,
                      fontSize: 15,
                      color: COLORES.texto,
                    }}
                  >
                    {filtrosActivos
                      ? "No se encontraron resultados"
                      : "Todavía no tienes productos"}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.7,
                      fontSize: 13,
                      color: COLORES.secundario,
                    }}
                  >
                    {filtrosActivos
                      ? "Prueba cambiando la búsqueda o los filtros."
                      : "Registra tu primer producto para comenzar."}
                  </Typography>

                  {filtrosActivos ? (
                    <Button
                      onClick={limpiarFiltros}
                      sx={{
                        mt: 1.5,
                        color: COLORES.naranja,
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  ) : (
                    <Button
                      onClick={onCrear}
                      startIcon={<AddRoundedIcon />}
                      sx={{
                        mt: 1.5,
                        color: COLORES.naranja,
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      Crear producto
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              productosPagina.map((producto) => {
                const stock = Number(producto.stock || 0);

                return (
                  <TableRow
                    key={producto.id}
                    hover
                    sx={{
                      transition: "background-color 0.15s ease",
                      "&:last-child td": { borderBottom: 0 },
                      "&:hover": { bgcolor: "#fcfcfd" },
                    }}
                  >
                    <TableCell sx={celdaTablaSx}>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ minWidth: 230 }}
                      >
                        {producto.imagen_url ? (
                          <Box
                            component="img"
                            src={producto.imagen_url}
                            alt={producto.nombre || "Producto"}
                            onError={(evento) => {
                              evento.currentTarget.style.visibility = "hidden";
                            }}
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2.5,
                              objectFit: "cover",
                              bgcolor: "#f1f5f9",
                              border: `1px solid ${COLORES.borde}`,
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2.5,
                              bgcolor: COLORES.naranjaClaro,
                              color: COLORES.naranja,
                              display: "grid",
                              placeItems: "center",
                              fontWeight: 900,
                              fontSize: 18,
                              flexShrink: 0,
                            }}
                          >
                            {producto.nombre?.charAt(0)?.toUpperCase() || "P"}
                          </Box>
                        )}

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 750,
                              color: COLORES.texto,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {producto.nombre}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.4,
                              fontSize: 12,
                              color: COLORES.secundario,
                              maxWidth: 320,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {producto.descripcion || "Sin descripción"}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.5,
                              fontSize: 10,
                              color: "#98a2b3",
                              fontWeight: 600,
                            }}
                          >
                            ID: {producto.id}
                            {producto.codigo ? ` · Código: ${producto.codigo}` : ""}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell
                      sx={{ ...celdaTablaSx, whiteSpace: "nowrap" }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 750,
                          color: COLORES.texto,
                        }}
                      >
                        {formatoPrecio(producto.precio)}
                      </Typography>
                    </TableCell>

                    <TableCell sx={celdaTablaSx}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 750,
                          color:
                            stock <= 0
                              ? COLORES.rojo
                              : stock <= 5
                                ? "#d97706"
                                : COLORES.texto,
                        }}
                      >
                        {stock}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.3,
                          fontSize: 11,
                          color: COLORES.secundario,
                        }}
                      >
                        unidades
                      </Typography>
                    </TableCell>

                    <TableCell sx={celdaTablaSx}>
                      {renderEstado(producto)}
                    </TableCell>

                    <TableCell align="right" sx={celdaTablaSx}>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={0.6}
                      >
                        <Tooltip title="Editar producto">
                          <IconButton
                            size="small"
                            onClick={() => onEditar?.(producto)}
                            aria-label={`Editar ${producto.nombre}`}
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: 2,
                              color: "#475569",
                              border: `1px solid ${COLORES.borde}`,
                              "&:hover": {
                                color: COLORES.naranja,
                                bgcolor: COLORES.naranjaClaro,
                                borderColor: "#fed7aa",
                              },
                            }}
                          >
                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Duplicar producto">
                          <IconButton
                            size="small"
                            onClick={() => onDuplicar?.(producto)}
                            aria-label={`Duplicar ${producto.nombre}`}
                            disabled={!onDuplicar}
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: 2,
                              color: "#475569",
                              border: `1px solid ${COLORES.borde}`,
                              "&:hover": {
                                color: "#2563eb",
                                bgcolor: "#eff6ff",
                                borderColor: "#bfdbfe",
                              },
                            }}
                          >
                            <ContentCopyRoundedIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Desactivar producto">
                          <IconButton
                            size="small"
                            onClick={() => onEliminar?.(producto)}
                            aria-label={`Desactivar ${producto.nombre}`}
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: 2,
                              color: "#98a2b3",
                              border: `1px solid ${COLORES.borde}`,
                              "&:hover": {
                                color: COLORES.rojo,
                                bgcolor: "#fef2f2",
                                borderColor: "#fecaca",
                              },
                            }}
                          >
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINACIÓN */}
      {!cargando && productosFiltrados.length > 0 && (
        <Box
          sx={{
            borderTop: `1px solid ${COLORES.borde}`,
            bgcolor: "#fafbfc",
          }}
        >
          <TablePagination
            component="div"
            count={productosFiltrados.length}
            page={pagina}
            onPageChange={(_, nuevaPagina) => setPagina(nuevaPagina)}
            rowsPerPage={filasPorPagina}
            onRowsPerPageChange={(evento) => {
              setFilasPorPagina(Number(evento.target.value));
              setPagina(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count}`
            }
            sx={{
              ".MuiTablePagination-toolbar": {
                minHeight: 58,
                px: { xs: 1, sm: 2 },
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                fontSize: 12,
                color: COLORES.secundario,
              },
              ".MuiTablePagination-select": {
                fontSize: 12,
              },
              ".MuiTablePagination-actions button": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
}
