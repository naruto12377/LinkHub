# LinkHub Troubleshooting Guide

This guide covers common issues you might encounter when setting up or using LinkHub, along with their solutions.

## Authentication Issues

### Problem: Unable to login or register

**Possible causes:**
1. Redis connection issues
2. Incorrect Redis key structure
3. Session cookie problems

**Solutions:**
1. Verify your Redis connection by checking the KV_URL and KV_REST_API_TOKEN environment variables
2. Use the "Fix Redis Structure" button in the admin panel
3. Clear browser cookies and try again
4. Check browser console for errors

### Problem: Session expires too quickly

**Solution:**
Modify the session expiry time in `lib/auth.ts` by changing the `ex` parameter in the `createSession` function.

## Profile and Link Issues

### Problem: Links not appearing on profile

**Possible causes:**
1. Links are set to private
2. Redis key structure issues
3. User ID mismatch

**Solutions:**
1. Check link visibility settings in the editor
2. Use the "Fix Redis Structure" button in the admin panel
3. Verify that links are properly associated with the user

### Problem: Profile image upload fails

**Possible causes:**
1. Blob storage configuration issues
2. File size too large
3. Unsupported file format

**Solutions:**
1. Verify your BLOB_READ_WRITE_TOKEN environment variable
2. Reduce image size (recommended: under 2MB)
3. Use supported formats (JPEG, PNG, GIF)

## Redis Key Structure

LinkHub uses the following Redis key structure:

- `user:{username}` - Hash containing user data
- `email:{email}` - String containing username for email lookup
- `session:{sessionId}` - String containing username for session lookup
- `users` - Set containing all usernames
- `user:{userId}:links` - Set containing link IDs for a user
- `link:{linkId}` - Hash containing link data
- `profile:{username}` - Hash containing profile data
- `profile:{username}:views` - Sorted set containing view timestamps
- `link:{linkId}:clicks` - Sorted set containing click timestamps

If you encounter issues with Redis key structure, you can use the "Fix Redis Structure" button in the admin panel to repair any inconsistencies.

## Environment Variables

LinkHub requires the following environment variables:

- `KV_URL` - Vercel KV URL
- `KV_REST_API_TOKEN` - Vercel KV REST API token
- `KV_REST_API_READ_ONLY_TOKEN` - Vercel KV REST API read-only token
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob read-write token

Make sure these variables are properly set in your `.env.local` file for local development and in your Vercel project settings for production.

## Development Reset

For development purposes, you can reset the database by visiting `/api/reset-db`. This endpoint is disabled in production.

## Still Need Help?

If you're still experiencing issues, please open an issue on the GitHub repository with the following information:

1. Detailed description of the problem
2. Steps to reproduce
3. Error messages (if any)
4. Environment details (OS, browser, Node.js version)
