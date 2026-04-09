Feature: MiDAS Home Search Advanced scenarios
  As a user of the MiDAS application
  I want to perform some advanced functionality
  So that I can verify the Home Search works as expected

  Background:
    Given I navigate to the MiDAS application

  @smoke @smoke-search-advanced
  Scenario: Check for multiple AR-2 results with valid files
    And I enter "\"A1012661\",\"A1533068\"" in the A Number field
    And I click the Advanced Search Options checkbox
    And I enter "\"M054C00894\",\"E024F01858\"" in the DOC ID field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "AR00101201327.PDF" in the Details section of row 1
    And I close the Details for row 1
    And I open the Details for row 2
    And I click the Compare button for DOC ID "AR00153300145.PDF" in the Details section of row 2
    Then I should see a valid File for Comparison row 1
    Then I should see a valid File for Comparison row 2
    And I should see the page has loaded