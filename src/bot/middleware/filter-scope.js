const matcher = command => (prev, item) => {
  if (typeof item === 'string') {
    return prev || item === command
  } else if (item instanceof RegExp) {
    return prev || item.test(command)
  } else {
    return prev
  }
}

module.exports = (handler, options) => (ctx, next) => {
  if (ctx.state.command) {
    const command = ctx.state.command.command
    // console.log(`being called with ${command}`)
    let check = true
    if (options && options.include && Array.isArray(options.include)) {
      check = options.include.reduce(matcher(command), false)
    } else if (options && options.exclude && Array.isArray(options.exclude)) {
      check = !options.exclude.reduce(matcher(command), false)
    }
    if (check) {
      handler(ctx, next)
    } else {
      next()
    }
  } else {
    next()
  }
}
