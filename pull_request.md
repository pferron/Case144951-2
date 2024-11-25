1.  Add a [changeset](https://github.com/atlassian/changesets) (i.e. `pnpm changeset`)
2.  Styles - Are you using the correct styles (styles from carina, see carina tokens - https://carina.core.cvent.org/docs/visual/design-tokens)
3.  Updated/Added Unit Tests (for both UI and graph changes)
4.  Updated/Added IT (for graph changes)
5.  Updated e2e tests and static data (if any) to all envs including prod.
6.  Please add your newly created E2E in PVTs. Look through 0006-pvt-setup.md adr.
7.  Screenshots added to the PR
8.  Story reviewed by UX
9.  Run the job 5-6 times for ITs added, to verify ITs are not flaky: https://jenkins.core.cvent.org/job/run-cdf-it/ 
10. Run the job 5-6 times for E2Es added, to verify E2Es are not flaky: https://jenkins.core.cvent.org/job/run-cdf-e2e/
11. The code coverage for the new code is maximum that can be achieved.
12. Ensure contributed code has 90% coverage. This may become a project requirement by Q1 2025.
