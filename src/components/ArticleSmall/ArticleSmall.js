import './ArticleSmall.css';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import {useEffect, useState} from 'react';

function ArticleSmall(props) {
  const [article, setArticle] = useState({});

  useEffect(() => {
    setArticle(props.article);
  }, [props.article]);

  return (
    <>
      <Grid container className={`articleSmall`}>
        <Grid item xs={12} md={4} className={`articleSmallPicture`} onClick={() => window.open(article.url)}>
          <img src={article.imageUrl} alt=""></img>
        </Grid>

        <Grid item xs={0} md={0.5}></Grid>

        <Grid item xs={12} md={7.5} className={`articleSmallContent`}>

          <Grid container spacing={3} marginTop={0} height={'100%'}>

            <Grid item xs={12} className={`articleSmallTitle`}>
              <Box display={{'xs': 'none', 'md': 'block'}}>
                <Typography variant='h6' textAlign={'left'}>
                  {article.title}
                </Typography>
              </Box>

              <Box display={{'xs': 'block', 'md': 'none'}}>
                <Typography variant='body'>
                  {article.title}
                </Typography>
              </Box>

            </Grid>

            <Grid item xs={12} className={`articleSmallSummary`}>

              <Box display={{'xs': 'none', 'md': 'block'}}>
                <Typography variant='body' textAlign={'justify'}>
                  {article.summary}
                </Typography>
              </Box>

              <Box display={{'xs': 'block', 'md': 'none'}}>
                <Typography variant='caption' textAlign={'justify'}>
                  {article.summary}
                </Typography>
              </Box>

            </Grid>

            <Grid item xs={12}>
              {
                (() => {
                  if (article.source) {
                    return <Chip className={'articleSourceChip'} label={article.source} />;
                  } else {
                    return <Chip className={'articleSourceChip'} label="" />;
                  }
                })()
              }
            </Grid>

          </Grid>

        </Grid>


      </Grid>
    </>
  );
}

export default ArticleSmall;
