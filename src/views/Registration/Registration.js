/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';

function Registration() {

  let navigate = useNavigate();

  const [response, setResponse] = useState({});
  const [failAlert, setFailAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleFailAlert(event, reason) {
      if (reason === 'clickaway') {
        return;
      }
      setFailAlert(false);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    const credentials = {
      username: evt.target.username.value,
      email: evt.target.email.value,
      password: evt.target.password.value,
      reenter: evt.target.reenter.value,
    }

    axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, credentials)
    .then((res) => {
      console.log(`Server response: ${JSON.stringify(res.data, null, 0)}`);
      setResponse(res.data);
    })
    .catch(err => {
      if(err.response.data.error) {
        setErrorMessage(err.response.data.error);
      }
      else {
        setErrorMessage('Username and password should have at least 6 characters, and email should be of a valid format. Password must contain at least one uppercase, one lowercase and one number.')
      }
      setFailAlert(true);
    });
  }

  useEffect(() => {
    if (response.success) {
      console.log(`User successfully registered: ${response.username}`);
      navigate('/login');
    }
  }, [response]);

  return (
    <>
      <Grid container className="formContainer">
        <Grid item className="formVertical formSurrounds" xs={12} md={12}></Grid>

        <Grid item md={12} className="formMiddle">
          <Grid container height={'100%'} width={'100%'}>

            <Grid item xs={0.5} md={4} className="formLeft formSurrounds"></Grid>

            <Grid item xs={11} md={4} className="formBody">
              <Grid container spacing={1} height={'100%'} alignItems={'center'} justifyContent={'center'}>

                <Grid item className="appLogo" xs={12} md={7}>
                  <img src={require('../../imageResources/logo.png')} alt="MyCryptoPal Logo"/>
                </Grid>

                <Grid item className="entryForm">
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>

                      <Grid item xs={12} md={7}>
                        <Tooltip title="Must have at least 6 characters" placement="top">
                          <TextField name='username' id="register-user" className="credentials" label="Username" variant="outlined" InputLabelProps={{shrink: true}} required/>
                        </Tooltip>
                      </Grid>

                      <Grid item xs={12} md={7}>
                        <TextField name='email' id="register-email" className="credentials" label="Email" variant="outlined" InputLabelProps={{shrink: true}} required/>
                      </Grid>

                      <Grid item xs={12} md={7}>
                        <Tooltip title="Must have at least 6 characters, 1 uppercase letter, 1 lowercase letter, and 1 number" placement="top">
                          <TextField name='password' id="register-pass" className="credentials" label="Password" type={'password'} variant="outlined" InputLabelProps={{shrink: true}} required/>
                        </Tooltip>
                      </Grid>

                      <Grid item xs={12} md={7}>
                        <TextField name='reenter' id="register-reenter" className="credentials" label="Re-enter Password" type={'password'} variant="outlined" InputLabelProps={{shrink: true}} required/>
                      </Grid>

                      <Grid item xs={12}>
                        <Button variant="outlined" size='large' type='submit'>Register</Button>
                      </Grid>

                      <Grid item xs={12} className='helperText' id='register-helper'>
                        <Button variant="text" size='small' onClick={() => {
                          navigate('/login');
                        }}>Have an Account? Sign In Here!</Button>
                      </Grid>

                    </Grid>

                  </form>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={0.5} md={4} className="formRight formSurrounds"></Grid>

          </Grid>
        </Grid>

        <Snackbar open={failAlert} autoHideDuration={6000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleFailAlert}>
          <Alert onClose={handleFailAlert} severity="error" sx={{width: '100%'}}>
              {errorMessage}
          </Alert>
        </Snackbar>

        <Grid item className="formVertical formSurrounds" xs={12} md={12}></Grid>

      </Grid>
    </>

  );
}

export default Registration;
