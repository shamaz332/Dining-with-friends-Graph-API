import { Cusine, Person, Restaurant, Review } from "./types";
import { g } from "./main";
import { convertObjectArrIntoParis } from "./diningMain";

export const addPerson = async (person: Person) => {
  try {
    const addsPerson = await g
      .addV("Person")
      .property("personId", person.personId)
      .property("first_name", person.first_name)
      .property("last_name", person.last_name)
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(addsPerson.value);
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
      .property("restaurantId", review.restaurantId)
      .property("created_date", review.created_date)

      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(addsRev.value);
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
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(addsCusine.value);
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
      .property("distance", addRes.address)
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(addsRestaurant.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};

//addFriends
export const addFriends = async (personID: String, personTwoId: String) => {
  try {
    const p1 = g.V().has("Person", "personId", personID);
    const p2 = g.V().has("Person", "personId", personTwoId);
    const followP = await g
      .addE("friends")
      .from_(p1)
      .to(p2)
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(followP.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};
