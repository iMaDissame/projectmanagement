Feature: Add Comment
  Scenario: Add a comment to a task
    Given I am logged in
    And I view a task
    When I enter a comment
    And I submit the comment
    Then I should see the comment under the task