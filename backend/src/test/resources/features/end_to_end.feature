Feature: End-to-End User Flow

  Scenario: Signup, Login, Add Project, Add Task, Add Comment, Generate Report
    # Signup
    Given I am on the signup page
    When I enter valid user details
    And I submit the signup form
    Then I should see a signup success message

    # Login
    Given I am on the login page
    When I enter valid credentials
    And I submit the login form
    Then I should be redirected to the dashboard

    # Add Project
    When I navigate to the create project page
    And I enter project details
    And I submit the project form
    Then I should see the new project in the project list

    # Add Task
    When I navigate to the create task page
    And I enter task details
    And I submit the task form
    Then I should see the new task in the task list

    # Add Comment
    When I view a task
    And I enter a comment
    And I submit the comment
    Then I should see the comment under the task

    # Generate Report
    When I navigate to the reporting AI page
    And I select the project "Test Project" in reporting AI
    And I generate a report with prompt "Show me a summary"
    And I save the generated report
    And I view saved reports
    Then I should see the saved report