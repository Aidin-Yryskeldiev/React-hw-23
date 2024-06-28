import { BsBookmarkStarFill, BsBookmarkStar } from "react-icons/bs";
import "./BookList.css";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteBook,
	deleteBookThunk,
	selectBooks,
	toggleFavoriteBook,
	toggleFavoriteBookThunk,
} from "../../redux/slices/eBookSlice";
import {
	selectAuthorFilter,
	selectOnlyFavoriteFilter,
	selectTitleFilter,
} from "../../redux/slices/filterSlice";

const BookList = () => {
	const eBooks = useSelector(selectBooks) || [];
	const titleFilter = useSelector(selectTitleFilter);
	const authorFilter = useSelector(selectAuthorFilter);
	const onlyFavoriteFilter = useSelector(selectOnlyFavoriteFilter);
	console.log(eBooks);
	const dispatch = useDispatch();

	function toggleFavoriteHandler(id) {
		const requestObject = eBooks.find((item) => item.id === id);
		const requestBody = {
			JAVASCRIPT: {
				ID: id,
				body: { ...requestObject, isFavorite: !requestObject.isFavorite },
			},
		};
		dispatch(toggleFavoriteBookThunk(requestBody));
	}

	function deleteBookHandler(id) {
		dispatch(deleteBookThunk({ JAVASCRIPT: { ID: id } }));
	}

	const filteredBooks = eBooks.filter((book) => {
		const matchesTitle = book.title
			.toLowerCase()
			.includes(titleFilter.toLowerCase());
		const matchesAuthor = book.author
			.toLowerCase()
			.includes(authorFilter.toLowerCase());
		const matchesFavorite = onlyFavoriteFilter ? book.isFavorite : true;
		return matchesTitle && matchesAuthor && matchesFavorite;
	});

	const highlightMatch = (text, filter) => {
		if (!filter) return text;

		const regex = new RegExp(`(${filter})`, "gi");

		return text.split(regex).map((substring, i) => {
			if (substring.toLowerCase() === filter.toLowerCase()) {
				return (
					<span key={i} className="highlight">
						{substring}
					</span>
				);
			}
			return substring;
		});
	};
	return (
		<div className="app-block book-list">
			<h2>Book List</h2>
			{eBooks.length === 0 ? (
				<p>No books available</p>
			) : (
				<ul>
					{filteredBooks.map((book, i) => (
						<li key={book.id}>
							<div className="book-info">
								{++i}. {highlightMatch(book.title, titleFilter)} by{" "}
								<strong>{highlightMatch(book.author, "")}</strong> (
								{book.source})
							</div>
							<div className="book-actions">
								<span>
									{book.isFavorite ? (
										<BsBookmarkStarFill
											className="star-icon"
											onClick={() => toggleFavoriteHandler(book.id)}
										/>
									) : (
										<BsBookmarkStar
											className="star-icon"
											onClick={() => toggleFavoriteHandler(book.id)}
										/>
									)}
								</span>
								<button onClick={() => deleteBookHandler(book.id)}>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default BookList;
