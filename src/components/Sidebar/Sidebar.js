import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import {slide as Menu} from 'react-burger-menu';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExploreIcon from '@mui/icons-material/Explore';
import SchoolIcon from '@mui/icons-material/School';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LogoutIcon from '@mui/icons-material/Logout';

function Sidebar() {

  let navigate = useNavigate();
  
  return (
    <Menu customBurgerIcon={ <img src={require('../../imageResources/graphicfavicon.ico')} />}>
      <Grid id="home" className="menu-item" onClick={() => navigate('/')}>
        <Grid container spacing={1} alignItems={'center'} justifyContent={'center'}>
          <Grid item xs={2}>
            <img src={require('../../imageResources/graphicfavicon.ico')} id="appLogo"/>
          </Grid>
          <Grid item xs={10}>
            <Typography fontSize={27} fontWeight={'bold'}>MyCryptoPal</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid id="portfolio" className="menu-item" >
        <Grid container spacing={1} onClick={() => navigate('/portfolio')}>
          <Grid item>
            <AssignmentIcon/>
          </Grid>
          <Grid item>
            <Typography variant='body1' className="subItem">Portfolio</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid id="explore" className="menu-item" >
        <Grid container spacing={1} onClick={() => navigate('/explore')}>
          <Grid item>
            <ExploreIcon />
          </Grid>
          <Grid item>
            <Typography variant='body1' className="subItem">Explore Cryptos</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid id="learn" className="menu-item" >
        <Grid container spacing={1} onClick={() => navigate('/learn')}>
          <Grid item>
            <SchoolIcon />
          </Grid>
          <Grid item>
            <Typography variant='body1' className="subItem">Learn</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid id="contact" className="menu-item" >
        <Grid container spacing={1} onClick={() => navigate('/contact')}>
          <Grid item>
            <AlternateEmailIcon />
          </Grid>
          <Grid item>
            <Typography variant='body1' className="subItem">Contact Us</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid id="settings" className="menu-item" >
        <Grid container spacing={1} onClick={() => navigate('/settings')}>
          <Grid item>
            <SettingsIcon />
          </Grid>
          <Grid item>
            <Typography variant='body1' className="subItem">Settings</Typography>
          </Grid>
        </Grid>
      </Grid>    

      <Grid id="transaction" className="menu-item" >
        <Grid container spacing={1} onClick={() => navigate('/transaction')}>
          <Grid item>
            <HistoryIcon />
          </Grid>
          <Grid item>
            <Typography variant='body1' className="subItem">Transaction</Typography>
          </Grid>
        </Grid>
      </Grid> 

      <Grid id="trade" className="menu-item" >
        <Grid container spacing={1} onClick={() => navigate('/trade')}>
          <Grid item>
            <MonetizationOnIcon />
          </Grid>
          <Grid item>
            <Typography variant='body1' className="subItem">Trade</Typography>
          </Grid>
        </Grid>
      </Grid>     

      <Grid id="logout" className="menu-item" >
        <Grid container spacing={1} onClick={() => {
          localStorage.removeItem('token');
          navigate('/logout');
          navigate(0);
          }}>
          <Grid item>
            <LogoutIcon />
          </Grid>
          <Grid item>
            <Typography variant='body1' className="subItem">Logout</Typography>
          </Grid>
        </Grid>
      </Grid>    
    </Menu>
  );
}

export default Sidebar;
