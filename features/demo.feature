Feature: Browser Demo
  As a test automation framework
  I want to demonstrate basic browser functionality
  So that users can see the framework working

  @demo
  Scenario: Navigate to example.com and verify title
    Given I navigate to the example website
    When I check the page title
    Then I should see the correct example title