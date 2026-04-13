export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = 'dk__M_4rn3ZGc27bnngJpskOtyy5zPb23-e';
  const path = req.query.path;

  const authHeaders = {
    'x-api-key': API_KEY,
    'next-auth.session-token': API_KEY,
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    if (path === 'offers') {
      const { network } = req.query;
      const url = `https://www.digi-mall.app/api/v1/offers${network ? `?network=${network}` : ''}`;
      const response = await fetch(url, { headers: authHeaders });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (path === 'order') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const response = await fetch('https://www.digi-mall.app/api/v1/orders', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(400).json({ error: 'Unknown path' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach DigiMall', details: err.message });
  }
}
