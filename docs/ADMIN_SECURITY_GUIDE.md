# Security Management Guide for Administrators

This guide provides comprehensive instructions for administrators on how to use the Security Management features in the Asset Management system.

## Overview

The Security Management system provides:
- **Real-time Security Dashboard** - Monitor security metrics and events
- **RBAC Management** - Role-based access control configuration
- **Security Settings** - Configure security policies and thresholds
- **Security Events Monitoring** - Track and analyze security events
- **Alerts Management** - Manage security alerts and notifications

## Accessing Security Management

### Prerequisites
- **Role Required**: You must have either `SUPER_ADMIN` or `ADMIN` role
- **Permission Required**: `security:read` permission

### Navigation
1. Log in to the system
2. The Security tab will appear in the sidebar if you have the required permissions
3. Click on "Security" to access the Security Management dashboard

## Security Dashboard

### Overview
The dashboard provides real-time metrics and monitoring of your system's security status.

#### Key Metrics
- **Failed Logins (24h)** - Number of failed login attempts in the last 24 hours
- **Active Sessions** - Currently active user sessions
- **Security Events (24h)** - Security events recorded in the last 24 hours
- **Blocked IPs** - Number of IP addresses currently blocked

#### Recent Events
Shows the latest security events with:
- **Timestamp** - When the event occurred
- **Type** - Category of security event
- **Description** - Brief description of the event
- **User** - User involved in the event (if applicable)
- **IP Address** - Source IP address
- **Severity** - Event severity level (LOW, MEDIUM, HIGH, CRITICAL)

#### Security Alerts
Displays active security alerts that require attention:
- **Unacknowledged Alerts** - Alerts waiting for review
- **Acknowledged Alerts** - Previously reviewed alerts

### Filtering and Search
Use the search and filter options to:
- Filter events by severity level
- Search by event type
- Search by description, user, or IP address
- Set date ranges for historical analysis

## RBAC Management

### Overview
Role-Based Access Control (RBAC) allows you to manage user permissions systematically.

### Available Roles

#### SUPER_ADMIN
- **Access Level**: Full system access
- **Permissions**: All permissions including security management
- **Use Case**: System administrators and IT security personnel

#### ADMIN
- **Access Level**: Administrative access with limitations
- **Permissions**: 
  - Site creation, management, and listing
  - Room and asset management
  - User viewing (read-only)
  - Security viewing (limited)
- **Use Case**: Department heads, site managers

#### SITE_MANAGER
- **Access Level**: Limited to assigned sites
- **Permissions**:
  - Read and list assigned sites
  - Room and asset management within assigned sites
- **Use Case**: Individual site managers, facility coordinators

### Managing Roles

#### Creating a New Role
1. Go to the RBAC Management tab
2. Click "Create Role" button
3. Fill in the role details:
   - **Role Name**: Enter a unique identifier (e.g., "DEPARTMENT_HEAD")
   - **Description**: Brief description of the role's purpose
   - **Permissions**: Select appropriate permissions from the list
4. Click "Create Role"

#### Editing an Existing Role
1. In the Roles tab, click "Edit" next to the role you want to modify
2. Update the role name, description, or permissions
3. Click "Save Changes"
4. Click "Delete Role" to remove a role (use with caution)

#### Understanding Permissions
Permissions follow the format: `resource:action`

**Resource Types:**
- `asset` - Asset management
- `site` - Site management
- `room` - Room management
- `user` - User management
- `security` - Security management

**Action Types:**
- `create` - Create new resources
- `read` - View resource details
- `update` - Modify existing resources
- `delete` - Remove resources
- `list` - View lists of resources
- `manage` - Administrative functions

**Example Permissions:**
- `asset:read` - View asset details
- `security:manage` - Full security management access
- `user:list` - View user lists without editing

## Security Settings

Configure the system's security policies and thresholds.

### Account Lockout Settings

#### Configuration Options
- **Max Failed Attempts**: Number of failed login attempts before account lockout
- **Lockout Duration**: Initial lockout time in minutes
- **Max Lockout Duration**: Maximum lockout time in minutes
- **Progressive Lockout**: Enable increasing lockout durations

#### Recommended Settings
- **Max Failed Attempts**: 5
- **Lockout Duration**: 15 minutes
- **Max Lockout Duration**: 24 hours (1440 minutes)
- **Progressive Lockout**: Enabled

### Password Policy Settings

#### Configuration Options
- **Minimum Length**: Minimum password length (recommend 12)
- **Require Uppercase**: Must contain uppercase letters
- **Require Lowercase**: Must contain lowercase letters
- **Require Numbers**: Must contain numbers
- **Require Special Characters**: Must contain special characters
- **Password History**: Number of previous passwords to remember
- **Password Expiry**: Days before passwords expire (0 = no expiry)
- **Prevent Common Passwords**: Block common password patterns

#### Recommended Settings
- **Minimum Length**: 12
- **Password History**: 5
- **Password Expiry**: 90 days
- **All character requirements**: Enabled
- **Prevent Common Passwords**: Enabled

### Session Management Settings

#### Configuration Options
- **Session Timeout**: Inactive session timeout in minutes
- **Max Concurrent Sessions**: Maximum sessions per user
- **Refresh Token Rotation**: Enable token rotation for security
- **Require HTTPS Only**: Force HTTPS for all sessions
- **Session Fingerprinting**: Enable device fingerprinting

#### Recommended Settings
- **Session Timeout**: 30 minutes
- **Max Concurrent Sessions**: 3
- **Refresh Token Rotation**: Enabled
- **Require HTTPS Only**: Enabled
- **Session Fingerprinting**: Enabled

## Security Events Monitoring

### Understanding Event Types

#### Login Events
- **LOGIN_SUCCESS**: Successful user login
- **LOGIN_FAILURE**: Failed login attempt
- **LOGOUT**: User logout

#### Data Access Events
- **DATA_ACCESS**: User accessed data (read, list, search)
- **DATA_MODIFICATION**: User created, updated, or deleted data

#### Security Events
- **UNAUTHORIZED_ACCESS**: Attempt to access restricted resources
- **ACCOUNT_LOCKED**: Account locked due to failed attempts
- **PASSWORD_CHANGE**: User changed password
- **SUSPICIOUS_LOGIN**: Login from unusual location/device

### Event Severity Levels

#### LOW
- Normal operational events
- No immediate action required
- Example: Successful logins, data reads

#### MEDIUM
- Potentially concerning events
- Monitor for patterns
- Example: Failed logins, password changes

#### HIGH
- Security events requiring attention
- Immediate review recommended
- Example: Unauthorized access attempts

#### CRITICAL
- Severe security threats
- Immediate action required
- Example: Multiple failed attempts, data breaches

### Interpreting Events

#### Failed Login Patterns
- **Single Failure**: May indicate user error
- **Multiple Failures**: Possible brute force attack
- **Rapid Failures**: Automated attack attempt

#### Suspicious Activity Indicators
- **Multiple IP Addresses**: Account compromise or shared credentials
- **Unusual Login Times**: Potential unauthorized access
- **Failed Admin Attempts**: Targeted attacks on administrative accounts

## Managing Security Alerts

### Alert Types

#### BRUTE_FORCE
- **Description**: Multiple failed login attempts from same IP
- **Action**: Consider IP blocking after investigation
- **Investigation**: Check if legitimate user or automated attack

#### UNAUTHORIZED_ACCESS
- **Description**: User attempted to access restricted resources
- **Action**: Review user permissions and training
- **Investigation**: Check if user needs access or if access was malicious

#### SUSPICIOUS_LOGIN
- **Description**: Login from unusual location or device
- **Action**: Verify with user if legitimate
- **Investigation**: Check travel records, new devices

### Responding to Alerts

#### Acknowledging Alerts
1. Review the alert details
2. Investigate the incident
3. Take appropriate action
4. Click "Acknowledge" to mark as reviewed

#### Escalation Process
1. **Low Severity**: Review within 24 hours
2. **Medium Severity**: Review within 4 hours
3. **High Severity**: Review within 1 hour
4. **Critical Severity**: Immediate review required

## Best Practices

### Security Monitoring
- **Daily Review**: Check dashboard metrics daily
- **Weekly Analysis**: Review security events trends
- **Monthly Assessment**: Evaluate security policy effectiveness

### Access Management
- **Principle of Least Privilege**: Grant minimum necessary permissions
- **Regular Review**: Review user roles and permissions monthly
- **Immediate Revocation**: Remove access immediately when users change roles

### Password Security
- **Strong Requirements**: Enforce complex passwords
- **Regular Updates**: Set reasonable password expiry periods
- **History Enforcement**: Prevent password reuse

### Session Security
- **Reasonable Timeouts**: Balance security with usability
- **Device Management**: Track and monitor active sessions
- **Token Security**: Enable token rotation and HTTPS requirements

## Troubleshooting

### Common Issues

#### User Cannot Access Security Features
- **Check Role**: Verify user has SUPER_ADMIN or ADMIN role
- **Check Permissions**: Ensure user has `security:read` permission
- **Clear Cache**: Have user clear browser cache and login again

#### High Number of Failed Logins
- **Check Password Requirements**: Ensure requirements aren't too strict
- **Review User Training**: Users may need password education
- **Consider CAPTCHA**: Implement for additional protection

#### False Positive Alerts
- **Review Patterns**: Analyze alert patterns for legitimate activity
- **Adjust Thresholds**: Tune alert sensitivity if needed
- **User Education**: Help users avoid triggering alerts

### Performance Considerations
- **Database Impact**: Security logging can impact performance
- **Storage Requirements**: Regular cleanup of old security events
- **API Rate Limits**: Be mindful of dashboard data requests

## Emergency Procedures

### Security Breach Response
1. **Immediate Actions**:
   - Enable account lockout for affected accounts
   - Block suspicious IP addresses
   - Review recent security events
   - Notify system administrators

2. **Investigation**:
   - Review security events timeline
   - Check access logs for unauthorized activity
   - Verify system integrity
   - Document findings

3. **Recovery**:
   - Reset affected user passwords
   - Revoke compromised session tokens
   - Update security policies if needed
   - Implement additional monitoring

### System Lockdown
In case of severe security threats:
1. Go to Security Settings
2. Temporarily increase security thresholds
3. Enable stricter session management
4. Require password changes for all users

## Support and Maintenance

### Regular Maintenance Tasks
- **Weekly**: Review security metrics and alerts
- **Monthly**: Audit user permissions and roles
- **Quarterly**: Review and update security policies
- **Annually**: Comprehensive security assessment

### Getting Help
- **Technical Issues**: Contact system administrators
- **Policy Questions**: Consult security team
- **Training Needs**: Request security awareness training

---

*This guide covers the Security Management system as of the latest version. For the most current information, refer to the system documentation and consult with your security team.*