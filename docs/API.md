# Asset Management API Documentation

## Overview

The Asset Management API provides endpoints for managing sites, rooms, assets, and users in the system.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints require authentication using NextAuth.js. Include the session token in the Authorization header:

```
Authorization: Bearer <session_token>
```

## Endpoints

### Sites

#### Get All Sites

```http
GET /api/sites
```

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "address": "string|null",
    "status": "ACTIVE|SUSPENDED|ARCHIVED",
    "createdAt": "date",
    "updatedAt": "date",
    "_count": {
      "rooms": 0,
      "assets": 0
    }
  }
]
```

#### Create Site

```http
POST /api/sites
```

**Request Body:**

```json
{
  "name": "string",
  "address": "string (optional)"
}
```

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "address": "string|null",
  "status": "ACTIVE",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### Get Site by ID

```http
GET /api/sites/{id}
```

**Parameters:**

- `id` (string): Site ID

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "address": "string|null",
  "status": "ACTIVE|SUSPENDED|ARCHIVED",
  "createdAt": "date",
  "updatedAt": "date",
  "rooms": [
    {
      "id": "string",
      "name": "string",
      "status": "OCCUPIED|VACANT|READY",
      "_count": {
        "assets": 0
      }
    }
  ],
  "_count": {
    "rooms": 0,
    "assets": 0
  }
}
```

#### Update Site

```http
PATCH /api/sites/{id}
```

**Parameters:**

- `id` (string): Site ID

**Request Body:**

```json
{
  "name": "string (optional)",
  "address": "string (optional)",
  "status": "ACTIVE|SUSPENDED|ARCHIVED (optional)"
}
```

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "address": "string|null",
  "status": "ACTIVE|SUSPENDED|ARCHIVED",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### Delete Site

```http
DELETE /api/sites/{id}
```

**Parameters:**

- `id` (string): Site ID

**Response:**

```json
{
  "success": true
}
```

#### Assign Users to Site

```http
POST /api/sites/{id}/assign-users
```

**Parameters:**

- `id` (string): Site ID

**Request Body:**

```json
{
  "userAssignments": [
    {
      "userId": "string",
      "role": "SITE_MANAGER|ADMIN"
    }
  ]
}
```

### Rooms

#### Get All Rooms

```http
GET /api/rooms
```

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "status": "OCCUPIED|VACANT|READY",
    "tenantName": "string|null",
    "site": {
      "id": "string",
      "name": "string"
    },
    "_count": {
      "assets": 0
    }
  }
]
```

#### Create Room

```http
POST /api/rooms
```

**Request Body:**

```json
{
  "name": "string",
  "siteId": "string",
  "status": "OCCUPIED|VACANT|READY",
  "tenantName": "string (optional)"
}
```

#### Get Room by ID

```http
GET /api/rooms/{id}
```

**Parameters:**

- `id` (string): Room ID

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "status": "OCCUPIED|VACANT|READY",
  "tenantName": "string|null",
  "site": {
    "id": "string",
    "name": "string"
  },
  "assets": [
    {
      "id": "string",
      "assetNumber": "string",
      "brand": "string",
      "type": "WASHER|DRYER|DISH_WASHER|REFRIGERATOR|AIR_CONDITIONER|OVEN_STOVE"
    }
  ],
  "_count": {
    "assets": 0
  }
}
```

#### Update Room

```http
PATCH /api/rooms/{id}
```

**Parameters:**

- `id` (string): Room ID

**Request Body:**

```json
{
  "name": "string (optional)",
  "status": "OCCUPIED|VACANT|READY (optional)",
  "tenantName": "string (optional)"
}
```

#### Delete Room

```http
DELETE /api/rooms/{id}
```

**Parameters:**

- `id` (string): Room ID

### Assets

#### Get All Assets

```http
GET /api/assets
```

**Response:**

```json
[
  {
    "id": "string",
    "assetNumber": "string",
    "brand": "string",
    "manufacturerPart": "string",
    "serialNumber": "string",
    "roomNumber": "string",
    "installedDate": "date",
    "type": "WASHER|DRYER|DISH_WASHER|REFRIGERATOR|AIR_CONDITIONER|OVEN_STOVE",
    "site": {
      "id": "string",
      "name": "string"
    },
    "images": [
      {
        "id": "string",
        "url": "string"
      }
    ],
    "user": {
      "name": "string"
    }
  }
]
```

#### Create Asset

```http
POST /api/assets
```

**Request Body:**

```json
{
  "brand": "string",
  "manufacturerPart": "string",
  "serialNumber": "string",
  "siteId": "string",
  "roomNumber": "string",
  "installedDate": "date",
  "type": "WASHER|DRYER|DISH_WASHER|REFRIGERATOR|AIR_CONDITIONER|OVEN_STOVE",
  "imageUrl": "string (optional)"
}
```

#### Get Asset by ID

```http
GET /api/assets/{id}
```

**Parameters:**

- `id` (string): Asset ID

**Response:**

```json
{
  "id": "string",
  "assetNumber": "string",
  "brand": "string",
  "manufacturerPart": "string",
  "serialNumber": "string",
  "roomNumber": "string",
  "installedDate": "date",
  "type": "WASHER|DRYER|DISH_WASHER|REFRIGERATOR|AIR_CONDITIONER|OVEN_STOVE",
  "site": {
    "id": "string",
    "name": "string"
  },
  "images": [
    {
      "id": "string",
      "url": "string"
    }
  ],
  "user": {
    "name": "string",
    "email": "string"
  }
}
```

#### Update Asset

```http
PATCH /api/assets/{id}
```

**Parameters:**

- `id` (string): Asset ID

**Request Body:**

```json
{
  "brand": "string (optional)",
  "manufacturerPart": "string (optional)",
  "serialNumber": "string (optional)",
  "siteId": "string (optional)",
  "roomNumber": "string (optional)",
  "installedDate": "date (optional)",
  "type": "WASHER|DRYER|DISH_WASHER|REFRIGERATOR|AIR_CONDITIONER|OVEN_STOVE (optional)",
  "imageUrl": "string (optional)"
}
```

#### Delete Asset

```http
DELETE /api/assets/{id}
```

**Parameters:**

- `id` (string): Asset ID

### Users

#### Get All Users

```http
GET /api/users
```

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "SUPER_ADMIN|ADMIN|SITE_MANAGER",
    "image": "string|null",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

#### Get User by ID

```http
GET /api/users/{id}
```

**Parameters:**

- `id` (string): User ID

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "SUPER_ADMIN|ADMIN|SITE_MANAGER",
  "image": "string|null",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### Update User

```http
PATCH /api/users/{id}
```

**Parameters:**

- `id` (string): User ID

**Request Body:**

```json
{
  "name": "string (optional)",
  "role": "SUPER_ADMIN|ADMIN|SITE_MANAGER (optional)",
  "siteIds": "string[] (optional)"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "string",
  "message": "string"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "string"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "string"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "string"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "string"
}
```

## Rate Limiting

Currently, there is no rate limiting implemented. In production, consider implementing rate limiting to prevent abuse.

## Role-Based Access Control

- **SUPER_ADMIN**: Full access to all endpoints and resources
- **ADMIN**: Access to all endpoints, limited to sites they manage
- **SITE_MANAGER**: Access only to assets and rooms in their assigned sites

## Examples

### Creating a Site

```bash
curl -X POST http://localhost:3000/api/sites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session_token>" \
  -d '{
    "name": "Main Building",
    "address": "123 Main St, Anytown, USA"
  }'
```

### Getting All Assets

```bash
curl -X GET http://localhost:3000/api/assets \
  -H "Authorization: Bearer <session_token>"
```

### Creating an Asset

```bash
curl -X POST http://localhost:3000/api/assets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session_token>" \
  -d '{
    "brand": "Samsung",
    "manufacturerPart": "WA45T6000AW",
    "serialNumber": "S/N123456789",
    "siteId": "site_123",
    "roomNumber": "101",
    "installedDate": "2023-01-15",
    "type": "WASHER"
  }'