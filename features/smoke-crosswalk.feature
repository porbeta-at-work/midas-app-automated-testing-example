Feature: MiDAS Home Search scenarios
  As a user of the MiDAS application
  I want to perform some baseline functionality
  So that I can verify the Home Search works as expected

  Background:
    Given I navigate to the MiDAS crosswalk tab

  @smoke @smoke-crosswalk
  Scenario: Check AR-2 search returns expected results
    When I select "AR-2" in the crosswalk Source field
    And I enter "A1532016" in the crosswalk A Number field
    And I click the "Search crosswalk" button
    Then I should see 1 row(s) in the Crosswalk Search Results
    And I should see the page has loaded

  @smoke @smoke-crosswalk
  Scenario: Check for AR-2 search returns expected DOC ID
    When I select "AR-2" in the crosswalk Source field
    And I enter "A1532016" in the crosswalk A Number field
    And I click the "Search crosswalk" button
    And I open the Details for row 1
    Then I should see the DOC ID of "AR00153200042.PDF" in the Details section of row 1
    And I should see the page has loaded

  @smoke @smoke-crosswalk
  Scenario: Check MT search returns expected results
    When I select "MT" in the crosswalk Source field
    And I enter "A1532016" in the crosswalk A Number field
    And I enter "C7408985" in the crosswalk C Number field
    And I click the "Search crosswalk" button
    Then I should see 1 row(s) in the Crosswalk Search Results
    And I should see the page has loaded

  @smoke @smoke-crosswalk
  Scenario: Check for MT search returns expected DOC ID
    When I select "MT" in the crosswalk Source field
    And I enter "A1532016" in the crosswalk A Number field
    And I enter "C7408985" in the crosswalk C Number field
    And I click the "Search crosswalk" button
    And I open the Details for row 1
    Then I should see the DOC ID of "MT000024009178.PDF" in the Details section of row 1
    And I should see the page has loaded

  @smoke @smoke-crosswalk
  Scenario: Check C-File search returns expected results
    When I select "C-File" in the crosswalk Source field
    And I enter "C6185040" in the crosswalk C Number field
    And I click the "Search crosswalk" button
    Then I should see 4 row(s) in the Crosswalk Search Results
    And I should see the page has loaded

  @smoke @smoke-crosswalk
  Scenario: Check for C-File search returns expected DOC ID
    When I select "C-File" in the crosswalk Source field
    And I enter "C6185040" in the crosswalk C Number field
    And I click the "Search crosswalk" button
    And I open the Details for row 4
    Then I should see the DOC ID of "CN00192.36A00069.PDF" in the Details section of row 4
    And I should see the page has loaded

  @smoke @smoke-crosswalk
  Scenario: Check OM search returns expected results
    When I select "OM" in the crosswalk Source field
    And I enter "OM14077" in the crosswalk C Number field
    And I click the "Search crosswalk" button
    Then I should see 1 row(s) in the Crosswalk Search Results
    And I should see the page has loaded

  @smoke @smoke-crosswalk
  Scenario: Check for OM search returns expected DOC ID
    When I select "OM" in the crosswalk Source field
    And I enter "OM14077" in the crosswalk C Number field
    And I click the "Search crosswalk" button
    And I open the Details for row 1
    Then I should see the DOC ID of "OM004601744.PDF" in the Details section of row 1
    And I should see the page has loaded