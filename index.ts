const sdk = (
  network: 'mainnet' | 'testnet' | 'testnet4' | 'signet' = 'mainnet',
  chain: 'bitcoin' | 'fractal' = 'bitcoin',
  api = 'https://api.inscrib3.com'
) => {
  return {
    drops: {
      create: async (
        name: string,
        symbol: string,
        description: string,
        icon: File,
        price: string,
        recipientAddress: string,
        recipientPublicKey: string,
        address: string,
        message: string,
        signature: string,
      ) => {
        const headers = new Headers();
        headers.append('Authorization', `Basic ${Buffer.from(`${address}:${message}:${network}:${chain}:${signature}`).toString('base64')}`);
        const formData = new FormData();
        formData.append('icon', icon);
        formData.append('name', name);
        formData.append('symbol', symbol);
        formData.append('description', description);
        formData.append('price', price.toString());
        formData.append('recipientAddress', recipientAddress);
        formData.append('recipientPublicKey', recipientPublicKey);
        const data = await fetch(`${api}/drops`, {
          headers,
          method: 'POST',
          body: formData,
          redirect: 'follow'
        });
        const res: { id: string } = await data.json();
        return res;
      },
      all: async (
        address: string,
        message: string,
        signature: string,
      ) => {
        const headers = new Headers();
        headers.append('Authorization', `Basic ${Buffer.from(`${address}:${message}:${network}:${chain}:${signature}`).toString('base64')}`);
        const data = await fetch(`${api}/drops`, {
          headers
        });
        const res: {
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
          minted: string,
        }[] = await data.json();
        return res;
      },
      read: async (
        id: string,
        address: string,
        message: string,
        signature: string,
      ) => {
        const headers = new Headers();
        headers.append('Authorization', `Basic ${Buffer.from(`${address}:${message}:${network}:${chain}:${signature}`).toString('base64')}`);
        const data = await fetch(`${api}/drops/${id}`, { headers });
        const res: {
          name: string,
          symbol: string,
          description: string,
          icon: string,
          price: string,
          recipientAddress: string,
          recipientPublicKey: string,
          supply: string,
          minting: string,
          minted: string,
        } = await data.json();
        return res;
      },
      remove: async (
        id: string,
        address: string,
        message: string,
        signature: string,
      ) => {
        const headers = new Headers();
        headers.append('Authorization', `Basic ${Buffer.from(`${address}:${message}:${network}:${chain}:${signature}`).toString('base64')}`);
        const data = await fetch(`${api}/drops/${id}`, {
          headers,
          method: 'DELETE',
        });
        const res: { id: string } = await data.json();
        return res;
      },
      mint: async (
        id: string,
        paymentAddress: string,
        paymentPublicKey: string,
        recipientAddress: string,
        recipientPublicKey: string,
        address: string,
        message: string,
        signature: string,
      ) => {
        const headers = new Headers();
        headers.append('Authorization', `Basic ${Buffer.from(`${address}:${message}:${network}:${chain}:${signature}`).toString('base64')}`);
        headers.append('Content-Type', 'application/json');
        const data = await fetch(`${api}/drops/${id}/mint`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            paymentAddress,
            paymentPublicKey,
            recipientAddress,
            recipientPublicKey,
          }),
        });
        const res: { psbt: string[] } = await data.json();
        return res;
      },
      broadcastMint: async (
        id: string,
        signedPsbt: string[],
        address: string,
        message: string,
        signature: string,
      ) => {
        const headers = new Headers();
        headers.append('Authorization', `Basic ${Buffer.from(`${address}:${message}:${network}:${chain}:${signature}`).toString('base64')}`);
        headers.append('Content-Type', 'application/json');
        const data = await fetch(`${api}/drops/${id}/mint/broadcast`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            signedPsbt,
          }),
        });
        const res: { txid: string } = await data.json();
        return res;
      },
      uploads: {
        all: async (
          id: string,
          address: string,
          message: string,
          signature: string,
        ) => {
          const headers = new Headers();
          headers.append('Authorization', `Basic ${Buffer.from(`${address}:${message}:${network}:${chain}:${signature}`).toString('base64')}`);
          const data = await fetch(`${api}/drops/${id}/uploads`, { headers});
          const res: { files: string[] } = await data.json();
          return res;
        },
        update: async (
          id: string,
          files: File[],
          address: string,
          message: string,
          signature: string,
        ) => {
          const headers = new Headers();
          headers.append('Authorization', `Basic ${Buffer.from(`${address}:${message}:${network}:${chain}:${signature}`).toString('base64')}`);
          const formData = new FormData();
          for (const file of files ) {
            formData.append('files', file);
          }
          const data = await fetch(`${api}/drops/${id}/uploads`, {
            method: 'POST',
            body: formData,
            headers,
          });
          const res: { supply: string } = await data.json();
          return res;
        },
        remove: async (
          id: string,
          files: string[],
          address: string,
          message: string,
          signature: string,
        ) => {
          const headers = new Headers();
          headers.append('Authorization', `Basic ${Buffer.from(`${address}:${message}:${network}:${chain}:${signature}`).toString('base64')}`);
          headers.append('Content-Type', 'application/json');
          const data = await fetch(`${api}/drops/${id}/uploads`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({
              files,
            }),
          });
          const res: { supply: string } = await data.json();
          return res;
        },
      }
    }
  }
};
export default sdk;
