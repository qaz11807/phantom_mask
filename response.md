# Response

[DBdocs](https://dbdocs.io/qaz11807/Pharmacy-Manage-Platform?table=pharmacy&schema=public&view=table_structure) : The database tables relation

Install step:

`npm install or npm ci`
set enviroment variable

```
/.env
DBHOST= #Database Host
DBNAME= #Database Name
DBUSER= #Database User
DBPASS= #Database Password, if use ssl
```

dev:
`npm run dev`

production:

```
npm run build
npm run start
```

## Required

### API Document

#### Postman

Import [this](https://www.getpostman.com/collections/5ca5a9093fc6fc2b2728) json file to Postman.
Remind to set the server host as `api_url` in enviroment variable as the.

#### SwaggerUI

You can also test the api on [this](https://pharmacy-manager-platform.herokuapp.com/api-docs).

### Import Data Commands

`npm run extract [file_name] --format=[datatype]`
| parameter name | description |
| :------------ |:---------------:|
| file_name | the json file name, pls put the file under `./data` |
| datatype | `user` or `pharmacy` |

ex. `npm run extract pharmacies --format=pharmacy`
_pls extract phamacies first!_

## Bonus

### Test Coverage Report

[X] check report [here](#test-coverage-report)

### Dockerized

[-] check my dockerfile [here](#dockerized)
have writed dockerfile and build to image, but failed to run when connect the database.

### Demo Site Url

[O] demo site is ready on [heroku](https://pharmacy-manager-platform.herokuapp.com/api-docs)
