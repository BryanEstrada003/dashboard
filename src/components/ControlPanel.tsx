import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState, useRef } from "react";
import WeatherChart from "./WeatherChart";
import Grid from '@mui/material/Grid'; 

interface Config {
  listas: Array<Array<Array<string | number>>>;
}

export default function ControlPanel({ listas }: Config) {
  const [chartData, setChartData] = useState<(string | number)[][]>([]);
  const [tituloElegido, setTituloElegido] = useState<{ title: string; curveType: string }>({ title: "", curveType: "" });


  const descriptionRef = useRef<HTMLDivElement>(null);


  const humedadesTitle = {
    title: "Humedad vs Hora",
    curveType: "function",
  };
  const nubosidadesTitle = {
    title: "Nubosidad vs Hora",
    curveType: "function",
  };
  const temperaturasTitle = {
    title: "Temperatura vs Hora",
    curveType: "function",
  };


  const titulos = [
    humedadesTitle,
    nubosidadesTitle,
    temperaturasTitle,
  ];

  const descripciones = [
    
    {
      name: "Humedad",
      description:
        "Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje.",
    },
    {
      name: "Nubosidad",
      description:
        "Grado de cobertura del cielo por nubes, afectando la visibilidad y la cantidad de luz solar recibida.",
    },
    {
      name: "Temperatura",
      description:
        "Medida de la energía cinética promedio de las partículas de un sistema, generalmente expresada en grados Celsius.",
    },
    
  ];

  

  const options = descripciones.map((item, key) => (
    <MenuItem key={key} value={key}>
      {item.name}
    </MenuItem>
  ));


  const handleChange = (event: SelectChangeEvent) => {
    const idx = parseInt(event.target.value);


    if (descriptionRef.current !== null) {
      descriptionRef.current.innerHTML = idx >= 0 ? descripciones[idx].description : "";
    }

    setChartData(listas[idx].slice(0, 16));
    setTituloElegido(titulos[idx]);
  };

  return (
    <>
      <Paper
        sx={{
          mt: 5,
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography  component="h3" variant="h6" color="primary">
          Graficos Variables vs Tiempo
        </Typography>
        <Typography mb={1} component="p" color="gray">
          Mostrando información de 2 días
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="simple-select-label">Variables</InputLabel>
                <Select
                  labelId="simple-select-label"
                  id="simple-select"
                  label="Variables"
                  defaultValue="-1"
                  onChange={handleChange}
                >
                  <MenuItem key="-1" value="-1" disabled>
                    Seleccione una variable meteorológica
                  </MenuItem>

                  {options}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        <Typography
          ref={descriptionRef}
          mt={2}
          component="p"
          color="text.secondary"
        />
      </Paper>

      {chartData.length > 0 ? <WeatherChart titulo={tituloElegido} info={chartData} /> : null}
    </>
  );
}
