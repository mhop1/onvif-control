# onvif-control

Easy control of presets for PZT cameras via ONVIF protocols

Pan, Zoom, and Tilt cameras can be controlled remotely if they have the standard ONVIF protocol.

Main use for this software is when cameras are for recording/broadcasting a performance or service on a stage, rather than general surveillance.

Using camera presets set to known positions (e.g. to a singer), keyboard presses can quickly bring different cameras onto the same target.
This makes live changes a lot easier.

Uses NodeJS.

## Installation

### NPM

npm install onvif-control - install latest stable version

npm install mhop1/onvif-control - install latest version from GitHub


## Configuration

### Cameras

Cameras will have a server built-in so they can be accessed over the network.

Create/edit the file called cameras.csv and put the detail for each camera on a seperate line:

NAME, IP ADDRESS, PORT, USERNAME, PASSWORD

```
1 Left, 192.168.1.190, 80, USERNAME, PASSWORD
2 Middle, 192.168.1.191, 80, USERNAME, PASSWORD
3 Right, 192.168.1.192, 80, USERNAME, PASSWORD
```

They don't have to have the number first in the name, but it makes it easier to identify in use.

Up to 9 cameras can be used, accessed using keys 1 through 9.

### Presets

Each camera needs to have presets set for every position it covers.
This preset should have the panning and zoom to focus on a particular location on stage, e.g. piano or singers.

Camera presets are ususally set by logging into the camera over the network, and using the browser to adjust and save them.
This will be dependent on the specific model of camera.

To give maximum flexibility, every camera should have every stage position preset into it.
The same preset number should be used for all, e.g. if the piano is preset 10 then all cameras should use that preset for the piano.

Even if in practice a camera might not be best for a specific position, it is better that it moves and you can see that, than wondering why it has not responded.
You can then choose a different camera if it is not right.

### Keys

Create/edit the file called keys.csv and put the detail for each preset on a seperate line:

CHARACTER, PRESET NUMBER, DESCRIPTION

```
a,1,All
s,3,Speaker
l,5,Left podium
L,5,Left podium
r,6,Right podium
R,6,Right podium
p,10,Piano
P,10,Piano
```

In the example, some lines are repeated with lower/upper case.
Lower and upper case are treated separately.
If you need lots of positions, then different lower/upper can lead to different preset positions.

However, if you don't need that many positions, then it is better to repeat the preset as both upper and lower case.
Then if you accidently press CAPS LOCK whilst live, it will continue to work as expected.


## Using

node index.js

Cameras and keys data will be listed.

Cameras should be found and will respond as ready, or with error information shown.

Press the number of the camera to change, then the letter to move that camera to its position.


## Open Broadcast Software (OBS)

How to use when broadcasting with OBS

Switch OBS into "studio mode" to get separate preview and live views.

Create a scene named for each camera, with that camera visible.

When in a performance, follow this sequence:

1. Select OBS scene with chosen camera e.g. 1 Left
2. Click on onvif-control window to get keyboard focus (important)
3. Press number digit for matching camera e.g. 1
4. Press letter for preset e.g. A
5. Check camera moves in preview and either:
6. Press 'transition' in OBS if you are happy, or choose a different camera/position
