import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import logo from "./../../../src/headline-logo-DgE6C_gE.svg";
import axios from 'axios';

const data = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

export default function MainGrid() {
  const defaultID = 9366
  const [selected, setSelected] = useState([defaultID]);

  const [stateHistory, setHistory] = useState([]);
  const [statePicks, setPicks] = useState([]);
  const [statePlayerData, setPlayer] = useState([]);

  const apiHistory = async (userID) => {
    console.log('getting history')
    axios.get("http://localhost:8080/api/history", {
      params: {
        userid: userID
      }
    }).then((data) => {
      const response = data.data;
      setHistory(response);
    });
  };

  const apiPicks = async (userID) => {
    console.log('getting picks')
    axios.get("http://localhost:8080/api/picks", {
      params: {
        userid: userID,
        lastgw: 12
      }
    }).then((data) => {
      const response = data.data;
      setPicks(response);
    });
  };

  const getPlayerData = async (userID) => {
    const gwHistory = stateHistory;
    const lastGW = gwHistory.length;
    const picks = statePicks;
    const arrayPicks = picks[lastGW.toString()];
    const players = [];
    for (let id in arrayPicks) {
      const playerResponse = await axios.get("http://localhost:8080/api/details", {
        params: {
          id: arrayPicks[id]["element"]
        }
      })
      const player = playerResponse.data
      const person = {}
      person.id = id
      person.name = player[0]["web_name"]
      person.form = player[0]["form"]
      person.current_price = player[0]["now_cost"] / 10
      person.selected = player[0]["selected_by_percent"]
      person.gw_points = player[0]["event_points"]
      person.total_points = player[0]["total_points"]
      person.ict = player[0]["ict_index"]
      person.influence = player[0]["influence"]
      person.creativity = player[0]["creativity"]
      person.threat = player[0]["threat"]
      person.gw_trans_in = player[0]["transfers_in_event"]
      person.gw_trans_out = player[0]["transfers_out_event"]
      person.trans_ratio = player[0]["transfers_in_event"]/player[0]["transfers_out_event"]
      person.bonus = player[0]["bonus"]
      players.push(person);
    }
    setPlayer(players)
  }

  const submit = () => {
    console.log("Grabbing data for user: " + selected);
    getPlayerData(selected);
  };

  useEffect(() => {
    console.log("run useEffect on initial render for maingrid");
    console.log("useeffect ran on start for user " + selected);
    getPlayerData(defaultID);
    apiHistory(defaultID);
    apiPicks(defaultID);
  }, []);

  useEffect(() => {
    console.log("useeffect getting history and picks for user " + selected);
    apiHistory(selected);
    apiPicks(selected);
  }, [selected]);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <img src={logo} className="premier-league-logo" alt="premierleaguelogo" width="253" height="63"/>
      <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {/* {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))} */}
        {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid> */}
        <Grid size={{ xs: 12, md: 8 }}>
          <SessionsChart/>
        </Grid>
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid> */}
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        My Team
      </Typography>
      <Stack direction="row" spacing={2}>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
        <TextField 
          id="standard-basic"
          label="ID"
          variant="standard"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          type='number'
        />
        </Box>
        <Button variant="outlined" onClick={submit} >Change ID</Button>
      </Stack>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 15}}>
          <CustomizedDataGrid player={statePlayerData}/>
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            {/* <CustomizedTreeView /> */}
            {/* <ChartUserByCountry /> */}
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
