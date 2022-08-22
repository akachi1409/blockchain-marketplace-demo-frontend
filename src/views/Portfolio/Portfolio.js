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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
  const [assetsPrice, setAssetsPrice] = useState({})
  const [symbols, setSymbols] = useState([]);
  const [minTick, setMinTick] = useState(0);
  const [maxTick, setMaxTick] = useState(0);
  const [emptyAssetDialogBox, setEmptyAssetDialogBox] = useState(false);
  const [balance, setBalance] = useState(0)
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};
  let navigate = useNavigate();

  useEffect(() => {
    async function getAssets() {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/assets`, {headers: authHeader});
      const data = res.data;
      // console.log("data:", data);
      setAssets(data.assets);
      setAssetsPrice(data.assetsPrice)
      const isEmpty = Object.keys(data).length === 0;
      if (isEmpty) {
        setEmptyAssetDialogBox(true);
      } 
      else {
        setEmptyAssetDialogBox(false);
      }
    }
    getAssets();
  }, []);

  useEffect(()=>{
    async function getBalance () {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/balance`, {headers: authHeader});
      const data = res.data;
      setBalance(data.balance)
    }
    getBalance();
  },[])

  useEffect(() => {
    async function getCryptos() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/crypto/explore?limit=100`);
        const data = res.data.cryptos;
        const tempData = []
        data.map((item, index) => {
          if (assets[item.symbol]>0){
            var price = item.price.toString().split(".")[0] +"." + item.price.toString().split(".")[1].substring(0,2)
            var percent =  (((parseFloat(assetsPrice[item.symbol]) - parseFloat(item.price)* parseFloat(assets[item.symbol])))/parseFloat(price* assets[item.symbol])*100).toString()
          
            console.log(percent)
            
            const temp = {
              symbol: item.symbol,
              supply: assets[item.symbol],
              price: price,
              volumn: price* assets[item.symbol],
              volumnP: percent.split(".")[0] + "." + percent.split(".")[1].substring(0, 2)+ "%"
            }
            console.log(temp);
            tempData.push(temp)
          }
          
        })
        setCryptos(tempData);
      } catch (err) {
        console.log('Error fetching cryptos');
        console.log(err);
      }
    }
    getCryptos();
  }, [assetsPrice]);

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
        <Typography variant='h6' fontWeight={'light'} className="page-balance">Balance: {"$" + balance.toFixed(2) }</Typography>
      </div>

      <div id="page-content">
        <Grid container spacing={2}>
          <Dialog open={emptyAssetDialogBox} className="text-center">
            <DialogTitle> Welcome to My Crypto Pal </DialogTitle>
            <DialogContent>
              <DialogContentText>
              Hi there! My name is Vishal Chugani and I am the founder of My Crypto Pal. Thank you so much for joining our platform! My Crypto Pal is your soon to be best friend that will answer all crypto related questions and even allow you to mock invest in the space! As a new user, we will grant you $10,000 to start your portfolio with any cryptocurrency you like! To have a larger allowance, we encourage you to complete our lessons and quizzes. Are you ready to start investing like Elon Musk? Click on and enjoy your relationship with My Crypto Pal!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => navigate('/explore')}>Explore Crypto</Button>
            </DialogActions>
          </Dialog>
          <Grid item xs={12} md={12}>
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Asset</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Market Price</TableCell>
                    <TableCell align="center">Total Value</TableCell>
                    <TableCell align="center">Profit/Loss(%)</TableCell>
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
                        {item.volumn}
                      </TableCell>
                      {
                       parseInt(item.volumeP)>0 ? (
                          <TableCell align='center' className="green">
                            {item.volumnP}
                          </TableCell>
                        ):
                        (
                          <TableCell align='center' className="red">
                            {item.volumnP}
                          </TableCell>
                        )
                      }
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h5' textAlign={'center'}>
              Currency Graph
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
