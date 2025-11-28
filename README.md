## Fantasy Premier League
======================

### Description

The goal was to create an FPL Dashboard which has graphs and stats that are missing from the official site.  These include a historical graph for selectable players and stats.  For example, you might wish to compare the points per round for two players over all the gameweeks.  Another idea is to have a table for your picks but to be able to sort the data by each column.  A good example is to sort your picks by form or gameweek transfers out.  This would quickly 'suggest' who you should transfer out.  Currently, you cannot do this on the site or the app.

### Design

+ Material UI is an open-source React component library.  Use a Material UI template that uses Material UI and MUI X components.

+ Use a JS wrapper for the FPL API.  This wrapper would make the axios requests to the api to retrieve the required data for the graphs and tables.

+ Uses React hooks to update page dynamically. 

+ Easy to add more mui components  to the grid.

+ Backend node server to proxy the requests to the FPL API.

<img width="1512" height="1173" alt="Screenshot 2025-11-19 at 13 23 27" src="https://github.com/user-attachments/assets/d2cbf10d-9ad2-42ed-a158-213a08faa52c" />

### Acknowledgement


+ [roboflank](https://github.com/roboflank/fpl-ts) for the JS/TS wrapper for Fantasy Premier League API

### Running project locally

You can run the project locally by doing the following steps:

Start node server
```
cd fpl-dashboard/server
node index.js
```

Start frontend
```
cd fpl-dashboard
npm install
npm start
```

## Links

+ [JS/TS wrapper for Fantasy Premier League API](https://github.com/roboflank/fpl-ts)

+ [JS/TS wrapper for Fantasy Premier League API - Guide & Examples](https://roboflank.github.io/fpl-ts/api)

+ [Fantasy Premier League API Endpoints: A Detailed Guide](https://medium.com/@frenzelts/fantasy-premier-league-api-endpoints-a-detailed-guide-acbd5598eb19)

+ [Material UI Templates](https://mui.com/material-ui/getting-started/templates/)

+ [Free React Dashboard Templates 2025](https://mui.com/store/collections/free-react-dashboard/)

+ [Material UI docs ](https://mui.com/material-ui/getting-started/)

+ [MUI X docs ](https://mui.com/x/introduction/)

+ [Postman collection](https://www.postman.com/fplassist/fpl-assist/documentation/zqlmv01/fantasy-premier-league-api)
