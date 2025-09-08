Feature: Add Project
  Scenario: Add a new project
    Given I am logged in
    When I navigate to the add project page
    And I enter project details
    And I submit the project form
    Then I should see the new project in the project list
