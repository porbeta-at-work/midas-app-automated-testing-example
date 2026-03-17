Feature: Recorded MiDAS Test Scenario
  As a user of the MiDAS application
  I want to perform some baseline functionality
  So that I can verify the application works as expected

  Background:
    Given I navigate to the MiDAS application

  @search @smoke
  Scenario: Check for Master and Flex results with files
    When I enter "BOGGIO" in the Last Name field
    And I enter "A1728308" in the A Number field
    And I click the "Search records" button
    And I click on the Compare button on row 1
    And I click on the Compare button on row 3
    Then I should see a valid File for Comparison row 1
    And I should see a valid File for Comparison row 2
    And I should see the page has loaded

  @search @smoke
  Scenario: Check for AR-2 results with files
    When I enter "KACINSKAS" in the Last Name field
    And I enter "A1532016" in the A Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "AR00153200042.PDF" in the Details section of row 1
    Then I should see a valid File for Comparison row 1
    And I should see the page has loaded

  @search @smoke
  Scenario: Check for MT results with files
    When I enter "LEE" in the Last Name field
    And I enter "A1532016" in the A Number field
    And I enter "C7408985" in the C Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "MT000024009178.PDF" in the Details section of row 1
    Then I should see a valid File for Comparison row 1
    And I should see the page has loaded

  @search @smoke
  Scenario: Check for C-File results with files
    And I enter "C6185040" in the C Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "CN00192.36A00069.PDF" in the Details section of row 1
    Then I should see a valid File for Comparison row 1
    And I should see the page has loaded

  @search @smoke
  Scenario: Check for OM results with files
    And I enter "OM14077" in the C Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "OM004601744.PDF" in the Details section of row 1
    Then I should see a valid File for Comparison row 1
    And I should see the page has loaded

  