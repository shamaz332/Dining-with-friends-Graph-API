import { City, Cusine, Person, Restaurant, Review } from "./types";
import { g } from "./main";
import { convertObjectArrIntoParis } from "./diningMain";

export const addPerson = async (person: Person) => {
  try {
    const addsPerson = await g
      .addV("Person")
      .property("personId", person.personId)
      .property("first_name", person.first_name)
      .property("last_name", person.last_name)
      .addE("lives")
      .from_(g.V().has("Person", "personId", person.personId))
      .to(g.V().has("City", "name", person.city))
      .valueMap(true)
      .next();

    console.log(addsPerson.value);
    return addsPerson.value  } catch (err) {
    console.log(err);
    return null;
  }
};

export const addCity = async (city: City) => {
  try {
    const addsC = await g
      .addV("City")
      .property("name", city.name)
      .valueMap(true)
      .next();

    console.log(addsC.value);
    return addsC.value
  } catch (err) {
    console.log(err);
    return null;
  }
};
//Review
export const addReview = async (review: Review) => {
  try {
    const addsRev = await g
      .addV("Review")
      .property("reviewId", review.reviewId)
      .property("rating", review.rating)
      .property("text", review.text)
      .property("created_date", review.created_date)
      .addE("isAbout")
      .to(g.V().has("Restaurant", "restaurantId", review.restaurantId))
      .valueMap(true)
      .addE("writes")
      .from_(g.V().has("Person", "personId", review.personId))
      .to(g.V().has("Review", "reviewId", review.reviewId))
      .next();
    console.log(addsRev.value);
    return addsRev.value;
  } catch (err) {
    console.log(err);
    return null;
  }
};


//Cusine

export const addCusine = async (addCus: Cusine) => {
  try {
    const addsCusine = await g
      .addV("Cusine")
      .property("cusineId", addCus.cusineId)
      .property("name", addCus.name)
      .property("restaurantId", addCus.restaurantId)
      .addE("serve")
      .from_(g.V().has("Restaurant", "restaurantId", addCus.restaurantId))
      .to(g.V().has("Cusine", "cusineId", addCus.cusineId))
      .valueMap(true)
      .next();
    console.log(addsCusine.value);
    return addsCusine.value
  } catch (err) {
    console.log(err);
    return null;
  }
};

//addRestaurant
export const addRestaurant = async (addRes: Restaurant) => {
  try {
    const addsRestaurant = await g
      .addV("Restaurant")
      .property("name", addRes.name)
      .property("restaurantId", addRes.restaurantId)
      .addE("within")
      .from_(g.V().has("Restaurant", "restaurantId", addRes.restaurantId))
      .to(g.V().has("City", "name", addRes.city))
      .valueMap(true)
      .next();
    console.log(addsRestaurant.value);
    return addsRestaurant.value
  } catch (err) {
    console.log(err);
    return null;
  }
};
//addFriends
export const addFriends = async (personID: String, personTwoId: String) => {
  try {
    const followP = await g
      .addE("friends")
      .from_(g.V().has("Person", "personId", personID))
      .to(g.V().has("Person", "personId", personTwoId))
      .valueMap(true)
      .next();
    console.log(followP.value);
    return followP.value
  } catch (err) {
    console.log(err);
    return null;
  }
};
