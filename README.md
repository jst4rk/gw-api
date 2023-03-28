<!-- ## Description

[Nest](https://github.com/nestjs/nest)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
``` -->

## Gateway Management REST Service
This project is a REST service built using Node.js and MongoDB for storing and managing information about gateways and their associated devices.

# Table of Contents
- Installation
- Usage
- API Endpoints
- Deployment
- Testing
- Technologies Used

## Installation

```bash
$ npm install
```
## Test Data

You need to have MongoDB installed on your system, you can do it following this [link](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition). Dowloand and install the correct version for your OS. Once you have MongoDB installed you need to import he devices.json into the devices collection. You can find the device.json file in the root of the project repo.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Usage

After starting the server, you can access the API endpoints using a tool like Postman or through the [UI provided](https://jst4rk.github.io/gw-ui/).

The UI provides a simple interface for adding, removing, and viewing gateways and their associated devices.

## API Endpoints
### Gateways
- GET /gateways: returns a list of all the stored gateways and their devices.
- POST /gateways: adds a new gateway to the database.
  ```
  {
    "serialId": "0000487",
    "name": "Gateway 1",
    "ipv4Address": "192.168.0.1",
    "peripheralDevices": [
      "64219cd591b193269f690da7",
      "64219ce391b193269f690dab",
      "64219cf991b193269f690daf"
    ]
  }
  ```
- GET /gateways/:id: returns details for a single gateway with the specified mongo ObjectId.
- PACTH /gateways/:id: update a gateway with the specified mongo ObjectId.
  ```
    {
      "serialId": "0000487",
      "name": "Gateway 1",
      "ipv4Address": "192.168.0.1",
      "peripheralDevices": [
        "64219cd591b193269f690da7",
        "64219ce391b193269f690dab",
        "64219cf991b193269f690daf"
      ]
    }
  ```
- DELETE /gateways/:id removes a gateway with the specified mongo ObjectId.

### Devices
- GET /devices: returns a list of all the stored devices.
- POST /devices: adds a new device to the database.
  ```
  {
    "uid": "658498v",
    "vendor": "Elavon",
    "createdAt": "2023-02-05T07:30:00.000Z",
    "status": "offline"
  }
  ```
- GET /devices/:id: returns details for a single device with the specified mongo ObjectId.
- PACTH /devices/:id: update a device with the specified mongo ObjectId.
  ```
  {
    "uid": "658498v",
    "vendor": "Elavon",
    "createdAt": "2023-02-05T07:30:00.000Z",
    "status": "offline"
  }
  ```
- DELETE /devices/:id removes a device with the specified mongo ObjectId.

## Deployment
This project is automatically deployed to Heroku every time changes are pushed to the main branch. https://gw-api.herokuapp.com/

## Testing

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Technologies Used
- Node.js ([NestJs](https://github.com/nestjs/nest))
- MongoDB


## Author
Dayron Alfaro
