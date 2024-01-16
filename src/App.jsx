import { useState, useEffect } from 'react';
import './assets/style/css/app.css';

function App() {
  // Définitions des différentes states de l'application
  // Initialisation du state city avec la valeur Paris par défaut
  const [city, setCity] = useState('Paris');
  const [data, setData] = useState([]);
  const [dataForcast, setDataForcast] = useState([]);
  const [bg, setBg] = useState('');
  const [icon, setIcon] = useState('');
  // Initialisation de la date actuelle
  const currentDate = new Date().toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
  const serverURL = process.env.SERVER_URL || 'http://localhost:4000';

  // Fonction asynchrone pour récupérer les données météorologiques actuelles depuis le backend
  const fetchData = async (city) => {
    try {
      // Envoi des données au backend via une requête POST
      const response = await fetch(`${serverURL}/api/getData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Conversion des données en JSON pour envoyer la valeur de la ville
        body: JSON.stringify({
          city: city,
        }),
      });

      // Gestion des réponses du backend
      // Si la réponse est ok, on récupère les données et on les stocke dans la state data
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        // Vide le champs de recherche
        setCity('');
        console.log('Données de la réponse current data:', responseData);
      // Si la réponse est un échec, on récupère les données et on les stocke dans la state error
      } else {
        const errorData = await response.json();
        console.error('Erreur de connexion :', errorData);
      }
      // Si la requête échoue, on récupère l'erreur et on l'affiche dans la console
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données au backend pour les current data', error);
    }
  };

  // Fonction asynchrone pour récupérer les prévisions météorologiques depuis le backend
  const fetchDataForcast = async (city) => {
    try {
      const response = await fetch(`${serverURL}/api/getDataForcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: city,
        }),
      });

      // Gestion des réponses du backend
      // Si la réponse est ok, on récupère les données et on les stocke dans la state dataForcast
      if (response.ok) {
        const responseData = await response.json();
        setDataForcast(responseData);
        setCity('');
        console.log('Données de la réponse forcast :', responseData);
        console.log(dataForcast.list);
      } else {
        const errorData = await response.json();
        console.error('Erreur de connexion :', errorData);
      }
      // Si la requête échoue, on récupère l'erreur et on l'affiche dans la console
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données au backend pour les data forcast', error);
    }
  };

  // Utilisation de useEffect pour récupérer les données météorologiques actuelles et les prévisions météorologiques
  useEffect(() => {
    if (data && data.weather && data.weather.length > 0) {
      if (data.weather[0].main === 'Clouds') {
        setBg('../src/assets/img/bgCloud.svg');
        setIcon('../src/assets/img/cloud.png');
      } else if (data.weather[0].main === 'Rain') {
        setBg('../src/assets/img/bgRaining.jpg');
        setIcon('../src/assets/img/rain.png');
      } else if (data.weather[0].main === 'Clear') {
        setBg('../src/assets/img/bgSun.svg');
        setIcon('../src/assets/img/sunIcone.png');
      } else if (data.weather[0].main === 'Snow') {
        setBg('../src/assets/img/bgSnow.jpg');
        setIcon('../src/assets/img/snowIcone.png');
      }
    }
  }, [data]);
  

  // UseEffect exécuté au chargerment de la page pour récupérer les données météorologiques actuelles et les prévisions météorologiques pour la valueur par défaut Paris
  useEffect(() => {
    fetchData(city);
  fetchDataForcast(city);
  }, []);


  // Fonction pour récupérer les données météorologiques actuelles et les prévisions météorologiques pour la ville saisie dans le champs de recherche
  const handleCity = async (e) => {
    e.preventDefault();
    fetchData(city);
    fetchDataForcast(city);
  };

// Rendu du composant principal de l'application
return (
  // Conteneur principal de l'application avec arrière-plan dynamique en fonction des conditions météorologiques actuelles
  <div className="appContainer" style={{backgroundImage: `url(${bg})`}}>
    <div className='contentContainer'>
      <div className="content">
        {/* Formulaire de recherche de la ville avec icône de recherche */}
        <form onSubmit={handleCity}>
          <div className='searchBar'>
            <input type="text" placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} className='inputSearch'/>
            <input type="submit" value="" name='search' id='search' hidden/>
            <label htmlFor="search"><img src="https://img.icons8.com/ios/50/search--v1.png" alt="" /></label>
          </div>
        </form> 
        {/* Affichage des données météorologiques actuelles */}
        <div className="data">
          <h1>{data && `${data.name}`}</h1>
          <p className='date'>{currentDate}</p>
          {/* Section pour la température actuelle, température minimale et maximale, et icône météorologique */}
          <div className="weather">
            <div className="temp">
              <h2>{data && data.main && Math.floor(data.main.temp - 273.15)}°</h2>
              <div className="tempMinMax">
                <p>{data && data.main && Math.floor(data.main.temp_min - 273.15)}° <br/>{data && data.main && Math.floor(data.main.temp_max - 273.15)}°</p>
              </div>
            </div>
            <div className="weatherIcon" style={{backgroundImage: `url(${icon})`}}></div>
          </div>
          {/* Section pour les autres informations météorologiques actuelles (vent, humidité, lever/coucher du soleil) */}
          <div className="othersInfos">
            <div className="wind_humidity">
              <div>
                <img src="../src/assets/img/windIcone.png" alt="" />
                <p>{data && data.wind && data.wind.speed} km/h</p>
              </div>
              <div>
                <img src="../src/assets/img/humidityIcone.png" alt="" />
                <p>{data && data.main && data.main.humidity}%</p>
              </div>
            </div>
            <div className="sunSet_sunRize">
              <div>
                <img src="../src/assets/img/sunriseIcone.png" alt="" />
                <p>{data && data.sys && new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
              </div>
              <div>
                <img src="../src/assets/img/sunsetIcone.png" alt="" />
                <p>{data && data.sys && new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
          {/* Section pour afficher les prévisions météorologiques des prochains jours */}
          <div className="otherDay">
            {dataForcast && dataForcast.list && dataForcast.list
              .filter((day, index) => index % 8 === 0)
              .map((day, index) => (
                <div className="day" key={index}>
                  <div>
                    {/* Affichage de la date et icône météorologique des prévisions */}
                    <h4>{day.dt_txt.split(' ')[0]}</h4>
                    <img src="../src/assets/img/snowIcone.png" alt="" />
                  </div>
                  {/* Affichage de la température prévue pour le jour */}
                  <p>{Math.floor(day.main.temp - 273.15)}°</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default App;
