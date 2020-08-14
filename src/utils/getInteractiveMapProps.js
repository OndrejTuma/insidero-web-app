const mapIdToProps = {
  1: {
    map: 'czechia',
    projectionConfig: {
      rotate: [-15.5, -49.8, 0],
      scale: 10000,
    }
  },
  2: {
    map: 'poland',
    projectionConfig: {
      rotate: [-19, -52, 0],
      scale: 4800,
    }
  },
}

function getInteractiveMapProps (id) {
  if (!mapIdToProps.hasOwnProperty(id)) {
    return null
  }

  return mapIdToProps[id]
}

export default getInteractiveMapProps