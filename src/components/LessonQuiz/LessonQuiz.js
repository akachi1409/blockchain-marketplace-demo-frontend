/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './LessonQuiz.css';
import LessonQuestion from '../../components/LessonQuestion/LessonQuestion';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import axios from 'axios';

function LessonQuiz(props) {
  const navigate = useNavigate();
  const authHeader = {Authorization: `JWT ${localStorage.getItem('token')}`};
  const [progress, setProgress] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const [correctOpen, setCorrectOpen] = useState(false);
  const [incorrectOpen, setIncorrectOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  async function getProgress() {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/progress/${props.lessonId}`, {headers: authHeader});
    const data = res.data;
    setProgress(data.progress);
  }

  useEffect(() => {
    getProgress();
    setQuestions(props.questions);
  }, []);

  useEffect(() => {
    if (questions) {
      setCurrentQuestion(questions[0]);
    }
  }, [questions]);

  useEffect(() => {
    if (progress) {
      setCorrectCount(Object.keys(progress).length);
      const questionNum = currentQuestion.number;
      if (progress[questionNum]) {
        document.getElementById('quiz-answer').value = currentQuestion.answer;
        document.getElementById('quiz-answer').setAttribute('readonly', true);
        if (!complete) {
          document.getElementById('quiz-center').style.visibility = 'hidden';
        }
      } else {
        document.getElementById('quiz-answer').value='';
        document.getElementById('quiz-answer').removeAttribute('readonly', false);
        document.getElementById('quiz-center').style.visibility = 'visible';
      }
      if (questionNum === questions[0].number) {
        document.getElementById('left-arrow').style.visibility = 'hidden';
      } else if (questionNum === questions.slice(-1)[0].number) {
        document.getElementById('right-arrow').style.visibility = 'hidden';
      } else {
        document.getElementById('left-arrow').style.visibility = 'visible';
        document.getElementById('right-arrow').style.visibility = 'visible';
      }
    }
  }, [progress, currentQuestion]);

  useEffect(() => {
    if (questions) {
      if (correctCount === questions.length) {
        setCompleteOpen(true);
        setComplete(true);
        document.getElementById('quiz-center').style.visibility = 'visible';
      }
    }
  }, [correctCount]);

  function redirectEnterKey() {
    const centerButton = document.getElementById('quiz-center');
    centerButton.click();
  }

  function getQuestionIndex(questionNum) {
    return questionNum - 1 - 3 * (props.lessonId - 1);
  }

  function prevQuestion() {
    setCurrentQuestion(questions[getQuestionIndex(currentQuestion.number) - 1]);
  }

  function nextQuestion() {
    setCurrentQuestion(questions[getQuestionIndex(currentQuestion.number) + 1]);
  }

  async function checkAnswer() {
    const answerBox = document.getElementById('quiz-answer');
    const userAnswer = answerBox.value.toLowerCase();
    const isCorrect = (userAnswer === currentQuestion.answer.toLowerCase());
    if (isCorrect) {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/update/progress/${props.lessonId}`, {questionNumber: currentQuestion.number}, {headers: authHeader});
      getProgress();
      document.getElementById('quiz-center').style.visibility = 'hidden';
      answerBox.value = currentQuestion.answer;
      setCorrectOpen(true);
    } else {
      setIncorrectOpen(true);
    }
  }

  function advanceLessons() {
    navigate(`/learn/id/${parseInt(props.lessonId)+1}`);
    navigate(0);
  }

  function handleCorrectClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setCorrectOpen(false);
  };

  function handleIncorrectClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setIncorrectOpen(false);
  };

  function handleCompleteClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setCompleteOpen(false);
  };

  return (
    <>
      <Stack>
        <div className='quizHeader'>
          <Typography variant='h5'>
                        Quiz
          </Typography>
        </div>

        <div className='quizQuestion'>
          {<LessonQuestion num={currentQuestion.number} content={currentQuestion.text} />}
        </div>

        <div className="quizAnswer">
          <TextField name="user-answer" id="quiz-answer" variant="filled" onKeyDown={(evt) => {
            if (evt.key === 'Enter') {
              if (!progress[currentQuestion.number]) {
                redirectEnterKey();
              }
            }
          }}/>
        </div>

        {questions ? (
                    <div id="quiz-progress">
                      <LinearProgress variant="determinate" value={correctCount / questions.length * 100} />
                    </div>
                ) : (<></>)}


        <Grid container className="quizButtons">

          <Grid item xs={3.5} md={1} alignItems={'center'} justifyContent={'center'}>
            <IconButton id="left-arrow" className="quizArrows leftArrow" onClick={prevQuestion}>
              <ArrowCircleLeftIcon color='primary' sx={{fontSize: 50}} />
            </IconButton>
          </Grid>

          <Grid item xs={4} md={3}>
            {(complete ? (
                                <Button id="quiz-center" variant="outlined" type="button" value="Check" onClick={advanceLessons}>Continue</Button>
                            ) :
                            (
                                <Button id="quiz-center" variant="outlined" type="button" value="Check" onClick={checkAnswer}>Check</Button>
                            ))}
          </Grid>

          <Grid item xs={3.5} md={1} alignItems={'center'} justifyContent={'center'}>
            <IconButton id="right-arrow" className="quizArrows rightArrow" onClick={nextQuestion}>
              <ArrowCircleRightIcon color='primary' sx={{fontSize: 50}} />
            </IconButton>
          </Grid>

        </Grid>

      </Stack>

      <Snackbar open={correctOpen} autoHideDuration={3000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleCorrectClose}>
        <Alert onClose={handleCorrectClose} severity="success" sx={{width: '100%'}}>
                    Correct!
        </Alert>
      </Snackbar>

      <Snackbar open={incorrectOpen} autoHideDuration={3000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleIncorrectClose}>
        <Alert onClose={handleIncorrectClose} severity="warning" sx={{width: '100%'}}>
                    Incorrect! Try Again.
        </Alert>
      </Snackbar>

      <Snackbar open={completeOpen} autoHideDuration={3000} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleCompleteClose}>
        <Alert onClose={handleCompleteClose} severity="success" sx={{width: '100%'}}>
                    Congratulations. You've completed this lesson's quiz!
        </Alert>
      </Snackbar>
    </>
  );
}

export default LessonQuiz;
