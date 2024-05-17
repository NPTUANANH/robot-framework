const { startProcess, getCode } = require('./apiService.js')

// Should we change vendorId?
const brand = {
  hino: {
    name: 'Hino Financial Services',
    vendorId: '2073928c-8dc3-4dca-999e-f05c3774c711',
    url: 'https://hinofinance.development.demo.verifier.me'
  },
  lexus: {
    name: 'Lexus Financial Services',
    vendorId: '2073928c-8dc3-4dca-999e-f05c3774c711',
    url: 'https://lexusfinance.development.demo.verifier.me'
  },
  mazda: {
    name: 'Mazda Finance',
    vendorId: '2073928c-8dc3-4dca-999e-f05c3774c711',
    url: 'https://mazdafinance.development.demo.verifier.me'
  },
  powerAlliance: {
    name: 'Power Alliance Finance',
    vendorId: '2073928c-8dc3-4dca-999e-f05c3774c711',
    url: 'https://poweralliancefinance.development.demo.verifier.me'
  },
  powerTorque: {
    name: 'PowerTorque Finance',
    vendorId: '2073928c-8dc3-4dca-999e-f05c3774c711',
    url: 'https://powertorquefinance.development.demo.verifier.me'
  },
  suzuki: {
    name: 'Suzuki Financial Services',
    vendorId: '2073928c-8dc3-4dca-999e-f05c3774c711',
    url: 'https://suzukifinancialservices.development.demo.verifier.me'
  },
  toyota: {
    name: 'Toyota Finance',
    vendorId: '2073928c-8dc3-4dca-999e-f05c3774c711',
    url: 'https://toyotafinance.development.demo.verifier.me'
  }
}

const getBrand = (brandKey) => brand[brandKey]

// Use for test.each need table. Table is Array of Arrays. Output something like this
// [
//   [
//     "Hino Financial Services",
//     "hino",
//     {
//       name: 'Hino Financial Services',
//       vendorId: '2073928c-8dc3-4dca-999e-f05c3774c711',
//       url: 'https://hinofinance.development.demo.verifier.me'
//     }
//   ],
//   [
//     "Toyota Finance",
//     "toyota",
//     {
//         name: 'Toyota Finance',
//         vendorId: '2073928c-8dc3-4dca-999e-f05c3774c711',
//         url: 'https://toyotafinance.development.demo.verifier.me'
//       }
//     ]
// ]
const getBrandTable = () => {
  const arrayOfArrays = []
  for (const brandKey of Object.keys(brand)) {
    arrayOfArrays.push([brand[brandKey].name, brandKey, brand[brandKey]])
  }

  return arrayOfArrays
}

// Get code for each brand
const getCodes = async () => {
  const codes = {}
  for (const brandKey of Object.keys(brand)) {
    const supperanuationResult = await startProcess(brand[brandKey])
    const code = await getCode(brand[brandKey], supperanuationResult.id)
    codes[brandKey] = code.code
  }
  return codes
}

module.exports = {
  getBrand,
  getBrandTable,
  getCodes
}
