import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]
const apiStatusConstanst = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    categoryOptionId: '',
    ratingOptionId: '',
    searchInput: '',
    apiStatus: apiStatusConstanst.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstanst.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, categoryOptionId, ratingOptionId, searchInput} =
      this.state

    // Construct the API URL
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryOptionId}&title_search=${searchInput}&rating=${ratingOptionId}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstanst.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstanst.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  filterBySearchInput = text => {
    this.setState({searchInput: text}, this.getProducts)
  }

  filterByRating = id => {
    this.setState({ratingOptionId: id}, this.getProducts)
  }

  filterByCategory = id => {
    this.setState({categoryOptionId: id}, this.getProducts)
  }

  onClearAllFilters = () => {
    this.setState(
      {
        categoryOptionId: '',
        ratingOptionId: '',
        searchInput: '',
      },
      this.getProducts,
    )
  }

  containerToDisplay = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstanst.inProgress:
        return this.renderLoader()

      case apiStatusConstanst.success:
        return this.renderProductsList()

      case apiStatusConstanst.failure:
        return this.renderFailure()

      default:
        return null
    }
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    // TODO: Add No Products View
    const displayProductList = productsList.length > 0
    return displayProductList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-product-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
          className="no-product-img"
        />
        <h1 className="no-product-title">No Products Found</h1>
        <p className="no-product-desc">
          We could not find any products. Try other filters.
        </p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  renderFailure = () => (
    <div className="no-product-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
        alt="products failure"
        className="no-product-img"
      />
      <p className="no-product-title">Oops! Something Went Wrong</p>
      <p className="no-product-desc">
        We are having some trouble processing your request.Please try again.
      </p>
    </div>
  )

  render() {
    const {categoryOptionId, ratingOptionId, searchInput} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          filterByRating={this.filterByRating}
          filterByCategory={this.filterByCategory}
          activeCategoryId={categoryOptionId}
          activeRatingId={ratingOptionId}
          onClearAllFilters={this.onClearAllFilters}
          filterBySearchInput={this.filterBySearchInput}
          searchInput={searchInput}
        />
        {this.containerToDisplay()}
      </div>
    )
  }
}

export default AllProductsSection
