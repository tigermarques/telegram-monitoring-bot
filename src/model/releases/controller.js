const Release = require('./model')

const getAll = () => {
  return Release.find().exec()
}

const replaceAll = async (newReleases) => {
  const releases = await getAll()

  for (let i = 0; i < newReleases.length; i++) {
    const newRelease = newReleases[i]
    const existingRelease = releases.find(item => item.name === newRelease.name)
    if (existingRelease) {
      if (existingRelease.status !== newRelease.status) {
        // update
        existingRelease.status = newRelease.status
        await existingRelease.save()
      }
    } else {
      // new
      const newDoc = new Release({
        name: newRelease.name,
        status: newRelease.status
      })
      await newDoc.save()
    }
  }

  const constReleasesCodes = newReleases.map(item => item.name)

  // delete all that exist in workTypes but not in newWorkTypes
  const itemsToDelete = releases.filter(item => constReleasesCodes.indexOf(item.name) === -1)
  for (let i = 0; i < itemsToDelete.length; i++) {
    await Release.deleteOne({ _id: itemsToDelete[i]._id })
  }
}

module.exports = {
  getAll,
  replaceAll
}
