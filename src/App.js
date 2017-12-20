import React, { Component } from 'react';
import banner from './images/banner.jpg';
import StarRatingComponent from 'react-star-rating-component';

class CookingApp extends Component {
  constructor(){
    super();
    this.state = {
      recipes: [],
      loading:true,
      rating: 3
    }
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
}

componentDidMount(){
    fetch('https://api.myjson.com/bins/gg3eh')
    .then((response)=>{
      return response.json()
    })
    .then((json)=>{
      const menu = json.recipes.map((item)=>item.category);
      this.setState({
        recipes:json,
        loading:false,
        menu
      });
    })
    
  }

  validate = () => {}
  handleClick = () => {
    const formValues = {
      title: this.title.value,
      category: this.category.value,
      description: this.description.value,
      rating:this.state.rating,
      recipeId:27
    };

    if(formValues.validate()){
      const updatedRecipies = [...this.state.recipes,formValues];
      localStorage.setItem('recipes',updatedRecipies);
  
    }

  }
  render() {
    const { recipes, loading, menu, rating } = this.state;
    if(loading){
      return <h4>loading.. </h4>
    }
    else{
      return (
        <div className="container">
          <header className="header">
            <img src={banner} />            
          </header>
          <ul className="menu">
          {
            menu.map((item,value) =>(
              <li 
                key={value}>
                  <Menu title={item}/>
              </li>)
            )
          }
          </ul>
          
          <div className="insert-recipe">
            <form onSubmit={this.handleClick}>
              <h2>New Recipe</h2>
              <input type="text" placeholder="Title" ref={input=>this.title=input}/>
              <input type="text" placeholder="Category" ref={input=>this.category=input}/>
              <textarea rows="3" ref={input=>this.description=input} placeholder="Description"></textarea>
              <label>Rating</label>
              <StarRatingComponent 
                name="rate1" 
                starCount={5}
                value={rating}
                onStarClick={this.onStarClick.bind(this)}
            />
              <button className="btn-success">Save</button>
            </form>
          </div>

          <h2>Featured Recipes</h2>
          <div className="recipes-box">
            {
              recipes.recipes.map((item,value) => (
                <Recipe 
                  key={value} 
                  title={item.title} 
                  description={item.description}
                  rating={item.rating}
                  category={item.category}
                />)
              )              
            }
          </div>
        </div>
      );
    }
  }
}

export default CookingApp;

// Menus
const Menu = ({title}) => <a href='#' className='menu-link'>{title}</a>;

// Recipes
const Recipe = (item) =>{
  return (
    <div className="recipe-box">
      <h2 className="recipe-title">{item.title}</h2>
      <span className="recipe-category">{item.category}</span>
      <p className="recipe-description">{item.description}</p>
    </div>
  );
};

// const Rating = () => {
//   return(
//   );
// }