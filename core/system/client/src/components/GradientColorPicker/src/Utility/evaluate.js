const evaluate = (store, chroma) => {
  try {
    const result = eval('((chroma, store) => {' + store.outputCode + '})')(
      chroma,
      store
    ).toString().slice(0,-1)
    return result
  } catch (err) {
    return err.toString()
  }
}

export default evaluate
