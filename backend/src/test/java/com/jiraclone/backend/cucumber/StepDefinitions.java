package com.jiraclone.backend.cucumber;

import io.cucumber.java.en.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;
import static org.junit.Assert.*;

public class StepDefinitions {
    private WebDriver driver;

    @io.cucumber.java.Before
    public void setUp() {
        driver = new ChromeDriver();
        //maximize the browser window
        driver.manage().window().maximize();
    }

    @io.cucumber.java.After
    public void tearDown() {
        if (driver != null) driver.quit();
    }

    // Signup
    @Given("I am on the signup page")
    public void i_am_on_the_signup_page() {
        driver.get("http://localhost:3000/register");
    }

    @When("I enter valid user details")
    public void i_enter_valid_user_details() {
        driver.findElement(By.name("name")).sendKeys("Test User");
        driver.findElement(By.name("email")).sendKeys("testuserb@example.com");
        driver.findElement(By.name("password")).sendKeys("AZDZS@#FCV. u6VV");
        driver.findElement(By.name("confirmPassword")).sendKeys("AZDZS@#FCV. u6VV");
    }

    @When("I submit the signup form")
    public void i_submit_the_signup_form() {
        driver.findElement(By.cssSelector("button[type='submit']")).click();
    }

    @Then("I should see a signup success message")
    public void i_should_see_a_signup_success_message() {
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.urlContains("/login"));
        assertTrue(driver.getCurrentUrl().contains("/login"));
    }

    // Login
    @Given("I am on the login page")
    public void i_am_on_the_login_page() {
        driver.get("http://localhost:3000/login");
    }

    @When("I enter valid credentials")
    public void i_enter_valid_credentials() {
        driver.findElement(By.name("email")).sendKeys("testuserb@example.com");
        driver.findElement(By.name("password")).sendKeys("AZDZS@#FCV. u6VV");
    }

    @When("I submit the login form")
    public void i_submit_the_login_form() {
        driver.findElement(By.cssSelector("button[type='submit']")).click();
    }

    @Then("I should be redirected to the dashboard")
    public void i_should_be_redirected_to_the_dashboard() {
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.urlContains("/dashboard"));
        assertTrue(driver.getCurrentUrl().contains("/dashboard"));
    }

    // Add Project
    @When("I navigate to the create project page")
    public void i_navigate_to_the_create_project_page() {
        driver.get("http://localhost:3000/projects/create");
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOfElementLocated(By.id("name")));
    }

    @When("I enter project details")
    public void i_enter_project_details() {
        driver.findElement(By.id("name")).sendKeys("Test Project");
        driver.findElement(By.id("key")).sendKeys("TP");
        driver.findElement(By.id("description")).sendKeys("A project for testing");
    }

    @When("I submit the project form")
    public void i_submit_the_project_form() {
        driver.findElement(By.cssSelector("button[type='submit']")).click();
    }

    @Then("I should see the new project in the project list")
    public void i_should_see_the_new_project_in_the_project_list() {
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.urlContains("/projects"));
        // Wait for the project name to appear in the DOM
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(),'Test Project')]")));
        assertTrue(driver.getPageSource().contains("Test Project"));
    }

    // Add Task
    @When("I navigate to the create task page")
    public void i_navigate_to_the_create_task_page() {
        // Wait for the project card with "Test Project" to appear
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(),'Test Project')]")));
        // Click on the project card with "Test Project"
        driver.findElement(By.xpath("//*[contains(text(),'Test Project')]")).click();
        // Wait for the "Create Task" button or link to appear
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(),'Create Task')]")));
        // Click the "Create Task" button or link
        driver.findElement(By.xpath("//*[contains(text(),'Create Task')]")).click();
        // Wait for the task creation form to appear
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(By.name("title")));
    }

    @When("I enter task details")
    public void i_enter_task_details() {
        driver.findElement(By.name("title")).sendKeys("Test Task");
        driver.findElement(By.name("description")).sendKeys("A task for testing");
    }

    @When("I submit the task form")
    public void i_submit_the_task_form() {
        WebElement submitBtn = new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.elementToBeClickable(By.cssSelector("button[type='submit']")));
        submitBtn.click();
    }

    @Then("I should see the new task in the task list")
    public void i_should_see_the_new_task_in_the_task_list() {
        // Wait for the task with title "Test Task" to appear in the DOM
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(),'Test Task')]")));
        assertTrue(driver.getPageSource().contains("Test Task"));
    }

    // Add Comment
    @When("I view a task")
    public void i_view_a_task() {
        //driver.get("http://localhost:3000/tasks/1"); // Adjust task ID as needed
        // Wait for the task card with "Test Task" to appear and click it to open the modal
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h4[contains(text(),'Test Task')]")));
        driver.findElement(By.xpath("//h4[contains(text(),'Test Task')]")).click();

        // Wait for the comment textarea in the modal to be visible
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("form textarea[placeholder='Add a comment...']")));
    }

    @When("I enter a comment")
    public void i_enter_a_comment() {
        driver.findElement(By.cssSelector("form textarea[placeholder='Add a comment...']")).sendKeys("This is a test comment");
    }

    @When("I submit the comment")
    public void i_submit_the_comment() {
        driver.findElement(By.cssSelector("button[type='submit']")).click();
    }

    @Then("I should see the comment under the task")
    public void i_should_see_the_comment_under_the_task() {
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), "This is a test comment"));
        assertTrue(driver.getPageSource().contains("This is a test comment"));
    }

    // Generate Report (optional)
    @When("I navigate to the reporting AI page")
public void i_navigate_to_the_reporting_ai_page() {
    // Click the "Reporting AI" link in the sidebar
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//a[contains(@href, '/reporting')]")));
    driver.findElement(By.xpath("//a[contains(@href, '/reporting')]")).click();

    // Wait for the project selector to appear
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("select")));
}

@When("I select the project {string} in reporting AI")
public void i_select_the_project_in_reporting_ai(String projectName) {
    WebElement select = driver.findElement(By.cssSelector("select"));
    Select dropdown = new Select(select);
    dropdown.selectByVisibleText(projectName);
}

@When("I generate a report with prompt {string}")
public void i_generate_a_report_with_prompt(String prompt) {
    // Wait for input to be enabled
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(ExpectedConditions.elementToBeClickable(By.cssSelector("input[placeholder*='Ask for project reports']")));
    driver.findElement(By.cssSelector("input[placeholder*='Ask for project reports']")).sendKeys(prompt);
    // Click the Send button by its text
    driver.findElement(By.xpath("//button[normalize-space()='Send']")).click();
}

// @Then("I should see the generated report")
// public void i_should_see_the_generated_report() {
//     new WebDriverWait(driver, Duration.ofSeconds(20))
//         .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(),'Report')]")));
//     assertTrue(driver.getPageSource().contains("Report"));
// }
@When("I save the generated report")
public void i_save_the_generated_report() {
    // Wait for the Save Report button to appear and click it
    new WebDriverWait(driver, Duration.ofSeconds(20))
        .until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(text(),'Save Report')]")))
        .click();
}

@When("I view saved reports")
public void i_view_saved_reports() {
    WebElement tab = new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(),'Saved Reports')]")));
    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", tab);
}

@Then("I should see the saved report")
public void i_should_see_the_saved_report() {
    // Wait for the saved report to appear in the list
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(),'Report') or contains(text(),'Show me a summary')]")));
    assertTrue(driver.getPageSource().contains("Report") || driver.getPageSource().contains("Show me a summary"));
}
}