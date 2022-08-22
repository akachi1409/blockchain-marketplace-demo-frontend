/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import "./Home.css";
import NewsFeed from "../../components/NewsFeed/NewsFeed";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@mui/material/styles";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
// import {
//   Tooltip,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
// } from 'recharts';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const colortheme = createMuiTheme({
  palette: {
    primary: { main: "#e91e63", contrastText: "#000" },
    secondary: { main: "#03a9f4", contrastText: "#000" },
  },
});

function Home() {
  const [allocations, setAllocations] = useState([]);
  const [colors, setColors] = useState([]);
  const authHeader = { Authorization: `JWT ${localStorage.getItem("token")}` };
  const [emptyAssetDialogBox, setEmptyAssetDialogBox] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [minTick, setMinTick] = useState(0);
  const [maxTick, setMaxTick] = useState(0);
  const [price, setPrice] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);
  const [rate, setRate] = useState(0);
  let navigate = useNavigate();

  // API call for mock asset allocation data

  const getAxios = (url) => {
    return getAxiosPromise(url);
  };
  const getAxiosPromise = (url) => {
    return new Promise((resolve) => {
      return resolve(axios.get(url));
    });
  };

  function getDataMin(data) {
    return data.reduce((currentMin, current) => {
      const lower = Math.min(current.open, current.close);
      return Math.min(lower, currentMin);
    }, Infinity);
  }

  function getDataMax(data) {
    return data.reduce((currentMax, current) => {
      const higher = Math.max(current.open, current.close);
      return Math.max(higher, currentMax);
    }, Number.NEGATIVE_INFINITY);
  }

  useEffect(() => {
    async function getAllocations() {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user/assets`,
        { headers: authHeader }
      );
      const data = res.data.assetsPrice;
      const assets = res.data.assets;
      const isEmpty = Object.keys(data).length === 0;
      if (isEmpty) {
        setEmptyAssetDialogBox(true);
      } else {
        setEmptyAssetDialogBox(false);
      }
      const assetSum = Object.values(data).reduce(
        (sum, current) => sum + current,
        0
      );
      setPrice(assetSum);
      const formattedData = Object.keys(data).reduce(
        (result, current, index) => {
          const entry = {};
          entry.name = current;
          entry.value = parseFloat(Object.values(data)[index]);
          // entry.value = parseFloat((Object.values(data)[index] / assetSum).toFixed(2));
          result.push(entry);
          return result;
        },
        []
      );
      const symbols = Object.keys(data);
      var tempData = [];
      for (var i = 0; i < symbols.length; i++) {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/crypto/graph/${symbols[i]}?interval=30`;
        const resAxios = await getAxios(url);
        console.log("===", resAxios);
        resAxios.data.graphData.values.map((item, index) => {
          if (i === 0) {
            var tempArray = {
              timestamp: item.timestamp,
              // open: item.open * assets[symbols[i]],
              close: parseInt(item.close) * assets[symbols[i]],
              price: assetSum,
            };
            tempData.push(tempArray);
          } else {
            var temp = tempData[index];
            tempData[index] = {
              timestamp: item.timestamp,
              // open: temp.open+ item.open * assets[symbols[i]],
              close: temp.close + parseInt(item.close) * assets[symbols[i]],
              price: assetSum,
            };
          }
        });
        setLastPrice(tempData[tempData.length - 1].close);
        setRate(
          ((tempData[tempData.length - 1].close / assetSum) * 100).toFixed(2)
        );
        setChartData(tempData);
        setMinTick(getDataMin(tempData));
        setMaxTick(getDataMax(tempData));
        console.log(tempData);
      }
      setAllocations(formattedData);
    }
    getAllocations();
  }, []);

  useEffect(() => {
    function getRandomColor() {
      return (
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .toString()
      );
    }
    const randomColors = new Array(allocations.length)
      .fill(0)
      .map(() => getRandomColor());
    setColors(randomColors);
  }, [allocations]);

  return (
    <>
      <div id="page-title">
        <Typography variant="h4" fontWeight={"bold"}>
          Home
        </Typography>
      </div>
      <div id="page-content">
        <div id="chart">
          <div className="homeHeader">
            <Typography variant="h5">{"Total Invested: $" + price}</Typography>
            <ThemeProvider theme={colortheme}>
              {rate > 100 ? (
               <div>
                  <div
                    className="row-control"
                  >
                      <KeyboardDoubleArrowUpIcon color="success" />
                      <Typography color="secondary" variant="body1">
                        {" Profit: " + rate + "%"}
                      </Typography>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className="row-control"
                  >
                      <KeyboardDoubleArrowDownRoundedIcon color="primary"/>
                      <Typography color="primary" variant="body1">
                        {rate + "%"}
                      </Typography>
                  </div>
                </div>
              )}
            </ThemeProvider>
            <div id="chart-container"></div>

            <ResponsiveContainer width="100%" height={300}>
              {/* <PieChart>
                <Pie data={allocations} dataKey="value" nameKey="name">
                  {allocations.map((item, index) => (
                    <Cell key={index} stroke={'#000'} strokeWidth={1} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart> */}
              <LineChart
                data={chartData}
                margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tick={{ fontSize: "60%" }} />

                <YAxis
                  type="number"
                  allowDecimals={true}
                  allowDataOverflow={true}
                  tick={{ fontSize: "60%" }}
                  domain={[minTick, maxTick]}
                />
                <Tooltip />
                <Legend />
                {/* <Line type="monotone" dataKey="open" stroke="green" dot={false} /> */}
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="blue"
                  dot={false}
                />
                {/* <Line type="monotone" dataKey="price" stroke="black" dot={false} /> */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <Dialog open={emptyAssetDialogBox} className="text-center">
          <DialogTitle> Welcome to My Crypto Pal </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Hi there! My name is Vishal Chugani and I am the founder of My
              Crypto Pal. Thank you so much for joining our platform! My Crypto
              Pal is your soon to be best friend that will answer all crypto
              related questions and even allow you to mock invest in the space!
              As a new user, we will grant you $10,000 to start your portfolio
              with any cryptocurrency you like! To have a larger allowance, we
              encourage you to complete our lessons and quizzes. Are you ready
              to start investing like Elon Musk? Click on and enjoy your
              relationship with My Crypto Pal!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate("/explore")}>Explore Crypto</Button>
          </DialogActions>
        </Dialog>
        <div className="divider"></div>
        <div id="news">
          <NewsFeed />
        </div>
      </div>
    </>
  );
}

export default Home;
