Feature: MiDAS Search functionality
  As a user of the MiDAS application
  I want to search for content
  So that I can find relevant information quickly

  Background:
    Given I am on the MiDAS application

  @search @smoke
  Scenario: Basic search with results
    When I enter search term "data"
    And I click the search button
    Then I should see search results displayed
    And the results should contain relevant information

  @search @filter
  Scenario: Search with filters
    When I enter search term "research"
    And I apply available filters
    And I click the search button
    Then I should see filtered search results

  @search @negative
  Scenario: Search with no results
    When I enter search term "xyzabc123nonexistent"
    And I click the search button
    Then I should see "No results found" message or empty results

  @search @pagination
  Scenario: Search results with pagination
    When I enter search term with many results
    And I click the search button
    Then I should see search results
    And I should be able to navigate through pages if pagination exists