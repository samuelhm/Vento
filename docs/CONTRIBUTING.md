# Vento Project: Engineering Standards & Guidelines

## Project Language Standard
To ensure professional quality and maintainability, **English** is established as the sole official language. All team members must use English for source code (variable names, functions, and classes), comments, commit messages, and technical documentation.

---

## Index
1. [Code Standards (Syntax & Style)](#1-code-standards-syntax--style)
2. [Comment Normalization](#2-comment-normalization)
3. [Database (DB) Normalization](#3-database-db-normalization)
4. [Branch and Commit Normalization](#4-branch-and-commit-normalization)
5. [File and Folder Normalization](#5-file-and-folder-normalization)
6. [Other Normalization Types](#6-other-normalization-types)

---

## 1. Code Standards (Syntax & Style)

### Naming Conventions:
*   **Variables and Functions:** Use `camelCase` (e.g., `basePrice`, `calculateShipping()`).
*   **Classes and Components:** Use `PascalCase` (e.g., `SellerProfile`, `ProductGrid`).
*   **Global Constants:** Use `UPPER_SNAKE_CASE` (e.g., `MAX_STOCK_LIMIT`, `API_ENDPOINT`).

### Syntax Rules:
*   **Variables:** Prioritize `const` for values that do not change; use `let` only when necessary. The use of `var` is strictly prohibited.
*   **Functions:** Prefer **Arrow Functions** for a more modern and clean syntax.
*   **Semicolons:** Mandatory at the end of each statement to avoid interpretation errors.

---

## 2. Comment Normalization

*   **Function Comments (Optional):** Use only for highly complex business logic within the marketplace.
*   **Standard Syntax:**
    *   *Single-line comments:* Use double forward slashes. `// Brief explanation of a non-obvious technical decision.`
    *   *Block comments:* For optional complex functions.
*   **Tracking Tags:** For pending tasks, always use the uppercase prefix: `// TODO: Description of what needs to be implemented.`

**Example:**
```javascript
/** 
 * Handles the state change of a C2C sale.
 * Validates stock before locking the buyer's funds.
 */
async function processTransaction(sellerId, productId) {
  // TODO: (Owner-Name) Integrate with the payment gateway module
 
  if (!checkStock(productId)) {
    return "OUT_OF_STOCK";
  }
 
  // Safety pause to prevent Race Conditions
  const transactionStatus = await lockFunds(sellerId);
 
  return transactionStatus;
}
```

---

## 3. Database (DB) Normalization

*   **DB Language:** The entire schema (table names, columns, and relations) must be in English.
*   **Naming Style:** Strictly use `snake_case` for all database elements (tables, columns, indexes).
*   **Table Naming:**
    *   Must be plural and in English (e.g., `users`, `products`, `transactions`).
    *   Intermediate tables for many-to-many relationships should join both table names (e.g., `products_tags`).
*   **Column Naming:**
    *   **Primary Key:** Always named `id` (UUID or Serial Autoincrement).
    *   **Foreign Keys:** Follow the format `table_singular_id` (e.g., `user_id`, `product_id`).
    *   **General:** Descriptive lowercase names separated by underscores (e.g., `first_name`, `phone_number`, `is_verified`).
    *   **Booleans:** Use prefixes like `is_`, `has_`, or `can_` (e.g., `is_active`, `has_stock`).

---

## 4. Branch and Commit Normalization

### Branch Naming:
*   `main`: Protected branch containing stable and final marketplace code. Only the Tech Lead performs merges here.
*   `develop`: Integration branch where all features are merged before moving to `main`.
*   `feature/`: For new functionalities (e.g., `feature/user-auth`, `feature/product-listing`).
*   `fix/`: For bug fixes (e.g., `fix/login-bug`).
*   `docs/`: For changes in documentation or READMEs.

### Commit Messages (Conventional Commits):
The golden rule: **One commit = One logical unit of work.**
Format: `<type>: subject`.
*   `<type>` must be lowercase (e.g., `feat`, `fix`, `docs`, `refactor`, `wip`).
*   `<subject>` can start with lowercase or uppercase.
*   `feat`: New functionality (e.g., `feat: add product upload for sellers` or `feat: Add product upload for sellers`).
*   `fix`: Bug fix (e.g., `fix: header responsive issue` or `fix: Header responsive issue`).
*   `docs`: Documentation changes (e.g., `docs: update contributing guide` or `docs: Update contributing guide`).
*   `refactor`: Code changes that neither fix a bug nor add a feature (e.g., `refactor: simplify price calculation logic` or `refactor: Simplify price calculation logic`).

### Exceptions (WIP):
Commits can be pushed to continue work on another machine or to get help.
*   Use the **wip** (Work In Progress) prefix.
*   Example: `git commit -m "wip: Product upload form (halfway through styling)"`.
*   *Note: Clean up or squash these commits once the logical unit is complete.*

---

## 5. File and Folder Normalization

### Naming Style:
*   **Logic/JavaScript Files:** Use `kebab-case` (e.g., `user-controller.js`, `auth-middleware.js`).
*   **Frontend Components:** Use `PascalCase` to match the component name (e.g., `ProductCard.tsx`).
*   **Styles (CSS/SASS):** Use `kebab-case` (e.g., `main-layout.css`).

### Folder Organization:
*   Folder names must always be lowercase and in English.
*   Use descriptive plural names for containers (e.g., `/src/components`, `/src/services`, `/src/utils`).
*   **Rule of "One file, one responsibility":** Each file should contain a single main logical piece.
*   **Indices:** Use `index.js` files within folders to centralize exports and clean up import paths.

---

## 6. Other Normalization Types

### Image and File Normalization:
*   **Formats:** Only `.jpg`, `.png`, and `.webp` are accepted for product photos.
*   **Max Size:** 2MB per image to ensure performance and avoid server saturation.
*   **Naming:** Uploaded files will be automatically renamed on the server with a unique ID (e.g., `prod_550e8400.webp`).

### API Response Normalization:
All API responses must follow this consistent structure:
*   **Success:** `{ "status": "success", "data": { ... } }`
*   **Error:** `{ "status": "error", "message": "Clear description of the error", "code": 400 }`
