
Feature: sample karate test script
  for help, see: https://github.com/intuit/karate/wiki/IDE-Support

  Background:
    * url 'https://xt3hhbm2qrcghjywh4wwq7ph2m.appsync-api.us-east-1.amazonaws.com/graphql'


  # karate configure('headers', { "x-api-key": 'da2-3zbudgxsfbc6rbo4egomsyrege' });

  Scenario: friends of friends
    # note the use of text instead of def since this is NOT json
    Given text query =

      """

      {
      fiendsoffriends(personID: "99"){
      city
      }
      }


      """

    And request { query: '#(query)' }
    And header X-API-KEY = 'da2-3zbudgxsfbc6rbo4egomsyrege'
    # And headers Accept = 'application/json'
    When method post
    Then status 200

   Scenario: who are my friends
    # note the use of text instead of def since this is NOT json
    Given text query =

      """

      {
      friends(personID: "99"){
      city
      }
      }


      """

    And request { query: '#(query)' }
    And header X-API-KEY = 'da2-3zbudgxsfbc6rbo4egomsyrege'
    # And headers Accept = 'application/json'
    When method post
    Then status 200

    # pretty print the response

   Scenario: who are my friends
    # note the use of text instead of def since this is NOT json
    Given text query =

      """

      {
      userAssociated(personID: "99", personIdTwo: "77")
      }


      """

    And request { query: '#(query)' }
    And header X-API-KEY = 'da2-3zbudgxsfbc6rbo4egomsyrege'
    # And headers Accept = 'application/json'
    When method post
    Then status 200