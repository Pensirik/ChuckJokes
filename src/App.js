import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  AppBar,
  CssBaseline,
  Container,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
  TextField,

} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import JokeCard from './JokeCard';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > *': {
      margin: 20,
      width: '25ch',
    },
  },
});

function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <CircularProgress />
    </div>
  );
}

function App() {

  const [jokes, setJokes] = useState([]);
  const [jokesToShow, setJokesToShow] = useState([]);
  
  const [likedJokes, setLikedJokes] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [totalOfJoke, setTotalOfJoke] = useState([]);

  const [loading, setLoading] = useState(false);

  const classes = useStyles();
  


  useEffect(() => {
    setLoading(true);
    fetchAndSetJokes();
  }, []);

  const fetchAndSetJokes = () => {
   
    fetch(
      `https://api.icndb.com/jokes?firstName=${firstName}&lastName=${lastName}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        console.log(totalOfJoke);
        setTotalOfJoke(totalOfJoke);
        setJokes(res.value);
        setJokesToShow(res.value.slice(0, totalOfJoke));
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const likeJoke = (id) => {
    if (likedJokes.find((j) => j.id === id)) return;
    const likedJoke = jokes.find((j) => j.id === id);
    setLikedJokes([likedJoke, ...likedJokes]);
  };

  const unlikeJoke = (id) => {
    const newLikedJokes = likedJokes.filter((j) => j.id !== id);
    setLikedJokes(newLikedJokes);
  };

  const changeTab = (event, value) => {
    setCurrentTab(value);
  };

  const changeName = (e) => {
    e.preventDefault();
    if (firstName === '' || lastName === '') return;
    fetchAndSetJokes();
  };

  return (
    <div className='App'>
      <CssBaseline />
      <Container>
        <Typography variant='h2' align='center' style={{ margin: 20 }}>
          Chuck  Jokes
        </Typography>
        <AppBar style={{ marginBottom: 20 }} position='sticky'>
          <Tabs value={currentTab} onChange={changeTab} centered>
            <Tab label='Home' id='home-tab' aria-controls='home-panel' />
            <Tab
              label={
                <Badge
                  color='secondary'
                  badgeContent={
                    likedJokes.length > 0 ? likedJokes.length : null
                  }
                >
                  Likes
                </Badge>
              }
              id='like-tab'
              aria-controls='like-panel'
            />
          </Tabs>
        </AppBar>
        <div role='tabpanel' hidden={currentTab !== 0}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <form onSubmit={changeName} noValidate className={classes.form}>
              <TextField
                id='firstName'
                label='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                id='lastName'
                label='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                id='totalOfJoke'
                label='Total'
                value={totalOfJoke}
                onChange={(e) => setTotalOfJoke(e.target.value)}
              />
              <Button type='submit' variant='contained' color='primary'>
                Give Me Joke
              </Button>
            </form>
          </div>

          {/* Joke cards */}
          {jokesToShow.map((joke, index) => {
              return (
                <JokeCard
                  key={joke.id}
                  joke={joke}
                  likeJoke={likeJoke}
                  unlikeJoke={unlikeJoke}
                  index={index}
                />
              );
            
          })}
          {loading && <Spinner />}
        </div>
        <div role='tabpanel' hidden={currentTab !== 1}>
          {likedJokes.map((joke) => (
            <JokeCard
              key={joke.id}
              joke={joke}
              likeJoke={likeJoke}
              unlikeJoke={unlikeJoke}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default App;