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

function Transaction() {
  let navigate = useNavigate();
  let [ data, setData ] = useState([])
  let [ firstLoad, setFirstLoad] = useState(true)

  useEffect(() =>{
    if (firstLoad){
        var tempData = [];
        for (var i = 0 ; i<10; i++){
            var temp = {
                date: new Date() - Math.random(),
                symbol : "BTC",
                quantity: 1,
                buyingPrice: 3000,
            }
            tempData.push(temp);
        }
        console.log(tempData);
        setData(tempData)
        setFirstLoad(false);
    } 
  })
  return (
    <>
      <div id="page-title">
        <Typography variant="h4" fontWeight={"bold"}>
          Transaction
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                  data.length>0 && data.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell align='center'>
                        {item.date}
                      </TableCell>
                      <TableCell align='center'>
                        {item.symbol}
                      </TableCell>
                      <TableCell align='center'>
                        {item.quantity}
                      </TableCell>
                      <TableCell align='center'>
                        {item.buyingPrice}
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
