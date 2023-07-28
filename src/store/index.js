import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_KEY, TMDB_BASE_URL } from '../utils/constants';
import axios from 'axios'

const initialState = {
    movies: [],
    genresLoaded: false,
    genres: []
};

export const getGenres = createAsyncThunk("netflix/genres", async()=>{
    const {data: {genres}} = await axios.get(
        ("https://api.themoviedb.org/3/genre/movie/list?api_key=e9d811bea5940b5918f82343dc8406a1")
    );
    return genres;  
});

const createArrayFromRawData = (array, moviesArray, genres)=> {
    array.forEach((movie) => {
        const movieGenres = [];
        movie.genre_ids.forEach((genre)=> {
            const name = genres.find(({ id }) => id === genre);
            if(name) {
                movieGenres.push(name.name)
            };
        });
        if (movie.backdrop_path) {
            moviesArray.push({
                id: movie.id,
                name: movie?.original_name ? movie.original_name : movie.original_title,
                image: movie.backdrop_path,
                genres: movieGenres.slice(0,3)
            });
        }
    });
}

const getRawData = async (api, genres, paging = false)=> {
    const moviesArray = [];
    for (let i = 1;  moviesArray.length < 60 && i < 10; i++) {
        const {data: {results}} = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
        createArrayFromRawData(results, moviesArray, genres);
    }
    return moviesArray;
}

export const fetchDataByGenre = createAsyncThunk("netflix/genre",
  async ({genre, type}, thunkAPI)=> {
    const { 
        netflix: { genres },    
    } = thunkAPI.getState();
    return getRawData(`https://api.themoviedb.org/3/discover/${type}?api_key=e9d811bea5940b5918f82343dc8406a1&with_genres=${genre}`, genres);
  }
); 

export const fetchMovies = createAsyncThunk("netflix/trending", 
  async ({type}, thunkAPI)=> {
    const { 
        netflix: { genres },    
    } = thunkAPI.getState();
    return getRawData(`${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`, genres, true);
  }
);

const NetflixSlice = createSlice({
    name: "Netflix",
    initialState,
    extraReducers: (builder)=> {
        builder.addCase(getGenres.fulfilled,(state,action)=> {
            state.genres = action.payload;
            state.genresLoaded = true;
        });
        builder.addCase(fetchMovies.fulfilled,(state,action)=> {
            state.movies = action.payload;
        });
        builder.addCase(fetchDataByGenre.fulfilled,(state,action)=> {
            state.movies = action.payload;
        });
    }
});

export const store = configureStore({
    reducer: {
        netflix: NetflixSlice.reducer
    }
});