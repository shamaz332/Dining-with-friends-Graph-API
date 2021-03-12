import { g } from "./main";
import { convertObjectArrIntoParis } from "./diningMain";
import { driver, process as gprocess, structure } from "gremlin";
import { select } from "async";

//working 1

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

//working 2

export const FriendsOfMyFriends = async (personID: String) => {
  try {
    const FrndOfFriends = await g
      .V()
      .has("Person")
      .properties("personId", personID)
      .repeat(gprocess.statics.out("friends"))
      .times(2)
      .dedup()
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(FrndOfFriends.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};

// g.V().has('code','AUS').out('route').has('code','DFW').hasNext()
//working 3
export const UserXwithY = async (personID: String, personTwoId: String) => {
  try {
    const UserAssociation = await g
      .V()
      .has("Person", "personId", personID)
      .until(gprocess.statics.has("Person", "personId", personTwoId))
      .repeat(gprocess.statics.both("friends").simplePath())
      .path()
      .valueMap(true)
      .hasNext();

    return UserAssociation;
  } catch (err) {
    console.log(err);
    return null;
  }
};
//highest raed resturnt near me 5

export const HighestRatedNearMe = async (personID: String) => {
  try {
    const frndRecomnd = await g
      .V()
      .has("Person", "personId", personID)
      .out("lives")
      .in_("within")
      .where(gprocess.statics.inE("isAbout"))
      .group()
      .by(gprocess.statics.identity())
      .by(gprocess.statics.in_("isAbout").values("rating").mean())
      .unfold()
      .order()
      .by(gprocess.statics.values, gprocess.order.desc)
      .limit(10)
      .unfold()
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(frndRecomnd.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};
//working 6
export const LatestReview = async (restaurantId: String) => {
  const limit = 3;
  const offset = 0;
  try {
    const latestR = await g
      .V()
      .has("Restaurant", "restaurantId", restaurantId)
      .in_("isAbout")
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

//what my friends recomd(gonna test) 7

export const MyFriendRecomd = async (personID: String) => {
  try {
    const frndRecomnd = await g
      .V()
      .has("Person")
      .properties("personId", personID)
      .out("friends")
      .out("writes")
      .values("rating")
      .mean()
      .unfold()
      .order()
      .by(gprocess.statics.values, gprocess.order.desc)
      .limit(3)
      .dedup()
      .valueMap(true)
      .next();

    return convertObjectArrIntoParis(frndRecomnd.value);
  } catch (err) {
    console.log(err);
    return null;
  }
};


// export const MyFriendRecomdPastTenDays = async (personID: String) => {
//   try {
//     const day = new Date().getDate();

//     const frndRecomnd = await g
//       .V()
//       .has("Person")
//       .properties("personId", personID)
//       .outE("friends")
//       .outE("writes")
//       .otherV("Review")
//       .properties("created_date")
//       .mean()
//       .unfold()
//       .order()
//       .by(gprocess.statics.values, gprocess.order.desc)
//       .limit(3)
//       .dedup()
//       .valueMap(true)
//       .next();

//     return convertObjectArrIntoParis(frndRecomnd.value);
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };

