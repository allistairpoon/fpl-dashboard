import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import axios from 'axios';

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

const defaultID = 9366
// const gwHistory =  await axios.get("http://localhost:8080/api/history", {
//   params: {
//     userid: defaultID
//   }
// })
// const lastGW = gwHistory.data.length;

// const picks =  await axios.get("http://localhost:8080/api/picks", {
//   params: {
//     userid: defaultID,
//     lastgw: lastGW
//   }
// })
// const arrayPicks = picks.data[lastGW];
// const players = [];
// const initialPlayerName = players.map(a => a.name)

// const myuser = new User(defaultID)
// const gwHistory = await myuser.gwHistory();
// const lastGW = 12;
// const picks = await myuser.getPicks([lastGW]);
// for (let id in arrayPicks) {
//   // const player = await new Player([
//   //   arrayPicks[id]["element"],
//   // ]).getDetails(false, false);
//   // console.log("basic arrayPicks: " + arrayPicks[id]["element"]);
//   const player = await axios.get("http://localhost:8080/api/details", {
//     params: {
//       id: arrayPicks[id]["element"]
//     }
//   })
//   const element = {}
//   element.id = player.data[0]["id"]
//   element.name = player.data[0]["web_name"]
//   players.push(element);
// }

export default function SessionsChart(props) {
  //user id
  const [user, setUser] = useState([defaultID]);
  //array of player names
  const [playerNames, setPlayerNames] = useState([]);
  //dropdown 1st player selected
  const [selected, setSelected] = useState(['player']);
  //data  1st player for chart
  const [player, setPlayer] = useState([]);
  //dropdown 2nd player selected
  const [selected2, setSelected2] = useState(['player']);
  //data  2nd player for chart
  const [player2, setPlayer2] = useState([]);
  //most recent gameweek
  const [mostRecentGameweek, setHistory] = useState([]);
  //array of element ids
  const [statePicks, setPicks] = useState([]);
  //array of element ids and names
  const [stateDetails, setDetails] = useState([]);

  const apiHistory = async (userID) => {
    // console.log('getting history with user: ' + userID)
    axios.get("http://localhost:8080/api/history", {
      params: {
        userid: userID
      }
    }).then((data) => {
      const response = data.data;
      // console.log('mostRecentGameweek: ' + JSON.stringify(response.length))
      setHistory(response.length);
    });
  };

  const apiPicks = async (userID) => {
    // console.log('getting picks with user: ' + userID + ' for gw' + mostRecentGameweek)
    axios.get("http://localhost:8080/api/picks", {
      params: {
        userid: userID,
        lastgw: mostRecentGameweek
      }
    }).then((data) => {
      const response = data.data[mostRecentGameweek];
      const elementIDs = [];
      for (let id in response) {
        elementIDs.push(response[id]["element"]);
      }
      // console.log('array of element ids: ' + JSON.stringify(elementIDs))
      setPicks(elementIDs);
    });
  };

  const apiDetails = async (arrayOfElements) => {
    // console.log('getting details with arrayOfElements: ' + arrayOfElements);
    const apiUrl = `http://localhost:8080/api/details`;
    const playerDetails = [];
    for (let id in arrayOfElements) {
      axios.get(apiUrl
        , {
          params: {
            id: arrayOfElements[id]
          }
        }
      ).then((data) => {
          const element = {}
          element.id = data.data[0]["id"]
          element.name = data.data[0]["web_name"]
          playerDetails.push(element);
          if(playerDetails.length === 15 ) {
            // console.log('playerDetails: ' + JSON.stringify(playerDetails));
            setDetails(playerDetails)
          }
      });
    }
  };

  const apiMoreDetails = async (selectedElement, whichPlayer) => {
    if (selectedElement.length !== 0) {
      // console.log('getting details with selectedElement: ' + JSON.stringify(selectedElement));
      const apiUrl = `http://localhost:8080/api/moredetails`;
      axios.get(apiUrl
        , {
          params: {
            id: selectedElement[0].id
          }
        }
      ).then((data) => {
        const pointsArray = [];
        const pointsArray2 = [];
        const summary = Object.fromEntries(
          Object.entries(data.data[0]).filter(
            ([key, value]) => key === 'summary' 
          )
        );
        const history = Object.fromEntries(
          Object.entries(summary['summary']).filter(
            ([key, value]) => key === 'history' 
          )
        );
        for (let gameweek = 0; gameweek < history['history'].length; gameweek++) {
          const totalPoints = Object.fromEntries(
            Object.entries(history['history'][gameweek]).filter(
              ([key, value]) => key === 'total_points' 
            )
          );
          whichPlayer ? pointsArray.push(totalPoints['total_points']) : pointsArray2.push(totalPoints['total_points'])
        }
        const missingWeeks = mostRecentGameweek - history['history'].length;
        for (let i = 0; i < missingWeeks; i++) {
          if (history['history'].length < mostRecentGameweek) {
            whichPlayer ? pointsArray.unshift(0) : pointsArray2.unshift(0)
          }
        }
        whichPlayer ? console.log('points: ' + JSON.stringify(pointsArray)) : console.log('points: ' + JSON.stringify(pointsArray2));
        whichPlayer ? setPlayer(pointsArray) : setPlayer2(pointsArray2);
      });
    } else {
      console.log('no player selected');
    }
  };

  const theme = useTheme();
  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  //x-axis
  const data = [];
  for (let gameweek = 1; gameweek < mostRecentGameweek+2; gameweek++){
    data.push(gameweek)
  }

  const getPlayerData = async (userID, playerName, whichPlayer) => {
    try {
      var playerArray = stateDetails.filter(function (player) {
        return player.name ===  playerName
      });
      // console.log('apiMoreDetails stateDetails: ' + JSON.stringify(stateDetails))
      apiMoreDetails(playerArray, whichPlayer)
    } catch (e) {
      console.log(e);
    }
      // const myuser = new User(userID)
      // const gwHistory = await myuser.gwHistory();
      // const gwHistory =  await axios.get("http://localhost:8080/api/history", {
      //   params: {
      //     userid: userID
      //   }
      // })
      // console.log('mostRecentGameweek ' + mostRecentGameweek);
      // const lastGW = gwHistory.data.length;
      // const picks = await myuser.getPicks([lastGW]);
      // const picks =  await axios.get("http://localhost:8080/api/picks", {
      //   params: {
      //     userid: userID,
      //     lastgw: lastGW
      //   }
      // })
      // const arrayPicks = picks.data[lastGW];
      // const elementOfIDs = statePicks;
      // console.log("elementOfIDs: " + JSON.stringify(elementOfIDs));
      // for (let id in elementOfIDs) {
      //   // const player = await new Player([
      //   //   arrayPicks[id]["element"],
      //   // ]).getDetails(false, false);
      //   console.log("getPlayerData arrayPicks: " + elementOfIDs[id]);
      //   const player = await axios.get("http://localhost:8080/api/details", {
      //     params: {
      //       id: elementOfIDs[id]
      //     }
      //   })
      //   const element = {}
      //   element.id = player.data[0]["id"]
      //   element.name = player.data[0]["web_name"]
      //   players.push(element);
      // }

      // console.log('playerArray: ' + JSON.stringify(playerArray))
      // // const id = playerArray[0].id
      // // const player = await new Player([
      // //   id
      // // ]).getDetails(true, false);
      // const player2 = await axios.get("http://localhost:8080/api/moredetails", {
      //   params: {
      //     id: playerArray[0].id
      //   }
      // })
      // const summary = Object.fromEntries(
      //   Object.entries(player2.data[0]).filter(
      //     ([key, value]) => key === 'summary' 
      //   )
      // );
      // const history = Object.fromEntries(
      //   Object.entries(summary['summary']).filter(
      //     ([key, value]) => key === 'history' 
      //   )
      // );
      // for (let gameweek = 0; gameweek < lastGW; gameweek++) {
      //   const totalPoints = Object.fromEntries(
      //     Object.entries(history['history'][gameweek]).filter(
      //       ([key, value]) => key === 'total_points' 
      //     )
      //   );
      //   whichPlayer ? pointsArray.push(totalPoints['total_points']) : pointsArray2.push(totalPoints['total_points'])
      // }
      // whichPlayer ? setPlayer(pointsArray) : setPlayer2(pointsArray2);
  };

  const getPlayerNames = async (userID) => {
    // console.log("getPlayerNames with user: " + userID);
    // console.log('stateDetails: ' + JSON.stringify(stateDetails))
    setPlayerNames(stateDetails.map(a => a.name))
    // const myuser = new User(userID)
    // const gwHistory = await myuser.gwHistory();
    // const gwHistory =  await axios.get("http://localhost:8080/api/history", {
    //   params: {
    //     userid: userID
    //   }
    // })
    // const lastGW = gwHistory.data.length;
    // // const picks = await myuser.getPicks([lastGW]);
    // const picks =  await axios.get("http://localhost:8080/api/picks", {
    //   params: {
    //     userid: userID,
    //     lastgw: lastGW
    //   }
    // })
    // const arrayPicks = picks.data[lastGW];
    // const players = [];
    // for (let id in arrayPicks) {
    //   // console.log("getPlayerNames arrayPicks: " + arrayPicks[id]["element"]);
    //   // const player = await new Player([
    //   //   arrayPicks[id]["element"],
    //   // ]).getDetails(false, false);
    //   const player = await axios.get("http://localhost:8080/api/details", {
    //     params: {
    //       id: arrayPicks[id]["element"]
    //     }
    //   })
    //   const element = {}
    //   element.id = player.data[0]["id"]
    //   element.name = player.data[0]["web_name"]
    //   players.push(element);
    // }
    //update stateDetails
  }

  const submit = () => {
    console.log("Grabbing data for first player: " + selected);
    getPlayerData(user, selected, true);
  };

  const submit2 = () => {
    console.log("Grabbing data for second player: " + selected2);
    getPlayerData(user, selected2, false);
  };

  const updateUser = () => {
    console.log("Grabbing data for user: " + user);
    getPlayerNames(user);
  };

  useEffect(() => {
    apiHistory(defaultID);
    console.log("run useEffect on initial render for chart");
    console.log("useeffect ran on start for user " + defaultID);
    console.log("most recent gw: " + mostRecentGameweek);
  }, []);

  useEffect(() => {
    console.log("run useEffect on initial render for user " + defaultID);
    apiPicks(defaultID);
  }, [mostRecentGameweek]);

  useEffect(() => {
    console.log("run useEffect on state change for user " + user);
    apiPicks(user);
  }, [user]);

  useEffect(() => {
    console.log("run useEffect on state change for statePicks " + statePicks);
    apiDetails(statePicks);
  }, [statePicks, mostRecentGameweek]);

  useEffect(() => {
    console.log("run useEffect on state change for stateDetails " + JSON.stringify(stateDetails));
    getPlayerNames(defaultID);
  }, [stateDetails]);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
      <Stack direction="row" spacing={2}>
        {/* <InputLabel id="fpl-multiple-name-label">Players</InputLabel> */}
          <Select
            labelId="fpl-multiple-name-label"
            id="fpl-multiple-name"
            // multiple
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            <MenuItem key = "player" value="player">
                <em>select</em>
            </MenuItem>
            {playerNames.map((name) => (
              <MenuItem
                key={name}
                value={name}
                // style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
          <Button variant="outlined" onClick={submit} >Update</Button>
          <Select
            labelId="fpl-multiple-name-label"
            id="fpl-multiple-name"
            // multiple
            value={selected2}
            onChange={(e) => setSelected2(e.target.value)}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            <MenuItem key = "player" value="player">
                <em>select</em>
            </MenuItem>
            {playerNames.map((name) => (
              <MenuItem
                key={name}
                value={name}
                // style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
          <Button variant="outlined" onClick={submit2} >Update</Button>
          <TextField 
              id="standard-basic"
              label="ID"
              variant="standard"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              type='number'
            />
          {/* <Button variant="outlined" onClick={updateUser} >Change ID</Button> */}
        </Stack>
        <Typography variant="title" color="inherit" noWrap>
          &nbsp;
        </Typography>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Historical Data
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          {/* <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              13,277
            </Typography>
            <Chip size="small" color="success" label="+35%" />
          </Stack> */}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Round Points
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data,
              // tickInterval: (index, i) => (i + 1) % 5 === 0,
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: 'selected',
              label: selected,
              showMark: false,
              curve: 'linear',
              //stack: 'total',
              //stackOrder: 'ascending',
              data: player,
              area: true,
            },
            {
              id: 'selected2',
              label: selected2,
              showMark: false,
              curve: 'linear',
              //stack: 'total',
              //stackOrder: 'ascending',
              data: player2,
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-organic': {
              fill: "url('#organic')",
            },
            '& .MuiAreaElement-series-referral': {
              fill: "url('#referral')",
            },
            '& .MuiAreaElement-series-direct': {
              fill: "url('#direct')",
            },
          }}
          // hideLegend
        >
          <AreaGradient color={theme.palette.primary.dark} id="organic" />
          <AreaGradient color={theme.palette.primary.main} id="referral" />
          <AreaGradient color={theme.palette.primary.light} id="direct" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
