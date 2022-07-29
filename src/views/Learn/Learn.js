import {useState, useEffect} from 'react';
import './Learn.css';
import LessonCircle from '../../components/LessonCircle/LessonCircle';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';

function Learn() {
  const [lessonCount, setLessonCount] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [balance, setBalance] = useState(0)
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};

  function generateLessonGrid(grid, lessons, spacing, xs, marginBottom) {
    let min = 0; let max;
    const elements = [];
    for (const num of grid) {
      max = min + num;
      elements.push(
          <Grid container spacing={spacing} className='lessonMap'>
            {
              lessons.slice(min, max).map((lesson, i) => {
                return (
                  <Grid item xs={xs} marginBottom={marginBottom}>
                    {lesson}
                  </Grid>
                );
              })
            }
          </Grid>
      );
      min = max;
    }
    return elements;
  }

  useEffect(() => {
    async function getLessonCount() {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lesson/count`);
      const data = await res.json();
      setLessonCount(data.count);
    }
    getLessonCount();
  }, []);

  useEffect(() => {
    const lessons = new Array(lessonCount).fill(0).map((ele, i) => {
      return <LessonCircle key={i} num={i+1} />;
    });
    setLessons(lessons);
  }, [lessonCount]);

  useEffect(()=>{
    async function getBalance () {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/balance`, {headers: authHeader});
      const data = res.data;
      setBalance(data.balance)
    }
    getBalance();
  },[])

  return (
    <>
      <div id="page-title">
        <Typography variant='h4' fontWeight={'bold'}>Learn</Typography>
        <Typography variant='h6' fontWeight={'light'} className="page-balance">Balance: {balance.toFixed(2)+ "$"}</Typography>
      </div>

      <div id="page-content">
        <Box id="desktop-map" display={{'xs': 'none', 'md': 'block'}}>
          {
            generateLessonGrid([4, 3, 4], lessons, 2, 2)
          }
        </Box>

        <Box id="mobile-map" display={{'xs': 'block', 'md': 'none'}}>
          {
            generateLessonGrid([2, 2, 2, 2, 2, 1], lessons, 2, 5, '1vh')
          }
        </Box>
      </div>
    </>
  );
}

export default Learn;
