/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import './Contact.css';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

function Contact() {
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};
  const [faqs, setFAQs] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [user, setUser] = useState(false);

  useEffect(() => {
    async function getUser() {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/info`, {headers: authHeader});
      const data = res.data;
      setUser(data);
    }
    async function getFAQs() {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/info/faq`);
      const data = res.data;
      setFAQs(data.faqs);
    }
    getUser();
    getFAQs();
  }, []);

  async function handleSubmitMessage(evt) {
    evt.preventDefault();
    
    const userInput = {
      name: evt.target.contactName.value || evt.target.contactName.placeholder,
      email: evt.target.contactEmail.value || evt.target.contactEmail.placeholder,
      message: evt.target.contactMessage.value,
      user_id: user.user_id,
    };

    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/info/contact`, userInput);
    if(res.data.success) {
      setAlertOpen(true);
    }
    else {
      console.log(res.data.error);
    }
  }

  function handleAlertClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <div id="page-title">
        <Typography variant='h4' fontWeight={'bold'}>Contact Us</Typography>
      </div>

      <div id="page-content">
        <Grid container direction={'column'} spacing={3}>
          <Grid item id="frequently-asked">
            <Typography variant='h5' marginBottom={'3vh'}>
              Frequently Asked Questions
            </Typography>
            { (faqs ?
                faqs.map((faq, i) => {
                  return (
                    <Accordion key={i}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant='subtitle1' align='justify'>
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant='body2' align='justify'>
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                }) : (<></>))
            }
          </Grid>

          <Grid item id="contact-us">
            <Typography variant='h5' marginBottom={'3vh'}>
              Still Need Help? Contact Us!
            </Typography>
            <form id="contact-form" onSubmit={handleSubmitMessage}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField name='contactName' id="contact-name" label="Your Name" variant="outlined" placeholder={`${user.firstName || ' '} ${user.lastName || ' '}`} fullWidth InputLabelProps={{shrink: true}}/>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField name='contactEmail' id="contact-email" label="Your Email" variant="outlined" placeholder={user.email} fullWidth InputLabelProps={{shrink: true}}/>
                </Grid>

                <Grid item xs={12}>
                  <TextField name='contactMessage' id="contact-message" label="Your Message" variant="outlined" multiline rows={12} fullWidth InputLabelProps={{shrink: true}} required/>
                </Grid>

                <Grid item xs={12} justifyContent={'flex-end'}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button variant="outlined" size='large' type='submit'>Submit</Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Grid>

          <Snackbar open={alertOpen} autoHideDuration={5000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleAlertClose}>
            <Alert onClose={handleAlertClose} severity="success" sx={{width: '100%'}}>
            Thank you for your message! Our team will get back to you shortly :)
            </Alert>
          </Snackbar>
        </Grid>
      </div>
    </>
  );
}

export default Contact;
