import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react'
import { getMoment } from './utils/helper'
import WeatherCard from './views/WeatherCard'
import useWeatherAPI from './hooks/useWeatherAPI'
import WeatherSetting from './views/WeatherSetting'
import { findLocation } from './utils/helper'
const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 5px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 10px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};
const Container = styled.div`
  background-color:${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const AUTHORIZATION_KEY = 'CWB-5DE6B83D-CF7A-4374-A5B7-FA0FEDF489B6'

const App = () => {
  const storageCity = localStorage.getItem('cityName') || '臺北市'
  const [currentPage, setCurrentPage] = useState('WeatherCard')
  const [currentCity, setCurrentCity] = useState(storageCity)
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity])
  const {
    cityName,
    locationName,
    sunriseCityName,
  } = currentLocation
  const handleCurrentPage = (currentPage) => {
    setCurrentPage(currentPage)
  }
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName])
  const [mode, setMode] = useState('dark')
  const [currentWeather, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY
  })
  useEffect(() => {
    setMode(mode === 'day' ? 'light' : 'dark')
  }, [moment])
  const setCurrentTheme = () => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }
  const {
    weatherCode
  } = currentWeather
  console.log(weatherCode)
  return (
    <ThemeProvider theme={theme[mode]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            cityName={cityName}
            handleCurrentPage={handleCurrentPage}
            fetchData={fetchData}
            currentWeather={currentWeather}
            setCurrentTheme={setCurrentTheme}
            moment={moment}
            weatherCode={weatherCode}
          />)}
        {currentPage === 'WeatherSetting' && <WeatherSetting currentCity={currentCity} setCurrentCity={setCurrentCity} setCurrentPage={setCurrentPage} />}
      </Container>
    </ThemeProvider>
  );
};

export default App;