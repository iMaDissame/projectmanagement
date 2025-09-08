Feature: Generate Report
  Scenario: Generate and save a report
    Given I am logged in
    When I navigate to the reporting AI page
    And I select the project "Test Project" in reporting AI
    And I generate a report with prompt "Show me a summary"
    And I save the generated report
    And I view saved reports
    Then I should see the saved report