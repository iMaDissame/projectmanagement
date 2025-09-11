package com.jiraclone.backend.cucumber;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
        features = "src/test/resources/features/add_project.feature",
        glue = "com.jiraclone.backend.cucumber"
)
public class AddProjectTest extends AbstractTestNGCucumberTests {}