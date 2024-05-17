const FormatType = {
  SHORT: 'SHORT',
  LONG: 'LONG',
  FULL: 'FULL'
}

const formatDate = (formattingDate, formatType) => {
  const date = formattingDate == null ? new Date() : formattingDate

  const dd = `${date.getDate()}`.padStart(2, '0')
  const yyyy = date.getFullYear()

  switch (formatType) {
    case FormatType.LONG:
      const month = date.toLocaleString('default', { month: 'long' })
      return `${dd} ${month} ${yyyy}`
    case FormatType.SHORT:
    default: // January is 0!
      const mm = `${date.getMonth() + 1}`.padStart(2, '0')
      return `${dd}/${mm}/${yyyy}`
  }
}

const getTodayDateShort = () => {
  return formatDate(new Date(), FormatType.SHORT)
}

const getTodayDateLong = () => {
  return formatDate(new Date(), FormatType.LONG)
}

const getConsentEndDate = (Consented = true) => {
  if (Consented) {
    const endDate = new Date()
    const duration = 89
    endDate.setDate(endDate.getDate() + duration)
    return formatDate(endDate, FormatType.LONG)
  } else {
    const endDate = new Date()
    endDate.setDate(endDate.getDate())
    return formatDate(endDate, FormatType.LONG)
  }
}
module.exports = {
  formatDate,
  getTodayDateShort,
  getTodayDateLong,
  getConsentEndDate
}
