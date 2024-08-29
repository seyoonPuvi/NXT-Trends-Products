import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    filterByRating,
    filterByCategory,
    activeCategoryId,
    activeRatingId,
    onClearAllFilters,
    filterBySearchInput,
    searchInput,
  } = props

  const onRatingFilter = id => {
    filterByRating(id)
  }

  const onCategoryFilter = id => {
    filterByCategory(id)
  }

  const onSearchInput = event => {
    if (event.key === 'Enter') {
      const text = event.target.value
      filterBySearchInput(text)
    }
  }

  const clearFilter = () => onClearAllFilters()

  const renderCategoryFilter = () =>
    categoryOptions.map(each => {
      const activeClassName =
        each.categoryId === activeCategoryId ? 'custom-category' : null

      return (
        <li key={each.categoryId}>
          <p
            className={`category-btn ${activeClassName}`}
            onClick={() => onCategoryFilter(each.categoryId)}
          >
            {each.name}
          </p>
        </li>
      )
    })

  const renderRatingFilter = () =>
    ratingsList.map(each => {
      const activeClassName =
        each.ratingId === activeRatingId ? 'custom-category' : null

      return (
        <li key={each.ratingId}>
          <p
            className="category-btn"
            onClick={() => onRatingFilter(each.ratingId)}
          >
            <img
              src={each.imageUrl}
              alt={`rating ${each.ratingId}`}
              className="star-img"
            />
            <span className={`rating-desc ${activeClassName}`}>&Up</span>
          </p>
        </li>
      )
    })

  return (
    <div className="filters-group-container">
      <div className="search-cont">
        <input
          type="search"
          placeholder="search"
          className="search"
          onKeyDown={onSearchInput}
        />
        <BsSearch className="search-logo" />
      </div>
      <ul className="category-cont">
        <h1 className="category-title">Category</h1>
        {renderCategoryFilter()}
      </ul>

      <ul className="category-cont">
        <h1 className="category-title">Rating</h1>
        {renderRatingFilter()}
      </ul>

      <div className="clear-filter-btn-cont">
        <button
          type="button"
          className="clear-filter-btn"
          onClick={clearFilter}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default FiltersGroup
