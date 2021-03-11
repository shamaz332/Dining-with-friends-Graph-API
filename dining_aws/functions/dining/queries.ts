import { g } from "./main";
import { convertObjectArrIntoParis } from "./diningMain";
import { driver, process as gprocess, structure } from "gremlin";
export const myFriends = async (personID: String) => {
  try {
    const myAllFriends = await g
      .V()
      .has("Person", "personId", personID)
      .out("friends")
      .values("first_name")
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(myAllFriends.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const FriendsOfMyFriends = async (personID: String) => {
  try {
    const FrndOfFriends = await g
      .V()
      .has("Person", "personId", personID)
      .out("friends")
      .values("first_name")
      .out("friends")
      .values("first_name")
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
      .has("Person", "personId",personID)
      .until(gprocess.statics.has("Person", "personId",personTwoId))
      .repeat(gprocess.statics.both("friends").simplePath())
      .path()
      .next();

    return convertObjectArrIntoParis(UserAssociation.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};