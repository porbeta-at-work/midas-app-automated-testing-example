Feature: Basic MiDAS Application Tests
  As a user
  I want to verify the MiDAS application loads successfully as a baseline
  So that I can confirm both the application and the test framework works at a base level

  @basic
  Scenario: Application loads with proper title
    Given I navigate to the MiDAS application
    Then I should see a page title