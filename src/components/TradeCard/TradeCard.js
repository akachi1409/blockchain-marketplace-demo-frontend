import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import './TradeCard.css';

function TradeCard(props) {
  let navigate = useNavigate();

  return (
    <>
      <Grid container className="exploreCard" onClick={() => navigate(`/trade/${props.symbol}`)}>
        <Grid item xs={5} md={2.5} className="cardImage">
          <img src={props.pic} alt = 'crypto-logo'/>
        </Grid>
        <Grid item xs={5} md={2.5} className="cardName">
          <Typography variant={'h6'} className="cardTitle">{props.symbol}</Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default TradeCard;
