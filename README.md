# Coloniz Indexer

This project contains Apibara indexers for the Coloniz platform.

## Development

### Prerequisites

- Node.js v22+
- Yarn
- PostgreSQL (optional, can use in-memory database for development)

### Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Run a single indexer in development mode:
   ```bash
   yarn dev --indexer coloniz-channel
   ```

## Running All Indexers

### Development Mode

To run all indexers in development mode:

```bash
yarn dev:all
```

This will:

- Start each indexer in a separate terminal window
- Run each indexer directly with `yarn dev --indexer <name>`
- Allow you to see logs in real-time in each terminal

### Production Mode

To run all indexers in production mode with PM2:

```bash
# Build and start all indexers
yarn start:prod

# If you've already built the indexers
yarn start:prod:no-build
```

This will:

- Build the indexers (unless --no-build is specified)
- Start each indexer in production mode using PM2
- Save the PM2 process list for persistence

### Managing Production Indexers

```bash
# Check status of all PM2 processes
yarn pm2:status

# View logs from all PM2 processes
yarn pm2:logs

# Stop only Coloniz indexers
yarn pm2:stop

# Remove only Coloniz indexers from PM2
yarn pm2:delete

# Save the current process list
yarn pm2:save

# Set up PM2 to start on system boot
yarn pm2:startup
```

## Indexers

The project includes the following indexers:

- `coloniz-channel`: Indexes channel-related events
- `coloniz-community`: Indexes community-related events
- `coloniz-handle`: Indexes handle-related events
- `coloniz-jolt`: Indexes jolt-related events
- `coloniz-profile`: Indexes profile-related events
- `coloniz-useraction`: Indexes user action events

## Database

The indexers use PostgreSQL with Drizzle ORM. You can run migrations with:

```bash
yarn drizzle:migrate
```

Generate migration files with:

```bash
yarn drizzle:generate
```

## Troubleshooting

If you encounter issues with the indexers:

1. Check the logs for specific errors:
   ```bash
   yarn pm2:logs
   ```

2. Make sure your environment variables are set correctly in `.env`

3. Ensure the database is properly configured and accessible

4. If you see syntax errors with PM2 and Yarn, try restarting the indexers:
   ```bash
   yarn pm2:delete
   yarn start:prod
   ```
