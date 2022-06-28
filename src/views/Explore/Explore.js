import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Explore.css';
import ExploreCard from '../../components/ExploreCard/ExploreCard';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';

function Explore() {
  let navigate = useNavigate();
  const [cryptos, setCryptos] = useState([]);
  const [selected, setSelected] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function getCryptos() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crypto/explore?limit=100`);
        const data = res.data.cryptos;
        setCryptos(data);
      } catch (err) {
        console.log('Error fetching cryptos');
        console.log(err);
      }
    }
    getCryptos();
  }, []);

  function handleAlertClose(evt, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  function handleSearch() {
    if (selected) {
      navigate(`/crypto/${selected}`);
    } else {
      setOpen(true);
    }
  }

  function handleSortChange(evt) {
    const filter = evt.target.value;
    const sorted = [...cryptos].sort((a, b) => a[filter] < b[filter]);
    setCryptos(sorted);
  }

  return (
    <>
      <div id="page-title">
        <Typography variant='h4' fontWeight={'bold'}>Explore</Typography>
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

        <Grid container marginTop={'2vh'} id="crypto-collage" marginBottom={'3vh'}>

          <Grid item xs={12} marginBottom={'2vh'}>

            <Box id='desktop-sort' display={{'xs': 'none', 'md': 'flex'}}>
              <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>

                <Grid item md={2}>
                  <Typography variant='h5' textAlign={'right'} height={'100%'}>
                    Most Popular By
                  </Typography>
                </Grid>

                <Grid item md={2} textAlign={'left'}>
                  <Select id='sort-select' defaultValue={'cap'} onChange={handleSortChange} fullWidth>
                    <MenuItem value={'cap'}>Market Cap</MenuItem>
                    <MenuItem value={'supply'}>Circulating Supply</MenuItem>
                    <MenuItem value={'volume'}>Volume (24H)</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Box>

            <Box id='phone-sort' display={{'xs': 'flex', 'md': 'none'}}>
              <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>

                <Grid item xs={12}>
                  <Typography variant='h5' textAlign={'center'} height={'100%'}>
                    Most Popular By
                  </Typography>
                </Grid>

                <Grid item xs={8} textAlign={'left'}>
                  <Select id='sort-select' defaultValue={'cap'} onChange={handleSortChange} fullWidth>
                    <MenuItem value={'cap'}>Market Cap</MenuItem>
                    <MenuItem value={'supply'}>Circulating Supply</MenuItem>
                    <MenuItem value={'volume'}>Volume (24H)</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Box>


          </Grid>

          <Grid item xs={12}>

            <Grid container spacing={2}>


              {cryptos.slice(0, 20).map((coin, i) => {
                return <Grid item key={i} xs={6} md={3}>
                  <ExploreCard key={i} symbol={coin.symbol} pic={coin.pic}/>
                </Grid>;
              })}

            </Grid>

          </Grid>

        </Grid>
      </div>

      <Snackbar open={open} autoHideDuration={5000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="info" sx={{width: '100%'}}>
              Select a crypto
        </Alert>
      </Snackbar>
    </>

  );
}

export default Explore;
