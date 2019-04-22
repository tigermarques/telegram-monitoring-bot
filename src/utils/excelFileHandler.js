const xlsx = require('xlsx')

// Team Sheet
const TEAM_SHEET = 'Equipa'
const TEAM_TELEGRAM_NAME_COLUMN = 'G'
const TEAM_ACRONYM_COLUMN = 'B'
const TEAM_COUNTRY_COLUMN = 'D'

// Work Type
const WORK_TYPE_SHEET = 'Reference Data'
const WORK_TYPE_COLUMN = 'G'

// Release
const RELEASE_SHEET = 'Releases'
const RELEASE_CODE_COLUMN = 'B'
const RELEASE_STATE_COLUMN = 'E'

// Vacation
const VACATION_SHEET = 'Férias'

// Official holidays
const OFFICIAL_HOLIDAYS_SHEET = 'Feriados'
const OFFICIAL_HOLIDAYS_COUNTRY_COLUMN = 'A'
const OFFICIAL_HOLIDAYS_DATE_COLUMN = 'B'

// Absences
const ABSENCES_SHEET = 'Ausências'
const ABSENCES_ACRONYM_COLUMN = 'A'
const ABSENCES_DATE_COLUMN = 'B'

// Training
const TRAINING_SHEET = 'Formações'

// Standby
const STANDBY_SHEET = 'Prevenção'
const STANDBY_ACRONYM_COLUMN = 'A'
const STANDBY_TYPE_COLUMN = 'B'
const STANDBY_START_DATE_COLUMN = 'C'

const getCellValue = (sheet, address) => {
  const cell = sheet[address]
  return cell ? cell.v : undefined
}

class ExcelFileHandler {
  constructor (workbook) {
    this.workbook = workbook
  }

  getWorkTypes () {
    const result = []
    const sheet = this.workbook.Sheets[WORK_TYPE_SHEET]
    let startRow = 2
    let nextValue = getCellValue(sheet, `${WORK_TYPE_COLUMN}${startRow}`)
    while (nextValue) {
      result.push({
        name: nextValue
      })
      startRow++
      nextValue = getCellValue(sheet, `${WORK_TYPE_COLUMN}${startRow}`)
    }
    return result
  }

  getReleases () {
    const result = []
    const sheet = this.workbook.Sheets[RELEASE_SHEET]
    let startRow = 4
    let nextReleaseCode = getCellValue(sheet, `${RELEASE_CODE_COLUMN}${startRow}`)
    while (nextReleaseCode) {
      const nextReleaseStatus = getCellValue(sheet, `${RELEASE_STATE_COLUMN}${startRow}`)
      result.push({
        name: nextReleaseCode,
        status: nextReleaseStatus || ''
      })
      startRow++
      nextReleaseCode = getCellValue(sheet, `${RELEASE_CODE_COLUMN}${startRow}`)
    }
    return result
  }

  getUserAcronym (username) {
    let result = null
    const sheet = this.workbook.Sheets[TEAM_SHEET]
    let startRow = 2
    let telegramUser = getCellValue(sheet, `${TEAM_TELEGRAM_NAME_COLUMN}${startRow}`)
    while (!result && telegramUser) {
      if (telegramUser.toLowerCase() === username.toLowerCase()) {
        result = getCellValue(sheet, `${TEAM_ACRONYM_COLUMN}${startRow}`)
      } else {
        startRow++
        telegramUser = getCellValue(sheet, `${TEAM_TELEGRAM_NAME_COLUMN}${startRow}`)
      }
    }
    return result
  }

  getUserCountry (username) {
    let result = null
    const sheet = this.workbook.Sheets[TEAM_SHEET]
    let startRow = 2
    let telegramUser = getCellValue(sheet, `${TEAM_TELEGRAM_NAME_COLUMN}${startRow}`)
    while (!result && telegramUser) {
      if (telegramUser.toLowerCase() === username.toLowerCase()) {
        result = getCellValue(sheet, `${TEAM_COUNTRY_COLUMN}${startRow}`)
      } else {
        startRow++
        telegramUser = getCellValue(sheet, `${TEAM_TELEGRAM_NAME_COLUMN}${startRow}`)
      }
    }
    return result
  }

  getUserHolidays (username) {
    const acronym = this.getUserAcronym(username)

    if (acronym) {
      const result = []
      const sheet = this.workbook.Sheets[VACATION_SHEET]
      const acronymRow = 1
      let userColumn = 'B'.charCodeAt(0)
      let foundUser = false
      let currentUser = getCellValue(sheet, `${String.fromCharCode(userColumn)}${acronymRow}`)
      while (!foundUser && currentUser) {
        if (currentUser.toUpperCase() === acronym.toUpperCase()) {
          foundUser = true
        } else {
          userColumn++
          currentUser = getCellValue(sheet, `${String.fromCharCode(userColumn)}${acronymRow}`)
        }
      }

      if (foundUser) {
        let startRow = 2
        let currentDate = getCellValue(sheet, `${String.fromCharCode(userColumn)}${startRow}`)
        while (currentDate) {
          result.push(currentDate)
          startRow++
          currentDate = getCellValue(sheet, `${String.fromCharCode(userColumn)}${startRow}`)
        }
        return result.map(item => xlsx.SSF.parse_date_code(item))
          .map(item => new Date(Date.UTC(item.y, item.m - 1, item.d)))
      } else {
        return null
      }
    } else {
      return null
    }
  }

  getUserOfficialHolidays (username) {
    const country = this.getUserCountry(username)

    if (country) {
      const result = []
      const sheet = this.workbook.Sheets[OFFICIAL_HOLIDAYS_SHEET]
      let startRow = 2
      let currentDate = getCellValue(sheet, `${OFFICIAL_HOLIDAYS_DATE_COLUMN}${startRow}`)
      while (currentDate) {
        result.push({
          date: currentDate,
          country: getCellValue(sheet, `${OFFICIAL_HOLIDAYS_COUNTRY_COLUMN}${startRow}`)
        })
        startRow++
        currentDate = getCellValue(sheet, `${OFFICIAL_HOLIDAYS_DATE_COLUMN}${startRow}`)
      }

      return result.filter(item => item.country === country)
        .map(item => xlsx.SSF.parse_date_code(item.date))
        .map(item => new Date(Date.UTC(item.y, item.m - 1, item.d)))
    } else {
      return null
    }
  }

  getUserTraining (username) {
    const acronym = this.getUserAcronym(username)

    if (acronym) {
      const result = []
      const sheet = this.workbook.Sheets[TRAINING_SHEET]
      const acronymRow = 1
      let userColumn = 'B'.charCodeAt(0)
      let foundUser = false
      let currentUser = getCellValue(sheet, `${String.fromCharCode(userColumn)}${acronymRow}`)
      while (!foundUser && currentUser) {
        if (currentUser.toUpperCase() === acronym.toUpperCase()) {
          foundUser = true
        } else {
          userColumn++
          currentUser = getCellValue(sheet, `${String.fromCharCode(userColumn)}${acronymRow}`)
        }
      }

      if (foundUser) {
        let startRow = 2
        let currentDate = getCellValue(sheet, `${String.fromCharCode(userColumn)}${startRow}`)
        while (currentDate) {
          result.push(currentDate)
          startRow++
          currentDate = getCellValue(sheet, `${String.fromCharCode(userColumn)}${startRow}`)
        }
        return result.map(item => xlsx.SSF.parse_date_code(item))
          .map(item => new Date(Date.UTC(item.y, item.m - 1, item.d)))
      } else {
        return null
      }
    } else {
      return null
    }
  }

  getUserOfficialHolidayStandbys (username) {
    const acronym = this.getUserAcronym(username)

    if (acronym) {
      const result = []
      const sheet = this.workbook.Sheets[STANDBY_SHEET]
      let startRow = 2
      let currentRowAcronym = getCellValue(sheet, `${STANDBY_ACRONYM_COLUMN}${startRow}`)
      while (currentRowAcronym) {
        result.push({
          acronym: currentRowAcronym,
          type: getCellValue(sheet, `${STANDBY_TYPE_COLUMN}${startRow}`),
          date: getCellValue(sheet, `${STANDBY_START_DATE_COLUMN}${startRow}`)
        })
        startRow++
        currentRowAcronym = getCellValue(sheet, `${STANDBY_ACRONYM_COLUMN}${startRow}`)
      }

      return result.filter(item => item.acronym === acronym && item.type === 'Feriado')
        .map(item => xlsx.SSF.parse_date_code(item.date))
        .map(item => new Date(Date.UTC(item.y, item.m - 1, item.d)))
    } else {
      return null
    }
  }

  getAbsences (username) {
    const acronym = this.getUserAcronym(username)

    if (acronym) {
      const result = []
      const sheet = this.workbook.Sheets[ABSENCES_SHEET]
      let startRow = 2
      let currentRowAcronym = getCellValue(sheet, `${ABSENCES_ACRONYM_COLUMN}${startRow}`)
      while (currentRowAcronym) {
        result.push({
          acronym: currentRowAcronym,
          date: getCellValue(sheet, `${ABSENCES_DATE_COLUMN}${startRow}`)
        })
        startRow++
        currentRowAcronym = getCellValue(sheet, `${STANDBY_ACRONYM_COLUMN}${startRow}`)
      }

      return result.filter(item => item.acronym === acronym)
        .map(item => xlsx.SSF.parse_date_code(item.date))
        .map(item => new Date(Date.UTC(item.y, item.m - 1, item.d)))
    } else {
      return null
    }
  }
}

module.exports = ExcelFileHandler
