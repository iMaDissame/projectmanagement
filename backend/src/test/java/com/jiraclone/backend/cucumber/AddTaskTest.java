package com.jiraclone.backend.cucumber;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
        features = "src/test/resources/features/add_task.feature",
        glue = "com.jiraclone.backend.cucumber"
)
public class AddTaskTest extends AbstractTestNGCucumberTests {}