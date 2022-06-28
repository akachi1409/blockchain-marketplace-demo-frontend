/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import AvatarUploader from '../../components/AvatarUploader/AvatarUploader';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import axios from 'axios';

function Settings() {
  let navigate = useNavigate();
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};
  const [user, setUser] = useState({});

  async function handleSubmitInfo(evt) {
    evt.preventDefault();

    const userInput = {
      firstName: evt.target.firstName.value || evt.target.firstName.placeholder,
      lastName: evt.target.lastName.value || evt.target.lastName.placeholder,
      username: evt.target.username.value || evt.target.username.placeholder,
      email: evt.target.email.value || evt.target.email.placeholder,
    };

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/update/info`, userInput, {headers: authHeader});
      navigate(0);
    } catch (err) {
      console.log('Error updating user info');
      console.log(err.response.data);
    }
  }

  async function handleSubmitCredentials(evt) {
    evt.preventDefault();

    const userInput = {
      currentPassword: evt.target.currentPassword.value,
      newPassword: evt.target.newPassword.value,
      rePassword: evt.target.rePassword.value,
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/update/credentials`, userInput, {headers: authHeader});
      navigate(0);
    }
    catch(err) {
      console.log('Error updating user password');
      console.log(err.response.data);
    }
  }

  useEffect(() => {
    async function getUser() {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/info`, {headers: authHeader});
      const data = res.data;
      setUser(data);
    }
    getUser();
  }, []);

  return (
    <>
      <div id="page-title">
        <Typography variant='h4' fontWeight={'bold'}>Settings</Typography>
      </div>

      <div id="page-content">

        <Grid container spacing={1} alignItems={'center'} justifyContent={'center'} textAlign={'center'} marginBottom={'3vh'}>

          <Grid item xs={12} md={4}>
            <AvatarUploader userId={user.user_id}/>
          </Grid>

          <Grid item xs={12} md={3.25} id={'personalize-form'} className={'settingsForm'}>
            <form onSubmit={handleSubmitInfo}>
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <Typography variant='h5' marginBottom={'1vh'}>
                      Personalize
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField name='firstName' id="fname-field" label="First Name" variant="outlined" placeholder={user.firstName} fullWidth InputLabelProps={{shrink: true}}/>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField name='lastName' id="lname-field" label="Last Name" variant="outlined" placeholder={user.lastName} fullWidth InputLabelProps={{shrink: true}}/>
                </Grid>

                <Grid item xs={12}>
                  <Tooltip title="Must have at least 6 characters" placement="top">
                    <TextField name='username' id="uname-field" label="Username" variant="outlined" placeholder={user.username} fullWidth InputLabelProps={{shrink: true}}/>
                  </Tooltip>
                </Grid>

                <Grid item xs={12}>
                  <TextField name='email' id="email-field" label="Email" variant="outlined" placeholder={user.email} fullWidth InputLabelProps={{shrink: true}}/>
                </Grid>

                <Grid item xs={12}>
                  <Button variant="outlined" size='large' type='submit'>Submit</Button>
                </Grid>
              </Grid>
            </form>
          </Grid>

          <Grid item xs={0} md={0.5}></Grid>

          <Grid item xs={12} md={3.25} id={'security-form'} className={'settingsForm'}>
            <form onSubmit={handleSubmitCredentials}>
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <Typography variant='h5' marginBottom={'1vh'}>
                        Security
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField id="curr-pass-field" name="currentPassword" label="Current Password" variant="outlined" fullWidth type={'password'} InputLabelProps={{shrink: true}} />
                </Grid>

                <Grid item xs={12}>
                  <Tooltip title="Must have at least 6 characters, 1 uppercase letter, 1 lowercase letter, and 1 number" placement="top">
                    <TextField id="new-pass-field" name="newPassword" label="New Password" variant="outlined" fullWidth type={'password'} InputLabelProps={{shrink: true}} />
                  </Tooltip>
                </Grid>

                <Grid item xs={12}>
                  <TextField id="re-pass-field" name="rePassword" label="Re-enter Password" variant="outlined" fullWidth type={'password'} InputLabelProps={{shrink: true}} />
                </Grid>

                <Grid item xs={12}>
                  <Button variant="outlined" size='large' type='submit'>Submit</Button>
                </Grid>

              </Grid>
            </form>
          </Grid>

        </Grid>
      </div>
    </>
  );
}

export default Settings;
