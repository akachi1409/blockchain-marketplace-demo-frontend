import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Link from '@mui/material/Link';

function Transaction() {
  let navigate = useNavigate();
  let [ data, setData ] = useState([])
  let [ firstLoad, setFirstLoad] = useState(true)
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};

  useEffect(() =>{
    async function getHistory(){
      if (firstLoad){
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/history`, {headers: authHeader});
        const history = res.data;
        console.log("data", history)
        setData(history.historys);
        setFirstLoad(false);
      }
    }
    getHistory();
  },[firstLoad])
  return (
    <>
      <div id="page-title">
        <Typography variant="h4" fontWeight={"bold"}>
        Transaction History
        </Typography>
      </div>

      <div id="page-content">
        <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Cryptocurrency</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Buying Price</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                  data.length>0 && data.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell align='center'>
                        {item.date.substring(5,7)+ "/" + item.date.substring(8,10)+ "/" + item.date.substring(0, 4) + " " + item.date.substring(11, 19)}
                      </TableCell>
                      <TableCell align='center'>
                      <Link href={`/crypto/${item.symbol}`}>{item.symbol}</Link>
                        {/* {item.symbol} */}
                      </TableCell>
                      <TableCell align='center'>
                        {item.amount}
                      </TableCell>
                      <TableCell align='center'>
                        {item.price.toString().split(".")[0]+"." + item.price.toString().split(".")[1].substring(0,2)}
                      </TableCell>
                      <TableCell align='center'>
                        {item.action}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Transaction;
