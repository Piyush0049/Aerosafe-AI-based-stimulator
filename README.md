// AeroSafe: Real-time Airspace Safety Simulation

AeroSafe is an advanced UAV (Unmanned Aerial Vehicle) simulation and airspace management platform designed to enhance safety and operational efficiency. It leverages AI-powered algorithms to predict collisions, enforce geofences, and issue real-time alerts, all presented through an intuitive 3D dashboard.

## Features

-   **Real-time UAV Tracking:** Monitor UAV positions, velocities, and flight paths with high precision.
-   **AI-powered Collision Prediction:** Advanced algorithms predict potential collisions, providing early warnings.
-   **Geofence Enforcement:** Define and enforce restricted zones and no-fly areas with automatic violation detection.
-   **AI-Grade Alerts:** Receive intelligent, contextual alerts with severity levels and automated response suggestions.
-   **Interactive 3D Visualization:** Explore a dynamic 3D environment for comprehensive airspace management and situational awareness.
-   **Simulation Controls:** Control and manage UAV simulations to test various scenarios.
-   **Minimap:** A 2D minimap for quick navigation and overview of the airspace.

## Technologies Used

-   **Next.js:** React framework for building performant applications.
-   **React Three Fiber:** React renderer for Three.js, enabling 3D graphics in React.
-   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
-   **NextAuth.js:** Authentication for Next.js applications.
-   **Zustand:** A small, fast, and scalable bearbones state-management solution.

## Getting Started

Follow these instructions to set up and run the AeroSafe project locally.

### Prerequisites

Make sure you have the following installed:

-   Node.js (v18 or later)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Piyush0049/Aerosafe-AI-based-stimulator.git
    cd Aerosafe-AI-based-stimulator
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your environment variables.
    ```
    # Example environment variables (adjust as needed)
    NEXTAUTH_URL=http://localhost:3000
    # Add any other necessary environment variables
    ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

1.  **Login/Signup:** If not authenticated, you will see a login/signup page. Create an account or log in to access the simulator.
2.  **3D Simulator:** Once authenticated, you will be directed to the 3D simulation dashboard.
3.  **Interact:** Use the controls to navigate the 3D world, observe UAVs, and monitor restricted zones and alerts.

