Feature: Generate Report
  Scenario: Generate a report
    Given I am logged in
    When I navigate to the report page
    And I request a report
    Then I should see the generated report
