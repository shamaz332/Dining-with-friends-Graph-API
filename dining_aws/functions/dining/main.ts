//https://docs.aws.amazon.com/neptune/latest/userguide/access-graph-gremlin-node-js.html
//https://docs.aws.amazon.com/neptune/latest/userguide/lambda-functions-examples.html

import { Context } from "aws-lambda";
import { driver, process as gprocess, structure } from "gremlin";
import * as async from "async";
import { convertObjectArrIntoParis } from "./diningMain";
import {
  Person,
  Cusine,
  Review,
  Restaurant,
  CusineInRestaurant,
} from "./types";
import {
  addPerson,
  addReview,
  addCusine,
  addRestaurant,
  addFriends,
} from "./mutations";
import {
  myFriends,
  FriendsOfMyFriends,
  UserXwithY,
  LatestReview,
} from "./queries";
const Graph = structure.Graph;
const DriverRemoteConnection = driver.DriverRemoteConnection;
declare var process: {
  env: {
    NEPTUNE_ENDPOINT: string;
  };
};

const database_url = "wss://" + process.env.NEPTUNE_ENDPOINT + ":8182/gremlin";
const graph = new Graph();
export const g = graph
  .traversal()
  .withRemote(new DriverRemoteConnection(database_url, {}));

//events

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    personID: string;
    personTwoId: string;
    cusineId: string;
    restaurantId: string;
    addPer: Person;
    addRev: Review;
    addCus: Cusine;
    addREst: Restaurant;
    addServCusine: CusineInRestaurant;
  };
};

export async function handler(event: AppSyncEvent, context: Context) {
  switch (event.info.fieldName) {
    //====================
    //Here is Mutations
    //====================

    case "addPerson":
      return await addPerson(event.arguments.addPer);
    case "addReview":
      return await addReview(event.arguments.addRev);

    case "addCusine":
      return await addCusine(event.arguments.addCus);

    case "addRestaurant":
      return await addRestaurant(event.arguments.addREst);
    case "addFriends":
      return await addFriends(
        event.arguments.personID,
        event.arguments.personTwoId
      );

    //====================
    //Here is Queries
    //====================

    case "friends":
      return await myFriends(event.arguments.personID);

    case "fiendsoffriends":
      return await FriendsOfMyFriends(event.arguments.personID);

    case "userAssociated":
      return await UserXwithY(
        event.arguments.personID,
        event.arguments.personTwoId
      );
    case "topRestaurant":
      return await LatestReview(event.arguments.restaurantId);

    default:
      return null;
  }
}

// const awaitSha = await sha

//    if (event.info.fieldName == "addPerson") {
//     console.log("await shah",sha)
//     return sha;
//   }
//   else return

// }

//   if (event.info.fieldName == "addReview") {
//     return await g
//       .addV("Review")
//       .property("reviewId", addRev.reviewId)
//       .property("rating", addRev.rating)
//       .property("text", addRev.text)
//       .property("restaurantId", addRev.restaurantId)
//       .valueMap()
//       .toList();
//   }

//   if (event.info.fieldName == "addCusine") {
//     return await g
//       .addV("Cusine")
//       .property("cusineId", addCus.cusineId)
//       .property("name", addCus.name)
//       .property("restaurantId", addRev.restaurantId)
//       .valueMap()
//       .toList();
//   }

//   if (event.info.fieldName == "addRestaurant") {
//     return await g
//       .addV("Restaurant")
//       .property("name", addREst.name)
//       .property("restaurantId", addREst.restaurantId)
//       .property("distance", addREst.distance)
//       .valueMap()
//       .toList();
//   }

// if (event.info.fieldName == "addFriends") {
//   return await g
//     .addE("friends")
//     .from("personId",personId)
//     .from("personId",personId)
// }

//   //who are my friends

// if (event.info.fieldName == "friends") {
//   return await g.V().has('Person','personId',personID).out('friends').values('first_name').next()
// }

// //friends of my friends
//   if (event.info.fieldName == "fiendsoffriends") {
//     return await g.V().has('Person','personId',personID).out('friends').values('first_name').out('friends').values('first_name').next()
//   }

//   //user x with y

//   if (event.info.fieldName == "userAssociated") {
//     return await g.V().has('person', 'personId',personID).
//     until(has('person', 'first_name', 'Denise')).
//     repeat(
//     both('friends').simplePath()
//     ).path().next()
//   }

// //What	restaurant	near	me	with	a	specific	cuisine	is	the	highest	rated?

// if (event.info.fieldName == "highestRatedCusine") {
//   return awaitg.V().has('person','person_id',pid).
//   out('lives').
//   in('within').
//   where(out('serves').has('name',
//   within(cuisine_list))).
//   where(inE('about')).
//   group().
//   by(identity()).
//   by(__.in('about').values('rating').mean()).
//   unfold().
//   order().
//   by(values, desc).
//   limit(1).
//   project('name', 'address',
//  'rating_average', 'cuisine').
//   by(select(keys).values('name')).
//   by(select(keys).values('address'
//   by(select(values)).
//   by(select(keys).out('serves').values('name'))
// }

// if (event.info.fieldName == "topRestaurant") {
//   return await g.V().has('person','person_id',pid).
//   out('lives').
//   in('within').
//   where(__.inE('about')).
//   group().
//   by(identity()).
//   by(__.in('about').values('rating').mean()).
//   unfold().
//   order().
//   by(values, desc).
//   limit(10).
//   unfold().
//   project('name', 'address', 'rating_average').
//   by(select(keys).values('name')).
//   by(select(keys).values('address')).
//   by(select(values))
// }

// if (event.info.fieldName == "latestReview") {
//   return await g.V().has('restaurant','restaurant_id',rid).
//   in('about').
//   order().by("created_date",desc).
//   range(offset, offset + limit).
//   valueMap('created_date', 'body').with(WithOptions.tokens).toList()
// }
