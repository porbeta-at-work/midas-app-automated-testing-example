Feature: Search functionality
  As a user
  I want to search for content
  So that I can find relevant information quickly

  Background:
    Given I am logged into the application
    And I am on the search page

  @search @smoke
  Scenario: Basic search with results
    Given I enter search term "automation"
    When I click the search button
    Then I should see search results displayed
    And the results should contain "automation" keyword
    And the results count should be greater than 0

  @search @filter
  Scenario: Search with filters
    Given I enter search term "testing"
    And I select category filter "Tools"
    And I select date range "Last 30 days"
    When I click the search button
    Then I should see filtered search results
    And all results should be in "Tools" category
    And all results should be from the last 30 days

  @search @negative
  Scenario: Search with no results
    Given I enter search term "xyzabc123nonexistent"
    When I click the search button
    Then I should see "No results found" message
    And I should see suggestions for alternative searches

  @search @pagination
  Scenario: Search results pagination
    Given I enter search term "test"
    When I click the search button
    And I see more than 10 results
    Then I should see pagination controls
    When I click "Next page"
    Then I should see the next set of results
    And the page number should be updated