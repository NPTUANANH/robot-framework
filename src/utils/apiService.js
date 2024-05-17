const axios = require('axios')
require('dotenv').config()

const apiUrl = process.env.API_URL
const apiKey = process.env.API_KEY
const email = process.env.EMAIL

const credentials = {
  username: 'admin@verifier.me',
  password: process.env.PASSWORD
}

const startProcess = async (brand, requestBody = getMockData(brand)) => {
  const res = await axios({
    method: 'POST',
    url: `${apiUrl}/api/v2/proofOfIncome/incomeInsights/start`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      credentials: {
        username: credentials.username,
        password: credentials.password,
        vendorId: brand.vendorId
      },
      request: requestBody
    }
  })

  return res.data
}

const getCode = async (brand, resultId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/api/v2/proofOfIncome/incomeInsights/code/${brand.vendorId}/${resultId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `x-api-key ${apiKey}`
      }
      // data: {
      //   credentials: {
      //     username: credentials.username,
      //     password: credentials.password,
      //     vendorId: brand.vendorId
      //   }
      // }
    })

    return res.data
  } catch (e) {
    console.log('ERROR:', e)
  }
}

const getMockData = (brand) => {
  const testNumber = 1

  return {
    product: {
      information: {
        brand: brand.name,
        dealershipId: `SUBURB00${testNumber}`,
        dealershipName: 'Bobs Dealership',
        businessManager: 'Bob Smiter'
      }
    },
    email: email,
    customerId: `test${testNumber}`,
    name: {
      firstName: 'Wetzel',
      lastName: 'Falk'
    },
    dateOfBirth: '1981-09-03',
    address: {
      line1: 'Unit 31 3 Ashley St',
      suburb: 'WANTIRNA',
      state: 'VIC',
      postcode: '3152',
      countryCode: 'AU'
    },
    employer: {
      name: 'Peters Meats',
      statedIncome: 29392.0,
      employmentType: 'Full Time',
      startDate: '1933-02-08',
      industryCode: 'Meat and Dairy',
      jobDescription: 'Butcher'
    },
    otherEmployers: [
      {
        name: 'Johns fish and chips',
        statedIncome: 6000.6,
        employmentType: 'Full Time',
        startDate: '1933-02-08',
        industryCode: 'Retail Trade',
        jobDescription: 'Food Retailing'
      }
    ],
    customerData: {
      information: {
        applicationId: `AP-${testNumber}`
      }
    }
  }
}

module.exports = {
  startProcess,
  getCode
}
