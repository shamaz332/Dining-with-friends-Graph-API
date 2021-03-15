import { g } from "./main";
import { convertObjectArrIntoParis } from "./diningMain";
import { driver, process as gprocess, structure } from "gremlin";
import { concatSeries, select } from "async";

//working 1

export const myFriends = async (personID: String) => {
  try {
    const myAllFriends = await g
      .V()
      .has("Person", "personId", personID)
      .both("friends")
      .dedup()
      .valueMap(true)
      .toList();

    console.log(myAllFriends);

    const allFriends = myAllFriends.map((obj) => {
      return convertObjectArrIntoParis(obj);
    });


    return allFriends
  } catch (err) {
    console.log(err);
    return err;
  }
};

//working 2

export const FriendsOfMyFriends = async (personID: String) => {
  try {
    const FrndOfFriends = await g
      .V()
      .has("Person", "personId", personID)
      .both("friends")
      .both("friends")
      .dedup()
      .valueMap(true)
      .toList();

    // const abc = FrndOfFriends;

    console.log(FrndOfFriends);

    const allFriendsofFrnd = FrndOfFriends.map((obj) => {
      return convertObjectArrIntoParis(obj);
    });

    return allFriendsofFrnd;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const UserXwithY = async (personID: String, personTwoId: String) => {
  try {
    const UserAssociation = await g
    g.V()
    .has('Friends','personId',personID)
    .out('friends')
    .has('Friends','personId',personTwoId)
    .hasNext()

    return `${personID} is friend of ${personTwoId}`
  } catch (err) {
    console.log(err);
    return err;
  }
};

//4

export const SpecificHighestRatedCusine = async (
  personID: String,
  cusineID: String
) => {
  try {
    const specificCusine = await g
    .V().has('Person','personId',personID).
    out().hasLabel("lives")
    .in_().hasLabel("within")
    .where(gprocess.statics.out().hasLabel('serves').has('cusineId',cusineID)).
     where(gprocess.statics.inE('isAbout')).
     group().
     by(gprocess.statics.identity()).
     by(gprocess.statics.in_().hasLabel('isAbout').values('rating').mean()).
     unfold().
     order().
     by(gprocess.statics.values, gprocess.order.desc).
     limit(1)
    .valueMap(true)
    .toList();
      
  console.log(specificCusine)

    return convertObjectArrIntoParis(specificCusine);
  } catch (err) {
    console.log(err);
    return err;
  }
};

//highest raed resturnt near me 5

export const HighestRatedNearMe = async (personID: String) => {
  try {
    const highestRatedNearMe = await g
      .V()
      .has("Person", "personId", personID)
      .out().hasLabel("lives")
      .in_().hasLabel("within")
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
      .toList();

    const higheshSPecificCusine = highestRatedNearMe.map((obj) => {
      return convertObjectArrIntoParis(obj);
    });

    return higheshSPecificCusine;
  } catch (err) {
    console.log(err);
    return err;
  }
};
//working 6

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
      .valueMap(true)
      .with_(gprocess.withOptions.tokens)
      .toList();


      const latesReview = latestR.map((obj) => {
        return convertObjectArrIntoParis(obj);
      });
  
      return latesReview;
  } catch (err) {
    console.log(err);
    return err;
  }
};

//what my friends recomd(gonna test) 7

export const MyFriendRecomd = async (personID: String) => {
  try {
    const frndRecomnd = await g
      .V()
      .has("Person", "personId", personID)
      .outV()
      .hasLabel("Person")
      .outE()
      .hasLabel("writes")
      .outV()
      .hasLabel("Review")
      .order()
      .by(gprocess.statics.values("rating"), gprocess.order.desc)
      .out()
      .hasLabel("Restaurant")
      .dedup()
      .valueMap(true)
      .toList();

    const abc = frndRecomnd;
    const frndR = abc.map((obj: any) => {
      return convertObjectArrIntoParis(obj);
    });

    return frndR;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const pastXDays = async (personID: String) => {
  try {
    const day = Date.now();

    const frndRecomnd = await g
      .V()
      .has("Person", "personId", personID)
      .outE()
      .hasLabel("friends")
      .outV()
      .hasLabel("Person")
      .outE()
      .hasLabel("writes")
      .outV()
      .hasLabel("Review")
      .where(
        gprocess.statics
          .values("created_date")
          .is(gprocess.P.gt(gprocess.statics.math(day - 864000000)))
      )
      .valueMap(true)
      .toList();

    return convertObjectArrIntoParis(frndRecomnd);
  } catch (err) {
    console.log(err);
    return err;
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

// g.V().
//   has('Person','personId',personID).
//   out('lives').
//   in_('within').
//   where(gprocess.statics.out('serves').has('cusineId',cusineID).
//   where(gprocess.statics.inE('isAbout')).
//   group().
//   by(gprocess.statics.identity()).
//   by(gprocess.statics.in_('isAbout').values('rating').mean()).
//   unfold().
//   order().
//   by(gprocess.statics.values, gprocess.order.desc).
//   limit(1)
//   .unfold()
//   .valueMap(true)
//   .next()
