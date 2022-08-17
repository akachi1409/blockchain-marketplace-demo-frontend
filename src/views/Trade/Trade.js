import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TradeCard from '../../components/TradeCard/TradeCard';
// import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// import Snackbar from "@mui/material/Snackbar";
import axios from "axios";

function Trade() {
  let navigate = useNavigate();
  const [cryptos, setCryptos] = useState([]);
  const [selected, setSelected] = useState('');
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState(0)
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};

  function handleSearch() {
    if (selected) {
      navigate(`/crypto/${selected}`);
    } else {
      setOpen(true);
    }
  }
  useEffect(() => {
    async function getCryptos() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/crypto/explore?limit=100`
        );
        const data = res.data.cryptos;
        setCryptos(data);
      } catch (err) {
        console.log("Error fetching cryptos");
        console.log(err);
      }
    }
    getCryptos();
  }, []);

  useEffect(()=>{
    async function getBalance () {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/balance`, {headers: authHeader});
      const data = res.data;
      setBalance(data.balance)
    }
    getBalance();
  },[])

  return (
    <>
      <div id="page-title">
        <Typography variant="h4" fontWeight={"bold"}>
          Trade
        </Typography>
        <Typography variant='h6' fontWeight={'light'} className="page-balance">Balance: {"$"+balance.toFixed(2) }</Typography>
      </div>
      <div id="page-content">
        <Grid container spacing={4}>
        <Grid item xs={12}>
            <Typography variant='h5' textAlign={'center'}>
              Search Crypto
            </Typography>
          </Grid>

          <Grid item xs={8} md={10}>
            <Autocomplete
              autoHighlight openOnFocus disableClearable
              id="crypto-dropdown"
              options={[...cryptos].sort((a, b) => a.label > b.label)}
              sx={{width: '100%'}}
              isOptionEqualToValue={(option, value) =>{
                return option.symbol === value.symbol;
              } }
              onChange={(evt, value) => setSelected(value.symbol)}
              renderInput={(params) => <TextField {...params} label="Cryptocurrency"
              />}
            />
          </Grid>

          <Grid item xs={4} md={2}>
            <Box>
              <Button variant="outlined" id='explore-search' onClick={handleSearch}>Search</Button>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          marginTop={"2vh"}
          id="crypto-collage"
          marginBottom={"3vh"}
        >
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {cryptos.slice(0, 20).map((coin, i) => {
                return (
                  <Grid item key={i} xs={6} md={3}>
                    <TradeCard key={i} symbol={coin.symbol} pic={coin.pic} />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Trade;
