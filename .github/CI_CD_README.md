# CI/CD Pipeline Documentation

This document explains the CI/CD pipeline setup for the Asset Management application.

## Overview

Our CI/CD pipeline is designed to provide fast, secure, and reliable automated testing and deployment. It follows the principle of "Automate everything, fail fast, deploy confidently."

## Workflow Architecture

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`

**Jobs:**
1. **Validate**: Quick checks for secrets and workflow syntax
2. **Test**: Runs tests across multiple Node.js versions (18.x, 20.x, 22.x)
3. **Lint**: Code quality and formatting checks
4. **Security**: Vulnerability scanning with Trivy
5. **Build**: Creates production build artifacts

**Features:**
- Parallel execution for faster feedback
- Dependency caching for improved performance
- Matrix strategy for multi-version testing
- Comprehensive security scanning
- Build artifact storage

### 2. Staging Deployment (`.github/workflows/deploy-staging.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Process:**
1. Builds application
2. Runs database migrations
3. Deploys to staging environment
4. Executes smoke tests
5. Runs integration tests
6. Notifies team of deployment status

### 3. Production Deployment (`.github/workflows/deploy.yml`)

**Triggers:**
- Version tags (e.g., `v1.0.0`)
- Manual workflow dispatch with environment selection

**Process:**
1. Builds application
2. Runs database migrations
3. Deploys to production with manual approval
4. Executes smoke tests
5. Notifies team of deployment status

### 4. Security Scanning (`.github/workflows/codeql.yml`)

**Triggers:**
- Push to `main` and `develop` branches
- Pull requests targeting `main`
- Weekly schedule (Mondays at 10:00 UTC)

**Features:**
- Static code analysis with CodeQL
- Automatic security vulnerability detection
- Integration with GitHub Security tab

### 5. Dependency Management (`.github/dependabot.yml`)

**Features:**
- Weekly dependency updates
- Automatic pull request creation
- Version update filtering
- Assignee and reviewer assignment

### 6. Auto-Merge (`.github/workflows/dependabot-auto-merge.yml`)

**Features:**
- Automatic approval and merging of patch updates
- Automatic approval of minor updates
- Smart labeling based on update type

## Security Practices

### Secret Management
- All secrets stored in GitHub Secrets
- Environment-specific secrets in GitHub Environments
- No hardcoded credentials in workflows
- OIDC authentication for cloud providers

### Access Control
- Minimal permissions per workflow
- Branch protection rules for main branch
- CODEOWNERS file for critical files
- Environment protection rules

### Security Scanning
- CodeQL for static analysis
- Trivy for dependency vulnerability scanning
- Dependabot for automated dependency updates
- Regular security audits

## Environment Strategy

### Development Environment
- Triggered by every push to `develop` branch
- Full CI pipeline execution
- No automatic deployment

### Staging Environment
- Triggered by every merge to `main` branch
- Automatic deployment
- Full test suite execution
- Integration testing

### Production Environment
- Triggered by version tags
- Manual approval required
- Full deployment pipeline
- Smoke tests and health checks

## Required GitHub Secrets

### Application Secrets
- `DATABASE_URL`: Production database connection string
- `STAGING_DATABASE_URL`: Staging database connection string
- `NEXTAUTH_SECRET`: Authentication secret
- `NEXTAUTH_URL`: Authentication URL

### Deployment Secrets
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

### Notification Secrets
- `SLACK_WEBHOOK`: Slack webhook for notifications

### Optional Secrets
- `CODECOV_TOKEN`: Code coverage reporting token

## Required GitHub Environments

### Staging Environment
- Name: `staging`
- Protection rules: None (auto-deploy)
- Environment variables: Staging-specific secrets

### Production Environment
- Name: `production`
- Protection rules: 
  - Required reviewers: 1
  - Wait timer: 5 minutes
- Environment variables: Production-specific secrets

## Branch Protection Rules (Recommended)

### Main Branch
- Require pull request reviews: 1
- Dismiss stale reviews on new commits
- Require status checks: test, lint, security, build
- Require conversation resolution
- Restrict force pushes
- Require signed commits

## Performance Optimizations

### Caching Strategy
- Node.js dependencies caching
- Build artifact storage
- Docker layer caching (if applicable)
- Cross-workflow caching

### Parallel Execution
- Independent jobs run in parallel
- Matrix strategy for multi-version testing
- Optimized job dependencies

### Fail Fast
- Quick validation job runs first
- Early failure stops dependent jobs
- Clear error reporting

## Monitoring and Notifications

### Workflow Status
- GitHub Actions dashboard
- Slack notifications for deployments
- Email notifications for failures

### Security Alerts
- GitHub Security tab integration
- Dependabot alerts
- CodeQL security findings

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check dependency versions
   - Verify Node.js version compatibility
   - Review build logs for errors

2. **Test Failures**
   - Check test environment setup
   - Verify database schema
   - Review test logs

3. **Deployment Failures**
   - Verify environment secrets
   - Check deployment permissions
   - Review deployment logs

4. **Security Scan Failures**
   - Review vulnerability reports
   - Update affected dependencies
   - Implement security fixes

### Getting Help

1. Check workflow logs in GitHub Actions tab
2. Review error messages and stack traces
3. Consult this documentation
4. Contact the repository maintainers

## Best Practices

### Code Changes
- Create feature branches from `develop`
- Submit pull requests to `develop`
- Use descriptive commit messages
- Follow coding standards

### Deployment
- Test thoroughly in staging
- Use semantic versioning for releases
- Monitor production after deployment
- Have rollback plan ready

### Security
- Never commit secrets
- Regularly update dependencies
- Review security alerts
- Follow secure coding practices