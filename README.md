# PR Labels Github Action
###
THIS IS A FORK OF https://github.com/joerick/pr-labels-action

![Screenshot](screenshot.png)

A Github action that extracts labels from the PR that this build belongs to, and makes them available to other actions. Labels are available as step outputs and environment variables that you can use in later steps in your action.

## Outputs

### `labels`

The labels on this PR. A comma seperated string containing tag identifiers.

### `labels-object`

The labels on this PR. An array containing the value of the label where a label exists.

## Example usage

```yaml
jobs:
  test:
    steps:
      - name: Get PR labels
        id: pr-labels
        uses: joerick/pr-labels-action@v1.0.6
```

## How do I use this?

Perhaps you have a test that you only want to run when PR label `Test Flimbomble` is set. Your workflow should look like this:

```yaml
jobs:
  test:
    steps:
      - name: Get PR labels
        id: pr-labels
        uses: joerick/pr-labels-action@v1.0.6

      # GITHUB_PR_LABEL_TEST_FLIMBOMBLE was set by pr-labels-action
      - run: |
          bin/run_normal_tests
          if [ -n "$GITHUB_PR_LABEL_TEST_FLIMBOMBLE" ]; then
            bin/run_flimbomble_tests
          fi

      # or you can use the action output.
      # For the label name, use lowercase kebab-case and surround with spaces
      - run: |
          bin/publish_flimbomble_test_results
        if: contains(steps.pr-labels.outputs.labels, ' test-flimbomble ')
```
