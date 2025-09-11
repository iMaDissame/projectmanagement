// package com.jiraclone.backend.cucumber;

// import org.junit.runner.RunWith;
// import io.cucumber.junit.Cucumber;
// import io.cucumber.junit.CucumberOptions;

// @RunWith(Cucumber.class)
// @CucumberOptions(
//     features = {
// //         "src/test/resources/features/signup.feature",
// //         "src/test/resources/features/login.feature",
// //         "src/test/resources/features/add_project.feature",
// //         "src/test/resources/features/add_task.feature",
// //         "src/test/resources/features/add_comment.feature",
// //         "src/test/resources/features/generate_report.feature",
// //         "src/test/resources/features/end_to_end.feature"
//     },
//     glue = "com.jiraclone.backend.cucumber"
// )
// public class RunCucumberTest {
// }
package com.jiraclone.backend.cucumber;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
    features = "src/test/resources/features",
    glue = "com.jiraclone.backend.cucumber"
)
public class RunCucumberTest extends AbstractTestNGCucumberTests {
}