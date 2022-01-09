# Vaccination Reservation

## Description/Assumptions
Health Centers/Vaccination Centers can employ multiple nurses and a single nurse is assumed to cater a single patient every 15 minutes (purely fictional and can be adjusted depending on real world parameters). A work hours field is also set on health centers to determine the nurses' number of hours to work(max 12 hours).

## Requirements
Node.js => v12.14.0

MongoDB => v5.0

## Installation
### Back End
``` bash
$ cd /vaccination-center/backend
$ npm install
$ nodemon index.js
```
### Front End
``` bash
$ cd /vaccination-center/frontend
$ npm install
$ npm start-pc (for windows) or npm start-mac (for mac/linux)
```

### Database
``` bash
$ mongo
> use slots
```
### Seeds
Create `health_centers` collection in slots database and import below JSON
``` json
{
    "_id": {
        "$oid": "61d8410fab8f25f0c1394633"
    },
    "name": "Health Center 1",
    "Address": "Test Address 123",
    "nurses": [{
        "$oid": "61d84125ab8f25f0c1394634"
    }, {
        "$oid": "61d84063ab8f25f0c1394622"
    }],
    "work_hours": "8"
},
{
    "_id": {
        "$oid": "61d8415bab8f25f0c1394637"
    },
    "name": "Health Center 2",
    "Address": "Test Address 123",
    "nurses": [{
        "$oid": "61d84125ab8f25f0c1394634"
    }],
    "work_hours": "9"
}
```

Create `users` collection in `slots` database and import below JSON:
``` json
{
    "_id": {
        "$oid": "61d84063ab8f25f0c1394622"
    },
    "full_name": "Jane Doe",
    "role": "nurse"
},
{
    "_id": {
        "$oid": "61d8406dab8f25f0c1394624"
    },
    "full_name": "John Doe",
    "role": "nurse"
}
```

## Usage
Go to http://localhost:8000