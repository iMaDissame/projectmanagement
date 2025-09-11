package com.jiraclone.backend.cucumber;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
        features = "src/test/resources/features/add_comment.feature",
        glue = "com.jiraclone.backend.cucumber"
)
public class AddCommentTest extends AbstractTestNGCucumberTests {}