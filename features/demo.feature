Feature: MiDAS Application Demo
  As a test automation framework
  I want to demonstrate basic browser functionality with MiDAS
  So that users can see the framework working with the actual application

  @demo
  Scenario: Navigate to MiDAS application and verify page loads
    Given I navigate to the MiDAS application
    When I check the page title
    Then I should see a valid page title