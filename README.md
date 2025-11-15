# Drive (MVP) - File and Folder Management

A single-user file management application with hierarchical folder structure, mimicking basic cloud storage navigation capabilities.

## 🎯 Project Overview

Drive MVP is a functional file management system that allows users to organize files in a nested folder hierarchy with full CRUD operations. The application provides an intuitive interface for managing files and folders, complete with breadcrumb navigation and contextual actions.

## 🚀 Tech Stack

### Frontend

- **Next.js** (TypeScript) - React framework for complex, stateful UI
- **React** - Component-based UI rendering
- **TypeScript** - Type-safe development

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Relational database for metadata storage
- **Prisma** - Modern ORM for database operations
- **File System** - Local disk storage for uploaded files

## ✨ Key Features

### Core Functionality

- ✅ **Hierarchical Folder Structure** - Create and navigate nested folders
- ✅ **File Upload & Download** - Full file management capabilities
- ✅ **CRUD Operations** - Create, Read, Update, Delete for files and folders
- ✅ **Breadcrumb Navigation** - Easy traversal through folder hierarchy
- ✅ **Context Menus** - Rename and delete operations
- ✅ **Data Persistence** - All metadata stored in PostgreSQL

### User Experience

- Alphabetically sorted file/folder lists
- Visual distinction between files and folders
- File size and last modified date display
- Upload progress acknowledgment
- Unique name validation within folders

### Analytics & Telemetry

- Client-side event logging for all user interactions
- Session-based tracking
- Non-blocking async logging
- Support for CLICK, KEY_PRESS, SCROLL, GO_TO_URL, SET_STORAGE, and CUSTOM events

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **npm** or **yarn** package manager

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd drive-mvp
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/drive_mvp?schema=public"

# File Storage
UPLOAD_DIR="./uploads"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
drive-mvp/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── api/              # API routes
│   │   │   ├── folders/      # Folder endpoints
│   │   │   ├── files/        # File endpoints
│   │   │   ├── items/        # Item update/delete endpoints
│   │   │   └── _synthetic/   # Analytics logging
│   │   ├── page.tsx          # Main page
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   │   ├── FileList.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── ActionToolbar.tsx
│   │   └── ContextMenu.tsx
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client instance
│   │   └── logger.ts         # Event logging utility
│   └── types/                # TypeScript type definitions
├── uploads/                   # File storage directory
└── package.json
```

## 🗄️ Database Schema

```prisma
model Item {
  id           String   @id @default(cuid())
  name         String
  type         String   // 'file' or 'folder'
  parentId     String?  @map("parent_id")
  size         Int?     // File size in bytes (null for folders)
  filePath     String?  @map("file_path") // Physical path on disk (null for folders)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Self-referential relation for hierarchy
  parent       Item?    @relation("ItemHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children     Item[]   @relation("ItemHierarchy")

  @@unique([name, parentId]) // Ensure unique names within the same parent
  @@map("items")
}
```

## 🔌 API Endpoints

### Folder Operations

#### Get Folder Contents

```
GET /api/folders/{id}
```

Returns all files and folders within the specified folder.

**Response:**

```json
{
  "items": [
    {
      "id": "clx...",
      "name": "Documents",
      "type": "folder",
      "size": null,
      "updatedAt": "2025-11-16T10:30:00Z"
    },
    {
      "id": "cly...",
      "name": "report.pdf",
      "type": "file",
      "size": 524288,
      "updatedAt": "2025-11-16T10:30:00Z"
    }
  ]
}
```

#### Create Folder

```
POST /api/folders
```

**Body:**

```json
{
  "name": "New Folder",
  "parentId": "clx..."
}
```

### File Operations

#### Upload File

```
POST /api/files/{parent_id}
Content-Type: multipart/form-data
```

**Form Data:**

- `file`: File to upload

#### Download File

```
GET /api/files/{id}
```

Streams the file content as a downloadable response.

### Item Operations

#### Update Item (Rename)

```
PUT /api/items/{id}
```

**Body:**

```json
{
  "name": "New Name"
}
```

#### Delete Item

```
DELETE /api/items/{id}
```

Recursively deletes the item and all its children (if folder).

### Analytics

#### Log Event

```
POST /_synthetic/log_event
```

**Body:**

```json
{
  "session_id": "session_abc123",
  "action_type": "CLICK",
  "payload": {
    "text": "Upload File",
    "page_url": "/",
    "element_identifier": "upload-button",
    "coordinates": { "x": 100, "y": 200 }
  }
}
```

## 🧪 Testing

### Run Tests

```bash
npm test
# or
yarn test
```

### Test Coverage

```bash
npm run test:coverage
# or
yarn test:coverage
```

**Target Coverage:** Minimum 80% line coverage for core API logic

### Mandatory Test Cases

- ✅ Hierarchy: Creating nested folder structure and retrieving subfolder contents
- ✅ CRUD: Upload, download, and deletion of files
- ✅ Recursion: Deleting folder removes all children
- ✅ Edge Cases: Duplicate name validation within same parent

## 📊 Event Logging

All user interactions are logged via the `logEvent` utility:

```typescript
import { logEvent } from "@/lib/logger";

// Example: Log a click event
logEvent("CLICK", {
  text: "Create Folder",
  page_url: window.location.href,
  element_identifier: "create-folder-btn",
  coordinates: { x: event.clientX, y: event.clientY },
});
```

### Supported Event Types

- `CLICK` - User clicks
- `KEY_PRESS` - Keyboard input
- `SCROLL` - Page scrolling
- `GO_TO_URL` - Navigation
- `SET_STORAGE` - localStorage/sessionStorage operations
- `CUSTOM` - Application-specific events

## 🔒 Security Considerations

- File uploads are validated for size and type
- Unique name constraints prevent overwriting
- Cascade deletion ensures data integrity
- Path traversal protection on file operations
- Input sanitization on all user-provided data

## 🚧 Development Roadmap

### MVP (Current)

- [x] Single-user file management
- [x] Folder hierarchy
- [x] File upload/download
- [x] CRUD operations
- [x] Event logging

### Future Enhancements

- [ ] Multi-user support with authentication
- [ ] File sharing and permissions
- [ ] Search functionality
- [ ] File versioning
- [ ] Trash/recovery system
- [ ] Preview for common file types
- [ ] Drag-and-drop interface
- [ ] Bulk operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Inspired by cloud storage solutions like Google Drive and Dropbox
- Built with modern web technologies for optimal performance
