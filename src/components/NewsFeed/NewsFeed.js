import {useState, useEffect} from 'react';
import './NewsFeed.css';
import ArticleSmall from '../ArticleSmall/ArticleSmall';
import InfiniteScroll from 'react-infinite-scroll-component';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [minShown, setMinShown] = useState(0);
  const [numShown, setNumShown] = useState(0);

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    async function getArticles() {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/news/feed?limit=100`);
      const data = await res.json();
      setArticles(data.articles);
    }
    getArticles();
  }, []);

  useEffect(() => {
    setMinShown(articles.length > 3 ? 3 : articles.length);
  }, [articles]);

  useEffect(() => {
    setNumShown(minShown);
  }, [minShown]);

  return (
    <>
      <div id="feed-header">
        <Typography variant="h5">News</Typography>
      </div>

      <div id="feed-news">

        <InfiniteScroll
          dataLength={numShown}
          next={() => setNumShown(Math.min(numShown + 5, articles.length))}
          hasMore={() => numShown >= articles.length ? false : true}
          id="infinite-scroll"
        />

        {articles.slice(0, numShown).map((current, index) =>
          <ArticleSmall key={index} article={current} />) }


      </div>


      <div id="feed-button">
        {numShown > minShown ? (
            <Button variant='outlined' size='large' className="toTopButton" onClick={scrollToTop}>
                To Top
            </Button>
            ) : (<></>)}
      </div>
    </>
  );
}

export default NewsFeed;
