Feature: Login functionality
  As a user
  I want to be able to login to the application
  So that I can access my account

  Background:
    Given I navigate to the login page

  @smoke
  Scenario: Successful login with valid credentials
    Given I enter valid username "testuser@example.com"
    And I enter valid password "password123"
    When I click the login button
    Then I should be redirected to the dashboard
    And I should see welcome message "Welcome, Test User!"

  @negative
  Scenario: Login with invalid credentials
    Given I enter invalid username "invalid@example.com"
    And I enter invalid password "wrongpassword"
    When I click the login button
    Then I should see error message "Invalid username or password"
    And I should remain on the login page

  @validation
  Scenario Outline: Login form validation
    Given I enter username "<username>"
    And I enter password "<password>"
    When I click the login button
    Then I should see validation message "<message>"

    Examples:
      | username          | password    | message                    |
      |                  | password123 | Username is required       |
      | test@example.com |             | Password is required       |
      |                  |             | Username and password required |