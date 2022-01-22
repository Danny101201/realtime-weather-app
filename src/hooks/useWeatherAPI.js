import React, { useState, useEffect, useCallback, useMemo } from 'react';

//API
const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
  ).then(res => res.json())
    .then(data => {
      const locationData = data.records.location[0]
      console.log(locationData.time.obsTime)
      const weatherElements = locationData.weatherElement.reduce((needElement, item) => {
        if (["WDSD", "TEMP"].includes(item.elementName)) {
          needElement[item.elementName] = item.elementValue
        }
        return needElement
      }, {})

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        windSpeed: weatherElements.WDSD,
        temperature: weatherElements.TEMP,
        isLoading: false
      }
    })
}
const fetchCurrentWeatherForecast = ({ authorizationKey, cityName }) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
  ).then(res => res.json())
    .then(data => {
      const locationData = data.records.location[0]
      const weatherElements = locationData.weatherElement.reduce((needElement, item) => {
        if (["Wx", "PoP", "CI"].includes(item.elementName)) {
          needElement[item.elementName] = item.time[0].parameter
        }
        return needElement
      }, {})
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comforability: weatherElements.CI.parameterName,
      }
    })
}

function useWeatherAPI({ locationName, cityName, authorizationKey }) {
  const [currentWeather, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    comforability: "",
    weatherCode: 0,
    isLoading: true
  });
  const fetchData = useCallback(async () => {
    setWeatherElement((preState) => ({
      ...preState,
      isLoading: true
    }))
    const [currentWeather, currentWeatherForecast] = await Promise.all([
      fetchCurrentWeather({ locationName, authorizationKey }),
      fetchCurrentWeatherForecast({ cityName, authorizationKey })
    ])
    setWeatherElement({
      ...currentWeather,
      ...currentWeatherForecast,
    })
  }, [])
  useEffect(() => {
    fetchData()
  }, [fetchData])
  return [currentWeather, fetchData]
}

export default useWeatherAPI
