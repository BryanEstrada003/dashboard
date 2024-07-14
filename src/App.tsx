import { useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Indicator from "./components/Indicator";
import Summary from "./components/Summary";
import ControlPanel from "./components/ControlPanel";
import BasicTable from "./components/BasicTable";

import "./App.css";

function App() {
  let [rowsTable, setRowsTable] = useState<
    { rangeHours: string; windDirection: string }[]
  >([]);
  let [indicators, setIndicators] = useState<JSX.Element[]>([]);
  let [datosGraficos, setDatosGraficos] = useState<any[][]>([]);
  let [amanecer, setAmanecer] = useState<string>("");
  let [atardecer, setAtardecer] = useState<string>("");

  var humidities: Array<[any, any]> = [["Hora", "Humedad"]];
  var nubosities: Array<[any, any]> = [["Hora", "Nubosidad"]];
  var temperatures: Array<[any, any]> = [["Hora", "Temperatura"]];

  useEffect(() => {
    (async () => {
		let savedTextXML = localStorage.getItem("openWeatherMap");
		let expiringTime = localStorage.getItem("expiringTime");
  
		let nowTime = new Date().getTime();
  
		if (
		  expiringTime === null ||
		  nowTime > parseInt(expiringTime)
		) {
		  let API_KEY = "c45a8618fc83e03c7355f428f9ffa221";
		  let response = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`
		  );
		  savedTextXML = await response.text();
  
		  let hours = 1;
		  let delay = hours * 3600000;
  
		  localStorage.setItem("openWeatherMap", savedTextXML);
		  localStorage.setItem("expiringTime", (nowTime + delay).toString());
  
		}
  
		if (savedTextXML) {
		  const parser = new DOMParser();
		  const xml = parser.parseFromString(savedTextXML, "application/xml");
  
		  let dataToIndicators: Array<[string, string, string]> = [];
		
		  
  
		  let ciudad = xml.getElementsByTagName("name")[0].innerHTML;
		  let location = xml.getElementsByTagName("location")[1];

		  const firstTimeNode = xml.querySelector('time');


		const latitude = location?.getAttribute('latitude') || '0';
		dataToIndicators.push([ciudad, 'Latitud', latitude]);
		const longitude = location?.getAttribute('longitude') || '0';
		dataToIndicators.push([ciudad, 'Longitud', longitude]);

		const temperatureValue = firstTimeNode?.querySelector('temperature')?.getAttribute('value');
		const feelsLikeValue = firstTimeNode?.querySelector('feels_like')?.getAttribute('value');

		const temperature = temperatureValue ? parseInt((parseFloat(temperatureValue) - 273.15).toString()) : 0;
		const feelsLike = feelsLikeValue ? parseInt((parseFloat(feelsLikeValue) - 273.15).toString()) : 0;	
		
		dataToIndicators.push([ciudad, 'Temperatura', temperature.toString() + '°C']);
		dataToIndicators.push([ciudad, 'Sensación térmica', feelsLike.toString() + '°C']);
		const pressure = firstTimeNode?.querySelector('pressure')?.getAttribute('value') || '0';
		dataToIndicators.push([ciudad, 'Presión', pressure.toString()+ 'hPa']);


  
		  const sunsetTime = xml.querySelector("sun")?.getAttribute("set");
		  const sunriseTime = xml.querySelector("sun")?.getAttribute("rise");
  
		  if (sunsetTime) {
			const sunsetDate = new Date(sunsetTime);
			sunsetDate.setHours(sunsetDate.getHours() - 5);
			setAtardecer(sunsetDate.toLocaleTimeString());
		  } else {
			// Handle the case where sunsetTime is null
			setAtardecer("N/A"); // Or any default/fallback value
		  }
		  
		  if (sunriseTime) {
			const sunriseDate = new Date(sunriseTime);
			sunriseDate.setHours(sunriseDate.getHours() - 5);
			setAmanecer(sunriseDate.toLocaleTimeString());
		  } else {
			// Handle the case where sunriseTime is null
			setAmanecer("N/A"); // Or any default/fallback value
		  }
  
		  let indicatorsElements = Array.from(dataToIndicators).map((element) => (
			<Indicator
			  subtitle={element[1]}
			  value={element[2]}
			/>
		  ));
  
		  setIndicators(indicatorsElements);
  
		  let vientos = Array.from(xml.getElementsByTagName("time")).map(
			(timeElement) => {
			  let fromAttr = timeElement.getAttribute("from");
			  let toAttr = timeElement.getAttribute("to");
  
			  let rangeHours =
				fromAttr?.split("T")[1] + " - " + toAttr?.split("T")[1];
  
			  let windDirection =
				timeElement
				  .getElementsByTagName("windDirection")[0]
				  .getAttribute("deg")! +
				" " +
				timeElement
				  .getElementsByTagName("windDirection")[0]
				  .getAttribute("code")!;
  
			  return { rangeHours: rangeHours!, windDirection: windDirection };
			}
		  );
  
		  vientos = vientos.slice(0, 8);
		  setRowsTable(vientos);
  
		  const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;
  
		  Array.from(xml.getElementsByTagName("time")).map((timeNode) => {
			const from = timeNode.getAttribute("from");
			const temperatureNode =
			  timeNode.getElementsByTagName("temperature")[0];
			const humidityNode = timeNode.getElementsByTagName("humidity")[0];
			const cloudsNode = timeNode.getElementsByTagName("clouds")[0];
  
			if (
			  from &&
			  temperatureNode &&
			  humidityNode &&
			  cloudsNode
			) {
			  const temperatura = kelvinToCelsius(
				parseInt(temperatureNode.getAttribute("value")!)
			  );
			  const humedad = parseInt(humidityNode.getAttribute("value")!);
			  const nubosidad = parseInt(cloudsNode.getAttribute("all")!);
			  const hora =
				new Date(from).getHours() + ":" + new Date(from).getMinutes();
  
			  temperatures.push([hora, temperatura]);
			  humidities.push([hora, humedad]);
			  nubosities.push([hora, nubosidad]);
			}
		  });
  
		  setDatosGraficos([
			humidities,
			nubosities,
			temperatures,
		  ]);
		}
	  })();
  
  }, []);

  return (
    <>
      <Grid container spacing={5}>
	  <Grid xs={12} sm={4} md={3} lg={12}>
          <Indicator
			subtitle="Ciudad"
			value="Guayaquil">
		  </Indicator>
        </Grid>
	  <Grid
          xs={12}
          sm={4}
          md={3}
          lg={12}
        >
          
          <Summary horaAmanecer={amanecer} horaAtardecer={atardecer} ></Summary>
        </Grid>
	  
        <Grid xs={12} sm={4} md={3} lg={6}>
          {indicators[0]}
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={6}>
          {indicators[1]}
        </Grid>
		<Grid xs={12} sm={4} md={3} lg={4}>
          {indicators[2]}
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={4}>
          {indicators[3]}
        </Grid>
		<Grid xs={12} sm={4} md={3} lg={4}>
          {indicators[4]}
        </Grid>

        
      </Grid>

      <Grid xs={12} lg={2}>
        <ControlPanel listas={datosGraficos}></ControlPanel>
      </Grid>

	  <Grid sx={{ mt: 2 }}>
	  <BasicTable rows={rowsTable}></BasicTable>
      </Grid>

      
    </>
  );
}

export default App;
