# Fix Authentication Token Issue

## Problem
Frontend API client not sending auth token with requests, causing 401 errors on protected endpoints.

## Steps to Complete
- [ ] Update API client to include Authorization header with Bearer token
- [ ] Test login functionality still works
- [ ] Test dashboard data loading with authentication
- [ ] Verify 401 errors are resolved

## Files to Modify
- `src/services/api.ts` - Add token handling to request method
