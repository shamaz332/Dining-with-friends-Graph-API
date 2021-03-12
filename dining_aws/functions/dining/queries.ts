import { g } from "./main";
import { convertObjectArrIntoParis } from "./diningMain";
import { driver, process as gprocess, structure } from "gremlin";


//working

export const myFriends = async (personID: String) => {
  try {
    const myAllFriends = await g
      .V()
      .has("Person", "personId", personID)
      .both("friends")
      .dedup()
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(myAllFriends.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};

//not

export const FriendsOfMyFriends = async (personID: String) => {
  try {
    const FrndOfFriends = await g
      .V()
      .has("Person", "personId", personID)
      .repeat(
        gprocess.EnumValue.("friends")
      ).times(2).dedup()
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(FrndOfFriends.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const UserXwithY = async (personID: String, personTwoId: String) => {
  try {
    const UserAssociation = await g
      .V()
      .has("Person", "personId", personID)
      .until(gprocess.statics.has("Person", "personId", personTwoId))
      .repeat(gprocess.statics.both("friends").simplePath())
      .path()
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(UserAssociation.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};

//working
export const LatestReview = async (restaurantId: String) => {
  const limit = 3;
  const offset = 0;
  try {
    const latestR = await g
      .V()
      .has("Restaurant", "restaurantId", restaurantId)
      .in_("about")
      .order()
      .by("created_date", gprocess.order.desc)
      .range(offset, offset + limit)
      .valueMap("created_date", "text")
      .with_(gprocess.withOptions.tokens)
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(latestR.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};



g.V().has("Person", "personId")
.outE("friends")
.outE("reting")
.



