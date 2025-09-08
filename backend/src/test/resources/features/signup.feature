Feature: User Signup
  Scenario: Successful signup
    Given I am on the signup page
    When I enter valid user details
    And I submit the signup form
    Then I should see a signup success message
