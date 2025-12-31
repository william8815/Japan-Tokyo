import { ref, onMounted } from 'vue'

export function useWeather() {
  const weather = ref({
    temp: 2,
    condition: 'Snowy',
    icon: 'CloudSnow',
    forecast: [
      { day: '1/07', temp: 2, condition: 'CloudSnow' },
      { day: '1/08', temp: -1, condition: 'Snow' },
      { day: '1/09', temp: 3, condition: 'Cloudy' },
      { day: '1/10', temp: -2, condition: 'Snow' },
      { day: '1/11', temp: 4, condition: 'Cloudy' }
    ],
    snowChance: '85%'
  })

  const fetchWeather = async () => {
    // 未來串接 API
  }

  onMounted(fetchWeather)

  return {
    weather,
    fetchWeather
  }
}
