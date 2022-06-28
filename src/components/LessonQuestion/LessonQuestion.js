import './LessonQuestion.css';
import Typography from '@mui/material/Typography';

function LessonQuestion(props) {
  return (
    <div className="quizQuestion">
      <div className="questionNumber">
        <Typography variant='h6'>
            Question {props.num}
        </Typography>
      </div>
      <div className="questionContent">
        <Typography variant='body1'>
          {props.content}
        </Typography>
      </div>
    </div>
  );
}

export default LessonQuestion;
