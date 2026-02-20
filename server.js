const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Game data
let players = [];
let buildings = {};
let resources = { gold: 0, wood: 0, stone: 0 };

// Player initialization
app.post('/api/players', (req, res) => {
    const { name } = req.body;
    const player = { id: players.length + 1, name, buildings: [], resources: { ...resources } };
    players.push(player);
    res.status(201).json(player);
});

// Building management
app.post('/api/buildings', (req, res) => {
    const { playerId, building } = req.body;
    const player = players.find(p => p.id === playerId);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    player.buildings.push(building);
    res.status(201).json(building);
});

// Resource production
const produceResources = () => {
    players.forEach(player => {
        player.resources.gold += 1;  // Example production rate
        player.resources.wood += 2;
        player.resources.stone += 2;
    });
};

setInterval(produceResources, 60000); // Produce resources every minute

// API endpoint to get player data
app.get('/api/players/:id', (req, res) => {
    const { id } = req.params;
    const player = players.find(p => p.id === parseInt(id));
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});