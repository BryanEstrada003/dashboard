// 454f2cb67ee7a7b1b76bb9cf65ed63d0
import { useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Indicator from "./components/Indicator";
import ControlPanel from "./components/ControlPanel";
import BasicTable from "./components/BasicTable";

import "./App.css";

function App() {

	{
		/* 
			 1. Agregue la variable de estado (dataTable) y función de actualización (setDataTable).
		 */
	}

	let [rowsTable, setRowsTable] = useState<{ rangeHours: string; windDirection: string; }[]>([]);
	let [indicators, setIndicators] = useState<JSX.Element[]>([]);
	// Asegúrate de que el estado y setListas acepten string[][]
	const [listas, setListas] = useState<string[][]>([]);

	var precipitaciones = [["Hora", "Precipitación"]];
	var humedades = [["Hora", "Humedad"]];
	var nubosidades = [["Hora", "Nubosidad"]];
	var temperaturas = [["Hora", "Temperatura"]];
	var visibilidades = [["Hora", "Visibilidad"]];



	{
		/* Hook: useEffect */
	}

	useEffect(() => {
		(async () => {
			{
				/* Del LocalStorage, obtiene el valor de las claves openWeatherMap y expiringTime */
			}

			let savedTextXML: string = localStorage.getItem("openWeatherMap") || "";
			let expiringTime = localStorage.getItem("expiringTime");

			{
				/* Estampa de tiempo actual */
			}

			let nowTime = new Date().getTime();

			{
				/* Realiza la petición asicrónica cuando: 
						(1) La estampa de tiempo de expiración (expiringTime) es nula, o  
						(2) La estampa de tiempo actual es mayor al tiempo de expiración */
			}

			if (expiringTime === null || nowTime > parseInt(expiringTime)) {
				{
					/* Request */
				}

				let API_KEY = "454f2cb67ee7a7b1b76bb9cf65ed63d0";
				let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
				savedTextXML = await response.text();

				{
					/* Diferencia de tiempo */
				}

				let hours = 1;
				let delay = hours * 3600000;

				{
					/* En el LocalStorage, almacena texto en la clave openWeatherMap y la estampa de tiempo de expiración */
				}

				localStorage.setItem("openWeatherMap", savedTextXML);
				localStorage.setItem("expiringTime", (nowTime + delay).toString());
			}

			{
				/* XML Parser */
			}

			const parser = new DOMParser();
			const xml = parser.parseFromString(savedTextXML, "application/xml");

			{
				/* Arreglo para agregar los resultados */
			}

			let dataToIndicators = new Array();

			{
				/* 
					Análisis, extracción y almacenamiento del contenido del XML 
					en el arreglo de resultados
				*/
			}

			let ciudad = xml.getElementsByTagName("name")[0].innerHTML;

			let location = xml.getElementsByTagName("location")[1];

			let geobaseid = location.getAttribute("geobaseid");
			dataToIndicators.push([ciudad, "geobaseid", geobaseid]);

			let latitude = location.getAttribute("latitude");
			dataToIndicators.push([ciudad, "Latitude", latitude]);

			let longitude = location.getAttribute("longitude");
			dataToIndicators.push([ciudad, "Longitude", longitude]);

			/* 		console.log( dataToIndicators )
			 */

			{
				/* Renderice el arreglo de resultados en un arreglo de elementos Indicator */
			}

			let indicatorsElements = Array.from(dataToIndicators).map((element) => (
				<Indicator
					title={element[0]}
					subtitle={element[1]}
					value={element[2]}
				/>
			));

			{
				/* Modificación de la variable de estado mediante la función de actualización */
			}

			setIndicators(indicatorsElements);

			{
				/* 
						 2. Procese los resultados de acuerdo con el diseño anterior.
						 Revise la estructura del documento XML para extraer los datos necesarios. 
					 */
			}

			let vientos = Array.from(xml.getElementsByTagName("time")).map(
				(timeElement) => {
					let rangeHours =
						(timeElement.getAttribute("from") ?? "").split("T")[1] +
						" - " +
						(timeElement.getAttribute("to") ?? "").split("T")[1];

					let windDirection =
						timeElement
							.getElementsByTagName("windDirection")[0]
							.getAttribute("deg") +
						" " +
						timeElement
							.getElementsByTagName("windDirection")[0]
							.getAttribute("code");

					return { rangeHours: rangeHours, windDirection: windDirection };
				}
			);

			vientos = vientos.slice(0, 8);

			{
				/* 3. Actualice de la variable de estado mediante la función de actualización */
			}

			setRowsTable(vientos);



			const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;

			Array.from(xml.getElementsByTagName("time")).map((timeNode) => {
				const from = timeNode.getAttribute("from");
				const temperatureNode = timeNode.getElementsByTagName("temperature")[0];
				const humidityNode = timeNode.getElementsByTagName("humidity")[0];
				const precipitationNode =
					timeNode.getElementsByTagName("precipitation")[0];
				const cloudsNode = timeNode.getElementsByTagName("clouds")[0];
				const visibilityNode = timeNode.getElementsByTagName("visibility")[0];

				const temperatura = kelvinToCelsius(
					parseInt(temperatureNode.getAttribute("value") ?? "")
				);
				const precipitacion = parseInt(
					precipitationNode.getAttribute("probability") ?? ""
				);
				const humedad = parseInt(humidityNode.getAttribute("value") ?? "");
				const nubosidad = parseInt(cloudsNode.getAttribute("all") ?? "");
				const visibilidad = parseInt(visibilityNode.getAttribute("value") ?? "");
				const hora =
					from ? `${new Date(from).getHours()}:${new Date(from).getMinutes()}` : "";

				temperaturas.push([hora, temperatura.toString()]);
				precipitaciones.push([hora, precipitacion.toString()]);
				humedades.push([hora, humedad.toString()]);
				nubosidades.push([hora, nubosidad.toString()]);
				visibilidades.push([hora, visibilidad.toString()]);
			});
			// Ejemplo de aplanamiento (puede que no sea aplicable en tu caso)
			const datosAplanados = [precipitaciones, humedades, nubosidades, temperaturas, visibilidades].flat();
			setListas(datosAplanados);
		})();
	}, []);




	return (
		<>
			<Grid container spacing={5}>
				<Grid xs={12} sm={4} md={3} lg={2}>
					{indicators[0]}
				</Grid>
				<Grid xs={12} sm={4} md={3} lg={2}>
					{indicators[1]}
				</Grid>
				<Grid xs={12} sm={4} md={3} lg={2}>
					{indicators[2]}
				</Grid>
				<Grid xs={12} sm={4} md={3} lg={2}>
					<Indicator
						title="Precipitación"
						subtitle="Probabilidad"
						value={0.13}
					/>
				</Grid>
				<Grid xs={12} sm={4} md={3} lg={2}>
					<Indicator
						title="Precipitación"
						subtitle="Probabilidad"
						value={0.13}
					/>
				</Grid>
				<Grid xs={12} sm={4} md={3} lg={2}>
					<Indicator
						title="Precipitación"
						subtitle="Probabilidad"
						value={0.13}
					/>
				</Grid>
				{/* <Summary></Summary> */}
			</Grid>

			<BasicTable rows={rowsTable}></BasicTable>

			<Grid xs={12} lg={2}>
				<ControlPanel listas={[listas]}></ControlPanel>
			</Grid>

		</>
	);
}

export default App;
