import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("https://covidapi.info/api/v1/country/dnk").then(
        response => response.json()
      )

      var results= result.result

      var days = []
      Object.keys(results).forEach(key =>{
        days.push(key)
      })
      var values = []
      Object.values(results).forEach(value => {
        values.push(value)
      })

      var array = []
      for(var i =0; i<days.length; i++){
        array.push({day : { 
          date : days[i],
          confirmed :values[i].confirmed,
          deaths :values[i].deaths,
          recovered :values[i].recovered
        }})
      }
     
     
      setData(array);
    };
    fetchData();
  }, []);


  return (
    <div className="App">
      <header>
        <h1>Numbers</h1>
      </header>
      <div>
        <ul>
          {data.map((value, i) =>(
            <li key={i}>day : {value.day.date}, confirmed: {value.day.confirmed}, deaths: {value.day.deaths}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
