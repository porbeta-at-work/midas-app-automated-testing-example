Feature: Recorded MiDAS Test Scenario
  As a user of the MiDAS application
  I want to perform the recorded actions
  So that I can verify the application works as expected

  Background:
    Given I navigate to the MiDAS application

  @search @smoke
  Scenario: Smoke test
    When I enter "BOGGIO" in the enter Last Name field
    When I enter "A1728308" in the enter A Number field
    When I click the "Search records" button
    Then I should see the page has loaded