import React, { Component } from 'react';
import banner from './images/banner.jpg';
import StarRatingComponent from 'react-star-rating-component';

class CookingApp extends Component {
  constructor(){
    super();
    this.state = {
      recipes: [],
      loading:true,
      rating: 3,
      menu: []
    }
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }

  componentDidMount(){
    if(localStorage.getItem('recipes')){
      let recipesData = JSON.parse(localStorage.getItem('recipes'));
      let menu = recipesData.map(menuItem=>menuItem.category);
      this.setState({
        recipes: recipesData,
        loading:false,
        menu
      });
    }
    else{
      fetch('https://api.myjson.com/bins/gg3eh')
      .then((response)=>{
        return response.json()
      })
      .then((json)=>{
        let menu = json.recipes.map(menuItem=>menuItem.category);
        this.setState({
          recipes:json,
          loading:false,
          menu
        });
        let recipes = JSON.stringify(this.state.recipes);
        localStorage.setItem('recipes',recipes);
      })
    }
  }

  validate = (formValues) => {
    if(formValues.title.length < 3){
      alert('Title must be atleast 3 letters')
      return null;
    }
    else if(formValues.category.length < 3){
      alert('Category must be atleast 3 letters')
      return null;
    }
    else if(formValues.description.length < 10){
      alert('Description must be atleast 10 letters')
      return null;
    }
    return formValues;
  }
  
  handleClick = (e) => {
    const formValues = {
      title: this.title.value,
      category: this.category.value,
      description: this.description.value,
      rating:this.state.rating,
      recipeId:this.state.recipes.length + 1 
    };

    if(this.validate(formValues)){
      let updatedRecipes = [...this.state.recipes,formValues];
      console.log(updatedRecipes);
      updatedRecipes = JSON.stringify(updatedRecipes);
      localStorage.setItem('recipes',updatedRecipes);
    }
  }

  render() {
    const { recipes, loading, menu, rating } = this.state;
    if(loading){
      return <h4 className="loading_indicator">Loading Recipes.. </h4>
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
              recipes.map((item,value) => (
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
