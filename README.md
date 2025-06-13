## How to Run the Project

Follow these steps to run the project locally:

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   or, if you use yarn:

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   - Copy the example environment file (if available):
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and fill in any required values.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   or, with yarn:

   ```bash
   yarn dev
   ```

5. **Open the app in your browser**

   Visit [http://localhost:3000](http://localhost:3000) to view the application.

6. **(Optional) Build for production**
   ```bash
   npm run build
   npm start
   ```
   or, with yarn:
   ```bash
   yarn build
   yarn start
   ```
