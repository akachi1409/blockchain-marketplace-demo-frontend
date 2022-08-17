import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './Lesson.css';
import LessonQuiz from '../../components/LessonQuiz/LessonQuiz';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';

function Lesson() {
  const navigate = useNavigate();
  const {lessonId} = useParams();
  const [lesson, setLesson] = useState({});
  const [questions, setQuestions] = useState(null);
  const [balance, setBalance] = useState(0)
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};

  useEffect(() => {
    async function getCurrentLesson() {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lesson/id/${lessonId}`);
      const data = await res.json();
      console.log("data", data);
      setLesson(data);
    }
    getCurrentLesson();
  }, [lessonId]);

  useEffect(() => {
    if (lesson !== undefined) {
      if (lesson.questions) {
        setQuestions(lesson.questions);
      }
    }
  }, [lesson]);

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
        <Typography variant='h4' fontWeight={'bold'}>Lesson</Typography>
        <Typography variant='h6' fontWeight={'light'} className="page-balance">Balance: {"$" + balance.toFixed(2) }</Typography>
      </div>
      <div id="page-content">
        <Stack id="lesson-body">
          <div className="lessonHeader">
            <Typography variant='h5'>
              {lesson.title}
            </Typography>
          </div>
          <div id="lesson-content">
            <Typography variant='body1'>
              {lesson.content}
            </Typography>
          </div>
        </Stack>

        <div className='divider'></div>

        <div id="lesson-quiz">
          {questions ?
          (
            <LessonQuiz lessonId={lessonId} questions={questions} />
          ) : (<></>)}
        </div>
        <div id="map-button">
          <button onClick={() => navigate('/learn')}>Back to Map</button>
        </div>
      </div>
    </>
  );
}

export default Lesson;
