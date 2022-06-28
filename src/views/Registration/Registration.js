/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Registration() {
  const notify = (msg) => toast(msg);
  let navigate = useNavigate();

  const [response, setResponse] = useState({});
  const [failAlert, setFailAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleFailAlert(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setFailAlert(false);
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  function checkUppercase(str) {
    for (var i = 0; i < str.length; i++) {
      if (
        str.charAt(i) == str.charAt(i).toUpperCase() &&
        str.charAt(i).match(/[a-z]/i)
      ) {
        return true;
      }
    }
    return false;
  }

  function containsNumber(str) {
    return /\d/.test(str);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    const credentials = {
      username: evt.target.username.value,
      email: evt.target.email.value,
      password: evt.target.password.value,
      reenter: evt.target.reenter.value,
    };

    if (credentials.username.length < 6) {
      notify("Username should be greater than 6 letters.");
      return;
    }
    if (credentials.password.length < 6) {
      notify("Password should be greater than 6 letters.");
      return;
    }
    if (!checkUppercase(credentials.password)){
      notify("Password should contain at least one uppercase!");
      return;
    }
    if (!validateEmail(credentials.email)){
      notify("Email is not valid format!");
      return;
    }
    if (!containsNumber(credentials.password)){
      notify("Password should contain at least one number!");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, credentials)
      .then((res) => {
        console.log(`Server response: ${JSON.stringify(res.data, null, 0)}`);
        setResponse(res.data);
      })
      .catch((err) => {
        if (err.response.data.error) {
          setErrorMessage(err.response.data.error);
        } else {
          setErrorMessage(
            "Username and password should have at least 6 characters, and email should be of a valid format. Password must contain at least one uppercase, one lowercase and one number."
          );
        }
        setFailAlert(true);
      });
  }

  useEffect(() => {
    if (response.success) {
      console.log(`User successfully registered: ${response.username}`);
      navigate("/login");
    }
  }, [response]);

  return (
    <>
      <Grid container className="formContainer">
        <Grid
          item
          className="formVertical formSurrounds"
          xs={12}
          md={12}
        ></Grid>

        <Grid item md={12} className="formMiddle">
          <Grid container height={"100%"} width={"100%"}>
            <Grid
              item
              xs={0.5}
              md={4}
              className="formLeft formSurrounds"
            ></Grid>

            <Grid item xs={11} md={4} className="formBody">
              <Grid
                container
                spacing={1}
                height={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Grid item className="appLogo" xs={12} md={7}>
                  <img
                    src={require("../../imageResources/logo.png")}
                    alt="MyCryptoPal Logo"
                  />
                </Grid>

                <Grid item className="entryForm">
                  <form onSubmit={handleSubmit}>
                    <Grid
                      container
                      spacing={3}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Grid item xs={12} md={7}>
                        <Tooltip
                          title="Must have at least 6 characters"
                          placement="top"
                        >
                          <TextField
                            name="username"
                            id="register-user"
                            className="credentials"
                            label="Username"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            required
                          />
                        </Tooltip>
                      </Grid>

                      <Grid item xs={12} md={7}>
                        <TextField
                          name="email"
                          id="register-email"
                          className="credentials"
                          label="Email"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={7}>
                        <Tooltip
                          title="Must have at least 6 characters, 1 uppercase letter, 1 lowercase letter, and 1 number"
                          placement="top"
                        >
                          <TextField
                            name="password"
                            id="register-pass"
                            className="credentials"
                            label="Password"
                            type={"password"}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            required
                          />
                        </Tooltip>
                      </Grid>

                      <Grid item xs={12} md={7}>
                        <TextField
                          name="reenter"
                          id="register-reenter"
                          className="credentials"
                          label="Re-enter Password"
                          type={"password"}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          required
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button variant="outlined" size="large" type="submit">
                          Register
                        </Button>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        className="helperText"
                        id="register-helper"
                      >
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => {
                            navigate("/login");
                          }}
                        >
                          Have an Account? Sign In Here!
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={0.5}
              md={4}
              className="formRight formSurrounds"
            ></Grid>
          </Grid>
        </Grid>

        <Snackbar
          open={failAlert}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleFailAlert}
        >
          <Alert
            onClose={handleFailAlert}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>

        <Grid
          item
          className="formVertical formSurrounds"
          xs={12}
          md={12}
        ></Grid>
        <ToastContainer />
      </Grid>
    </>
  );
}

export default Registration;
