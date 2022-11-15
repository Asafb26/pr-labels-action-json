import * as core from '@actions/core';
import * as github from '@actions/github';
import ansiColor from './ansiColor';
import _deburr from 'lodash/deburr';

interface Label {
    color: string,
    default: boolean,
    description: string,
    name: string,
    node_id: string,
    url: string,
}

function main() {
    const labels: Label[]|undefined = github.context.payload?.pull_request?.labels
    const labelsObject: { label: string }[] = []

    if (!labels) {
        core.info("Not a pull request")
        core.setOutput('labels', '')
        core.setOutput('labels-object', labelsObject)
        return;
    }

    if (labels.length == 0) {
        core.info("No labels found")
        core.setOutput('labels', '')
        core.setOutput('labels-object', labelsObject)
        return;
    }

    for (const label of labels) {
        const identifier = nameToIdentifier(label.name);
        const environmentVariable = nameToEnvironmentVariableName(label.name);

        core.exportVariable(environmentVariable, '1');
        core.info(`\nFound label ${ansiColor.startColor(label.color)} ${label.name} ${ansiColor.endColor()}\n  Setting env var for remaining steps: ${environmentVariable}=1`)
        labelsObject.push({label: identifier})
    }

    const labelsString = labelsObject.join()

    core.info(`\nAction output:\nlabels: ${JSON.stringify(labelsString)}\nlabels-object: ${JSON.stringify(labelsObject)}`)
    core.setOutput('labels', labelsString);
    core.setOutput('labels-object', labelsObject);
}

try {
    main();
} catch (error) {
    core.setFailed(error.message);
}

function nameToIdentifier(name: string) {
    return name
        .replace(/['"“‘”’]+/gu, '')  // remove quotes
        .replace(/[^\p{Letter}\p{Number}]+/gu, '-')  // non alphanum to dashes
        .replace(/-+/g, '-')  // remove consecutive dashes
        .toLowerCase()
}

function nameToEnvironmentVariableName(name: string) {
    return 'GITHUB_PR_LABEL_' + (
        _deburr(name)  // remove accents
            .replace(/['"“‘”’]+/gu, '')  // remove quotes
            .replace(/[^\w]+/g, '_')  // non-alphanum to underscores
            .replace(/_+/g, '_')  // remove consecutive underscores
            .toUpperCase()
    )
}
