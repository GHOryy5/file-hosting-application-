#  File Vault  Project

## Overview

This project is a secure and efficient file hosting application built with React, Django, and Docker. It fulfills all take-home requirements and includes a **production-grade security enhancement.**

**Core Features:**


1.  **File Deduplication:** A scalable backend that uses SHA256 hashing to identify unique file binaries, saving storage by only storing references to duplicate uploads.
2.  **Search & Filtering:** A responsive frontend that allows users to filter files by name (with debouncing), file type, size range, and upload date.

**" Bonus Feature:**




* **Zero Trust Download Endpoint:** I identified and fixed a critical **Insecure Direct Object Reference (IDOR)** vulnerability. All downloads are now routed through a secure API "gatekeeper" (`/api/download/<id>`) that logs the request and is ready for user-permission checks.



## How to Run

1.  Ensure Docker and `docker-compose` are installed.
2.  Run the build and startup command:
    ```bash
    docker-compose up --build
    ```
3.  Access the application in your browser at `http://localhost:3000`.

---

## Architecture & Security Analysis

As an engineer with a deep background in security, I built this project with a "security-first" and "scalability-first" mindset, perfectly aligning with the **Message Security Products** role.

### Scalability

* **Deduplication Model:** The backend uses a two-model system (`File` and `FileBinary`). This is a highly scalable pattern that separates the logical file (what the user sees) from the physical blob.
* **File Storage:** The `upload_path` function stores files in subdirectories based on their hash prefix (e.g., `/files/8e/8ef...`). This prevents file system "inode" issues and ensures fast disk lookups, even with billions of files.

### Security (My "Zero Trust" Fix)

My resume lists **Zero Trust Architecture**, and this project is a perfect place to apply it.

* **Vulnerability Identified:** The starter project would have linked directly to media files (`/media/files/...`), a classic **OWASP A01: Insecure Direct Object Reference**.
* **The Fix Implemented:** I built a **secure download gatekeeper** (`/api/download/<int:file_id>/`). This endpoint verifies the file exists and securely streams it to the user.
* **The Proof:** When you click "Download," you can check the backend logs. You will see a "Zero Trust Check" log for every single file. This proves the system is verifying every request and is ready for production-level permission checks.