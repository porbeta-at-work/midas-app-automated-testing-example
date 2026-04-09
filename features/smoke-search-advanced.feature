Feature: MiDAS Home Search Advanced scenarios
  As a user of the MiDAS application
  I want to perform some advanced functionality
  So that I can verify the Home Search works as expected

  Background:
    Given I navigate to the MiDAS application

  @smoke @smoke-search-advanced
  Scenario: Check for multiple 129 results with valid files
    And I enter "\"129/2522\",\"129/5187\",\"129/75704\"" in the C Number field
    And I click the Advanced Search Options checkbox
    And I enter "\"C006004605\",\"C002514522\",\"C006000081\"" in the DOC ID field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "OM00129301415.PDF" in the Details section of row 1
    And I close the Details for row 1
    And I open the Details for row 2
    And I click the Compare button for DOC ID "OM00129-4100044.PDF" in the Details section of row 2
    And I close the Details for row 2
    And I open the Details for row 3
    And I click the Compare button for DOC ID "OM00129-501121.PDF" in the Details section of row 3
    Then I should see a valid File for Comparison row 1
    Then I should see a valid File for Comparison row 2
    Then I should see a valid File for Comparison row 3
    And I should see the page has loaded

  @smoke @smoke-search-advanced
  Scenario: Check for multiple 3904 results with valid files
    And I enter "\"3904/14856\",\"3904/6383\"" in the C Number field
    And I click the Advanced Search Options checkbox
    And I enter "\"A005210922\",\"A005215780\"" in the DOC ID field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "OM003904-1000920.PDF" in the Details section of row 1
    And I close the Details for row 1
    And I open the Details for row 2
    And I click the Compare button for DOC ID "OM003904-1100661.PDF" in the Details section of row 2
    Then I should see a valid File for Comparison row 1
    Then I should see a valid File for Comparison row 2
    And I should see the page has loaded

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

  @smoke @smoke-search-advanced
  Scenario: Check for multiple C-File results with valid files
    And I enter "\"C24140\",\"C3281010\",\"C358\",\"C24145\",\"C6185040\"" in the C Number field
    And I click the Advanced Search Options checkbox
    And I enter "\"D004008503\",\"E004106308\",\"D009100221\",\"B010911466\",\"A009105842\"" in the DOC ID field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "CN00192.36A00069.PDF" in the Details section of row 1
    And I close the Details for row 1
    And I open the Details for row 2
    And I click the Compare button for DOC ID "CN00964800035.PDF" in the Details section of row 2
    And I close the Details for row 2
    And I open the Details for row 3
    And I click the Compare button for DOC ID "CN0001-0200032.PDF" in the Details section of row 3
    And I close the Details for row 3
    And I open the Details for row 4
    And I click the Compare button for DOC ID "CN001.5200056.PDF" in the Details section of row 4
    And I close the Details for row 4
    And I open the Details for row 5
    And I click the Compare button for DOC ID "CN001.5200015.PDF" in the Details section of row 5
    Then I should see a valid File for Comparison row 1
    Then I should see a valid File for Comparison row 2
    Then I should see a valid File for Comparison row 3
    Then I should see a valid File for Comparison row 4
    Then I should see a valid File for Comparison row 5
    And I should see the page has loaded

  @smoke @smoke-search-advanced
  Scenario: Check for multiple MT results with valid files
    And I click the Advanced Search Options checkbox
    And I enter "\"E000504763\",\"T002203553\",\"W003210480\"" in the DOC ID field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "MT000060005079.PDF" in the Details section of row 1
    And I close the Details for row 1
    And I open the Details for row 2
    And I click the Compare button for DOC ID "MT003800008.PDF" in the Details section of row 2
    And I close the Details for row 2
    And I open the Details for row 3
    And I click the Compare button for DOC ID "MT000590000138.PDF" in the Details section of row 3
    Then I should see a valid File for Comparison row 1
    Then I should see a valid File for Comparison row 2
    Then I should see a valid File for Comparison row 3
    And I should see the page has loaded

  @smoke @smoke-search-advanced
  Scenario: Check for multiple OM results with valid files
    And I enter "\"OM10953\",\"OM14077\"" in the C Number field
    And I click the Advanced Search Options checkbox
    And I enter "\"A005210254\",\"A001A07313\"" in the DOC ID field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "OM0014814-SUP300344.PDF" in the Details section of row 1
    And I close the Details for row 1
    And I open the Details for row 2
    And I click the Compare button for DOC ID "OM004601744.PDF" in the Details section of row 2
    Then I should see a valid File for Comparison row 1
    Then I should see a valid File for Comparison row 2
    And I should see the page has loaded

  @smoke @smoke-search-advanced
  Scenario: Check for a 129 and 3904 result with multiple valid files
    And I enter "\"129/4351\",\"3904/1649\"" in the C Number field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "OM00129402142.PDF" in the Details section of row 1
    And I close the Details for row 1
    And I open the Details for row 2
    And I click the Compare button for DOC ID "OM003904-300788.PDF" in the Details section of row 2
    Then I should see 2 valid Files for Comparison row 1
    Then I should see 2 valid Files for Comparison row 2
    And I should see the page has loaded

  @smoke @smoke-search-advanced
  Scenario: Check for an AR-2 result with multiple valid files
    And I enter "\"A1362295\"" in the A Number field
    And I click the Advanced Search Options checkbox
    And I enter "\"L012303558\"" in the DOC ID field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "AR00136200601.PDF" in the Details section of row 1
    Then I should see 2 valid Files for Comparison row 1
    And I should see the page has loaded

  @smoke @smoke-search-advanced
  Scenario: Check for a C-File result with multiple valid files
    And I enter "\"A4576774\"" in the A Number field
    And I enter "\"C5287501\"" in the C Number field
    And I click the Advanced Search Options checkbox
    And I enter "\"L006515244\"" in the DOC ID field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "CN00161.3103227.PDF" in the Details section of row 1
    Then I should see 2 valid Files for Comparison row 1
    And I should see the page has loaded

  @smoke @smoke-search-advanced
  Scenario: Check for an MT result with multiple valid files
    And I enter "\"A10802624\"" in the A Number field
    And I enter "\"C9230885\"" in the C Number field
    And I click the Advanced Search Options checkbox
    And I enter "\"E000504759\"" in the DOC ID field
    And I click the "Search records" button
    And I open the Details for row 1
    And I click the Compare button for DOC ID "MT000060005077.PDF" in the Details section of row 1
    Then I should see 2 valid Files for Comparison row 1
    And I should see the page has loaded