# gif0

A Slack Gif bot that's nice to use

---

## Improvements over Giphy Slack app

- Prev and Next buttons instead of random shuffle
- Preview image height is fixed so buttons stay in the same location

## Installing for your Slack workspace

- This app is not published to the Slack app registry - use it at your own risk.

### Prerequisites

- A Slack workspace where you have the permissions to create and install an app.
- A Giphy developer account.

### Install guide

#### Create Slack App

1. Create a new Slack App
2. Under "OAuth & Permissions" add the scopes - `chat:write, chat:write.customize, chat:write.public, commands, users.profile:read`
3. Save the Slack App and install it in your workspace.
4. From "Basic Information" copy the "Signing Secret"
5. From "Install App" copy the "Bot User OAuth Token"
6. We will need to configure this more later

#### Create a Giphy App

1. Create a new Giphy "API" App
2. Copy the API Key.

#### Deploy the gif0 backend

1. Use `/deployment` to deploy using `aws-cdk`. See `/deployment/README.md`
2. You will need to configure the environment variables with the values we copied above.
3. Copy the `TheUrl` the stack outputs.

#### Complete Slack App Configuration

1. Go back to the Slack App configuration
2. Under "Interactivity & Shortcuts" enter the backend URL as the Request URL
3. Under "Slash Commands", create a new command `/gif0` and enter the backend URL as the Request URL

## Development

### Testing

No

## Contributing

Yes
