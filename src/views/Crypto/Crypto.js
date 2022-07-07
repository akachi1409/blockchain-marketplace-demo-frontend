/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './Crypto.css';
import Alert from '@mui/material/Alert';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

function Crypto() {
  let navigate = useNavigate();
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};
  const [coinData, setCoinData] = useState({slug: '', symbol: '', circulating_supply: 0, quote: {USD: {price: 0, percent_change_24h: 0, volume_24h: 0, market_cap: 0}}});
  const [coinGraph, setCoinGraph] = useState(null);
  const [coinInfo, setCoinInfo] = useState('');
  const [coinLogo, setCoinLogo] = useState(`${process.env.REACT_APP_COIN_PLACEHOLDER}`);
  const [minTick, setMinTick] = useState(0);
  const [maxTick, setMaxTick] = useState(0);
  const [ownedAmount, setOwnedAmount] = useState(0);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [dropDialogOpen, setDropDialogOpen] = useState(false);
  const [cancelAlertOpen, setCancelAlertOpen] = useState(false);
  const [failAlertOpen, setFailAlertOpen] = useState(false);
  const [addSuccessAlertOpen, setAddSuccessAlertOpen] = useState(false);
  const [dropSuccessAlertOpen, setDropSuccessAlertOpen] = useState(false);

  const {symbol} = useParams();

  async function getOwnedAmount() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/assets/${symbol}`, {headers: authHeader});
      const data = res.data.amount;
      setOwnedAmount(data);
    } catch (err) {
      console.log('Error fetching amount owned');
      console.log(err);
    }
  }

  useEffect(() => {
    async function getCoinData() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crypto/data/${symbol}`);
        const data = res.data.cryptoData;
        console.log("data", data);
        setCoinData(data);
      } catch (err) {
        navigate('/notfound');
      }
    }
    async function getCoinInfo() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crypto/info/${symbol}`);
        const data = res.data.cryptoInfo;
        // console.log("data", data);
        setCoinInfo(data.description);
      } catch (err) {
        console.log('Error fetching info');
        console.log(err);
      }
    }
    async function getCoinGraph() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crypto/graph/${symbol}?interval=30`);
        const data = res.data.graphData;
        setMinTick(data.min);
        setMaxTick(data.max);
        setCoinGraph(data.values);
      } catch (err) {
        console.log('Error fetching ticker data');
        console.log(err);
      }
    }
    getOwnedAmount();
    getCoinData();
    getCoinInfo();
    getCoinGraph();
  }, []);

  useEffect(() => {
    if (coinData.id) {
      const logoURL = `${process.env.REACT_APP_COIN_LOGO}/${coinData.id}.png`;
      setCoinLogo(logoURL);
    }
  }, [coinData]);

  function setColor(number) {
    if (number > 0) {
      return 'green';
    } else if (number < 0) {
      return 'red';
    }
    return;
  }

  function handleAddDialogOpen() {
    setAddDialogOpen(true);
  }
  function handleDropDialogOpen() {
    setDropDialogOpen(true);
  }
  function handleAddDialogClose() {
    setAddDialogOpen(false);
    setCancelAlertOpen(true);
  }
  function handleDropDialogClose() {
    setDropDialogOpen(false);
    setCancelAlertOpen(true);
  }

  async function handleAddDialogConfirm() {
    setAddDialogOpen(false);
    const addAmount = document.getElementById('crypto-amount').value;
    if (addAmount.length === 0 || addAmount <= 0) {
      setFailAlertOpen(true);
      setDropDialogOpen(false);
    } else {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/update/assets/${coinData.symbol}`, {amount: addAmount}, {headers: authHeader});
        setAddSuccessAlertOpen(true);
      } catch (err) {
        console.log('Error updating user assets');
        console.log(err.response.data);
      }
    }
    getOwnedAmount();
  }
  async function handleDropDialogConfirm() {
    setDropDialogOpen(false);
    const dropAmount = document.getElementById('crypto-amount').value;
    if (dropAmount.length === 0 || dropAmount <= 0 || dropAmount > ownedAmount) {
      setFailAlertOpen(true);
      setDropDialogOpen(false);
    } else {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/update/assets/${coinData.symbol}`, {amount: dropAmount * -1}, {headers: authHeader});
        setDropSuccessAlertOpen(true);
      } catch (err) {
        console.log('Error updating user assets');
        console.log(err.response.data);
      }
    }
    getOwnedAmount();
  }

  function handleCancelAlertClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setCancelAlertOpen(false);
  }
  function handleFailAlertClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setFailAlertOpen(false);
  }
  function handleAddSuccessAlertClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setAddSuccessAlertOpen(false);
  }
  function handleDropSuccessAlertClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setDropSuccessAlertOpen(false);
  }

  return (
    <>
      <div id="page-title">
        <Typography variant='h4' fontWeight={'bold'}>Analytics</Typography>
      </div>

      <div id="page-content">
        <Box display={{'xs': 'none', 'md': 'block'}} id="crypto-desktop">
          <Grid container spacing={2}>
            <Grid item xs={9} id="crypto-left">
              <Grid item xs={12} id="crypto-summary" marginBottom={'5vh'}>
                <Grid container spacing={3}>
                  <Grid item xs={2} id="crypto-image">
                    <img src={coinLogo} alt="Coin"></img>
                  </Grid>

                  <Grid item xs={10} id="crypto-basic">
                    <Grid container spacing={0} height={'100%'} textAlign={'left'} alignItems={'center'}>
                      <Grid item xs={12} id="crypto-name">
                        <Typography variant='h3' fontWeight={'bold'}>
                          {coinData.name} <Chip label={coinData.symbol}/>
                        </Typography>
                      </Grid>

                      <Grid item xs={8} id="crypto-info">
                        <Grid container spacing={1}>
                          <Grid item xs={5} id="crypto-price-text">
                            <Typography variant='h6'>
                                Price (USD)
                            </Typography>
                          </Grid>
                          <Grid item xs={7} color={setColor(coinData.quote.USD.percent_change_24h)} id="crypto-price-data">
                            <Typography variant='h6'>
                              {coinData.quote.USD.price.toFixed(5)}
                            </Typography>
                          </Grid>

                          <Grid item xs={5} id="crypto-change-text">
                            <Typography variant='h6'>
                                Change (1D)
                            </Typography>
                          </Grid>
                          <Grid item xs={7} id="crypto-change-data">
                            <Typography variant='h6' color={setColor(coinData.quote.USD.percent_change_24h)}>
                              {(coinData.quote.USD.percent_change_24h / 100).toFixed(2)}%
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* <Grid item xs={4} id="crypto-buttons" textAlign={'center'}>
                        <Grid container>
                          <Grid item xs={6}>
                            <Button variant="contained" className="cryptoButtons" onClick={handleAddDialogOpen}>
                                Add
                            </Button>
                          </Grid>

                          <Grid item xs={6}>
                            <Button variant="outlined" className="cryptoButtons" onClick={handleDropDialogOpen}>
                                Drop
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>

              <ResponsiveContainer id="crypto-graph" width="100%" height={300}>
                <LineChart data={coinGraph} margin={{'left': 10, 'right': 10}}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={{fontSize: '80%'}} />

                  <YAxis type="number" allowDecimals={true} allowDataOverflow={true} tick={{fontSize: '80%'}}
                    domain={[minTick, maxTick]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="open" stroke="green" dot={false} />
                  <Line type="monotone" dataKey="close" stroke="blue" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Grid>

            <Grid container xs={3} id="crypto-right" alignItems={'center'}>
              <Grid item xs={12} textAlign={'center'} id="crypto-stats">
                <Grid item xs={12} textAlign={'center'} id="crypto-stats-title" marginBottom={'1vh'}>
                  <Typography variant='h5'>
                    Market Stats
                  </Typography>
                </Grid>

                <Grid container spacing={0.5} id="crypto-stats-data">
                  <Grid item xs={12} id="crypto-volume-title">
                    <Typography fontWeight={'bold'}>
                      Trading Volume
                    </Typography>
                  </Grid>
                  <Grid item xs={12} id="crypto-volume-data">
                    <Typography>
                      {coinData.quote.USD.volume_24h.toLocaleString('en-US')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} id="crypto-cap-title">
                    <Typography fontWeight={'bold'}>
                      Market Cap
                    </Typography>
                  </Grid>
                  <Grid item xs={12} id="crypto-cap-data">
                    <Typography>
                      {coinData.quote.USD.market_cap.toLocaleString('en-US')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} id="crypto-supply-title">
                    <Typography fontWeight={'bold'}>
                      Circulating Supply
                    </Typography>
                  </Grid>
                  <Grid item xs={12} id="crypto-supply-data">
                    <Typography>
                      {coinData.circulating_supply.toLocaleString('en-US')}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item id="crypto-more">
                <Grid textAlign={'center'} id="crypto-more-text" marginBottom={'1vh'}>
                  <Typography variant='h5'>
                    More Info
                  </Typography>
                </Grid>

                <Grid id="crypto-more-data">
                  <Typography variant='subtitle1' textAlign={'justify'}>
                    {coinInfo}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Box>

        <Box display={{'xs': 'block', 'md': 'none'}} id="crypto-mobile">

          <Grid container spacing={1}>

            <Grid item xs={12} id="crypto-top">
              <Grid container spacing={2}>
                <Grid item xs={8} textAlign={'center'} id="crypto-basic">
                  <Grid container spacing={1} height={'100%'}>

                    <Grid item xs={12} id="crypto-name">
                      <Typography variant='h5' fontWeight={'bold'}>
                        {coinData.name} <Chip label={coinData.symbol}/>
                      </Typography>
                    </Grid>

                    <Grid item xs={12} id="crypto-info">
                      <Grid container spacing={0.5}>
                        <Grid item xs={6} id="crypto-price-text">
                          <Typography>
                            Price (USD)
                          </Typography>
                        </Grid>

                        <Grid item xs={6} color={setColor(coinData.quote.USD.percent_change_24h)} id="crypto-price-data">
                          <Typography>
                            {coinData.quote.USD.price.toFixed(5)}
                          </Typography>
                        </Grid>

                        <Grid item xs={6} id="crypto-change-text">
                          <Typography>
                            Change (24h)
                          </Typography>
                        </Grid>

                        <Grid item xs={6} id="crypto-change-data">
                          <Typography color={setColor(coinData.quote.USD.percent_change_24h)}>
                            {(coinData.quote.USD.percent_change_24h / 100).toFixed(2)}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                  </Grid>
                </Grid>

                <Grid item xs={4} id="crypto-image">
                  <img src={coinLogo} alt="Coin"></img>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} marginTop={'1vh'}>
              <ResponsiveContainer id="crypto-graph" width="100%" height={300}>
                <LineChart data={coinGraph}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={{fontSize: '80%'}} />

                  <YAxis type="number" allowDecimals={true} allowDataOverflow={true} tick={{fontSize: '80%'}}
                    domain={[minTick, maxTick]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="open" stroke="green" dot={false} />
                  <Line type="monotone" dataKey="close" stroke="blue" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Grid>

            <Grid container id="crypto-stats">
              <Grid item xs={12} textAlign={'center'} marginBottom={'1vh'}>
                <Typography variant='h5'>
                  Market Stats
                </Typography>
              </Grid>

              <Grid item xs={12} textAlign={'center'} marginBottom={'1vh'} id="crypto-stats-data">
                <Grid container spacing={0.5}>
                  <Grid item xs={6} id="crypto-volume-title">
                    <Typography fontWeight={'bold'}>
                          Trading Volume
                    </Typography>
                  </Grid>

                  <Grid item xs={6} id="crypto-volume-data">
                    <Typography>
                      {coinData.quote.USD.volume_24h.toLocaleString('en-US')}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} id="crypto-cap-title">
                    <Typography fontWeight={'bold'}>
                          Market Cap
                    </Typography>
                  </Grid>

                  <Grid item xs={6} id="crypto-cap-data">
                    <Typography>
                      {coinData.quote.USD.market_cap.toLocaleString('en-US')}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} id="crypto-supply-title">
                    <Typography fontWeight={'bold'}>
                          Circulating Supply
                    </Typography>
                  </Grid>

                  <Grid item xs={6} id="crypto-supply-data">
                    <Typography>
                      {coinData.circulating_supply.toLocaleString('en-US')}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container id="crypto-more">
              <Grid item xs={12} textAlign={'center'} marginBottom={'1vh'} id="crypto-more-title">
                <Typography variant='h5'>
                  More Info
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle1' textAlign={'justify'} id="crypto-more-text">
                  {coinInfo}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12} id="crypto-buttons" marginBottom={'2vh'} textAlign='center'>
              <Grid container>
                <Grid item xs={6}>
                  <Button variant="contained" className="cryptoButtons" onClick={handleAddDialogOpen}>
                    Add
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button variant="outlined" className="cryptoButtons" onClick={handleDropDialogOpen}>
                    Drop
                  </Button>
                </Grid>
              </Grid>
            </Grid>

          </Grid>


        </Box>

        <Dialog open={dropDialogOpen} onClose={handleDropDialogClose}>
          <DialogTitle>Drop {coinData.symbol} </DialogTitle>
          <DialogContent>
            <DialogContentText>
              You currently have {ownedAmount} {coinData.symbol}. Please enter a positive quantity. Your changes will be reflected in your allocation pie chart.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="crypto-amount"
              label="Quantity"
              type="number"
              inputProps={{min: 0}}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDropDialogClose}>Cancel</Button>
            <Button onClick={handleDropDialogConfirm}>Confirm</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
          <DialogTitle>Add {coinData.symbol} </DialogTitle>
          <DialogContent>
            <DialogContentText>
            You currently have {ownedAmount} {coinData.symbol}. Please enter a positive quantity. Your changes will be reflected in your allocation pie chart.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="crypto-amount"
              label="Quantity"
              type="number"
              inputProps={{min: 0}}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddDialogClose}>Cancel</Button>
            <Button onClick={handleAddDialogConfirm}>Confirm</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={cancelAlertOpen} autoHideDuration={2000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleCancelAlertClose}>
          <Alert onClose={handleCancelAlertClose} severity="info" sx={{width: '100%'}}>
              Cancelled transaction.
          </Alert>
        </Snackbar>
        <Snackbar open={addSuccessAlertOpen} autoHideDuration={2000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleAddSuccessAlertClose}>
          <Alert onClose={handleAddSuccessAlertClose} severity="success" sx={{width: '100%'}}>
              Successfully added {coinData.symbol}!
          </Alert>
        </Snackbar>
        <Snackbar open={dropSuccessAlertOpen} autoHideDuration={2000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleDropSuccessAlertClose}>
          <Alert onClose={handleDropSuccessAlertClose} severity="success" sx={{width: '100%'}}>
              Successfully dropped {coinData.symbol}!
          </Alert>
        </Snackbar>
        <Snackbar open={failAlertOpen} autoHideDuration={2000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleFailAlertClose}>
          <Alert onClose={handleFailAlertClose} severity="warning" sx={{width: '100%'}}>
              Please enter an appropiate quantity.
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default Crypto;
