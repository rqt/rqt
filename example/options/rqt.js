import rqt from '../../src'

(async () => {
  const res = await rqt('http://rqt.adc.sh/', {
    headers: {
      'User-Agent': 'Node.js rqt',
    },
  })
})()
