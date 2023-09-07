# Next.js Blackjack Game

Welcome to the Next.js Blackjack game! This is a simple implementation of the classic card game Blackjack (also known as 21) where you can play against an automated dealer.

## Getting Started

To run the game, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/MiltonTulli/blackjack.git
   cd blackjack
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The game will be available at http://localhost:3000 in your web browser.

### Database

The FakeDb class stored in `/src/lib/DB.ts` simulates a simple database for storing and retrieving rounds of the Blackjack game. It doesn't use an actual database system like SQL or NoSQL; instead, it stores data in a JSON file (db.json) on the server's file system.

### API

Endpoints available are:

- `GET:: /api/rounds`: return all rounds stored in db
- `POST:: /api/rounds`: insert a new round in db
- `GET:: /api/user/{userName}/rounds`: return rounds by userName

## Author

[Milton Tulli](https://github.com/miltontulli)

Enjoy playing Blackjack!
