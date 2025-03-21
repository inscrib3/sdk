# @inscrib3/sdk
A TypeScript SDK for interacting with the Inscrib3 API, providing a simple interface for managing Ordinals drops on Bitcoin.

## Installation

```bash
npm install @inscrib3/sdk
```

## Quick Start

```typescript
import sdk from '@inscrib3/sdk';

// Initialize with default API endpoint (https://api.inscrib3.com)
const inscrib3 = sdk();

// Initialize with custom Network and Chain (Bitcoin and Fractal are supported)
const inscrib3 = sdk('signet', 'bitcoin');

// Create a new drop
const createDrop = async () => {
  const result = await inscrib3.drops.create(
    'My Ordinals Collection',  // name
    'ORD',                    // symbol
    'A unique collection',    // description
    iconFile,                 // File object
    '10000',                  // price in sats
    recipientAddress,         // recipient's address
    recipientPublicKey,       // recipient's public key
    userAddress,              // creator's address
    authMessage,              // auth message
    authSignature             // auth signature
  );
  
  console.log('Created drop with ID:', result.id);
};
```

## API Reference

### Initialization

The SDK is initialized with an optional API endpoint:

```typescript
const inscrib3 = sdk(apiEndpoint?: string);
```

If no endpoint is provided, it defaults to `https://api.inscrib3.com`.

### Authentication

All API calls require authentication using three components:
- `address`: Your wallet address
- `message`: Authentication message
- `signature`: Signed authentication message

These are passed as parameters to each method and are used to create a Basic Auth header.

### Drops Management

#### Create a Drop

Creates a new Ordinals drop.

```typescript
const result = await inscrib3.drops.create(
  name: string,
  symbol: string,
  description: string,
  icon: File,
  price: string,
  recipientAddress: string,
  recipientPublicKey: string,
  address: string,
  message: string,
  signature: string
);
```

**Parameters:**
- `name`: Name of the drop
- `symbol`: Symbol for the drop
- `description`: Description of the drop
- `icon`: File object for the drop's icon
- `price`: Price in sats
- `recipientAddress`: Address to receive payments
- `recipientPublicKey`: Public key for the recipient address
- `address`: Creator's address for authentication
- `message`: Authentication message
- `signature`: Authentication signature

**Returns:** `{ id: string }`

#### Get All Drops

Retrieves all drops for the authenticated user.

```typescript
const drops = await inscrib3.drops.all(
  address: string,
  message: string,
  signature: string
);
```

**Parameters:**
- `address`: User's address for authentication
- `message`: Authentication message
- `signature`: Authentication signature

**Returns:** Array of drop objects:
```typescript
{
  id: string,
  name: string,
  symbol: string,
  description: string,
  icon: string,
  price: string,
  recipientAddress: string,
  recipientPublicKey: string,
  supply: string,
  minting: string,
  minted: string
}[]
```

#### Get Drop Details

Retrieves details for a specific drop.

```typescript
const drop = await inscrib3.drops.read(
  id: string,
  address: string,
  message: string,
  signature: string
);
```

**Parameters:**
- `id`: ID of the drop to retrieve
- `address`: User's address for authentication
- `message`: Authentication message
- `signature`: Authentication signature

**Returns:** Drop object:
```typescript
{
  name: string,
  symbol: string,
  description: string,
  icon: string,
  price: string,
  recipientAddress: string,
  recipientPublicKey: string,
  supply: string,
  minting: string,
  minted: string
}
```

#### Remove a Drop

Removes a drop.

```typescript
const result = await inscrib3.drops.remove(
  id: string,
  address: string,
  message: string,
  signature: string
);
```

**Parameters:**
- `id`: ID of the drop to remove
- `address`: User's address for authentication
- `message`: Authentication message
- `signature`: Authentication signature

**Returns:** `{ id: string }`

#### Mint from a Drop

Initiates the minting process for a drop.

```typescript
const result = await inscrib3.drops.mint(
  id: string,
  paymentAddress: string,
  paymentPublicKey: string,
  recipientAddress: string,
  recipientPublicKey: string,
  address: string,
  message: string,
  signature: string
);
```

**Parameters:**
- `id`: ID of the drop to mint from
- `paymentAddress`: Address to make payment from
- `paymentPublicKey`: Public key for the payment address
- `recipientAddress`: Address to receive the minted ordinal
- `recipientPublicKey`: Public key for the recipient address
- `address`: User's address for authentication
- `message`: Authentication message
- `signature`: Authentication signature

**Returns:** `{ psbt: string[] }`

#### Broadcast Mint Transaction

Broadcasts a signed mint transaction.

```typescript
const result = await inscrib3.drops.broadcastMint(
  id: string,
  signedPsbt: string[],
  address: string,
  message: string,
  signature: string
);
```

**Parameters:**
- `id`: ID of the drop
- `signedPsbt`: Array of signed PSBTs
- `address`: User's address for authentication
- `message`: Authentication message
- `signature`: Authentication signature

**Returns:** `{ txid: string }`

### Uploads Management

#### Get All Uploads

Retrieves all uploads for a drop.

```typescript
const result = await inscrib3.drops.uploads.all(
  id: string,
  address: string,
  message: string,
  signature: string
);
```

**Parameters:**
- `id`: ID of the drop
- `address`: User's address for authentication
- `message`: Authentication message
- `signature`: Authentication signature

**Returns:** `{ files: string[] }`

#### Update Uploads

Adds new files to a drop.

```typescript
const result = await inscrib3.drops.uploads.update(
  id: string,
  files: File[],
  address: string,
  message: string,
  signature: string
);
```

**Parameters:**
- `id`: ID of the drop
- `files`: Array of File objects to upload
- `address`: User's address for authentication
- `message`: Authentication message
- `signature`: Authentication signature

**Returns:** `{ supply: string }`

#### Remove Uploads

Removes files from a drop.

```typescript
const result = await inscrib3.drops.uploads.remove(
  id: string,
  files: string[],
  address: string,
  message: string,
  signature: string
);
```

**Parameters:**
- `id`: ID of the drop
- `files`: Array of file names to remove
- `address`: User's address for authentication
- `message`: Authentication message
- `signature`: Authentication signature

**Returns:** `{ supply: string }`

## Complete Example

Here's a complete example showing how to create a drop, upload files, and mint from it:

```typescript
import sdk from '@inscrib3/sdk';

const inscrib3 = sdk();

// Authentication details
const userAddress = 'bc1q...';
const authMessage = 'Sign this message to authenticate with Inscrib3';
const authSignature = 'signature...';

// Create a drop
const createAndMint = async () => {
  try {
    // Step 1: Create a drop
    const dropResult = await inscrib3.drops.create(
      'My Ordinals Collection',
      'ORD',
      'A collection of unique digital artifacts on Bitcoin',
      iconFile,
      '10000',
      recipientAddress,
      recipientPublicKey,
      userAddress,
      authMessage,
      authSignature
    );
    
    console.log('Created drop with ID:', dropResult.id);
    
    // Step 2: Upload additional files
    const uploadResult = await inscrib3.drops.uploads.update(
      dropResult.id,
      additionalFiles,
      userAddress,
      authMessage,
      authSignature
    );
    
    console.log('Updated supply:', uploadResult.supply);
    
    // Step 3: Initiate minting
    const mintResult = await inscrib3.drops.mint(
      dropResult.id,
      paymentAddress,
      paymentPublicKey,
      recipientAddress,
      recipientPublicKey,
      userAddress,
      authMessage,
      authSignature
    );
    
    console.log('PSBTs to sign:', mintResult.psbt);
    
    // Step 4: Sign PSBTs (using your wallet or signing library)
    const signedPsbts = await signPsbts(mintResult.psbt);
    
    // Step 5: Broadcast the signed transaction
    const broadcastResult = await inscrib3.drops.broadcastMint(
      dropResult.id,
      signedPsbts,
      userAddress,
      authMessage,
      authSignature
    );
    
    console.log('Mint transaction ID:', broadcastResult.txid);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Error Handling

The SDK uses standard Promise-based error handling. It's recommended to wrap API calls in try-catch blocks:

```typescript
try {
  const drops = await inscrib3.drops.all(address, message, signature);
} catch (error) {
  console.error('API Error:', error);
}
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions. You'll get autocomplete and type checking out of the box when using TypeScript.

## License

MIT
