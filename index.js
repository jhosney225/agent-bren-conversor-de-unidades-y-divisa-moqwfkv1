```javascript
const readline = require('readline');
const http = require('http');

// Rates de conversión (actualizadas manualmente - en producción usar API)
const exchangeRates = {
  'USD': 1.0,
  'EUR': 0.92,
  'GBP': 0.79,
  'JPY': 149.50,
  'AUD': 1.52,
  'CAD': 1.36,
  'CHF': 0.88,
  'CNY': 7.24,
  'INR': 83.12,
  'MXN': 17.05
};

// Conversiones de unidades
const unitConversions = {
  length: {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100,
    millimeter: 1000,
    mile: 0.000621371,
    yard: 1.09361,
    foot: 3.28084,
    inch: 39.3701
  },
  weight: {
    kilogram: 1,
    gram: 1000,
    milligram: 1000000,
    pound: 2.20462,
    ounce: 35.274
  },
  temperature: {
    celsius: 'special',
    fahrenheit: 'special',
    kelvin: 'special'
  },
  volume: {
    liter: 1,
    milliliter: 1000,
    gallon: 0.264172,
    pint: 2.11338,
    cup: 4.22675
  }
};

// Funciones de conversión de unidades
function convertLength(value, from, to) {
  const fromValue = unitConversions.length[from];
  const toValue = unitConversions.length[to];
  if (!fromValue || !toValue) throw new Error('Unidad de longitud no válida');
  return (value / fromValue) * toValue;
}

function convertWeight(value, from, to) {
  const fromValue = unitConversions.weight[from];
  const toValue = unitConversions.weight[to];
  if (!fromValue || !toValue) throw new Error('Unidad de peso no válida');
  return (value / fromValue) * toValue;
}

function convertVolume(value, from, to) {
  const fromValue = unitConversions.volume[from];
  const toValue = unitConversions.volume[to];
  if (!fromValue || !toValue) throw new Error('Unidad de volumen no válida');
  return (value / fromValue) * toValue;
}

function convertTemperature(value, from, to) {
  let celsius;
  
  // Convertir a Celsius primero
  if (from === 'celsius') {
    celsius = value;
  } else if (from === 'fahrenheit') {
    celsius = (value - 32) * 5/9;
  } else if (from === 'kelvin') {
    celsius = value - 273.15;
  } else {
    throw new Error('Unidad de temperatura no válida');
  }
  
  // Convertir de Celsius a unidad destino
  if (to === 'celsius') {
    return celsius;
  } else if (to === 'fahrenheit') {
    return (celsius * 9/5) + 32;
  } else if (to === 'kelvin') {
    return celsius + 273.15;
  } else {
    throw new Error('Unidad de temperatura no válida');
  }
}

// Función de conversión de divisas
function convertCurrency(amount, fromCurrency, toCurrency) {
  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];
  
  if (!fromRate || !toRate) {
    throw new Error('Divisa no válida. Divisas disponibles: ' + Object.keys(exchangeRates).join(', '));
  }
  
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

// Función principal de conversión
function convert(value, type, from, to) {
  try {
    let result;
    
    if (type === 'length') {
      result = convertLength(value, from, to);
    } else if (type === 'weight') {
      result = convertWeight(value, from, to);
    } else if (type === 'volume') {
      result = convertVolume(value, from, to);
    } else if (type === 'temperature') {
      result = convertTemperature(value, from, to);
    } else if (type === 'currency') {
      result = convertCurrency(value, from, to);
    } else {
      throw new Error('Tipo de conversión no válido');
    }
    
    return result;
  } catch (error) {
    throw error;
  }
}

// Función de demostración
function demonstrateConversions() {
  console.log('\n========== DEMOSTRACIÓN DE CONVERSIONES ==========\n');
  
  // Conversiones de longitud
  console.log('--- LONGITUD ---');
  console.log(`100 metros = ${convert(100, 'length', 'meter', 'kilometer').toFixed(4)} kilómetros`);
  console.log(`5 millas = ${convert(5, 'length', 'mile', 'kilometer').toFixed(4)} kilómetros`);
  console.log(`10 pies = ${convert(10, 'length', 'foot', 'meter').toFixed(4)} metros`);
  
  // Conversiones de peso
  console.log('\n--- PESO ---');
  console.log(`50 kilogramos = ${convert(50, 'weight', 'kilogram', 'pound').toFixed(4)} libras`);
  console.log(`150 libras = ${convert(150, 'weight',