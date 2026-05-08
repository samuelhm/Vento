*This project has been created as part of the 42 curriculum by apaterno, camurill, yrodrigu, fcarranz, shurtado.*

# 🛒 Description: Vento Marketplace

**Vento** is a specialized C2C (Consumer-to-Consumer) e-commerce platform designed for the Spanish market, focused on the resale of second-hand goods. The project arises from the need to promote **sustainability and responsible consumption**, providing a digital space where objects can find a "second life," thereby reducing environmental impact.

The platform is built on three core pillars:

* **Efficiency for Sellers:** Vento offers an agile and intuitive interface that allows users to list advertisements quickly and without friction, lowering the barrier to entry for casual sellers.
* **Geolocated Discovery:** It features a powerful search engine that prioritizes proximity, enabling buyers to find relevant products within their immediate local area.
* **User Connection Model:** Unlike traditional e-commerce, Vento acts exclusively as a **facilitator and connector**. The platform does not integrate a payment gateway; instead, its primary role is to bridge the gap between users, who then coordinate directly to meet in person and finalize the transaction.

By focusing on local, face-to-face exchanges, Vento reinforces the community aspect of the C2C market and ensures a transparent, peer-to-peer interaction model.


## 🛠️ Instructions

This section provides a step-by-step guide to compiling, installing, and running **Vento** in a local development environment.

### 1. Prerequisites
To ensure consistent behavior across all devices, the following tools must be installed:
* **Docker & Docker Compose**: For containerization and service orchestration.
* **Make**: To execute automated management commands.
* **SSL/TLS**: The backend requires HTTPS for all communications.

### 2. Environment Configuration
Before launching the project, you must set up your local environment variables:
1. Locate the `env.example` file in the root directory.
2. Create a copy named `.env`.
3. Fill in the required API keys and credentials, which are ignored by Git for security.

### 3. Installation and Execution
Vento uses a single-entry deployment system:

* **`make`**: This is the primary entry point. It automatically triggers the build of all Docker images and subsequently brings the services up.

### 4. Core Lifecycle Commands
If you need to manage specific states of the marketplace, use the following commands:

| Command | Action |
| :--- | :--- |
| `make build` | Compiles the Docker images for all microservices without starting them. |
| `make up` | Starts all services in the background, making the App operational. |
| `make start` | Resumes execution of existing containers that were previously stopped. |
| `make stop` | Halts service execution without removing the containers. |
| `make restart` | Restarts all services in the stack to apply configuration changes. |
| `make down` | Stops and removes all active containers and virtual networks. |

> **Project Access:** Once the `make` command completes, the marketplace will be accessible at: **https://localhost:8443**.


## 👥 Team Organization & Management

### 1. Roles and Responsibilities
In accordance with the project requirements, the team has been organized into specialized roles to ensure efficient delivery and technical excellence:

* **Product Owner (PO): shurtado**
    * Defines the product vision and prioritizes features based on the C2C marketplace needs.
    * Maintains the product backlog and validates completed work.
* **Scrum Master (PM): yrodrigu**
    * Facilitates team coordination, removes obstacles, and tracks progress against deadlines.
    * Organizes weekly meetings and ensures smooth team communication.
* **Technical Lead / Architect: camurill**
    * Oversees technical architecture and defines the technology stack.
    * Ensures code quality and reviews critical changes to maintain engineering standards.
* **Developers: fcarranz and apaterno**
    * Responsible for the implementation of features and specific modules.
    * Participate in code reviews, testing, and documentation of their work.

### 2. Work Methodology
To manage a project of this complexity, we implemented the **Scrum framework**:

* **Task Management:** We utilized **Jira** as our primary project management tool to track issues, sprints, and the product backlog.
* **Sync Meetings:** The team held weekly synchronization meetings every Tuesday to discuss progress, blockers, and plan the next steps.
* **Communication Channels:** Quick coordination and technical discussions were handled via **Slack** and **WhatsApp**.

### 3. Engineering Standards
To ensure technical consistency and professional quality across the entire microservices architecture, the team strictly adheres to the established project protocols:

> 📄 **Official Documentation:** For a detailed breakdown of our development workflow, naming conventions, and commit standards, please refer to the:  
> **[Vento Engineering Standards & Guidelines](/docs/CONTRIBUTING.md)**

* **Official Language:** English is the mandatory language for all technical assets, including source code, documentation, and internal communication.
* **Localization:** While the technical core is developed in English, the User Interface (Web) is localized in Spanish to align with the project's target C2C market in Spain.
* **Syntax & Style:** We follow a unified naming convention for variables, functions, and components as defined in the project's style guide.
* **Database Normalization:** All schema elements (tables, columns, and relations) follow a standardized English naming convention and `snake_case` structure.
* **Git Flow & Version Control:** The team utilizes a structured branching strategy and follows **Conventional Commits** to maintain a traceable and professional version history.

## 🏗️ Technical Stack

Vento is built on a modern, decoupled architecture designed for high performance and reliability. The choice of technologies focuses on scalability through microservices and real-time user interaction.

### 1. Architecture Overview
The system follows a **Microservices pattern**, where each core functionality (Authentication, Catalog, Media, and Chat) operates as an independent service. This approach ensures that a failure in one module does not compromise the entire marketplace.

> 🖼️ **System Architecture Diagram:** You can visualize the complete microservices interaction and network flow at the following link:  
> **[View Architecture Diagram](/docs/microservices.png)**

* **API Gateway (Nginx):** Acts as the single entry point. It handles **SSL termination (HTTPS)**, **Rate Limiting**, and secures the internal network.
* **Backend for Frontend (BFF):** A specialized layer that orchestrates requests between the frontend and internal microservices via **REST APIs**.

### 2. Core Technologies

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | **React & Vite** | Provides a responsive, component-based UI for a smooth user experience. |
| **Backend** | **Fastify (Node.js)** | High-performance framework used for all microservices due to its low overhead and built-in schema validation. |
| **Primary Database** | **PostgreSQL** | Relational database ensuring data integrity for users and transactions. |
| **Geospatial Data** | **PostGIS** | Extension for Postgres that enables the "search by proximity" feature, vital for a local C2C marketplace. |
| **Real-time** | **Socket.IO** | Powers the instant chat system and real-time notifications. |

### 3. Specialized Services & DevOps
* **Media Management:** Uses **Sharp** for automatic image optimization and conversion to WebP, ensuring fast load times and reduced server storage costs.
* **Containerization:** The entire ecosystem is orchestrated using **Docker** and **Docker Compose**, allowing for consistent environments from development to evaluation.
* **CI/CD:** **GitHub Actions** automates our testing and quality checks to maintain high engineering standards.

### 4. Feature List

| Feature Group | Description | Owner(s) |
| :--- | :--- | :--- |
| **Secure Authentication** | Implementation of a robust signup and login system using hashed/salted passwords and strict HTTPS communication. | shurtado, fcarranz |
| **User Profiles** | Management of personal data, account settings, and public-facing profiles for trust-building in the C2C market. | yrodrigu, shurtado, fcarranz |
| **C2C Catalog** | Full CRUD system for product listings, enabling users to post, edit, and manage second-hand advertisements. | apaterno, yrodrigu, fcarranz |
| **Proximity Search** | Advanced search engine leveraging **PostGIS** to filter and sort products based on the user's geographical coordinates. | apaterno |
| **Real-time Chat** | Instant messaging service via **WebSockets** to facilitate direct connection and negotiation between buyers and sellers. | shurtado, camurill |
| **Media Processing** | Automated microservice for image uploads and optimization using **Sharp** to convert assets into WebP format. | shurtado |
| **API Gateway** | Traffic orchestration using **Nginx**, including SSL termination, centralized routing, and Rate Limiting for security. | camurill, shurtado |
| **Governance & Legal** | Mandatory implementation of accessible Privacy Policy and Terms of Service pages tailored to the Spanish market. | yrodrigu |
| **DevOps & Infrastructure** | Architecture design based on loosely-coupled microservices and unified deployment via **Docker** and **Make**. | shurtado, camurill |

### 5. Database Schema
To understand how data consistency and relationships are maintained across our microservices, you can view the detailed Entity-Relationship Diagram (ERD) here:

> 📊 **[View Database Schema](/docs/db-schema.png)**

* **Data Modeling:** Each microservice manages its own schema (Auth, Catalog, and Chat), ensuring strict data isolation while maintaining referential integrity where necessary.
* **Spatial Extensions:** The Catalog schema specifically incorporates **PostGIS** geometry types to handle geographic coordinates for the proximity-based search engine, allowing for high-performance spatial queries.


## 🧩 Modules

### 1. Web Category

#### **Major: Frameworks for Frontend and Backend (2 pts)**
The project utilizes a complete decoupled architecture, moving away from simple libraries to full-featured frameworks to ensure professional-grade development.

* **Frontend Framework:** **React** was chosen for its component-based architecture and robust ecosystem, allowing for a highly responsive user interface.
* **Backend Framework:** **Fastify (Node.js)** is used across all microservices due to its high performance, native schema validation, and structured architecture.
* **Implementation:** All microservices (Auth, Catalog, Media, and Chat) and the frontend application are built using these frameworks to ensure architectural consistency and long-term scalability.
* **Team Contribution:** Given the complexity of implementing and orchestrating multiple services, **all team members** (shurtado, yrodrigu, camurill, fcarranz, and apaterno) contributed to the development and integration of these frameworks.

#### **Major: Real-time features using WebSockets (2 pts)**
This module enables instantaneous communication between users, ensuring that messages and notifications are delivered without page refreshes, which is critical for a fast-paced C2C environment.

* **Technology:** We implemented **Socket.IO** to handle persistent full-duplex communication channels between the client and the server.
* **Implementation in Vento:** This technology is the backbone of the **Chat Service**, allowing buyers and sellers to negotiate in real-time. It is decoupled from the rest of the services to ensure that high traffic in chat does not affect catalog browsing.
* **Key Capabilities:**
    * **Real-time updates:** Instant message delivery and receipt confirmation.
    * **Connection Handling:** Robust logic to manage user connection and disconnection states gracefully across different devices.
    * **Efficient Broadcasting:** Optimized message routing between specific user pairs to ensure privacy and low latency.
* **Team Contribution:** This module was implemented and integrated into the microservices architecture by **shurtado** and **camurill**.

#### **Major: User Interaction & Social Features (2 pts)**
While Vento is not a traditional social network, we have implemented a suite of interaction features specifically tailored to peer-to-peer commerce. This module ensures seamless connectivity and trust-building between participants.

* **Wishlist & Favorites Interaction:** Users can interact with other users' listings by marking them as "favorites". This provides a persistent personal wishlist for the buyer and signals market interest to the seller, enhancing the overall engagement of the platform.
* **Public Seller Profiles:** Each user has a dedicated, public-facing profile page displaying their active advertisements. This allows buyers to browse the commercial activity of trusted sellers and verify their history within the marketplace, fostering a transparent environment.
* **Real-time Negotiation:** The primary interaction occurs via the integrated chat service, where users negotiate transaction details directly and instantly, bridging the gap between digital discovery and physical exchange.
* **Technical Integration:** These features required a centralized state management in the frontend and complex relational queries in the **User** and **Catalog** microservices.
* **Team Contribution:** Due to the cross-functional nature of these features, **all team members** (shurtado, yrodrigu, camurill, fcarranz, and apaterno) contributed to the development and full-stack integration of this module.

#### **Minor: Advanced Search Functionality (1 pt)**
To ensure users can navigate the large volume of C2C advertisements efficiently, we implemented a robust search engine with multi-layered filtering, moving beyond basic queries to a professional discovery system.

* **Geospatial Filtering:** Leveraging **PostGIS**, users can filter products by proximity, searching within a specific radius from their current location. This is the core engine for our local-first marketplace.
* **Dynamic Filters:** Advanced filtering options allowing users to narrow down results by category, price range, and item condition (second-hand status).
* **Sorting & Pagination:** Implementation of **server-side pagination** to ensure high performance even with large datasets, including "Sort by" features (e.g., price: low to high, newest listings).
* **Technical Implementation:** The **Catalog Service** handles these complex spatial and relational queries directly against the PostgreSQL database using optimized indexing to minimize latency.
* **Team Contribution:** **apaterno** (Lead developer for the search engine and PostGIS integration).

#### **Minor: Support for Additional Browsers (1 pt)**
To guarantee a consistent and professional user experience for the entire Spanish C2C market, the platform has been rigorously tested and optimized for cross-browser compatibility, ensuring accessibility regardless of the user's software choice.

* **Extended Compatibility:** In addition to Google Chrome, the application is fully functional on **Firefox** and **Opera**, covering the vast majority of the modern web user base.
* **UI/UX Consistency:** We ensured that all interactive elements, such as the real-time chat and proximity search, behave identically across all supported engines (**Chromium, Gecko, and WebKit**).
* **CSS Normalization:** Implementation of standard styling practices and modern CSS properties to avoid layout shifts or broken components in non-Chromium browsers.
* **Testing Protocol:** Each feature was verified in different environments to identify and fix browser-specific limitations, ensuring high performance and visual fidelity.
* **Team Contribution:** The entire frontend team (**shurtado, yrodrigu, camurill, and fcarranz**) participated in the testing and cross-browser bug-fixing phase.

#### **Minor: Use of an ORM for Database Management (1 pt)**
To interact with the database in a more structured and secure manner, we integrated **Prisma ORM** within the Chat Service, moving away from writing raw SQL queries.

* **Type Safety:** Prisma provides a type-safe database client, which significantly reduced runtime errors and improved development speed during the implementation of the chat logic.
* **Schema Management:** We utilized Prisma's declarative data modeling to define the Chat entities, ensuring that the database schema is always in sync with our TypeScript interfaces.
* **Technical Choice:** While other services use raw queries for maximum performance with PostGIS, we chose Prisma for the Chat Service to prioritize development agility and data consistency in real-time messaging.
* **Team Contribution:** **shurtado** and **camurill** (Implementation and schema design for the Chat microservice).


#### **Major: Standard User Management and Authentication (2 pts)**
This module provides the core security and personalization layer for the marketplace, ensuring all participants are authenticated and their data is handled securely according to modern web standards.

* **Secure Profile Updates:** Users have full control over their account information, with the ability to update their personal details, contact information, and preferences at any time through a secure interface.
* **Avatar System:** Implementation of a custom profile picture system. It includes a default avatar generation for new users and a secure upload functionality for personalized images, integrated with our specialized **Media Service**.
* **Public Profile Pages:** Each user has a dedicated public page that displays their active listings and essential information. This feature is key to fostering transparency and building trust within the C2C community.
* **Data Integrity & Security:** All authentication processes follow industry best practices, including:
    * **Password Hashing:** Implementation of salted hashing to protect user credentials.
    * **Session Management:** Secure token handling and strict HTTPS-only communication.
* **Team Contribution:** Due to its critical importance for security, **all team members** (shurtado, yrodrigu, camurill, fcarranz, and apaterno) contributed to the development and full-stack integration of this module.

#### **Major: Backend as Microservices (2 pts)**
The core of Vento is built using a loosely-coupled **Microservices Architecture**, moving away from a monolithic design to ensure high availability, independent scaling, and fault isolation across the entire platform.

* **Service Decoupling:** Each core business function (**Authentication, Catalog, Media, and Chat**) is designed as a standalone service with a single responsibility (Single Responsibility Principle), allowing for cleaner code and easier maintenance.
* **Communication & Interfaces:** Services communicate through clear REST API interfaces orchestrated by a **Backend for Frontend (BFF)** layer, which acts as the intelligent mediator between the client and the internal network.
* **Isolated Persistence:** Each microservice manages its own dedicated database or storage logic (e.g., **PostGIS** for Catalog, local storage for Media), preventing data corruption and ensuring true modularity.
* **Scalability & Resilience:** This architecture allows the team to update or scale specific components, such as the **Chat Service (WebSockets)**, independently from the Catalog Service without affecting the entire platform's uptime.
* **Team Contribution:** **camurill, shurtado, and apaterno** (Responsible for infrastructure design, service orchestration, and inter-service communication).

#### **Major: Advanced Geospatial Technologies & Proximity Engine (2 pts)**
This custom module was implemented to provide the core value proposition of Vento: connecting users based on their physical proximity to foster a sustainable, local C2C economy.

* **Why we chose this module:** Geospatial intelligence is the foundation of our application's mission. Unlike traditional e-commerce, Vento relies on local face-to-face transactions, making precise location-based discovery an essential business requirement rather than a secondary feature.
* **Technical Challenges Addressed:**
    * **Geographic Calculations:** Implementing spherical geometry calculations to determine real-world distances between coordinates (latitude/longitude).
    * **Spatial Reference Systems:** Managing and transforming different Coordinate Reference Systems (CRS) within the database to ensure mathematical accuracy.
    * **Performance:** Optimizing spatial queries using specialized GIST indexing so they remain fast even as the number of advertisements grows.
* **Added Value to the Project:** Without this module, the project would lose its primary purpose: reducing the environmental footprint by encouraging local exchanges. It provides users with a professional-grade "Items Near Me" experience.
* **Justification for Major Status (2 pts):**
    * **Full-Stack Complexity:** Required deep integration across the entire stack.
    * **Database:** Configuring **PostGIS** and implementing spatial indexing.
    * **Backend:** Developing specialized API endpoints in **Fastify** to handle coordinate-based queries.
    * **Frontend:** Implementing geolocation services and interactive location-based filtering for a seamless UX.
* **Team Contribution:** **apaterno** and **shurtado** (Integration and architecture).