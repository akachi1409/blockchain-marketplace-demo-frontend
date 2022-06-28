/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import './Portfolio.css';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
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

function Portfolio() {
  const INTERVAL_OPTIONS = [30, 60, 90, 120];
  const [cryptos, setCryptos] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState(null);
  const [interval, setInterval] = useState(INTERVAL_OPTIONS[0]);
  const [assets, setAssets] = useState({});
  const [symbols, setSymbols] = useState([]);
  const [minTick, setMinTick] = useState(0);
  const [maxTick, setMaxTick] = useState(0);
  const [emptyAssetDialogBox, setEmptyAssetDialogBox] = useState(false);
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};
  let navigate = useNavigate();

  useEffect(() => {
    async function getAssets() {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/assets`, {headers: authHeader});
      const data = res.data.assets;
      const isEmpty = Object.keys(data).length === 0;
      // if (isEmpty) {
      //   setEmptyAssetDialogBox(true);
      // } 
      // else {
      //   setEmptyAssetDialogBox(false);
      // }
      axios.get('https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: {
          'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
        },
      }).then((res) => console.log("res", res))
      setAssets(data);
    }
    getAssets();
  }, []);

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

  useEffect(() => {
    setSymbols(Object.keys(assets));
  }, [assets]);

  useEffect(() => {
    setSymbol(symbols[0]);
  }, [symbols]);

  useEffect(() => {
    if (!symbol | !interval) {
      return;
    }
    async function getData() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crypto/graph/${symbol}?interval=${interval}`);
        const data = res.data.graphData;
        setData(data.values);
        setMinTick(data.min);
        setMaxTick(data.max);
      } catch (err) {
        console.log('Error fetching ticker data');
        console.log(err);
      }
    }
    getData();
  }, [symbol, interval]);

  const handleChangeCrypto = (event) => setSymbol(event.target.value);

  const handleChangeInterval = (event) => setInterval(event.target.value);
  return (
    <>
      <div id="page-title">
        <Typography variant='h4' fontWeight={'bold'}>My Portfolio</Typography>
      </div>

      <div id="page-content">
        <Grid container spacing={2}>

          {/* <Grid item xs={12}>
            <Typography variant='h5' textAlign={'center'}>
              My Assets
            </Typography>
          </Grid> */}

          {/* <Dialog open={emptyAssetDialogBox}>
          <DialogTitle> Please Add Assets </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please add assets into your crypto portfolio. Empty portfolios limit the functionality of MyCryptoPal. 
              Certain features are disabled if there are no assets present. Thank you.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate('/explore')}>Explore Crypto</Button>
          </DialogActions>
        </Dialog> */}

          {/* <Grid item xs={0} md={3}/> */}

          <Grid item xs={12} md={12}>
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Asset</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Market Price</TableCell>
                    <TableCell align="center">Total Value</TableCell>
                    <TableCell align="center">Total Value(%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cryptos.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell align='center'>
                        <Link href={`/crypto/${item.symbol}`}>{item.symbol}</Link>
                      </TableCell>
                      <TableCell align='center'>
                        {item.supply}
                      </TableCell>
                      <TableCell align='center'>
                        {item.price}
                      </TableCell>
                      <TableCell align='center'>
                        {item.volume}
                      </TableCell>
                      <TableCell align='center'>
                        {item.volumeP}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* <Grid item xs={0} md={3}/> */}

          <Grid item xs={12}>
            <Typography variant='h5' textAlign={'center'}>
              Stock Graph
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container alignItems={'center'} justifyContent={'center'} spacing={3}>
              <Grid item xs={12} md={2}>
                <Select className='graphDropdown' onChange={handleChangeCrypto} fullWidth displayEmpty value={symbol}>
                  {symbols.map((s, i) => <MenuItem key={i} value={s}>{s}</MenuItem>)}
                </Select>
              </Grid>

              <Grid item xs={12} md={2}>
                <Select className='graphDropdown' onChange={handleChangeInterval} fullWidth displayEmpty value={interval}>
                  {INTERVAL_OPTIONS.map((s, i) => <MenuItem key={i} value={s}>Past {s} days</MenuItem>)}
                </Select>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{'left': 10, 'right': 10, 'top': 10, 'bottom': 10}}>
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
        </Grid>
      </div>
    </>
  );
}

export default Portfolio;
