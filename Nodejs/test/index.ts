import gremlin from "gremlin";
import * as uuid from "uuid";

const __ = gremlin.process.statics;
const Graph = gremlin.structure.Graph;
const traversal = new Graph().traversal;

class Operations {
  port: string | number;
  endPoint: string;
  url: string;
  connection: gremlin.driver.DriverRemoteConnection;
  g: gremlin.process.GraphTraversalSource;

  constructor(endPoint: string, port: string | number) {
    this.port = port;
    this.endPoint = endPoint;
    this.url = `ws://${endPoint}:${port}/gremlin`;
    this.connection = new gremlin.driver.DriverRemoteConnection(this.url, {});
    this.g = traversal().withRemote(this.connection);
  }

  async addPerson() {
    const awsRequestId = uuid.v4();

    const sha = this.g
    .addV("Person")
    .property("personId", "sja,az")
    .property("first_name", "shamaz")
    .property("last_name", "1")
    
    const result = await sha;
    return result
  
}

}
(async function () {
  try {
    const a = new Operations("localhost", 8182);
    console.log(await a.addPerson());

    // console.log(await a.addRestaurant());
    // console.log(await a.addCuisine());
    // console.log(await a.addReview());
    // console.log(await a.addFriend());
    // console.log(await a.addRating());
    // console.log(await a.friends());
    // console.log(await a.friendsOfFriends());
    // console.log(await a.relation());
    // console.log(await a.searchBestWithCusineAndLocation());
    // console.log(await a.topTen());
    // console.log(await a.latestReviews());
    // console.log(await a.restaurantRecommendationsByFriends());
    // console.log(await a.reviewedInLastXDays());
    // console.log(await a.restaurantRating());
    // console.log(await a.tester());
    // console.log("\nTests complete");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
