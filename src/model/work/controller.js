const Work = require('./model')
const userModel = require('../users')

const startDateToCheck = new Date(Date.UTC(2019, 3, 15, 0, 0, 0))

const getDates = function (startDate, endDate) {
  const dates = []
  let currentDate = startDate
  const addDays = function (days) {
    const date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
  }
  while (currentDate <= endDate) {
    dates.push(currentDate)
    currentDate = addDays.call(currentDate, 1)
  }
  return dates
}

const getAll = () => {
  return Work.find().exec()
}

const add = (username, month, day, release, workType, hours) => {
  const date = Date.UTC(2019, month, day, 0, 0, 0)
  const newUser = new Work({
    username,
    release,
    workType,
    workDate: date,
    hours
  })
  return newUser.save()
}

const getMissing = async (username, makeTodayCount) => {
  const user = await userModel.getByUsername(username)

  const currentDate = new Date(Date.now())
  if (!makeTodayCount) {
    currentDate.setDate(currentDate.getDate() - 1)
  }

  let dates = getDates(startDateToCheck, currentDate)

  // remove weekends
  dates = dates.filter(date => date.getDay() % 6)
  // remove vacation
  if (user.holidays) {
    dates = dates.filter(date => !user.holidays.find(vacation => vacation.getTime() === date.getTime()))
  }
  // remove absences
  if (user.absences) {
    dates = dates.filter(date => !user.absences.find(absence => absence.getTime() === date.getTime()))
  }
  // remove official holidays
  if (user.officialHolidays) {
    dates = dates.filter(date => !user.officialHolidays.find(holiday => holiday.getTime() === date.getTime()))
  }
  // remove training
  if (user.trainings) {
    dates = dates.filter(date => !user.trainings.find(training => training.getTime() === date.getTime()))
  }

  const allWork = await getAll()
  const missingRecords = []

  dates.forEach(date => {
    const workHours = allWork.filter(item => {
      return item.username === username && item.workDate.getTime() === date.getTime()
    }).reduce((prev, item) => prev + item.hours, 0)

    if (workHours < 8) {
      missingRecords.push({
        date: date,
        missingHours: 8 - workHours
      })
    }
  })

  return missingRecords
}

module.exports = {
  add,
  getAll,
  getMissing
}
