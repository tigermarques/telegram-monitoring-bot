const WorkType = require('./model')

const getAll = () => {
  return WorkType.find().exec()
}

const replaceAll = async (newWorkTypes) => {
  const workTypes = await getAll()

  for (let i = 0; i < newWorkTypes.length; i++) {
    const newWorkType = newWorkTypes[i]
    const existingRelease = workTypes.find(item => item.name === newWorkType.name)
    if (!existingRelease) {
      // new
      const newDoc = new WorkType({
        name: newWorkType.name
      })
      await newDoc.save()
    }
  }

  const constNewWorkTypeCodes = newWorkTypes.map(item => item.name)

  // delete all that exist in workTypes but not in newWorkTypes
  const itemsToDelete = workTypes.filter(item => constNewWorkTypeCodes.indexOf(item.name) === -1)
  for (let i = 0; i < itemsToDelete.length; i++) {
    await WorkType.deleteOne({ _id: itemsToDelete[i]._id })
  }
}

module.exports = {
  getAll,
  replaceAll
}
