import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
	books: [],
	isLoading: false,
};

const bookSlice = createSlice({
	name: "eBook",
	initialState: initialState,
	reducers: {
		toggleFavoriteBook: (state, action) => {
			state.books.forEach((item) => {
				if (item.id === action.payload) {
					item.isFavorite = !item.isFavorite;
				}
			});
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getEbookThunk.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(getEbookThunk.fulfilled, (state, action) => {
			state.books = action.payload;
			state.isLoading = false;
		});
		builder.addCase(getEbookThunk.rejected, (state, action) => {
			console.log(action.payload);
			state.isLoading = false;
		});
		builder.addCase(addBookRequestThunk.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(addBookRequestThunk.fulfilled, (state) => {
			state.isLoading = false;
		});
		builder.addCase(addBookRequestThunk.rejected, (state) => {
			state.isLoading = false;
		});
	},
});

export const { addBooks, deleteBook, toggleFavoriteBook, getBooks } =
	bookSlice.actions;
export const selectBooks = (state) => state.ebook.books;
export default bookSlice.reducer;

export const getEbookThunk = createAsyncThunk(
	"eBook/getBooks",
	async (_, thunkApi) => {
		try {
			const response = await fetch(
				"https://ebook-25c68-default-rtdb.firebaseio.com/ebook.json"
			);
			const ebook = await response.json();
			const transformedBooks = [];
			for (const key in ebook) {
				transformedBooks.push({
					id: key,
					title: ebook[key].title,
					author: ebook[key].author,
					isFavorite: ebook[key].isFavorite,
				});
			}
			return transformedBooks;
		} catch (error) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const addBookRequestThunk = createAsyncThunk(
	"ebook/postBook",
	async (newBook, thunkApi) => {
		try {
			await fetch(
				"https://ebook-25c68-default-rtdb.firebaseio.com/ebook.json",
				{
					method: "POST",
					header: {
						"Content-type": "application/json",
					},
					body: JSON.stringify(newBook),
				}
			);
			thunkApi.dispatch(getEbookThunk());
		} catch (error) {
			thunkApi.rejectWithValue(error);
		}
	}
);

export const deleteBookThunk = createAsyncThunk(
	"ebook/deleteBook",
	async (param, thunkApi) => {
		try {
			await fetch(
				`https://ebook-25c68-default-rtdb.firebaseio.com/ebook/${param.JAVASCRIPT.ID}.json`,
				{
					method: "DELETE",
				}
			);
			thunkApi.dispatch(getEbookThunk());
		} catch (error) {
			return thunkApi.rejectWithValue(error);
		}
	}
);

export const toggleFavoriteBookThunk = createAsyncThunk(
	"ebook/toggleFavorite",
	async (param, thunkApi) => {
		try {
			await fetch(
				`https://ebook-25c68-default-rtdb.firebaseio.com/ebook/${param.JAVASCRIPT.ID}.json`,
				{
					method: "PATCH",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify(param.JAVASCRIPT.body),
				}
			);
			thunkApi.dispatch(getEbookThunk());
		} catch (error) {
			return thunkApi.rejectWithValue(error);
		}
	}
);
