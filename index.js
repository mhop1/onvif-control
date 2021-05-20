
// (c) Mark Hopkins 2021 - See LICENSE

const Cam = require('onvif').Cam
const keypress = require('keypress')

// CSV data is read in directly from local files as should be very simple
const fs = require('fs')

// read camera information
let CAMS = []
let camData = fs.readFileSync('cameras.csv', 'utf8')
if (!camData) {
  console.log('No camera data found')
  process.exit()
}
camData = camData.split('\n')
camData.forEach(camRow => {
  camRow = camRow.trim()
  if (camRow) {
    camRow = camRow.split(',')

    if (camRow.length < 5) {
      console.log('Row too short:', camRow)
      return
    }

    const cam = {
      name: camRow[0].trim(),
      host: camRow[1].trim(),
      port: parseInt(camRow[2]),
      username: camRow[3].trim(),
      password: camRow[4].trim(),
      object: null,
      presets: []
    }

    CAMS.push(cam)
  }
})
let camera = CAMS[0]

console.log('\nCamers:', CAMS.length)
CAMS.forEach(cam => {
  console.log(cam.name)
})

//////

// read key press information
let KEYS = []
let keyData = fs.readFileSync('keys.csv', 'utf8')
if (!keyData) {
  console.log('No key data found')
  process.exit()
}
keyData = keyData.split('\n')
keyData.forEach(keyRow => {
  keyRow = keyRow.trim()
  if (keyRow) {
    keyRow = keyRow.split(',')

    if (keyRow.length < 3) {
      console.log('Row too short:', keyRow)
      return
    }

    const key = {
      ch: keyRow[0].trim(),
      preset: parseInt(keyRow[1]),
      message: keyRow[2].trim()
    }

    KEYS.push(key)
  }
})

console.log('\nKeys:')
KEYS.forEach(key => {
  console.log(key.ch + ':', key.message)
})

////

handleKeyboard = () => {
  keypress(process.stdin)
  process.stdin.setRawMode(true)
  process.stdin.resume()

  console.log('')
  console.log('Press number to choose camera, then letter to move camera.\nCtrl-C to quit.\n')

  process.stdin.on('keypress', (ch, key) => {
    // exit
    if (key && key.ctrl && (key.name === 'c' || key.name === 'C')) {
      process.exit()
    }

    /*
    // debug
    if (key) console.log('keypress:', key)
    if (ch) console.log('character:', ch)
    */

    if (ch) {
      // check if switching camera
      const chCam = ch - '1'
      if (chCam >= 0 && chCam < CAMS.length) {
        // console.log('camera to change', chCam)
        setCamera(chCam)
      }

      // check if key preset
      KEYS.forEach(key => {
        if (key.ch === ch) {
          gotoPreset(key.preset, key.message)
        }
      })
    }
  })
}

setCamera = val => {
  camera = CAMS[val]
  if (!camera) {
    console.log('ERROR: Camera has no information:', val + 1)
  } else {
    console.log('Cam:', camera.name)
  }
}

gotoPreset = (val, name) => {
  console.log('Move: ' + name)

  if (!camera || !camera.object) {
    console.log('Preset camera is not ready')
    return
  }

  if (val < 1 || val > camera.presets.length) {
    console.log('Preset is not in range of presets:', val, camera.presets)
    return
  }

  camera.object.gotoPreset({ preset : camera.presets[val - 1] }, // presets start at 1, but are stored from 0
  (err, stream, xml) => {
    if (err) {
      console.log('Error:', err)
    }
  })
}

handleCamera = (cam, err) => {
  if (err) {
    console.log('Cannot open camera:', cam, err)
    return
  }

  console.log('Camera found, getting presets:', cam.name)

  cam.object.getPresets({}, // 'default' profileToken
    (err, stream, xml) => {
      if (err) {
        console.log("getPresets failed", err)
        return

      } else {
        console.log("Controls ready for camera:", cam.name)
        for (let item in stream) {
          var name = item           // key
          var token = stream[item]  // value

          cam.presets.push(token)
        }
      }
    }
  )
}

////

handleKeyboard()

CAMS.forEach(CAM => {
  CAM.object = new Cam({
    hostname : CAM.host,
    username : CAM.username,
    password : CAM.password,
    port : CAM.port,
    timeout : 10000
  }, handleCamera.bind(null, CAM))
})
