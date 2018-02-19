
// LYRIC INFO
const songList = {
  1: "Don't want to be a fool for you, Just another player in your game for two, You may hate me but it ain't no lie, Baby bye bye bye, Bye bye, I Don't want to make it tough, I just want to tell you that I've had enough, It might sound crazy but it ain't no lie, Baby bye bye bye".split(', '),
  2: "One baby to another says, I'm lucky to have met you, I don't care what you think, Unless it is about me, It is now my duty to completely drain you, A travel through a tube, And end up in your infection, Chew your meat for you, Pass it back and forth, In a passionate kiss, From my mouth to yours, I like you".split(', ')
};

// INITIAL REDUX STATE
const initialState = {
  currentSongId: null,
  //currentSongId is a SLICE!
  songsById: {
    1: {
      title: 'Bye Bye Bye',
      artist: 'N Sync',
      songId: 1,
      songArray: songList[1],
      arrayPosition: 0
    },
    //songsById is another SLICE! woo
    2: {
      title: 'Drain You',
      artist: 'Nirvana',
      songId: 2,
      songArray: songList[2],
      arrayPosition: 0
    }
  }
};

// REDUX REDUCER (communicates desired state mutations to the store via actions)
//provide initialState as an argument
const lyricChangeReducer = (state = initialState.songsById, action) => {

  // Declares several variables used below, without yet defining.
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;

  switch (action.type) {
    case 'NEXT_LYRIC':
    // Locates the arrayPosition of the song whose ID was provided
    // in the action's payload, and increments it by one:
    newArrayPosition = state[action.currentSongId].arrayPosition + 1
    // Creates a copy of that song's entry in the songsById state slice,
    // and adds the updated newArrayPosition value we just calculated as its arrayPosition:
    newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
      arrayPosition: newArrayPosition
    })
    // Creates a copy of the entire songsById state slice, and adds the
    // updated newSongsById state entry we just created to this new copy:
    newSongsByIdStateSlice = Object.assign({}, state, {
      [action.currentSongId]: newSongsByIdEntry
    })
    // Returns the entire newSongsByIdStateSlice we just constructed, which will
    // update state in our Redux store to match this returned value:
    return newSongsByIdStateSlice;

  case 'RESTART_SONG':
  // Creates a copy of the song entry in songsById state slice whose ID matches
  // the currentSongId included with the action, sets the copy's arrayPosition value
  // to 0:
  newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
    arrayPosition: 0
  //action.currentSongId is separate from state at this point--it came from the payload in the action
  })
  // Creates a copy of the entire songsById state slice, and adds the
  // updated newSongsByIdEntry we just created to this copy:
  newSongsByIdStateSlice = Object.assign({}, state, {
    [action.currentSongId]: newSongsByIdEntry
  });
  //whole slice o' state being passed in here^, guys
  // Returns the entire newSongsByIdStateSlice we just constructed, which will
  // update the songsById state slice in our Redux store to match the new slice returned:
  return newSongsByIdStateSlice;
  // If action is neither 'NEXT_LYRIC' nor 'RESTART_STATE' type, return existing state:
  default:
    return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type) {
    case 'CHANGE_SONG':
      return action.newSelectedSongId
    default:
      return state;
  }
}

const rootReducer = this.Redux.combineReducers({ currentSongId: songChangeReducer, songsById: lyricChangeReducer});

// REDUX STORE (holds and mutates the state)
const { createStore } = Redux;
const store = createStore(rootReducer);

// JEST TESTS + SETUP
const { expect } = window;
expect(lyricChangeReducer(initialState.songsById, { type: null})).toEqual(initialState.songsById);
expect(lyricChangeReducer(initialState.songsById, { type: 'NEXT_LYRIC', currentSongId: 2 })).toEqual({
  1: {
    title: 'Bye Bye Bye',
    artist: 'N Sync',
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0
  },
  2: {
    title: 'Drain You',
    artist: 'Nirvana',
    songId: 2,
    songArray: songList[2],
    arrayPosition: 1
  }
});

expect(lyricChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId: 1 })).toEqual({
  1: {
    title: 'Bye Bye Bye',
    artist: 'N Sync',
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0
  },
  2: {
    title: 'Drain You',
    artist: 'Nirvana',
    songId: 2,
    songArray: songList[2],
    arrayPosition: 0
  }
});

expect(songChangeReducer(initialState.currentSongId, { type: 'CHANGE_SONG', newSelectedSongId: 1})).toEqual(1);

expect(rootReducer(initialState, { type: null })).toEqual(initialState);

expect(store.getState().currentSongId).toEqual(songChangeReducer(undefined, { type: null }));
expect(store.getState().songsById).toEqual(lyricChangeReducer(undefined, { type: null }));


//RENDERING STATE IN DOM
const renderLyrics = () => {
  // defines a lyricsDisplay constant referring to the div with a 'lyrics' ID in index.html
  const lyricsDisplay = document.getElementById('lyrics');
  // if there are already lyrics in this div, remove them one-by-one until it's empty:
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }

  if (store.getState().currentSongId) {
    const currentLine =               document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[store.getState().songsById[store.getState().currentSongId].arrayPosition]);
    document.getElementById('lyrics').appendChild(currentLine);
  } else {
    const selectSongMessage = document.createTextNode("Select a song from the menu above to sing along!");
    document.getElementById('lyrics').appendChild(selectSongMessage);
  }
}

const renderSongs = () => {
  console.log('renderSongs method successfully fired!');
  console.log(store.getState());
  const songsById = store.getState().songsById;
  for (const songKey in songsById) {
    const song = songsById[songKey];
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    const songTitle = document.createTextNode(song.title);
    const songArtist = document.createTextNode(`by ${song.artist}`);
    em.appendChild(songTitle);
    h3.appendChild(em);
    h3.appendChild(songArtist);
    h3.addEventListener('click', function() {
      selectSong(song.songId);
    });
    li.appendChild(h3);
    document.getElementById('songs').appendChild(li);
  }
}

// runs renderLyrics() method from above when page is finished loading.
// window.onload is HTML5 version of jQuery's $(document).ready()
window.onload = function() {
  renderSongs();
  renderLyrics();
}
// CLICK LISTENER (actions are dispatched when we want to trigger a state mutation, i.e., on  a clickety click)
const userClick = () => {
  if (store.getState().songsById[store.getState().currentSongId].arrayPosition === store.getState().songsById[store.getState().currentSongId].songArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG', currentSongId: store.getState().currentSongId});
  } else {
    store.dispatch({ type: 'NEXT_LYRIC', currentSongId: store.getState().currentSongId});
  }
}

const selectSong = (newSongId) => {
  let action;
  if (store.getState().currentSongId) {
    action = {
      type: 'RESTART_SONG',
      currentSongId: store.getState().currentSongId
    }
    store.dispatch(action);
  }
  action = {
    type: 'CHANGE_SONG',
    newSelectedSongId: newSongId
  }
  store.dispatch(action);
}

//SUBSCRIBE TO REDUX STORE
store.subscribe(renderLyrics);
