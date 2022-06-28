import {Routes, Route} from 'react-router-dom';
// Views
import Home from './views/Home/Home';
import Portfolio from './views/Portfolio/Portfolio';
import Explore from './views/Explore/Explore';
import Learn from './views/Learn/Learn';
import Contact from './views/Contact/Contact';
import Settings from './views/Settings/Settings';
import Crypto from './views/Crypto/Crypto';
import Lesson from './views/Lesson/Lesson';
import NotFound from './views/NotFound/NotFound';
// Components
import Sidebar from './components/Sidebar/Sidebar';
// CSS
import './App.css';

function App() {
  return (
    <div className="App" id="outer-container">
      <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'}/>
      <div id="page-wrap">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Home />} />
          <Route path='/registration' element={<Home />} />
          <Route path='/portfolio' element={<Portfolio />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/learn' element={<Learn />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='crypto' element={<Explore />} />
          <Route path='/crypto/:symbol' element={<Crypto />} />
          <Route path='/learn/id/:lessonId' element={<Lesson />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
