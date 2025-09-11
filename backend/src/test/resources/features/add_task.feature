Feature: Add Task
  Scenario: Add a new task
    Given I am logged in
    When I navigate to the create task page
    And I enter task details
    And I submit the task form
    Then I should see the new task in the task list