type Person = {
    personId: String;
    first_name: String;
    last_name: String;
  }
  type Review ={
    reviewId: String;
    rating:String;
    text: String;
    restaurantId: String;
    created_date: String;
  }
  type Cusine ={
    cusineId: String;
    name: String;
    restaurantId: String;
  }
  type Restaurant ={
    name: String;
    restaurantId: String;
    address:String;
  }
  
  export { Person,Review,Cusine,Restaurant}
  