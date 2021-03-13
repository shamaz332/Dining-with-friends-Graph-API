import { type } from "os"

type Person = {
    personId: String;
    first_name: String;
    last_name: String;
    city: String;
  }
  type Review ={
    reviewId: String;
    rating:String;
    text: String;
    restaurantId: String;
    created_date: String;
    personId: String
  }
  type Cusine ={
    cusineId: String;
    name: String;
    restaurantId: String;
  }
  type Restaurant ={
    name: String;
    restaurantId: String;
    city: String;
  }
  type CusineInRestaurant={
    cusineId: String;
    restaurantId: String;
    }
    type City = {
      name: String;
    }
  export { Person,Review,Cusine,Restaurant,CusineInRestaurant,City}
  