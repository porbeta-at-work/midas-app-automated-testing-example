Feature: MiDAS Home Search scenarios
  As a user of the MiDAS application
  I want to perform some baseline functionality
  So that I can verify the Home Search works as expected

  Background:
    Given I navigate to the MiDAS application

  @smoke
  Scenario: Check for Master and Flex results with valid files
    When I enter "BOGGIO" in the Last Name field
    And I enter "A1728308" in the A Number field
    And I click the "Search records" button
    And I click on the Compare button on row 1
    And I click on the Compare button on row 3
    Then I should see a valid File for Comparison row 1
    And I should see a valid File for Comparison row 2
    And I should see the page has loaded

  @smoke
  Scenario: Check for AR-2 results with a valid file
    When I enter "KACINSKAS" in the Last Name field
    And I enter "A1532016" in the A Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "AR00153200042.PDF" in the Details section of row 1
    Then I should see a valid File for Comparison row 1
    And I should see the page has loaded

  @smoke
  Scenario: Check for MT results with a valid file
    When I enter "LEE" in the Last Name field
    And I enter "A1532016" in the A Number field
    And I enter "C7408985" in the C Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "MT000024009178.PDF" in the Details section of row 1
    Then I should see a valid File for Comparison row 1
    And I should see the page has loaded

  @smoke
  Scenario: Check for C-File results with a valid file
    And I enter "C6185040" in the C Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "CN00192.36A00069.PDF" in the Details section of row 1
    Then I should see a valid File for Comparison row 1
    And I should see the page has loaded

  @smoke
  Scenario: Check for OM results with a valid file
    And I enter "OM14077" in the C Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "OM004601744.PDF" in the Details section of row 1
    Then I should see a valid File for Comparison row 1
    And I should see the page has loaded

  @smoke
  Scenario: Check the Download File Modal results for Master
    When I enter "BOGGIO" in the Last Name field
    And I enter "A1728308" in the A Number field
    And I click the "Search records" button
    And I click on the Compare button on row 1
    And I open the Download File modal for Comparison row 1
    Then I can see 1 file(s) available in the Download File modal
    And I should see the page has loaded

  @smoke
  Scenario: Check the Download File Modal results for Flex
    When I enter "BOGGIO" in the Last Name field
    And I enter "A1728308" in the A Number field
    And I click the "Search records" button
    And I click on the Compare button on row 3
    And I open the Download File modal for Comparison row 1
    Then I can see 1 file(s) available in the Download File modal
    And I should see the page has loaded

  @smoke
  Scenario: Check the Download File Modal results for AR-2
    When I enter "KACINSKAS" in the Last Name field
    And I enter "A1532016" in the A Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "AR00153200042.PDF" in the Details section of row 1
    And I open the Download File modal for Comparison row 1
    Then I can see 1 file(s) available in the Download File modal
    And I should see the page has loaded

  @smoke
  Scenario: Check the Download File Modal results for MT
    When I enter "LEE" in the Last Name field
    And I enter "A1532016" in the A Number field
    And I enter "C7408985" in the C Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "MT000024009178.PDF" in the Details section of row 1
    And I open the Download File modal for Comparison row 1
    Then I can see 1 file(s) available in the Download File modal
    And I should see the page has loaded

  @smoke
  Scenario: Check the Download File Modal results for C-File
    And I enter "C6185040" in the C Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "CN00192.36A00069.PDF" in the Details section of row 1
    And I open the Download File modal for Comparison row 1
    Then I can see 10 file(s) available in the Download File modal
    And I should see the page has loaded

  @smoke
  Scenario: Check the Download File Modal results for OM
    And I enter "OM14077" in the C Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "OM004601744.PDF" in the Details section of row 1
    And I open the Download File modal for Comparison row 1
    Then I can see 1 file(s) available in the Download File modal
    And I should see the page has loaded

  