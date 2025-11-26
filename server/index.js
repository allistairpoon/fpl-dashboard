import express from 'express';
import cors from 'cors';
// import path from 'path';
import axios from 'axios';
import { User, Player } from "fpl-ts";

const PORT = 8080;
const app = express();

app.use(cors());
const corsOptions = {
    origin: "http://localhost:3000"
};

// app.use(express.static(path.join(__dirname, './clientBuild')))

app.get("/api/player", cors(corsOptions), async (req, res) => {
  try {
    const URL = "https://fantasy.premierleague.com/api/entry/9366/history/";
    const response = await axios.get(URL, {
      headers: {},
    })
    res.send(response.data);

  } catch (err) {
    res.send(err);
  }
});

app.get("/api/history", cors(corsOptions), async (req, res) => {
  try {
    console.log('getting history')
    const myuser = new User(9366)
    const response = await myuser.gwHistory();
    console.log('history ' + JSON.stringify(response))
    res.send(response);

  } catch (err) {
    res.send(err);
  }
});

app.get("/api/picks", cors(corsOptions), async (req, res) => {
  try {
    console.log('getting picks')
    const myuser = new User(9366)
    const lastGW = 12;
    const picks = await myuser.getPicks([lastGW]);
    console.log('picks ' + JSON.stringify(picks))
    res.send(picks);

  } catch (err) {
    res.send(err);
  }
});

app.get("/api/details", cors(corsOptions), async (req, res) => {
  try {
    console.log('getting details')
    const player = await new Player([
          req.query.id,
        ]).getDetails(false, false);
    console.log('details ' + JSON.stringify(player))
    res.send(player);

  } catch (err) {
    res.send(err);
  }
});

app.get("/api/moredetails", cors(corsOptions), async (req, res) => {
  try {
    console.log('getting more details')
    const player = await new Player([
          req.query.id,
        ]).getDetails(true, false);
    console.log('more details ' + JSON.stringify(player))
    res.send(player);

  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, () => {
      console.log(`server listening at http://localhost:${PORT}`)
})