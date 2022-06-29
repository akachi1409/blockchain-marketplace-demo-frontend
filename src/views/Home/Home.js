/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import './Home.css';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

function Home() {
  const [allocations, setAllocations] = useState([]);
  const [colors, setColors] = useState([]);
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};
  const [emptyAssetDialogBox, setEmptyAssetDialogBox] = useState(false);
  let navigate = useNavigate();

  // API call for mock asset allocation data
  useEffect(() => {
    async function getAllocations() {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/assets`, {headers: authHeader});
      const data = res.data.assetsPrice;

      const isEmpty = Object.keys(data).length === 0;
      if (isEmpty) {
        setEmptyAssetDialogBox(true);
      } 
      else {
        setEmptyAssetDialogBox(false);
      }
      const assetSum = Object.values(data).reduce((sum, current) => sum + current, 0);
      const formattedData = Object.keys(data).reduce((result, current, index) => {
        const entry = {};
        entry.name = current;
        entry.value = parseFloat((Object.values(data)[index] / assetSum).toFixed(2));
        result.push(entry);
        return result;
      }, []);
      setAllocations(formattedData);
    }
    getAllocations();
  }, []);


  useEffect(() => {
    function getRandomColor() {
      return '#' + Math.floor(Math.random()*16777215).toString(16).toString();
    }
    const randomColors = new Array(allocations.length).fill(0).map(() => getRandomColor());
    setColors(randomColors);
  }, [allocations]);

  return (
    <>
      <div id="page-title">
        <Typography variant='h4' fontWeight={'bold'}>Home</Typography>
      </div>
      <div id="page-content">
        <div id="chart">
          <div className="homeHeader">
            <Typography variant='h5'>Asset Allocations</Typography>
          </div>
          <div id="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={allocations} dataKey="value" nameKey="name">
                  {allocations.map((item, index) => (
                    <Cell key={index} stroke={'#000'} strokeWidth={1} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <Dialog open={emptyAssetDialogBox}>
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
        </Dialog>
        <div className='divider'></div>
        <div id="news">
          <NewsFeed/>
        </div>
      </div>
    </>
  );
}

export default Home;
